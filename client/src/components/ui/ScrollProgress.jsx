import { useScrollProgress } from '../../hooks/useScrollProgress.js'

// Thin gradient bar pinned to the top, scaling with scroll position.
export default function ScrollProgress() {
  const p = useScrollProgress()
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full origin-left transition-transform duration-75"
        style={{
          transform: `scaleX(${p})`,
          backgroundImage:
            'linear-gradient(90deg, rgb(var(--primary)), rgb(var(--secondary)), rgb(var(--accent)))',
        }}
      />
    </div>
  )
}
