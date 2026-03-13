import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Profile() {
  const { user, role } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleBack = () => {
    navigate(role === 'ADMIN' ? '/admin' : '/user')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass w-full max-w-md p-8 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.email.charAt(0).toUpperCase()}
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">User Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your account information</p>

          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <p className="text-slate-700 dark:text-slate-200 font-medium">{user.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Account Role</label>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                }`}>
                  {role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBack}
            className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-white text-white dark:text-slate-900 font-semibold transition shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
