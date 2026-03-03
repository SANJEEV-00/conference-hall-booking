import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast.error('Please enter email and password.')
      return
    }
    const result = await login(email.trim(), password)
    if (result.success) {
      const role = result.role || 'USER'
      toast.success('Logged in successfully.')
      navigate(role === 'ADMIN' ? '/admin' : '/user', { replace: true })
    } else {
      toast.error(result.message || 'Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg glass text-slate-600 dark:text-slate-300 hover:bg-white/20"
        aria-label="Toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className="w-full max-w-md">
        <div className="glass p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
            Event Hall Booking
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-6">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="admin@company.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              Log in
            </button>
          </form>

          <div className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400 space-y-1">
            <p><span className="font-semibold">Admin</span>: admin@jsrec.in / Admin@123</p>
            <p><span className="font-semibold">Users</span>:</p>
            <p>ad@jsrec.in / Ad@123</p>
            <p>cse@jsrec.in / Cse@123</p>
            <p>eee@jsrec.in / Eee@123</p>
            <p>ece@jsrec.in / Ece@123</p>
            <p>it@jsrec.in / It@123</p>
            <p>ft@jsrec.in / Ft@123</p>
            <p>mech@jsrec.in / Mech@123</p>
            <p>civil@jsrec.in / Civil@123</p>
            <p>mba@jsrec.in / Mba@123</p>
            <p>snh@jsrec.in / Snh@123</p>
            <p>office@jsrec.in / Office@123</p>
            <p>tpc@jsrec.in / Tpc@123</p>

          </div>
        </div>
      </div>
    </div>
  )
}
