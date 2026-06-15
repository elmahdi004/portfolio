import { cn } from '../../lib/cn.js'

export default function GradientText({ children, className, animated = false, as: Comp = 'span' }) {
  return (
    <Comp className={cn(animated ? 'text-gradient-animated' : 'text-gradient', className)}>
      {children}
    </Comp>
  )
}
