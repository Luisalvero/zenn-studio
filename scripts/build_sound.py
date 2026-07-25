"""
Zenn Studio — curated sound library builder.
---------------------------------------------------------------------------
Hand-curated from the Qwen2-Audio pass (public/audio/_results.jsonl):
titles varied, descriptions cleaned/translated, junk stripped, duplicates and
WIP files dropped, everything re-sorted into real playlists. Pulls the audio
url + duration for each kept track from the checkpoint by id, then regenerates
src/data/sound.ts. Run:  python scripts/build_sound.py
"""
import os, re, json, io, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# playlist id -> (title, [c0, c1], description)
PLAYLISTS = [
    ("beats-instrumentals", "Beats & Instrumentals", ["#3b1d5e", "#c34a3e"], "Original beats and instrumental productions."),
    ("ambient-chill", "Ambient & Chill", ["#0b3d3a", "#1d6e5e"], "Atmospheric, downtempo, and dream-leaning pieces."),
    ("vocals-voice", "Vocals & Voice", ["#3a1a4a", "#8a4ac3"], "Tracks built around vocals and vocal textures."),
    ("remixes-covers", "Remixes & Covers", ["#1a2a52", "#4a6cc3"], "Flips, remixes, and reimagined tracks."),
    ("game-audio", "Game Audio", ["#12303a", "#2f9ab9"], "Themes, menu UI, and foley made for games."),
    ("sound-design-fx", "Sound Design & FX", ["#4a3410", "#b98a2f"], "Designed textures, ambiences, and cues."),
]

# (id, playlist_id, title, description)  — id must match _results.jsonl
CURATION = [
    # ---------- Beats & Instrumentals ----------
    ("140-f-major-funkystyleyeaaah", "beats-instrumentals", "Funky Breakbeat", "Jazz-tinged breakbeat with a soulful piano lead over a groovy bassline and crisp drums, upbeat and energetic. It would lift a vibrant city scene or a stylish montage."),
    ("160-bpm-e-min-pergatory-prod-3choed", "beats-instrumentals", "Purgatory", "Glitchy acoustic guitar over a tense synth bass, dark and quietly menacing. It would sit under a suspense beat in a crime thriller or a high-stakes game moment."),
    ("140-bpm-f-min-weewoo-prod-3choed", "beats-instrumentals", "Weewoo", "A moody instrumental blending jazzy keys with darker, tense textures over an uneasy groove. It would fit a noir or thriller scene."),
    ("acid-undis", "beats-instrumentals", "Euphoria", "An electronic dance piece with a techno pulse, a synth-heavy melody and driving bass building a euphoric lift. It would suit a nightclub scene or a high-energy montage."),
    ("aurafarmingpremium", "beats-instrumentals", "Aura", "A high-energy build with cinematic synths, heavy bass, and punchy synth drums, euphoric and widescreen. It would power a futuristic cityscape or a high-action sequence."),
    ("aggrivated", "beats-instrumentals", "Aggravated", "A glitchy hip-hop instrumental with heavy bass and edgy synth lines over a tense, eerie backdrop. It would suit a thriller beat or a menacing game sequence."),
    ("crazy-rage-145-dmin", "beats-instrumentals", "Crazy Rage", "A glitchy electro-funk instrumental in D minor, a gritty synth bass over funky electronic drums, experimental but danceable. It would suit an edgy montage or a rebellious game level."),
    ("aisufhliaunvlkjaenfliusahdlkjfb-done", "beats-instrumentals", "Ethereal Machine", "A dreamy electro-pop instrumental, a haunting piano line over a synth-driven beat, uplifting and ethereal. It would fit a sci-fi drama or a reflective, futuristic scene."),
    ("phonkaura", "beats-instrumentals", "Phonk Aura", "A hard-hitting electro/phonk instrumental, heavy bass and aggressive drums building an intense, driving atmosphere. It would power an action scene or a high-energy edit."),
    ("second-acid-undistorted", "beats-instrumentals", "Second Acid", "A driving, synth-forward cut with heavy bass and distorted guitar bite, echoing classic sci-fi scores. It would push an action set-piece in a futuristic setting."),
    ("steven-d4dic", "beats-instrumentals", "Dreamscape", "A reverb-drenched, cinematic cut with sweeping strings, heavy guitar, and synth textures. It would score a lone figure crossing an alien landscape."),
    ("savemytears", "beats-instrumentals", "Save My Tears", "A futuristic electro-pop instrumental with a glitchy edge and tense energy, synth lead and electronic drums driving hard. It would fit a sci-fi action sequence or a fast-paced game level."),
    ("signoftheend", "beats-instrumentals", "Sign of the End", "An eerie instrumental with a haunting synth melody over electronic pads, mysterious and cinematic. It would suit a horror trailer or a foreboding game sequence."),
    ("glowinginwhite", "beats-instrumentals", "Glowing in White", "A haunting electronic piece with a suspenseful edge, synth, piano, and strings building a cinematic, uneasy mood. It would suit a thriller trailer or a tense game cutscene."),
    ("iwannabefree", "beats-instrumentals", "I Wanna Be Free", "A haunting electronic track with an eerie, cinematic atmosphere, synth, piano, and drums building tension. It would suit a thriller or a dramatic game sequence."),
    ("losindios", "beats-instrumentals", "Los Indios", "A world-beat groove driven by organic hand percussion and ethnic drums, earthy and rhythmic. It would suit a travel documentary or a game set in an exotic locale."),
    ("tueresproblemas", "beats-instrumentals", "Tu Eres Problemas", "A dreamy R&B instrumental, a soothing piano line over a groovy bassline and electronic beats, relaxed and warm. It would suit a romantic scene or a laid-back game moment."),
    ("vocalcoverthingy", "beats-instrumentals", "E-Minor Omen", "A dark, ominous electronic cut leaning toward dubstep, synths and heavy bass in E minor. It would work as background tension for a horror film or game scene."),
    ("amalgamation", "beats-instrumentals", "Amalgamation", "An electronic track with jungle influences that builds a dark, eerie atmosphere. It suits a tense horror scene or a shadowy late-night set."),
    ("beest-house-i-ve-made", "beats-instrumentals", "La La Land", "A dreamy synthwave cut in D# minor with a wistful, cinematic chord progression. It would fit a musical, neon-lit scene in a futuristic city."),
    ("crazydrill", "beats-instrumentals", "Crazy Drill", "Ghostly synths and unsettling vocal chops build a tense, creeping energy over a drill-leaning beat. It fits a suspenseful horror or thriller-game scene."),
    ("ethnic-kankan", "beats-instrumentals", "Kankan", "An eerie, suspenseful beat pairing Eastern-flavored instrumentation with modern trap drums. It would suit a tense game level or a dramatic action scene."),
    ("firstopiumbeat", "beats-instrumentals", "First Opium", "A glitchy, dream-like beat with atmospheric synths, heavy bass, and sparse drums, dark and introspective. It would suit a film-noir scene or a psychological-thriller game."),
    ("letmeout", "beats-instrumentals", "Let Me Out", "A synthwave instrumental with a haunting violin lead over synth pads and electronic drums, a slow build into something driving. It would suit a cyberpunk scene or a game soundtrack."),
    ("rebelbeat-130-d-min", "beats-instrumentals", "Rebel", "A moody, heavy trap instrumental at a slow tempo, synths, deep bass, and hard drums in D# minor. It would suit a noir scene or a tense, nocturnal game level."),
    ("sexy-drill", "beats-instrumentals", "Drill", "A modern hip-hop and drill instrumental with a deep, dark mood, bass and drums up front, synth and piano adding texture. It would suit a city-themed game or an urban montage."),
    ("songepic", "beats-instrumentals", "Epic", "A dreamy synthwave cut with a haunting violin lead over synth pads and electronic drums, mysterious and suspenseful. It would suit a thriller scene or a noir game."),

    # ---------- Ambient & Chill ----------
    ("108-d-maj", "ambient-chill", "Sunlit Piano", "A serene solo-piano melody in D major with a soft, ambient glow. It would sit comfortably under a reflective scene, a meditation app, or a calm spa moment."),
    ("115-gmin", "ambient-chill", "Neon Drift", "A soothing synthwave instrumental, mellow synth chords drifting over a calm, spacious backdrop in G minor. It would fit a quiet cyberpunk cityscape or a slow sci-fi moment."),
    ("127-d-min", "ambient-chill", "Drift in D Minor", "A mellow synthwave instrumental in D minor, soft chord progressions and a calm, floating atmosphere. It would underscore a nocturnal cityscape or a contemplative sci-fi beat."),
    ("120-reaggeaton-d-min", "ambient-chill", "Distant Planet", "Flowing synth melodies over a chilled-out beat, building an ethereal, weightless atmosphere. It would suit a sci-fi scene set on a distant world."),
    ("crazyinterlude", "ambient-chill", "Interlude", "A dreamy synthwave interlude, soft flowing synths and gentle melodies that feel calm and otherworldly. It would bridge scenes in a sci-fi film or a serene game environment."),
    ("don-t-call-it-love-mixe", "ambient-chill", "Don't Call It Love", "A laid-back indie-pop instrumental, soothing acoustic guitar over a gentle synth backdrop, mellow and unhurried. It would suit a coffee-shop scene or a relaxed afternoon montage."),
    ("im-not-the-man-170bpm", "ambient-chill", "I'm Not the Man", "A poignant piano piece in Db major, tender, reflective, and emotionally direct. It would underscore a quiet, romantic, or bittersweet scene."),
    ("jazzplug-d-min-95", "ambient-chill", "After Hours", "Soft piano jazz chords under a smooth soprano-sax lead, mellow and easygoing at 95 BPM in D minor. It would suit a late-night bar, a classy interior, or a reflective scene."),
    ("dahlonega", "ambient-chill", "Dahlonega", "A serene solo acoustic-guitar piece, a soft, dreamy melody, gentle and unhurried. It would suit a meditation video or a quiet, reflective scene."),
    ("fly-with-me-final", "ambient-chill", "Fly With Me", "A dreamy electro-pop instrumental, a haunting piano melody over a synth backdrop, gently melancholic. It would land in a reflective drama scene."),
    ("helpme", "ambient-chill", "Smoky Jazz", "A smoky jazz soundscape led by saxophone, piano, and trumpet, elegant with a vintage haze. Subtle atmospheric touches add depth, and it would suit a mysterious, noir scene."),
    ("lmao", "ambient-chill", "Enchanted Forest", "Light, airy synth pads and soft violin melodies evoke calm and quiet wonder. It would suit a magical-forest scene, or a meditation and ambient playlist."),
    ("morernb-new", "ambient-chill", "Lullaby", "Warm, soothing piano chords build a calming, sleepy atmosphere. It would suit a spa, a meditation space, or a tender, quiet scene."),
    ("newambience", "ambient-chill", "New Ambience", "A dreamy synthwave instrumental, a soothing melody over a chilled electronic beat. Easy and warm, it would suit a relaxed montage or a vlog bed."),
    ("something-inside-of-me", "ambient-chill", "Something Inside", "A tranquil soundscape of gentle synths, harp, and soft vocal textures. Calm and weightless, it would suit meditation, a spa bed, or a serene scene."),

    # ---------- Vocals & Voice ----------
    ("you-know-what-i-want", "vocals-voice", "You Know What I Want", "A dreamy hip-hop cut with a soulful female vocal over a groovy beat and a chilled-out atmosphere. It would suit a romantic evening scene or a relaxed montage."),
    ("replay-hoodtrap-3choed", "vocals-voice", "Replay", "A soulful cut with a warm male vocal over a groovy rhythm section and hip-hop-flavored drums, romantic and easygoing. It would suit a summer-romance montage or a cozy late-night scene."),
    ("mylancore-lyrics-mixed", "vocals-voice", "Mylancore", "A dreamy electro-pop cut with a soft female vocal floating over mellow keys and warm synth textures. Laid-back and chill, it would suit a summer montage or a relaxed interior scene."),
    ("afrohouseambient", "vocals-voice", "Afrohouse", "A soulful female vocal drifting over a dreamy, downtempo blend of R&B and electronic textures. Slow and immersive, it would suit a romantic scene or a chilled interior."),
    ("meldocibirdsong", "vocals-voice", "Birdsong", "A dreamy electro-pop cut with a hauntingly pretty female vocal over a warm synth bed. Laid-back and chill, it would suit a summer montage or a relaxed interior."),
    ("meoodic", "vocals-voice", "Melodic", "A dreamy electro-pop piece with an ethereal female vocal over a synth-driven melody in F# major. Otherworldly and soft, it would suit a sci-fi drama scene."),
    ("newrnb", "vocals-voice", "New R&B", "Ethereal female vocals float over a synth-driven melody with a groovy bassline and a danceable beat. Lush and immersive, it would suit a summer-festival edit or a chilled lounge."),
    ("swag", "vocals-voice", "Swag", "A hauntingly soulful cut, vocals over an eerie keyboard melody and moody synth bass, mysterious and cinematic. It would suit a suspenseful scene or a dramatic game moment."),

    # ---------- Remixes & Covers ----------
    ("bringebacktolif-remix-mixed", "remixes-covers", "Bring You Back", "A dreamy electro-pop remix built around an ethereal female vocal over a shimmering synth bed. Soothing and cinematic, it would slot into a dream sequence or a late-night set."),
    ("hoodtrap-remix", "remixes-covers", "Hood Trap", "A dark, cinematic flip blending eerie electronic textures with jazzy piano, mysterious and noir. It would fit a shadowy city scene or a suspense-driven game moment."),
    ("houseafromix", "remixes-covers", "Afro House Flip", "A moody electronic flip with jazzy keys and a hypnotic groove in G minor, mysterious and atmospheric. It would underscore a noir scene or a tense game sequence."),
    ("beautyandabeat-remix", "remixes-covers", "Beauty and a Beat", "A glitchy hip-hop flip, a tense synth line over a bouncy bassline and 808 drums, edgy and anxious. It would suit a crime-thriller beat or a high-stakes game moment."),

    # ---------- Game Audio ----------
    ("hunt-theme", "game-audio", "Hunt Theme", "An eerie instrumental theme, haunting synth melodies over a spooky choral texture. Written as a game theme for a tense hunt or horror sequence."),
    ("main-menu-final-track", "game-audio", "Main Menu — Final", "A driving menu theme with heavy electric-guitar riffs, big drums, and gritty energy in D minor. Written to open a high-energy action game."),
    ("main-menu-threshold", "game-audio", "Main Menu — Threshold", "A dark, atmospheric menu bed with organic, cinematic textures. Written to sit under a game's main menu with a tense, expectant mood."),
    ("main-menu-click", "game-audio", "Menu UI — Click", "A crisp UI click for a game menu selection."),
    ("main-menu-hover", "game-audio", "Menu UI — Hover", "A soft UI hover cue for navigating a game menu."),
    ("running-loopable-1", "game-audio", "Running Footsteps", "A seamless running-footsteps loop on a hard surface, foley for a moving character."),
    ("walking-regular-loopable", "game-audio", "Walking Footsteps", "A seamless walking-footsteps loop on a hard surface, foley for a moving character."),
    ("walking-slow-loopable", "game-audio", "Slow Walk", "A seamless slow-walking footsteps loop, foley for a character moving at an easy pace."),
    ("running-stop-shuffle", "game-audio", "Footstep Stop", "A quick stop-and-shuffle footstep cue, foley for a character halting or turning."),
    ("step-1", "game-audio", "Footstep", "A single footstep on a hard surface, game foley."),
    ("alarm-1", "game-audio", "Alarm I", "A short designed alarm cue, an alert tone for a UI, warning, or hazard moment."),
    ("alarm-2", "game-audio", "Alarm II", "A short designed alarm cue with a harsher edge, an alert for a warning or hazard state."),

    # ---------- Sound Design & FX ----------
    ("granular-textures-cordpath-2-granular-2", "sound-design-fx", "Granular Chordpath", "A granular, evolving texture built from processed chords, hypnotic and slightly psychedelic. Designed for scene transitions, sci-fi ambience, or sound-design beds."),
    ("robot-ambience-1", "sound-design-fx", "Robot Ambience I", "A glitchy, mechanical ambience built from processed synth and sampler textures, abstract and futuristic. Designed for a robotic or sci-fi environment."),
    ("robot-ambience-2", "sound-design-fx", "Robot Ambience II", "A raw, experimental noise bed of dissonant tones and ambient texture, dark and uneasy. Designed for a suspense scene or a machine-world environment."),
    ("robot-ambience-3", "sound-design-fx", "Robot Ambience III", "Experimental glitch textures meet mechanical noise for a cold, futuristic soundscape. Designed for a machine city or a dystopian sci-fi environment."),
    ("limboloop-fx", "sound-design-fx", "Limbo Loop", "A dreamy, loopable synth bed over a soft electronic pulse, designed as an ambient background loop. Built to sit under menus, transitions, or atmospheric scenes."),
    ("leap-of-faith", "sound-design-fx", "Leap of Faith", "A short, suspenseful stinger, an eerie piano figure under tense strings. Built for a horror jump moment or a dramatic reveal."),
    ("scene-complete", "sound-design-fx", "Scene", "A spine-chilling cue, eerie effects, atmospheric strings, and suspenseful piano building an ominous mood. Built for a horror or psychological-thriller scene."),
    ("stupid", "sound-design-fx", "Soundscape", "A haunting soundscape of eerie strings, synths, and designed effects. Built for a horror bed of jump scares and creeping suspense."),
]

# ---- join with checkpoint for url + duration -------------------------------
records = {}
for l in open(os.path.join("public", "audio", "_results.jsonl"), encoding="utf-8"):
    r = json.loads(l)
    records[r["id"]] = r

missing = [c[0] for c in CURATION if c[0] not in records]
if missing:
    sys.exit("Curation ids not found in checkpoint: " + ", ".join(missing))


# ---- emit the flat track data as JSON (fetched at runtime, editable in dev) --
# Order: grouped by playlist (matches the page), with a global sort_order.
seed_order = []
for pid, _, _, _ in PLAYLISTS:
    seed_order += [c for c in CURATION if c[1] == pid]

tracks_json = []
for i, (cid, pid, title, desc) in enumerate(seed_order, 1):
    rec = records[cid]
    tracks_json.append({
        "id": cid,
        "title": title,
        "description": desc,
        "url": rec["url"],
        "duration": rec.get("duration") or None,
        "playlist": pid,
        "sort_order": i,
    })

out_path = os.path.join("src", "data", "sound.data.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(tracks_json, f, ensure_ascii=False, indent=2)
    f.write("\n")

kept = len(tracks_json)
total = len(records)
n_playlists = len({t["playlist"] for t in tracks_json})
print(f"Wrote {out_path} — {kept} curated tracks across {n_playlists} playlists (from {total} analyzed, {total - kept} cut).")
for pid, ptitle, _, _ in PLAYLISTS:
    n = len([t for t in tracks_json if t["playlist"] == pid])
    if n:
        print(f"  {ptitle}: {n}")
