import type { Project } from '@/types'

/**
 * Portfolio projects.
 * ---------------------------------------------------------------------------
 * Every entry here is PERSONAL / SPEC work — creative explorations made to
 * sharpen the craft, not client commissions. The copy is written to reflect
 * that honestly. Replace empty image/video fields with your real assets:
 *   - thumbnails/stills: drop files in /public/images/projects/<slug>/ and set
 *     the path (e.g. '/images/projects/echoes/thumb.jpg'). Empty string ('')
 *     renders a branded placeholder so the layout always looks intentional.
 *   - video: set provider + id to embed the final piece.
 */
export const projects: Project[] = [
  {
    slug: 'echoes-in-the-static',
    title: 'Echoes in the Static',
    summary: 'A spec teaser trailer built to study dread, silence, and the cut that arrives one frame too late.',
    kind: 'Spec teaser trailer · Personal project',
    year: '2025',
    categories: ['Trailer', 'Horror', 'Sound Design', 'Color Grading'],
    thumbnail: '',
    video: { provider: 'youtube', id: '' },
    overview:
      'Echoes in the Static is a self-initiated teaser trailer for an imagined horror feature. I wanted to see how far atmosphere alone could carry a piece — no dialogue, no exposition, just image, tone, and negative space. The goal was to make ninety seconds feel like a held breath.',
    goals: [
      'Build tension entirely through pacing and sound rather than jump scares.',
      'Practice trailer structure: tease, escalate, hard cut to black.',
      'Design a cohesive cold, desaturated look that still reads as filmic.',
    ],
    direction:
      'The reference board leaned on A24 restraint and the muted palettes of modern folk horror. Everything is dim and slightly cold, with a single warm source in frame to give the eye somewhere to fall. I treated silence as a character — the loudest moment is the one with no sound at all.',
    process:
      'I assembled a rough spine first, cutting purely to a temp sound bed to find the rhythm. Once the pacing felt right I stripped the temp track and rebuilt the audio from scratch so picture and sound were carved together. The final third is deliberately withheld — the trailer ends before it resolves.',
    software: ['DaVinci Resolve', 'Fairlight', 'Fusion', 'Photoshop'],
    techniques: [
      'J- and L-cuts to bleed sound across shots',
      'Speed ramping into the title card',
      'Match cuts on motion and shape',
      'Negative-space framing and long holds',
    ],
    soundNotes:
      'The bed is a layered drone tuned a semitone apart to sit uneasily. Room tone was pitched down and stretched; a single sub hit lands on the cut to black. I automated everything by hand to keep the dynamics breathing rather than mechanical.',
    gradeNotes:
      'A cool, low-saturation base with lifted-but-crushed shadows, then a subtle warm split in the highlights so skin never goes fully lifeless. Grain and a soft halation were added to keep the digital edges from feeling clinical.',
    challenges:
      'The hardest part was resisting the urge to add more. Every time I inserted an extra shot the tension leaked out. Learning to trust a four-second hold was the whole exercise.',
    lessons:
      'Pacing is a sound-design decision as much as an editorial one. When I cut to the audio instead of the picture, the whole piece locked into place.',
    stills: [
      { src: '', alt: 'Cold, dim interior with a single warm light source', caption: 'Opening frame — one warm source in a cold room' },
      { src: '', alt: 'Silhouette against a doorway', caption: 'Negative space carries the dread' },
      { src: '', alt: 'Title card on black', caption: 'Hard cut to the title before resolution' },
    ],
    timelineStills: [
      { src: '', alt: 'Editing timeline showing layered audio tracks', caption: 'Audio built from scratch beneath the picture spine' },
    ],
    gradeComparisons: [
      { before: '', after: '', label: 'Log capture → final cold grade' },
    ],
    featured: true,
  },
  {
    slug: 'ashfall',
    title: 'Ashfall',
    summary: 'A cinematic edit cut from in-game capture, treating real-time footage like a film camera.',
    kind: 'Game cinematic · Personal edit',
    year: '2025',
    categories: ['Game Cinematic', 'Color Grading', 'Motion Graphics'],
    thumbnail: '',
    video: { provider: 'youtube', id: '' },
    overview:
      'Ashfall is a cinematic sequence I edited from captured gameplay to explore how far real-time engine footage can be pushed toward a filmic look. The aim was to make it read like a pre-rendered trailer rather than a screen recording.',
    goals: [
      'Turn raw capture into a paced, story-driven sequence.',
      'Design a title and lower-third system that feels premium, not gamer-y.',
      'Match a consistent color identity across wildly different lighting.',
    ],
    direction:
      'I leaned into ash, ember, and low-light contrast — a world caught between cooling and burning. Motion graphics are minimal and typographic, letting the frames do the talking.',
    process:
      'I captured multiple passes of the same beats to give myself coverage, then cut for rhythm and camera language rather than gameplay logic. Stabilisation and subtle reframing sold the "cinematographer" illusion.',
    software: ['DaVinci Resolve', 'After Effects', 'Fusion'],
    techniques: [
      'Reframing and stabilisation to fake deliberate camera moves',
      'Shot matching across inconsistent engine lighting',
      'Typographic title system built in After Effects',
      'Motion blur and shutter tuning for a cinematic cadence',
    ],
    motionNotes:
      'The title system uses a single typeface at two weights, animated with slow tracking-in reveals. Nothing bounces — every element eases in on a long curve and settles.',
    gradeNotes:
      'A warm-shadow, cool-highlight split with heavy contrast, then a gentle bloom on the embers. I kept skin and fire tones protected with qualifiers so the grade never turned muddy.',
    challenges:
      'Engine lighting shifted between captures, so matching shots took far longer than the edit itself. Building a node tree I could reuse per shot saved the project.',
    lessons:
      'Coverage matters even when you own the camera. Capturing extra angles gave me the freedom to cut like an editor instead of a player.',
    stills: [
      { src: '', alt: 'Ember-lit wide shot from the sequence', caption: 'Warm shadows, cool highlights' },
      { src: '', alt: 'Typographic title card', caption: 'Minimal, film-first title system' },
    ],
    timelineStills: [
      { src: '', alt: 'Resolve node tree for shot matching', caption: 'Reusable node tree for shot matching' },
    ],
    gradeComparisons: [{ before: '', after: '', label: 'Raw capture → graded frame' }],
    featured: true,
  },
  {
    slug: 'the-quiet-hour',
    title: 'The Quiet Hour',
    summary: 'A short, wordless character piece about the small ritual of a morning before everything changes.',
    kind: 'Short film · Personal project',
    year: '2024',
    categories: ['Short Film', 'Color Grading', 'Sound Design'],
    thumbnail: '',
    video: { provider: 'youtube', id: '' },
    overview:
      'The Quiet Hour is a short, intimate edit built around stillness. I wanted to practice emotional pacing — how long you can hold on a face, a hand, a window, before the audience feels it rather than watches it.',
    goals: [
      'Edit for emotion and rhythm instead of information.',
      'Grade for warmth and nostalgia without tipping into sentimentality.',
      'Let ambient sound design carry the emotional subtext.',
    ],
    direction:
      'Soft morning light, warm neutrals, and a palette that feels remembered rather than lived. The cutting is slow and breathing, closer to a photograph coming to life than a scene.',
    process:
      'I organised selects by emotional temperature, not by scene, then built the piece as a rising and falling curve. The edit went through several silent passes before any sound was added.',
    software: ['DaVinci Resolve', 'Fairlight', 'Premiere Pro'],
    techniques: [
      'Long holds and dissolves for emotional pacing',
      'Cutting on breath and gesture',
      'Ambient soundscape layering',
      'Warm, filmic color grade',
    ],
    soundNotes:
      'The soundscape is built from close, quiet textures — fabric, a kettle, distant traffic — mixed low so the audience leans in. There is no score until the final shot, which is the only moment music is allowed.',
    gradeNotes:
      'A warm, gentle grade with soft roll-off in the highlights and protected skin tones. I pulled a little saturation out of the shadows to keep it from feeling like a commercial.',
    challenges:
      'Restraint, again. The instinct to cut faster fought the whole intention of the piece. Watching it back on a real screen, away from the timeline, kept me honest.',
    lessons:
      'Emotion lives in duration. The shots I almost trimmed were the ones people remembered.',
    stills: [
      { src: '', alt: 'Warm morning light through a window', caption: 'Remembered, not lived — the palette of memory' },
      { src: '', alt: 'Close hold on a hand', caption: 'Cutting on breath and gesture' },
    ],
    gradeComparisons: [{ before: '', after: '', label: 'Neutral capture → warm memory grade' }],
    featured: true,
  },
  {
    slug: 'nightshift-devlog',
    title: 'Nightshift — Devlog',
    summary: 'A developer-log edit that makes the unglamorous work of building feel cinematic and worth watching.',
    kind: 'Developer log · Spec edit',
    year: '2025',
    categories: ['Developer Log', 'Motion Graphics', 'Sound Design'],
    thumbnail: '',
    video: { provider: 'youtube', id: '' },
    overview:
      'Nightshift is a spec developer-log edit made to prove that "someone building something at their desk" can be genuinely cinematic. Devlogs are usually flat and functional; I wanted to give the format tension and momentum.',
    goals: [
      'Bring narrative structure and pacing to a talking-head / screen-capture format.',
      'Design clean, informative motion graphics that never distract.',
      'Keep screen recordings legible while still feeling filmic.',
    ],
    direction:
      'Late-night, monitor-lit, focused. The graphics language is precise and monospaced, echoing a code editor without becoming a meme. Warmth comes from the desk lamp, not the grade.',
    process:
      'I scripted the beats first, then cut b-roll and capture against a voiceover spine. Motion graphics were designed as a reusable kit so future episodes stay consistent.',
    software: ['After Effects', 'Premiere Pro', 'DaVinci Resolve'],
    techniques: [
      'Voiceover-driven pacing',
      'Reusable motion-graphics kit',
      'Screen-capture punch-ins for legibility',
      'Subtle parallax on stills',
    ],
    motionNotes:
      'A monospaced label system animates on with quick, confident wipes. Progress and metrics are shown as restrained typographic callouts rather than busy infographics.',
    challenges:
      'Keeping screen captures readable at delivery resolution while still cutting quickly. Punch-ins and selective sharpening did most of the work.',
    lessons:
      'Structure beats spectacle. Once the narration had a real arc, the visuals only had to support it.',
    stills: [
      { src: '', alt: 'Monitor-lit desk at night', caption: 'Warmth from the lamp, not the grade' },
      { src: '', alt: 'Monospaced motion-graphics callout', caption: 'A reusable, restrained graphics kit' },
    ],
    featured: false,
  },
  {
    slug: 'signal',
    title: 'Signal',
    summary: 'A pure sound-design study — one minute of image scored entirely by textures built from scratch.',
    kind: 'Sound design study · Personal project',
    year: '2024',
    categories: ['Sound Design', 'Motion Graphics'],
    thumbnail: '',
    video: { provider: 'youtube', id: '' },
    overview:
      'Signal is an exercise in building an entire soundscape from nothing. I took a short abstract visual and designed every element of the audio by hand to practice thinking in frequency, space, and dynamics.',
    goals: [
      'Design a full mix from silence — no library beds.',
      'Practice spatialisation and dynamic range.',
      'Sync sound design tightly to abstract motion.',
    ],
    direction:
      'Cold, electronic, and precise. The visual is minimal so the sound has room to be the subject. Everything is about tension and release across a single minute.',
    process:
      'I recorded household objects and synthesised the rest, then processed everything until it lost its origin. The mix was built to a reference loudness so it would translate across devices.',
    software: ['Fairlight', 'Ableton Live', 'iZotope RX'],
    techniques: [
      'Foley recording and heavy processing',
      'Synthesis and re-amping',
      'Spatial panning and reverb design',
      'Loudness-referenced mixing',
    ],
    soundNotes:
      'Three layers: a sub foundation, a mid texture built from processed foley, and a high sparkle for detail. Automation rides the whole thing so it never sits static.',
    challenges:
      'Making disparate recorded elements feel like they belong in one room. Shared reverb sends and careful EQ carving pulled them together.',
    lessons:
      'Sound design is editing. Choosing what to leave out of the mix mattered more than what I put in.',
    stills: [{ src: '', alt: 'Abstract minimal visual from Signal', caption: 'Minimal image, maximal sound' }],
    featured: false,
  },
  {
    slug: 'neon-rain-grade-study',
    title: 'Grade Study — Neon Rain',
    summary: 'A color-grading study turning flat log footage into a rain-soaked, neon-lit night in three looks.',
    kind: 'Color grading study · Personal project',
    year: '2025',
    categories: ['Color Grading', 'Motion Graphics'],
    thumbnail: '',
    video: { provider: 'youtube', id: '' },
    overview:
      'Neon Rain is a focused color study. I took a single set of flat log clips and developed three distinct night looks from them to practice building a grade with intention rather than presets.',
    goals: [
      'Build a full grade from a neutral starting point.',
      'Practice power windows, qualifiers, and secondary color work.',
      'Develop three looks that stay believable, not gaudy.',
    ],
    direction:
      'Wet streets, neon signage, and reflected light. The challenge was pushing saturation in the highlights while keeping shadows clean and skin natural.',
    process:
      'I balanced each shot first, then built a node tree: primary balance, contrast, secondaries for the neons, a subtle vignette, then film emulation. Each look is a variation on that spine.',
    software: ['DaVinci Resolve'],
    techniques: [
      'Primary balance from log',
      'Qualifiers for neon isolation',
      'Power windows and vignettes',
      'Film emulation and grain',
    ],
    gradeNotes:
      'The trick was protecting skin with a qualifier while letting the environment go saturated and moody. A gentle film emulation on top unified the three looks.',
    challenges:
      'Keeping the three looks distinct without any of them feeling like a filter. Restraint on saturation was the deciding factor.',
    lessons:
      'A great grade is built, not applied. Understanding why each node exists made every look intentional.',
    stills: [{ src: '', alt: 'Neon-lit wet street, graded', caption: 'Saturated environment, protected skin tones' }],
    gradeComparisons: [
      { before: '', after: '', label: 'Log → Look A (cool)' },
      { before: '', after: '', label: 'Log → Look B (warm)' },
    ],
    featured: false,
  },
]

/** Convenience selectors. */
export const featuredProjects = projects.filter((p) => p.featured)

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null
  next: Project | null
} {
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? projects[index - 1] : projects[projects.length - 1],
    next: index < projects.length - 1 ? projects[index + 1] : projects[0],
  }
}
