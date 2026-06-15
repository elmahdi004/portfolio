import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAdminExperiences, useCrud } from '../../hooks/useAdmin.js'
import Modal from '../../components/admin/Modal.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { PageHeader, Row, Loading, Empty } from '../../components/admin/ui.jsx'
import { Text, TextArea, Select, Toggle, TagsInput, NumberInput } from '../../components/admin/Fields.jsx'

const EMPTY = {
  role: '',
  company: '',
  location: '',
  type: 'work',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: [],
  tags: [],
  order: 0,
}
const TYPES = [
  { value: 'work', label: 'Work' },
  { value: 'education', label: 'Education' },
  { value: 'certification', label: 'Certification' },
]
const asDate = (d) => (d ? String(d).slice(0, 10) : '')

export default function ExperiencesAdmin() {
  const { data, isLoading } = useAdminExperiences()
  const { create, update, remove } = useCrud('experiences')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const openNew = () => {
    setForm(EMPTY)
    setEditing('new')
  }
  const openEdit = (e) => {
    setForm({ ...EMPTY, ...e, startDate: asDate(e.startDate), endDate: asDate(e.endDate) })
    setEditing(e._id)
  }

  const save = async () => {
    if (!form.role.trim() || !form.company.trim()) return toast.error('Role and company are required')
    const payload = { ...form, endDate: form.current ? null : form.endDate || null, startDate: form.startDate || null }
    try {
      if (editing === 'new') {
        await create.mutateAsync(payload)
        toast.success('Experience added')
      } else {
        await update.mutateAsync({ id: editing, ...payload })
        toast.success('Experience updated')
      }
      setEditing(null)
    } catch (err) {
      toast.error(err.message || 'Save failed')
    }
  }
  const del = async (e) => {
    if (!window.confirm(`Delete "${e.role} @ ${e.company}"?`)) return
    try {
      await remove.mutateAsync(e._id)
      toast.success('Deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const saving = create.isPending || update.isPending

  return (
    <div>
      <PageHeader title="Experience" subtitle="Roles, education and certifications." onNew={openNew} newLabel="New entry" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {(data || []).map((e) => (
            <Row
              key={e._id}
              title={`${e.role} · ${e.company}`}
              subtitle={e.description}
              badge={e.type}
              meta={e.current ? 'Current' : null}
              onEdit={() => openEdit(e)}
              onDelete={() => del(e)}
            />
          ))}
          {(!data || data.length === 0) && <Empty label="No experience entries yet." />}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New experience' : 'Edit experience'}
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
        <div className="grid grid-cols-2 gap-3">
          <Text label="Role / Title" value={form.role} onChange={(v) => set('role', v)} />
          <Text label="Company / School" value={form.company} onChange={(v) => set('company', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Text label="Location" value={form.location} onChange={(v) => set('location', v)} />
          <Select label="Type" value={form.type} onChange={(v) => set('type', v)} options={TYPES} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Text label="Start date" type="date" value={form.startDate} onChange={(v) => set('startDate', v)} />
          <Text label="End date" type="date" value={form.endDate} onChange={(v) => set('endDate', v)} />
        </div>
        <Toggle label="Current (present)" value={form.current} onChange={(v) => set('current', v)} />
        <TextArea label="Description" value={form.description} onChange={(v) => set('description', v)} rows={3} />
        <TagsInput label="Highlights" value={form.highlights} onChange={(v) => set('highlights', v)} placeholder="Add a highlight, press Enter" />
        <TagsInput label="Tags" value={form.tags} onChange={(v) => set('tags', v)} />
        <NumberInput label="Order" value={form.order} onChange={(v) => set('order', v)} />
      </Modal>
    </div>
  )
}
