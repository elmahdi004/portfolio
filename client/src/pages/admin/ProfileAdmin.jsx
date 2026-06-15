import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Save, Plus, Trash2 } from 'lucide-react'
import { useAdminProfile, useUpdateProfile } from '../../hooks/useAdmin.js'
import GlassCard from '../../components/ui/GlassCard.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { PageHeader, Loading } from '../../components/admin/ui.jsx'
import { Text, TextArea, Toggle, NumberInput, TagsInput } from '../../components/admin/Fields.jsx'

const blank = {
  name: '',
  title: '',
  roles: [],
  tagline: '',
  bio: '',
  location: '',
  email: '',
  phone: '',
  avatarUrl: '',
  resumeUrl: '',
  availableForWork: true,
  yearsExperience: 0,
  socials: { github: '', linkedin: '', twitter: '', website: '' },
  stats: [],
}

const statInput =
  'rounded-xl border border-line/70 bg-surface/50 px-3 py-2.5 text-sm outline-none focus:border-primary/60'

export default function ProfileAdmin() {
  const { data, isLoading } = useAdminProfile()
  const updateProfile = useUpdateProfile()
  const [form, setForm] = useState(blank)

  useEffect(() => {
    if (data)
      setForm({
        ...blank,
        ...data,
        socials: { ...blank.socials, ...(data.socials || {}) },
        stats: data.stats || [],
      })
  }, [data])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setSocial = (k, v) => setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }))
  const setStat = (i, k, v) =>
    setForm((f) => {
      const stats = [...f.stats]
      stats[i] = { ...stats[i], [k]: v }
      return { ...f, stats }
    })
  const addStat = () => setForm((f) => ({ ...f, stats: [...f.stats, { label: '', value: '' }] }))
  const removeStat = (i) => setForm((f) => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }))

  const save = async () => {
    try {
      await updateProfile.mutateAsync(form)
      toast.success('Profile saved')
    } catch (e) {
      toast.error(e.message || 'Save failed')
    }
  }

  if (isLoading)
    return (
      <div>
        <PageHeader title="Profile" />
        <Loading />
      </div>
    )

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your identity across the whole site." />
      <div className="space-y-5">
        <GlassCard className="space-y-4 p-6" spotlight={false}>
          <h2 className="font-semibold">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Name" value={form.name} onChange={(v) => set('name', v)} />
            <Text label="Title / Headline" value={form.title} onChange={(v) => set('title', v)} />
          </div>
          <TagsInput label="Rotating roles (hero typing effect)" value={form.roles} onChange={(v) => set('roles', v)} />
          <Text label="Tagline" value={form.tagline} onChange={(v) => set('tagline', v)} />
          <TextArea
            label="Bio (separate paragraphs with a blank line)"
            value={form.bio}
            onChange={(v) => set('bio', v)}
            rows={6}
          />
        </GlassCard>

        <GlassCard className="space-y-4 p-6" spotlight={false}>
          <h2 className="font-semibold">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Location" value={form.location} onChange={(v) => set('location', v)} />
            <Text label="Email" value={form.email} onChange={(v) => set('email', v)} />
            <Text label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
            <NumberInput label="Years of experience" value={form.yearsExperience} onChange={(v) => set('yearsExperience', v)} />
            <Text label="Avatar URL" value={form.avatarUrl} onChange={(v) => set('avatarUrl', v)} />
            <Text label="Resume URL" value={form.resumeUrl} onChange={(v) => set('resumeUrl', v)} />
          </div>
          <Toggle label="Available for work" value={form.availableForWork} onChange={(v) => set('availableForWork', v)} />
        </GlassCard>

        <GlassCard className="space-y-4 p-6" spotlight={false}>
          <h2 className="font-semibold">Social links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="GitHub" value={form.socials.github} onChange={(v) => setSocial('github', v)} />
            <Text label="LinkedIn" value={form.socials.linkedin} onChange={(v) => setSocial('linkedin', v)} />
            <Text label="Twitter / X" value={form.socials.twitter} onChange={(v) => setSocial('twitter', v)} />
            <Text label="Website" value={form.socials.website} onChange={(v) => setSocial('website', v)} />
          </div>
        </GlassCard>

        <GlassCard className="space-y-4 p-6" spotlight={false}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Highlight stats</h2>
            <button onClick={addStat} className="btn-ghost !py-2 text-sm">
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={s.value || ''}
                  onChange={(e) => setStat(i, 'value', e.target.value)}
                  placeholder="20+"
                  className={`${statInput} w-24`}
                />
                <input
                  value={s.label || ''}
                  onChange={(e) => setStat(i, 'label', e.target.value)}
                  placeholder="Projects Shipped"
                  className={`${statInput} flex-1`}
                />
                <button
                  onClick={() => removeStat(i)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {form.stats.length === 0 && (
              <p className="text-sm text-muted">No stats yet — add a few eye-catching numbers.</p>
            )}
          </div>
        </GlassCard>

        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={save}
            disabled={updateProfile.isPending}
            className="btn-primary shadow-glow disabled:opacity-70"
          >
            {updateProfile.isPending ? (
              <Spinner className="h-4 w-4 border-white/40 border-t-white" />
            ) : (
              <>
                <Save size={16} /> Save profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
