import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderGit2,
  Route as RouteIcon,
  Cpu,
  User,
  Inbox,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuth.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { cn } from '../../lib/cn.js'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/admin/experience', label: 'Experience', icon: RouteIcon },
  { to: '/admin/skills', label: 'Skills', icon: Cpu },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
]

export default function AdminLayout() {
  const { logout } = useAdminAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const doLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const Sidebar = (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center gap-2.5 px-2 py-3">
        <span
          className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}
        >
          EB
        </span>
        <span className="font-display font-semibold">Admin</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((n) => {
          const Icon = n.icon
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-primary/15 text-primary' : 'text-muted hover:bg-surface/60 hover:text-ink'
                )
              }
            >
              <Icon size={17} /> {n.label}
            </NavLink>
          )
        })}
      </nav>
      <div className="space-y-1 border-t border-line/60 pt-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-surface/60 hover:text-ink"
        >
          <ExternalLink size={17} /> View site
        </a>
        <button
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-surface/60 hover:text-ink"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />} {isDark ? 'Light' : 'Dark'} mode
        </button>
        <button
          onClick={doLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line/60 bg-surface/40 backdrop-blur-xl lg:block">
        {Sidebar}
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/60 bg-surface/60 px-4 py-3 backdrop-blur-xl lg:hidden">
        <span className="font-display font-semibold">Admin</span>
        <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg glass">
          <Menu size={18} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 glass-strong">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg glass"
            >
              <X size={16} />
            </button>
            {Sidebar}
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
