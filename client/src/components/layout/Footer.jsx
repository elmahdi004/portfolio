import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { useProfile } from '../../hooks/useApi.js'
import GradientText from '../ui/GradientText.jsx'
import { useI18n } from '../../lib/i18n.jsx'

const YEAR = new Date().getFullYear()

function SocialIcon({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full glass text-muted transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-ink"
    >
      <Icon size={18} />
    </a>
  )
}

export default function Footer() {
  const { t } = useI18n()
  const { data: profile } = useProfile()
  const socials = profile?.socials || {}
  const email = profile?.email || socials.email

  return (
    <footer className="relative mt-10 border-t border-line/60">
      <div className="section !py-12">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <a href="#top" className="font-display text-xl font-bold">
              <GradientText>El Mahdi Bellaziz</GradientText>
            </a>
            <p className="mt-2 max-w-sm text-sm text-muted">
              {profile?.title || 'DevSecOps Engineer & Full-Stack Developer'}
              {t('footer.tagline')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {socials.github && <SocialIcon href={socials.github} icon={Github} label="GitHub" />}
            {socials.linkedin && <SocialIcon href={socials.linkedin} icon={Linkedin} label="LinkedIn" />}
            {email && <SocialIcon href={`mailto:${email}`} icon={Mail} label="Email" />}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="grid h-11 w-11 place-items-center rounded-full glass transition-colors hover:border-primary/50"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center border-t border-line/50 pt-6 text-xs text-muted">
          <p>© {YEAR} El Mahdi Bellaziz. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
