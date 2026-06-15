import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

// A glowing dot + trailing ring that follows the cursor (fine pointers only).
export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const fine = useMediaQuery('(pointer: fine)')

  useEffect(() => {
    if (!fine) return
    let rx = 0,
      ry = 0,
      x = 0,
      y = 0,
      raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
    }
    const loop = () => {
      rx += (x - rx) * 0.15
      ry += (y - ry) * 0.15
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [fine])

  if (!fine) return null
  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-4 -mt-4 h-8 w-8 rounded-full border border-primary/60 mix-blend-difference"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary"
      />
    </>
  )
}
