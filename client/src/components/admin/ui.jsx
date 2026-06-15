import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import GlassCard from '../ui/GlassCard.jsx'
import Spinner from '../ui/Spinner.jsx'

export function PageHeader({ title, subtitle, onNew, newLabel = 'New' }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {onNew && (
        <button onClick={onNew} className="btn-primary shrink-0 !py-2.5">
          <Plus size={16} /> {newLabel}
        </button>
      )}
    </div>
  )
}

export function Loading() {
  return (
    <div className="grid place-items-center py-20">
      <Spinner className="h-7 w-7" />
    </div>
  )
}

export function Empty({ label }) {
  return (
    <GlassCard className="p-10 text-center text-muted" spotlight={false}>
      {label}
    </GlassCard>
  )
}

export function Row({ title, subtitle, badge, meta, featured, onEdit, onDelete }) {
  return (
    <GlassCard className="flex items-center gap-4 p-4" spotlight={false}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{title}</span>
          {featured && <Star size={14} className="shrink-0 text-yellow-400" fill="currentColor" />}
          {badge && <span className="chip !py-0.5 !text-[10px]">{badge}</span>}
          {meta && (
            <span className="chip !py-0.5 !text-[10px] border-amber-400/40 text-amber-400">{meta}</span>
          )}
        </div>
        {subtitle && <div className="truncate text-sm text-muted">{subtitle}</div>}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={onEdit}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface/60 hover:text-ink"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-rose-500/10 hover:text-rose-400"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </GlassCard>
  )
}
