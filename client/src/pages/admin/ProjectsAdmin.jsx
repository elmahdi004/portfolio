import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAdminProjects, useCrud } from '../../hooks/useAdmin.js'
import Modal from '../../components/admin/Modal.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { PageHeader, Row, Loading, Empty } from '../../components/admin/ui.jsx'
import { Text, TextArea, Select, Toggle, TagsInput, NumberInput } from '../../components/admin/Fields.jsx'

const EMPTY = {
  title: '',
  summary: '',
  description: '',
  category: 'Web',
  period: '',
  role: '',
  coverImage: '',
  tags: [],
  highlights: [],
  links: { github: '', live: '', demo: '' },
  featured: false,
  status: 'published',
  order: 0,
}
const CATEGORIES = ['Web', 'Security', 'DevOps', 'Cloud', 'Other']

export default function ProjectsAdmin() {
  const { data, isLoading } = useAdminProjects()
  const { create, update, remove } = useCrud('projects')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setLink = (k, v) => setForm((f) => ({ ...f, links: { ...f.links, [k]: v } }))
  const openNew = () => {
    setForm(EMPTY)
    setEditing('new')
  }
  const openEdit = (p) => {
    setForm({ ...EMPTY, ...p, links: { ...EMPTY.links, ...(p.links || {}) } })
    setEditing(p._id)
  }

  const save = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    try {
      if (editing === 'new') {
        await create.mutateAsync(form)
        toast.success('Project created')
      } else {
        await update.mutateAsync({ id: editing, ...form })
        toast.success('Project updated')
      }
      setEditing(null)
    } catch (e) {
      toast.error(e.message || 'Save failed')
    }
  }
  const del = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return
    try {
      await remove.mutateAsync(p._id)
      toast.success('Deleted')
    } catch (e) {
      toast.error(e.message)
    }
  }

  const saving = create.isPending || update.isPending

  return (
    <div>
      <PageHeader title="Projects" subtitle="Manage your portfolio projects." onNew={openNew} newLabel="New project" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {(data || []).map((p) => (
            <Row
              key={p._id}
              title={p.title}
              subtitle={p.summary}
              badge={p.category}
              featured={p.featured}
              meta={p.status === 'draft' ? 'Draft' : null}
              onEdit={() => openEdit(p)}
              onDelete={() => del(p)}
            />
          ))}
          {(!data || data.length === 0) && <Empty label="No projects yet. Create your first one!" />}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New project' : 'Edit project'}
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
        <Text label="Title" value={form.title} onChange={(v) => set('title', v)} />
        <Text label="Summary" value={form.summary} onChange={(v) => set('summary', v)} />
        <TextArea label="Description" value={form.description} onChange={(v) => set('description', v)} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" value={form.category} onChange={(v) => set('category', v)} options={CATEGORIES} />
          <Select label="Status" value={form.status} onChange={(v) => set('status', v)} options={['published', 'draft']} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Text label="Period" value={form.period} onChange={(v) => set('period', v)} placeholder="2025" />
          <Text label="Role" value={form.role} onChange={(v) => set('role', v)} />
        </div>
        <Text label="Cover image URL" value={form.coverImage} onChange={(v) => set('coverImage', v)} placeholder="https://…" />
        <TagsInput label="Tags" value={form.tags} onChange={(v) => set('tags', v)} />
        <TagsInput label="Highlights" value={form.highlights} onChange={(v) => set('highlights', v)} placeholder="Add a highlight, press Enter" />
        <div className="grid grid-cols-2 gap-3">
          <Text label="GitHub link" value={form.links.github} onChange={(v) => setLink('github', v)} />
          <Text label="Live link" value={form.links.live} onChange={(v) => setLink('live', v)} />
        </div>
        <div className="grid grid-cols-2 items-end gap-3">
          <NumberInput label="Order" value={form.order} onChange={(v) => set('order', v)} />
          <Toggle label="Featured" value={form.featured} onChange={(v) => set('featured', v)} />
        </div>
      </Modal>
    </div>
  )
}
