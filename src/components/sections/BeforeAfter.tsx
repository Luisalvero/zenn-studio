import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ComparisonSlider } from '@/components/ui/ComparisonSlider'
import { beforeAfters } from '@/data/before-after'
import { cn } from '@/lib/utils'

/** "Before / after" grading + edit reveals — visceral proof of the craft. */
export function BeforeAfter() {
  if (!beforeAfters.length) return null

  return (
    <Section spacing="compact" aria-label="Before and after">
      <Container size="wide">
        <Reveal>
          <span className="eyebrow">The craft, up close</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl">
            Drag to see the grade.
          </h2>
          <p className="mt-3 max-w-lg text-sm text-mist">
            The raw frame on one side, the finished look on the other. Same shot — everything else is the work.
          </p>
        </Reveal>

        <div className={cn('mt-8 grid gap-8', beforeAfters.length > 1 && 'md:grid-cols-2')}>
          {beforeAfters.map((ba, i) => (
            <ComparisonSlider key={i} {...ba} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
