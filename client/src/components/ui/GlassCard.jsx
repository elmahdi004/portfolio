import { forwardRef } from 'react'
import { cn } from '../../lib/cn.js'

// Glass surface with an optional cursor-tracking spotlight glow.
const GlassCard = forwardRef(function GlassCard(
  { as: Comp = 'div', className, spotlight = true, children, ...props },
  ref
) {
  const onMouseMove = spotlight
    ? (e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
    : undefined

  return (
    <Comp
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn('glass rounded-2xl', spotlight && 'card-spotlight', className)}
      {...props}
    >
      {children}
    </Comp>
  )
})

export default GlassCard
