import type { ProcessStep } from '@/types'

/** The four-step working process shown on the home and about pages. */
export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Discover',
    description: 'Understand the project.',
    detail:
      'We start with the story you want to tell and the feeling you want people to leave with. I learn the footage, the intent, and the audience before a single cut is made.',
  },
  {
    index: '02',
    title: 'Edit',
    description: 'Craft pacing, storytelling, transitions.',
    detail:
      'The spine comes first — structure, rhythm, and the emotional curve. I cut to sound as much as to picture, shaping momentum until the piece feels inevitable.',
  },
  {
    index: '03',
    title: 'Refine',
    description: 'Sound design, color grading, polish.',
    detail:
      'With the edit locked, the piece is finished properly: sound designed and mixed, color graded with intention, and every frame polished until it feels cinematic.',
  },
  {
    index: '04',
    title: 'Deliver',
    description: 'Export and revisions.',
    detail:
      'Clean exports for wherever the piece is going, delivered to spec. Focused revision rounds make sure the final result is exactly what the project needs.',
  },
]
