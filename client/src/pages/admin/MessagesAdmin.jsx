import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, MailOpen, Trash2, ChevronDown } from 'lucide-react'
import { useMessages, useMessageActions } from '../../hooks/useAdmin.js'
import GlassCard from '../../components/ui/GlassCard.jsx'
import { PageHeader, Loading, Empty } from '../../components/admin/ui.jsx'

const fmt = (d) => (d ? new Date(d).toLocaleString() : '')

export default function MessagesAdmin() {
  const { data, isLoading } = useMessages()
  const { setRead, remove } = useMessageActions()
  const [openId, setOpenId] = useState(null)

  const toggle = (m) => {
    const next = openId === m._id ? null : m._id
    setOpenId(next)
    if (next && !m.read) setRead.mutate({ id: m._id, read: true })
  }
  const del = async (m) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await remove.mutateAsync(m._id)
      toast.success('Deleted')
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <PageHeader title="Messages" subtitle="Inbox from your contact form." />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {(data || []).map((m) => (
            <GlassCard key={m._id} className="overflow-hidden p-0" spotlight={false}>
              <button onClick={() => toggle(m)} className="flex w-full items-center gap-3 p-4 text-left">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                    m.read ? 'bg-surface-2 text-muted' : 'bg-primary/15 text-primary'
                  }`}
                >
                  {m.read ? <MailOpen size={15} /> : <Mail size={15} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{m.name}</span>
                    {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    <span className="ml-auto shrink-0 text-xs text-muted">{fmt(m.createdAt)}</span>
                  </div>
                  <div className="truncate text-sm text-muted">{m.subject || m.message}</div>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted transition-transform ${openId === m._id ? 'rotate-180' : ''}`}
                />
              </button>
              {openId === m._id && (
                <div className="border-t border-line/60 p-4">
                  <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">
                    {m.email}
                  </a>
                  {m.subject && <div className="mt-1 font-medium">{m.subject}</div>}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{m.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your message'))}`}
                      className="btn-primary !py-2 text-sm"
                    >
                      Reply
                    </a>
                    <button onClick={() => setRead.mutate({ id: m._id, read: !m.read })} className="btn-ghost !py-2 text-sm">
                      {m.read ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button onClick={() => del(m)} className="btn-ghost ml-auto !py-2 text-sm !text-rose-400">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
          {(!data || data.length === 0) && <Empty label="No messages yet." />}
        </div>
      )}
    </div>
  )
}
