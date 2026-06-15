import { Link } from 'react-router-dom'
import { FolderGit2, Route as RouteIcon, Cpu, Inbox, Mail, ArrowUpRight } from 'lucide-react'
import {
  useAdminProjects,
  useAdminExperiences,
  useAdminSkills,
  useMessages,
} from '../../hooks/useAdmin.js'
import { useAdminAuth } from '../../context/AdminAuth.jsx'
import GlassCard from '../../components/ui/GlassCard.jsx'
import { Loading } from '../../components/admin/ui.jsx'

function StatCard({ icon: Icon, label, value, to }) {
  return (
    <Link to={to}>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between">
          <Icon className="text-primary" size={22} />
          <ArrowUpRight size={16} className="text-muted" />
        </div>
        <div className="mt-3 text-3xl font-bold">{value}</div>
        <div className="text-sm text-muted">{label}</div>
      </GlassCard>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAdminAuth()
  const projects = useAdminProjects()
  const experiences = useAdminExperiences()
  const skills = useAdminSkills()
  const messages = useMessages()

  const unread = (messages.data || []).filter((m) => !m.read).length
  const loading =
    projects.isLoading || experiences.isLoading || skills.isLoading || messages.isLoading

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">
        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
      </h1>
      <p className="mt-1 text-muted">Here's everything in your portfolio at a glance.</p>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FolderGit2} label="Projects" value={projects.data?.length || 0} to="/admin/projects" />
            <StatCard icon={RouteIcon} label="Experience" value={experiences.data?.length || 0} to="/admin/experience" />
            <StatCard icon={Cpu} label="Skills" value={skills.data?.length || 0} to="/admin/skills" />
            <StatCard
              icon={Inbox}
              label={`Messages${unread ? ` · ${unread} new` : ''}`}
              value={messages.data?.length || 0}
              to="/admin/messages"
            />
          </div>

          <h2 className="mt-10 font-display text-lg font-semibold">Recent messages</h2>
          <div className="mt-4 space-y-3">
            {(messages.data || []).slice(0, 4).map((m) => (
              <GlassCard key={m._id} className="flex items-start gap-3 p-4" spotlight={false}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2">
                  <Mail size={15} className="text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{m.name}</span>
                    {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <div className="truncate text-sm text-muted">{m.subject || m.message}</div>
                </div>
                <Link to="/admin/messages" className="shrink-0 text-xs text-primary hover:underline">
                  Open
                </Link>
              </GlassCard>
            ))}
            {(!messages.data || messages.data.length === 0) && (
              <p className="text-sm text-muted">No messages yet — your contact form is ready to receive them.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
