import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Home,
  User,
  Cpu,
  FolderGit2,
  Route,
  Github,
  Mail,
  Linkedin,
  Sun,
  Moon,
  Sparkles,
  Lock,
  Copy,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

const SECTIONS = [
  { id: 'top', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: Route },
  { id: 'github', label: 'GitHub', icon: Github },
  { id: 'contact', label: 'Contact', icon: Mail },
]

const EMAIL = 'elmahdibellaziz@gmail.com'
const GITHUB = 'https://github.com/elmahdi004'
const LINKEDIN = 'https://www.linkedin.com/in/elmahdibellaziz'

const groupClass =
  '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted'

function Item({ icon: Icon, children, onSelect }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors data-[selected=true]:bg-surface data-[selected=true]:text-ink"
    >
      <Icon size={16} />
      <span>{children}</span>
    </Command.Item>
  )
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [])

  const run = useCallback((fn) => {
    setOpen(false)
    setTimeout(fn, 10)
  }, [])

  const goto = (id) =>
    run(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  const openLink = (url) => run(() => window.open(url, '_blank', 'noopener'))
  const copyEmail = () =>
    run(async () => {
      try {
        await navigator.clipboard.writeText(EMAIL)
        toast.success('Email copied to clipboard!')
      } catch {
        toast.error('Could not copy — please copy manually.')
      }
    })
  const openAI = () => run(() => window.dispatchEvent(new CustomEvent('open-ai-assistant')))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-md" onClick={() => setOpen(false)} />
          <motion.div
            className="relative z-10 h-fit w-full max-w-xl"
            initial={{ scale: 0.97, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: -8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Command loop className="overflow-hidden rounded-2xl glass-strong shadow-soft">
              <div className="flex items-center gap-2 border-b border-line/60 px-4">
                <Sparkles size={16} className="text-primary" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search…"
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted"
                />
                <kbd className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
              </div>
              <Command.List className="max-h-[22rem] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted">No results found.</Command.Empty>
                <Command.Group heading="Navigate" className={groupClass}>
                  {SECTIONS.map((s) => (
                    <Item key={s.id} icon={s.icon} onSelect={() => goto(s.id)}>
                      {s.label}
                    </Item>
                  ))}
                </Command.Group>
                <Command.Group heading="Actions" className={groupClass}>
                  <Item icon={isDark ? Sun : Moon} onSelect={() => run(toggle)}>
                    Switch to {isDark ? 'light' : 'dark'} mode
                  </Item>
                  <Item icon={Sparkles} onSelect={openAI}>
                    Ask the AI assistant
                  </Item>
                  <Item icon={Copy} onSelect={copyEmail}>
                    Copy email address
                  </Item>
                </Command.Group>
                <Command.Group heading="Links" className={groupClass}>
                  <Item icon={Github} onSelect={() => openLink(GITHUB)}>
                    GitHub profile
                  </Item>
                  <Item icon={Linkedin} onSelect={() => openLink(LINKEDIN)}>
                    LinkedIn
                  </Item>
                  <Item icon={Mail} onSelect={() => openLink(`mailto:${EMAIL}`)}>
                    Send an email
                  </Item>
                </Command.Group>
                <Command.Group heading="Admin" className={groupClass}>
                  <Item icon={Lock} onSelect={() => run(() => navigate('/admin'))}>
                    Admin dashboard
                  </Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
