import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { useProfile } from '../hooks/useApi.js'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { FALLBACK_PROFILE } from '../lib/fallback.js'
import GradientText from '../components/ui/GradientText.jsx'
import MagneticButton from '../components/ui/MagneticButton.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'

function Social({ icon: Icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid h-11 w-11 place-items-center rounded-full glass text-muted transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-ink"
    >
      <Icon size={18} />
    </a>
  )
}

function HeroTerminal({ name, roles }) {
  const lines = [
    { p: '$', t: 'whoami' },
    { o: name, cls: 'text-ink' },
    { gap: true },
    { p: '$', t: 'cat roles.txt' },
    ...roles.map((r) => ({ o: `→ ${r}`, cls: 'text-secondary' })),
    { gap: true },
    { p: '$', t: 'security --audit' },
    { o: '✔ secure by design', cls: 'text-emerald-400' },
    { o: '✔ automated by default', cls: 'text-emerald-400' },
    { o: '✔ observable in production', cls: 'text-emerald-400' },
  ]
  return (
    <GlassCard className="overflow-hidden p-0 shadow-glow">
      <div className="flex items-center gap-2 border-b border-line/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-3 font-mono text-xs text-muted">bellaziz@portfolio: ~</span>
      </div>
      <div className="space-y-1 p-5 font-mono text-[13px] leading-relaxed">
        {lines.map((l, i) =>
          l.gap ? (
            <div key={i} className="h-3" />
          ) : (
            <div key={i} className={l.cls || 'text-muted'}>
              {l.p && <span className="text-primary">{l.p} </span>}
              {l.t || l.o}
            </div>
          )
        )}
        <div className="text-primary">
          ${' '}
          <span className="animate-blink">▌</span>
        </div>
      </div>
    </GlassCard>
  )
}

export default function Hero() {
  const { data } = useProfile()
  const profile = data && data.name ? data : FALLBACK_PROFILE
  const name = profile.name
  const roles = profile.roles?.length ? profile.roles : FALLBACK_PROFILE.roles
  const tagline = profile.tagline || FALLBACK_PROFILE.tagline
  const typed = useTypewriter(roles)
  // "El Mahdi Bellaziz" -> "El Mahdi" (drop the surname; fall back to full name)
  const firstName = name.split(' ').slice(0, -1).join(' ') || name
  const socials = profile?.socials || {}
  const email = profile?.email || socials.email
  const stats = profile?.stats || []

  return (
    <section id="hero" className="relative flex min-h-screen items-center pb-24 pt-32">
      <div className="section grid items-center gap-12 !py-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="chip"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile?.availableForWork === false
              ? 'Currently focused on a project'
              : 'Available for new opportunities'}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Hi, I'm <GradientText animated>{firstName}</GradientText>.
            <br />
            I engineer{' '}
            <span className="whitespace-nowrap">
              {typed}
              <span
                className="ml-0.5 inline-block w-[3px] animate-blink bg-primary align-middle"
                style={{ height: '0.9em' }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticButton as="a" href="#projects" className="btn-primary">
              View my work <ArrowUpRight size={18} />
            </MagneticButton>
            <MagneticButton as="a" href="#contact" className="btn-ghost">
              Get in touch
            </MagneticButton>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <Download size={16} /> Resume
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-3"
          >
            {socials.github && <Social icon={Github} href={socials.github} />}
            {socials.linkedin && <Social icon={Linkedin} href={socials.linkedin} />}
            {email && <Social icon={Mail} href={`mailto:${email}`} />}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="animate-float-slow"
        >
          <HeroTerminal name={name} roles={roles} />
        </motion.div>
      </div>

      {stats.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden md:block">
          <div className="section !py-0">
            <div className="grid grid-cols-4 gap-4">
              {stats.slice(0, 4).map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold">
                    <GradientText>{s.value}</GradientText>
                  </div>
                  <div className="text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
