import { cn } from '../../lib/cn.js'

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        'h-5 w-5 animate-spin rounded-full border-2 border-line border-t-primary',
        className
      )}
    />
  )
}
