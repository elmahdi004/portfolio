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
import { useI18n } from '../lib/i18n.jsx'

const SECTIONS = [
  { id: 'top', key: 'palette.home', icon: Home },
  { id: 'about', key: 'nav.about', icon: User },
  { id: 'skills', key: 'nav.skills', icon: Cpu },
  { id: 'projects', key: 'nav.projects', icon: FolderGit2 },
  { id: 'experience', key: 'nav.journey', icon: Route },
  { id: 'github', key: 'nav.github', icon: Github },
  { id: 'contact', key: 'nav.contact', icon: Mail },
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
  const { t } = useI18n()
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
        toast.success(t('palette.copied'))
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
                  placeholder={t('palette.placeholder')}
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted"
                />
                <kbd className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
              </div>
              <Command.List className="max-h-[22rem] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted">
                  {t('palette.empty')}
                </Command.Empty>
                <Command.Group heading={t('palette.navigate')} className={groupClass}>
                  {SECTIONS.map((s) => (
                    <Item key={s.id} icon={s.icon} onSelect={() => goto(s.id)}>
                      {t(s.key)}
                    </Item>
                  ))}
                </Command.Group>
                <Command.Group heading={t('palette.actions')} className={groupClass}>
                  <Item icon={isDark ? Sun : Moon} onSelect={() => run(toggle)}>
                    {isDark ? t('palette.switchLight') : t('palette.switchDark')}
                  </Item>
                  <Item icon={Sparkles} onSelect={openAI}>
                    {t('palette.askAI')}
                  </Item>
                  <Item icon={Copy} onSelect={copyEmail}>
                    {t('palette.copyEmail')}
                  </Item>
                </Command.Group>
                <Command.Group heading={t('palette.links')} className={groupClass}>
                  <Item icon={Github} onSelect={() => openLink(GITHUB)}>
                    {t('palette.githubProfile')}
                  </Item>
                  <Item icon={Linkedin} onSelect={() => openLink(LINKEDIN)}>
                    {t('palette.linkedin')}
                  </Item>
                  <Item icon={Mail} onSelect={() => openLink(`mailto:${EMAIL}`)}>
                    {t('palette.sendEmail')}
                  </Item>
                </Command.Group>
                <Command.Group heading={t('palette.admin')} className={groupClass}>
                  <Item icon={Lock} onSelect={() => run(() => navigate('/admin'))}>
                    {t('palette.adminDash')}
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
