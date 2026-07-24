import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** Leading/trailing icon nodes. */
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

interface AsButton extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  to?: never
  href?: never
}
interface AsLink extends BaseProps {
  /** Internal route — renders a react-router Link. */
  to: string
  href?: never
}
interface AsAnchor extends BaseProps {
  /** External URL — renders an anchor with safe rel. */
  href: string
  to?: never
  /** Anchor target; defaults to _blank for external links. */
  newTab?: boolean
}

type ButtonProps = AsButton | AsLink | AsAnchor

const base =
  'group inline-flex items-center justify-center gap-2.5 font-medium tracking-tight rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-40 disabled:pointer-events-none select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-chalk text-void hover:bg-bone hover:-translate-y-0.5 shadow-lg shadow-black/40',
  secondary:
    'border border-white/15 text-bone hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5 backdrop-blur-sm',
  ghost: 'text-mist hover:text-chalk',
}

const sizes: Record<Size, string> = {
  sm: 'text-xs px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-sm sm:text-base px-8 py-4',
}

function classesFor(variant: Variant, size: Size, fullWidth?: boolean, className?: string) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    iconLeft,
    iconRight,
    fullWidth,
  } = props

  const classes = classesFor(variant, size, fullWidth, className)
  const content = (
    <>
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0 transition-transform duration-500 group-hover:translate-x-1">{iconRight}</span>}
    </>
  )

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {content}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, newTab = true } = props as AsAnchor
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  // Strip the component's own props so only valid DOM attributes reach <button>.
  // (Names destructured alongside `...rest` are exempt from noUnusedLocals.)
  const {
    children: _children,
    variant: _variant,
    size: _size,
    className: _className,
    iconLeft: _iconLeft,
    iconRight: _iconRight,
    fullWidth: _fullWidth,
    type = 'button',
    ...rest
  } = props as AsButton
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}
