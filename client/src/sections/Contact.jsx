import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Mail, MapPin, Send, Github, Linkedin, MessageSquare } from 'lucide-react'
import api from '../lib/api.js'
import { IS_STATIC, submitContactStatic } from '../lib/staticMode.js'
import { useProfile } from '../hooks/useApi.js'
import { FALLBACK_PROFILE } from '../lib/fallback.js'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import GradientText from '../components/ui/GradientText.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useI18n } from '../lib/i18n.jsx'

const inputClass =
  'w-full rounded-xl border border-line/70 bg-surface/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary/60'

function ContactRow({ icon: Icon, label, value, href }) {
  const inner = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line/60 bg-surface/60 text-primary">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <div className="text-xs text-muted">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </>
  )
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-opacity hover:opacity-80">
      {inner}
    </a>
  ) : (
    <div className="flex items-center gap-3">{inner}</div>
  )
}

export default function Contact() {
  const { t } = useI18n()
  const { data } = useProfile()
  const profile = data && data.name ? data : FALLBACK_PROFILE
  const socials = profile.socials || {}
  const email = profile.email || socials.email
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const mutation = useMutation({
    mutationFn: (payload) =>
      IS_STATIC ? submitContactStatic(payload) : api.post('/contact', payload).then((r) => r.data),
    onSuccess: (res) => {
      // Without a form service configured, static mode hands off to mailto:.
      toast.success(res?.mailto ? 'Opening your email app…' : t('contact.toastSuccess'))
      if (!res?.mailto) setForm({ name: '', email: '', subject: '', message: '' })
    },
    onError: (e) => toast.error(e.message || t('contact.toastError')),
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error(t('contact.toastFill'))
      return
    }
    mutation.mutate(form)
  }

  return (
    <section id="contact" className="section">
      <SectionHeading
        eyebrow={t('contact.eyebrow')}
        title={
          <>
            {t('contact.title1')}
            <GradientText>{t('contact.titleHl')}</GradientText>
          </>
        }
        subtitle={t('contact.subtitle')}
      />

      <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="space-y-6">
            <p className="text-muted">
              {t('contact.introA')}
              <span className="font-medium text-ink">
                {profile.availableForWork ? t('contact.open') : t('contact.focused')}
              </span>
              {t('contact.introB')}
            </p>
            <div className="space-y-4">
              {email && (
                <ContactRow icon={Mail} label={t('contact.email')} value={email} href={`mailto:${email}`} />
              )}
              {profile.location && (
                <ContactRow icon={MapPin} label={t('contact.location')} value={profile.location} />
              )}
              {socials.github && (
                <ContactRow icon={Github} label="GitHub" value="@elmahdi004" href={socials.github} />
              )}
              {socials.linkedin && (
                <ContactRow icon={Linkedin} label="LinkedIn" value="El Mahdi Bellaziz" href={socials.linkedin} />
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard className="p-6 sm:p-7">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputClass} placeholder={t('contact.namePh')} value={form.name} onChange={set('name')} />
                <input
                  className={inputClass}
                  type="email"
                  placeholder={t('contact.emailPh')}
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
              <input
                className={inputClass}
                placeholder={t('contact.subjectPh')}
                value={form.subject}
                onChange={set('subject')}
              />
              <textarea
                className={`${inputClass} min-h-[140px] resize-y`}
                placeholder={t('contact.messagePh')}
                value={form.message}
                onChange={set('message')}
              />
              <button type="submit" disabled={mutation.isPending} className="btn-primary w-full disabled:opacity-70">
                {mutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 border-white/40 border-t-white" /> {t('contact.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.send')} <Send size={16} />
                  </>
                )}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
                <MessageSquare size={12} /> {t('contact.aiHint')}
              </p>
            </form>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}
