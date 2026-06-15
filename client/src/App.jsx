import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import { AdminAuthProvider } from './context/AdminAuth.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import Login from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ProjectsAdmin from './pages/admin/ProjectsAdmin.jsx'
import ExperiencesAdmin from './pages/admin/ExperiencesAdmin.jsx'
import SkillsAdmin from './pages/admin/SkillsAdmin.jsx'
import ProfileAdmin from './pages/admin/ProfileAdmin.jsx'
import MessagesAdmin from './pages/admin/MessagesAdmin.jsx'

function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="experience" element={<ExperiencesAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="profile" element={<ProfileAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminAuthProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
