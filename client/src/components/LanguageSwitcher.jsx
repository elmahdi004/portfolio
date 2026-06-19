import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useI18n, LANGS } from '../lib/i18n.jsx'
import { cn } from '../lib/cn.js'

export default function LanguageSwitcher({ className }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        className="flex h-10 items-center gap-1.5 rounded-full glass px-3 text-sm transition-colors hover:border-primary/50"
      >
        <Globe size={16} />
        <span className="font-medium">{LANGS[lang].short}</span>
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-40 overflow-hidden rounded-xl glass-strong p-1 shadow-soft">
          {Object.entries(LANGS).map(([code, l]) => (
            <button
              key={code}
              onClick={() => {
                setLang(code)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                lang === code ? 'bg-surface text-ink' : 'text-muted hover:bg-surface/60 hover:text-ink'
              )}
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1 text-start">{l.name}</span>
              {lang === code && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
