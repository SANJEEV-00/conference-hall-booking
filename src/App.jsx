import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { Login } from './components/auth/Login'
import { Landing } from './pages/Landing'
import { AdminDashboard } from './pages/AdminDashboard'
import { UserDashboard } from './pages/UserDashboard'

function RootRedirect() {
  const { user, role } = useAuth()
  if (!user) return <Landing />
  return <Navigate to={role === 'ADMIN' ? '/admin' : '/user'} replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RootRedirect />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/*"
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Layout><UserDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </ThemeProvider>
  )
}
