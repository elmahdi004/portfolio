import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Command, ArrowUpRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { cn } from '../../lib/cn.js'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#experience' },
  { label: 'GitHub', href: '#github' },
  { label: 'Contact', href: '#contact' },
]

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-10 w-10 place-items-center rounded-full glass transition-colors hover:border-primary/50"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: -12, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 12, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openPalette = () => window.dispatchEvent(new CustomEvent('open-command-palette'))

  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'py-2' : 'py-4')}>
        <nav
          className={cn(
            'mx-3 flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-300 sm:mx-auto sm:max-w-7xl',
            scrolled ? 'glass-strong shadow-soft' : 'bg-transparent'
          )}
        >
          <a href="#top" className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}
            >
              EB
            </span>
            <span className="hidden text-sm font-semibold sm:block">
              El&nbsp;Mahdi<span className="text-muted"> · DevSecOps</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:bg-surface/60 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openPalette}
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-full glass px-3 py-2 text-xs text-muted transition-colors hover:border-primary/50 sm:flex"
            >
              <Command size={14} /> <span>Search</span>
              <kbd className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
            </button>
            <ThemeToggle />
            <a href="#contact" className="btn-primary !hidden !px-5 !py-2 text-sm md:!inline-flex">
              Hire me <ArrowUpRight size={16} />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full glass lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-bg/80 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 h-full w-72 glass-strong p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full glass"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-8 flex flex-col gap-1">
                {LINKS.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="rounded-xl px-4 py-3 text-lg font-medium text-muted hover:bg-surface/60 hover:text-ink"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </div>
              <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">
                Hire me
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
