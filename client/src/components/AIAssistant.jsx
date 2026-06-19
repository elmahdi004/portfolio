import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'
import api from '../lib/api.js'
import Spinner from './ui/Spinner.jsx'
import { useI18n } from '../lib/i18n.jsx'

function TypingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [{ role: 'assistant', content: t('ai.greeting') }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const SUGGESTIONS = [t('ai.s1'), t('ai.s2'), t('ai.s3'), t('ai.s4')]

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-ai-assistant', onOpen)
    return () => window.removeEventListener('open-ai-assistant', onOpen)
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  const send = async (text) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const payload = next.filter((m, i) => !(i === 0 && m.role === 'assistant'))
      const { data } = await api.post('/assistant', {
        messages: payload.map((m) => ({ role: m.role, content: m.content })),
      })
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...next, { role: 'assistant', content: t('ai.error') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('ai.title')}
        className="fixed bottom-5 end-5 z-[75] grid h-14 w-14 place-items-center rounded-full text-white shadow-glow-lg"
        style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'x' : 'chat'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={22} /> : <MessageSquare size={22} />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute end-0 top-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-bg" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 end-5 z-[75] w-[calc(100vw-2.5rem)] max-w-sm"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-[30rem] max-h-[70vh] flex-col overflow-hidden rounded-2xl glass-strong shadow-soft">
              <div className="flex items-center gap-3 border-b border-line/60 p-4">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-white"
                  style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--secondary)))' }}
                >
                  <Sparkles size={16} />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{t('ai.title')}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t('ai.subtitle')}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface/60"
                >
                  <X size={16} />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                        m.role === 'user'
                          ? 'rounded-br-md bg-primary text-white'
                          : 'rounded-bl-md glass'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md glass px-4 py-3">
                      <TypingDots />
                    </div>
                  </div>
                )}
                {messages.length <= 1 && !loading && (
                  <div className="space-y-2 pt-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="block w-full rounded-xl border border-line/60 bg-surface/40 px-3 py-2 text-start text-xs text-muted transition-colors hover:border-primary/50 hover:text-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send()
                }}
                className="flex items-center gap-2 border-t border-line/60 p-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('ai.placeholder')}
                  className="flex-1 rounded-full border border-line/70 bg-surface/50 px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-primary/60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white disabled:opacity-50"
                  style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}
                >
                  {loading ? <Spinner className="h-4 w-4 border-white/40 border-t-white" /> : <Send size={16} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
