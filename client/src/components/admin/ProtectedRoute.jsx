import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuth.jsx'
import Spinner from '../ui/Spinner.jsx'

export default function ProtectedRoute() {
  const { user, loading } = useAdminAuth()
  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <Spinner className="h-7 w-7" />
      </div>
    )
  if (!user) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
