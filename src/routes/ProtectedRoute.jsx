import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'ADMIN' ? '/admin' : '/user'} replace />
  }

  return children
}
