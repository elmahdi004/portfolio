import { motion } from 'framer-motion'

// Scroll-into-view reveal. Wrap any block to fade + rise it on entry.
export default function Reveal({ children, delay = 0, y = 24, className, once = true, as = 'div' }) {
  const Motion = motion[as] || motion.div
  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion>
  )
}
