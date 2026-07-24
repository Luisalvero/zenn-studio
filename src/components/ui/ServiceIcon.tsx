import {
  Clapperboard,
  Gamepad2,
  Terminal,
  Film,
  AudioLines,
  Palette,
  Shapes,
  type LucideProps,
} from 'lucide-react'

/** Explicit map keeps the bundle small (only these icons are shipped). */
const iconMap = {
  Clapperboard,
  Gamepad2,
  Terminal,
  Film,
  AudioLines,
  Palette,
  Shapes,
} as const

interface ServiceIconProps extends LucideProps {
  name: string
}

/** Resolves a service's icon name to its Lucide component. */
export function ServiceIcon({ name, ...props }: ServiceIconProps) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? Film
  return <Icon {...props} />
}
