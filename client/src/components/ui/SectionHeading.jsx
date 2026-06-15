import { cn } from '../../lib/cn.js'
import Reveal from './Reveal.jsx'

// `title` is a node so callers can drop a <GradientText> inside.
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className }) {
  const centered = align === 'center'
  return (
    <Reveal className={cn(centered ? 'text-center' : 'text-left', className)}>
      {eyebrow && (
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle && (
        <p className={cn('mt-4 max-w-2xl text-muted', centered && 'mx-auto')}>{subtitle}</p>
      )}
    </Reveal>
  )
}
