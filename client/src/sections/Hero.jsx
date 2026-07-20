import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { useProfile } from '../hooks/useApi.js'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { FALLBACK_PROFILE } from '../lib/fallback.js'
import { useI18n } from '../lib/i18n.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import MagneticButton from '../components/ui/MagneticButton.jsx'
// Three.js is heavy — load it in its own chunk so the page paints first.
const Hero3D = lazy(() => import('../components/three/Hero3D.jsx'))

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

// The terminal card was replaced by the interactive 3D hero (see Hero3D).

export default function Hero() {
  const { t } = useI18n()
  const { data } = useProfile()
  const profile = data && data.name ? data : FALLBACK_PROFILE
  const name = profile.name
  const roles = profile.roles?.length ? profile.roles : FALLBACK_PROFILE.roles
  const tagline = profile.tagline || FALLBACK_PROFILE.tagline
  const typed = useTypewriter(roles)
  // "El Mahdi Bellaziz" -> "El Mahdi" (drop the surname; fall back to full name)
  const socials = profile?.socials || {}
  const email = profile?.email || socials.email
  const stats = profile?.stats || []

  return (
    <section id="hero" className="relative flex min-h-screen items-center pb-24 pt-32">
      <div className="section grid min-w-0 items-center gap-10 !py-0 sm:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
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
            {profile?.availableForWork === false ? t('hero.badgeBusy') : t('hero.badgeAvailable')}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-balance text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t('hero.greeting')} <GradientText animated>{name}</GradientText>.
            <br />
            {t('hero.engineer')}{' '}
            <span className="break-words">
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
              {t('hero.viewWork')} <ArrowUpRight size={18} />
            </MagneticButton>
            <MagneticButton as="a" href="#contact" className="btn-ghost">
              {t('hero.getInTouch')}
            </MagneticButton>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <Download size={16} /> {t('hero.resume')}
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Suspense fallback={<div className="relative mx-auto aspect-square w-full max-w-md" />}>
            <Hero3D />
          </Suspense>
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
