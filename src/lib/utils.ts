/**
 * cn — tiny className combiner.
 * Filters out falsy values and joins the rest. Kept dependency-free; component
 * class lists in this project are authored to avoid conflicts, so a full
 * tailwind-merge is unnecessary.
 */
export type ClassValue = string | number | false | null | undefined

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Deterministic index from a string — used to vary placeholder gradients. */
export function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
