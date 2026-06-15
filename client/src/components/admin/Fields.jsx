import { cn } from '../../lib/cn.js'

const base =
  'w-full rounded-xl border border-line/70 bg-surface/50 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary/60'

export function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-medium text-muted">{children}</label>
}

export function Text({ label, value, onChange, ...rest }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input className={base} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </div>
  )
}

export function TextArea({ label, value, onChange, rows = 4, ...rest }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <textarea
        rows={rows}
        className={cn(base, 'resize-y')}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  )
}

export function NumberInput({ label, value, onChange, ...rest }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input
        type="number"
        className={base}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        {...rest}
      />
    </div>
  )
}

export function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <select className={base} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const val = o.value ?? o
          const lbl = o.label ?? o
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line/70 bg-surface/50 px-3.5 py-2.5">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn('relative h-6 w-11 rounded-full transition-colors', value ? 'bg-primary' : 'bg-surface-2')}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
            value ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  )
}

export function TagsInput({ label, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const arr = Array.isArray(value) ? value : []
  const add = (v) => {
    const t = (v || '').trim()
    if (t && !arr.includes(t)) onChange([...arr, t])
  }
  const remove = (i) => onChange(arr.filter((_, idx) => idx !== i))
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-line/70 bg-surface/50 p-2">
        {arr.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs">
            {t}
            <button type="button" onClick={() => remove(i)} className="text-muted hover:text-rose-400">
              ×
            </button>
          </span>
        ))}
        <input
          className="min-w-[120px] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-muted/70"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add(e.target.value)
              e.target.value = ''
            }
          }}
          onBlur={(e) => {
            if (e.target.value) {
              add(e.target.value)
              e.target.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}
