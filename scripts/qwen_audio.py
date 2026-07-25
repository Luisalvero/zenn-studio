"""
Zenn Studio — LOCAL sound-library builder (Qwen2-Audio on your GPU).
---------------------------------------------------------------------------
For each audio file: transcode to a web mp3 and have Qwen2-Audio-7B-Instruct
title + describe (>=2 sentences) + tag genre + guess a playlist. Every clip is
checkpointed to public/audio/_results.jsonl the moment it's done, so a crash
never loses more than the current file and a re-run RESUMES automatically.
A first-pass src/data/sound.ts is regenerated from the checkpoint at the end
(final playlist curation happens separately, from the checkpoint).

Run (from project root):
  SOUND_SRC="/path/to/audio" python scripts/qwen_audio.py
Optional: SOUND_LIMIT=1 to test on the first file only.
"""
import os, sys, re, json, subprocess, warnings

# Windows consoles default to cp1252; model output contains unicode → force UTF-8
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

warnings.filterwarnings("ignore")
import torch
import librosa
from transformers import Qwen2AudioForConditionalGeneration, AutoProcessor, BitsAndBytesConfig

MODEL_ID = "Qwen/Qwen2-Audio-7B-Instruct"
SRC = os.environ.get("SOUND_SRC") or (sys.argv[1] if len(sys.argv) > 1 else None)
LIMIT = int(os.environ.get("SOUND_LIMIT", "0"))
FFMPEG = os.environ.get("FFMPEG", os.path.join("node_modules", "ffmpeg-static", "ffmpeg.exe"))
OUT_AUDIO = os.path.join("public", "audio")
CKPT = os.path.join(OUT_AUDIO, "_results.jsonl")
if not SRC:
    sys.exit("Set SOUND_SRC (or pass a folder path)")
os.makedirs(OUT_AUDIO, exist_ok=True)

PLAYLISTS = {
    "Beats & Instrumentals": ("#3b1d5e", "#c34a3e", "Original beats and instrumental productions."),
    "Ambient & Chill": ("#0b3d3a", "#1d6e5e", "Atmospheric, ambient, and downtempo pieces."),
    "Remixes & Covers": ("#1a2a52", "#4a6cc3", "Flips, remixes, and reimagined tracks."),
    "Game Audio": ("#12303a", "#2f9ab9", "Music and sound designed for games."),
    "Sound Design & FX": ("#4a3410", "#b98a2f", "Impacts, alarms, textures, and designed sound."),
    "Vocals & Voice": ("#3a1a4a", "#8a4ac3", "Vocal work, chops, and voice."),
    "Other": ("#2a2a30", "#444444", "Everything else worth a listen."),
}
CATEGORIES = [k for k in PLAYLISTS if k != "Other"]
AUDIO_EXT = (".mp3", ".wav", ".m4a", ".flac", ".ogg", ".aiff", ".aif", ".opus")


def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:60] or "track"


def duration_of(path):
    try:
        r = subprocess.run([FFMPEG, "-i", path], capture_output=True, text=True)
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+)", r.stderr)
        if m:
            return f"{int(m.group(1)) * 60 + int(m.group(2))}:{m.group(3).zfill(2)}"
    except Exception:
        pass
    return None


# ---- gather files ----------------------------------------------------------
files = []
for root, _, fs in os.walk(SRC):
    for f in fs:
        if f.lower().endswith(AUDIO_EXT):
            files.append(os.path.join(root, f))
files.sort()
if LIMIT:
    files = files[:LIMIT]
print(f"Found {len(files)} audio files", flush=True)

# ---- resume from checkpoint ------------------------------------------------
done = {}  # src filename -> record
if os.path.exists(CKPT):
    with open(CKPT, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                r = json.loads(line)
                done[r["src"]] = r
            except Exception:
                pass
if done:
    print(f"Resuming — {len(done)} already in checkpoint, will skip those.", flush=True)
used_slugs = {r["id"] for r in done.values()}

# ---- load model ------------------------------------------------------------
todo = [p for p in files if os.path.basename(p) not in done]
if todo:
    print("Loading Qwen2-Audio (4-bit)…", flush=True)
    bnb = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
    )
    processor = AutoProcessor.from_pretrained(MODEL_ID)
    model = Qwen2AudioForConditionalGeneration.from_pretrained(
        MODEL_ID, quantization_config=bnb, device_map="auto", dtype=torch.float16
    )
    model.eval()
    SR = processor.feature_extractor.sampling_rate
    print("Model loaded. Device:", next(model.parameters()).device, flush=True)
else:
    print("Nothing new to process — rebuilding sound.ts from checkpoint.", flush=True)

PROMPT = (
    "Listen to this clip from a music/sound producer's portfolio and reply in EXACTLY this format, nothing else:\n"
    "TITLE: <punchy 2-5 word title in Title Case>\n"
    "DESC: <exactly two sentences: first describe the sound, mood, genre and key instrumentation; "
    "second describe where it would fit (a scene, a game, a type of project)>\n"
    "PLAYLIST: <one of: " + " | ".join(CATEGORIES) + ">"
)


def field(name, text, stops):
    stop = "|".join(stops + [r"$"])
    m = re.search(rf"{name}:\s*(.+?)(?:\s*(?:{stop}))", text, re.IGNORECASE | re.DOTALL)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


# ---- process ---------------------------------------------------------------
ckpt_fh = open(CKPT, "a", encoding="utf-8")
for i, p in enumerate(files):
    fname = os.path.basename(p)
    if fname in done:
        continue
    base = os.path.splitext(fname)[0]
    try:
        slug = slugify(base)
        if slug in used_slugs:
            n = 2
            while f"{slug}-{n}" in used_slugs:
                n += 1
            slug = f"{slug}-{n}"
        used_slugs.add(slug)
        mp3 = os.path.join(OUT_AUDIO, slug + ".mp3")
        subprocess.run([FFMPEG, "-y", "-i", p, "-vn", "-ac", "2", "-b:a", "128k", mp3], capture_output=True)
        dur = duration_of(mp3)

        title = re.sub(r"[_-]+", " ", base).strip()
        desc, playlist, resp = "", "Other", ""
        try:
            audio, _ = librosa.load(p, sr=SR, mono=True, duration=45)
            conv = [{"role": "user", "content": [{"type": "audio", "audio_url": p}, {"type": "text", "text": PROMPT}]}]
            text = processor.apply_chat_template(conv, add_generation_prompt=True, tokenize=False)
            inputs = processor(text=text, audio=audio, return_tensors="pt", padding=True, sampling_rate=SR).to(model.device)
            with torch.no_grad():
                gen = model.generate(**inputs, max_new_tokens=200, do_sample=False)
            gen = gen[:, inputs.input_ids.size(1):]
            resp = processor.batch_decode(gen, skip_special_tokens=True)[0].strip()
            title = field("TITLE", resp, ["DESC:", "PLAYLIST:"]) or title
            desc = field("DESC", resp, ["PLAYLIST:"])
            pl = field("PLAYLIST", resp, [])
            playlist = next((c for c in CATEGORIES if c.lower().split()[0] in pl.lower()), "Other")
        except Exception as e:
            print(f"  ! qwen failed for {base}: {str(e)[:160]}", flush=True)

        rec = {"src": fname, "id": slug, "title": title, "description": desc,
               "url": f"/audio/{slug}.mp3", "duration": dur, "playlist": playlist, "raw": resp}
        ckpt_fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        ckpt_fh.flush()
        os.fsync(ckpt_fh.fileno())
        done[fname] = rec
        print(f"  {len(done)}/{len(files)}  {title}  ->  {playlist}", flush=True)
    except Exception as e:
        print(f"  !! FILE FAILED {fname}: {str(e)[:200]}", flush=True)
        continue
ckpt_fh.close()


# ---- build first-pass sound.ts from checkpoint -----------------------------
def esc(s):
    return str(s).replace("\\", "\\\\").replace("'", "\\'")


ordered = [done[os.path.basename(p)] for p in files if os.path.basename(p) in done]
blocks = []
for cat in CATEGORIES + ["Other"]:
    lst = [t for t in ordered if t["playlist"] == cat]
    if not lst:
        continue
    c0, c1, pdesc = PLAYLISTS[cat]
    lines = "\n".join(
        f"      {{ id: '{t['id']}', title: '{esc(t['title'])}', description: '{esc(t['description'])}', url: '{t['url']}'"
        + (f", duration: '{t['duration']}'" if t.get("duration") else "")
        + " },"
        for t in lst
    )
    blocks.append(
        f"  {{\n    id: '{slugify(cat)}',\n    title: '{esc(cat)}',\n    description: '{esc(pdesc)}',\n"
        f"    colors: ['{c0}', '{c1}'],\n    tracks: [\n{lines}\n    ],\n  }},"
    )

sound_path = os.path.join("src", "data", "sound.ts")
header = open(sound_path, encoding="utf-8").read().split("export const soundPlaylists")[0]
with open(sound_path, "w", encoding="utf-8") as f:
    f.write(header + "export const soundPlaylists: SoundPlaylist[] = [\n" + "\n".join(blocks) + "\n]\n")

print(f"\nDONE. {len(ordered)} tracks in checkpoint -> src/data/sound.ts + public/audio/", flush=True)
