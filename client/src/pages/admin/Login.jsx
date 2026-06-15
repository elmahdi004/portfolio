import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuth.jsx'
import AuroraBackground from '../../components/ui/AuroraBackground.jsx'
import GradientText from '../../components/ui/GradientText.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

function Field({ icon: Icon, value, onChange, ...rest }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-surface/50 px-4 focus-within:border-primary/60">
      <Icon size={16} className="shrink-0 text-muted" />
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted"
      />
    </div>
  )
}

export default function Login() {
  const { user, login } = useAdminAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-5">
      <AuroraBackground />
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div
            className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white"
            style={{ backgroundImage: 'linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))' }}
          >
            <Lock size={22} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">
            <GradientText>Admin Access</GradientText>
          </h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio.</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl glass-strong p-6 shadow-soft">
          <Field
            icon={Mail}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <Field
            icon={Lock}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(v) => setForm((f) => ({ ...f, password: v }))}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
            {loading ? (
              <Spinner className="h-4 w-4 border-white/40 border-t-white" />
            ) : (
              <>
                Sign in <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
        <Link to="/" className="mt-4 block text-center text-sm text-muted hover:text-ink">
          ← Back to site
        </Link>
      </div>
    </div>
  )
}
