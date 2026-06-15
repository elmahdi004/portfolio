import { useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Star } from 'lucide-react'
import { useAdminSkills, useCrud } from '../../hooks/useAdmin.js'
import Modal from '../../components/admin/Modal.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import GlassCard from '../../components/ui/GlassCard.jsx'
import { PageHeader, Loading, Empty } from '../../components/admin/ui.jsx'
import { Text, Select, Toggle, NumberInput, Label } from '../../components/admin/Fields.jsx'

const EMPTY = { name: '', category: 'Languages', level: 80, color: '#8b5cf6', featured: false, order: 0 }
const CATEGORIES = ['Languages', 'Frontend', 'Backend', 'DevOps', 'Security', 'Cloud', 'Other']

export default function SkillsAdmin() {
  const { data, isLoading } = useAdminSkills()
  const { create, update, remove } = useCrud('skills')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const openNew = () => {
    setForm(EMPTY)
    setEditing('new')
  }
  const openEdit = (s) => {
    setForm({ ...EMPTY, ...s })
    setEditing(s._id)
  }
  const save = async () => {
    if (!form.name.trim()) return toast.error('Name is required')
    try {
      if (editing === 'new') {
        await create.mutateAsync(form)
        toast.success('Skill added')
      } else {
        await update.mutateAsync({ id: editing, ...form })
        toast.success('Skill updated')
      }
      setEditing(null)
    } catch (e) {
      toast.error(e.message || 'Save failed')
    }
  }
  const del = async (s) => {
    if (!window.confirm(`Delete "${s.name}"?`)) return
    try {
      await remove.mutateAsync(s._id)
      toast.success('Deleted')
    } catch (e) {
      toast.error(e.message)
    }
  }
  const saving = create.isPending || update.isPending

  return (
    <div>
      <PageHeader title="Skills" subtitle="Your tech stack and proficiency." onNew={openNew} newLabel="New skill" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {(data || []).map((s) => (
            <GlassCard key={s._id} className="flex items-center gap-3 p-4" spotlight={false}>
              <span className="h-9 w-9 shrink-0 rounded-lg" style={{ background: s.color || 'rgb(var(--primary))' }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{s.name}</span>
                  {s.featured && <Star size={13} className="text-yellow-400" fill="currentColor" />}
                </div>
                <div className="text-xs text-muted">
                  {s.category} · {s.level}%
                </div>
              </div>
              <button
                onClick={() => openEdit(s)}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface/60 hover:text-ink"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => del(s)}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-rose-500/10 hover:text-rose-400"
              >
                <Trash2 size={15} />
              </button>
            </GlassCard>
          ))}
          {(!data || data.length === 0) && (
            <div className="sm:col-span-2">
              <Empty label="No skills yet." />
            </div>
          )}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New skill' : 'Edit skill'}
        footer={
          <>
            <button onClick={() => setEditing(null)} className="btn-ghost !py-2">
              Cancel
            </button>
            <button onClick={save} disabled={saving} className="btn-primary !py-2">
              {saving ? <Spinner className="h-4 w-4 border-white/40 border-t-white" /> : 'Save'}
            </button>
          </>
        }
      >
        <Text label="Name" value={form.name} onChange={(v) => set('name', v)} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" value={form.category} onChange={(v) => set('category', v)} options={CATEGORIES} />
          <NumberInput
            label="Level (0-100)"
            value={form.level}
            onChange={(v) => set('level', Math.max(0, Math.min(100, v)))}
            min={0}
            max={100}
          />
        </div>
        <div className="grid grid-cols-2 items-end gap-3">
          <div>
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.color || '#8b5cf6'}
                onChange={(e) => set('color', e.target.value)}
                className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-line/70 bg-transparent"
              />
              <Text value={form.color} onChange={(v) => set('color', v)} placeholder="#8b5cf6" />
            </div>
          </div>
          <Toggle label="Featured" value={form.featured} onChange={(v) => set('featured', v)} />
        </div>
        <NumberInput label="Order" value={form.order} onChange={(v) => set('order', v)} />
      </Modal>
    </div>
  )
}
