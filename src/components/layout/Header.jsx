import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function smoothScrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export function Header() {
  const { user, role, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  const isLanding = location.pathname === '/'

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          if (y > 100) setNavHidden(y > lastScrollY)
          setLastScrollY(y)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleAnchor = (e, id) => {
    e.preventDefault()
    setMobileOpen(false)
    smoothScrollTo(id)
  }

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${navHidden ? '-translate-y-full' : 'translate-y-0'
    }`

  const linkClass =
    'px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/20 dark:hover:bg-slate-600/30 transition'

  return (
    <header className={navClass}>
      <div className="glass border-b border-white/10">
        <div className="w-full px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Event Hall Booking
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {isLanding && (
              <>
                <a href="#halls" onClick={(e) => handleAnchor(e, 'halls')} className={linkClass}>
                  Halls
                </a>
                <a href="#recommend" onClick={(e) => handleAnchor(e, 'recommend')} className={linkClass}>
                  Get recommendation
                </a>
              </>
            )}
            {user && (
              <>
                {role === 'USER' && (
                  <>
                    <Link to="/user" className={linkClass}>Dashboard</Link>
                    <Link to="/user#bookings" className={linkClass}>My Bookings</Link>
                  </>
                )}
                {role === 'ADMIN' && <Link to="/admin" className={linkClass}>Admin</Link>}
              </>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className={`${linkClass} p-2`}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {user ? (
              <button
                onClick={async () => {
                  await logout();
                  setMobileOpen(false);
                  navigate('/');
                }}
                className="px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white text-sm font-medium transition"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white text-sm font-medium transition">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 text-slate-700 dark:text-slate-200"
            aria-label="Menu"
          >
            <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
            {isLanding && (
              <>
                <a href="#halls" onClick={(e) => handleAnchor(e, 'halls')} className={linkClass}>Halls</a>
                <a href="#recommend" onClick={(e) => handleAnchor(e, 'recommend')} className={linkClass}>Get recommendation</a>
              </>
            )}
            {user && (
              <>
                {role === 'USER' && (
                  <>
                    <Link to="/user" onClick={() => setMobileOpen(false)} className={linkClass}>Dashboard</Link>
                    <Link to="/user" onClick={() => setMobileOpen(false)} className={linkClass}>My Bookings</Link>
                  </>
                )}
                {role === 'ADMIN' && <Link to="/admin" onClick={() => setMobileOpen(false)} className={linkClass}>Admin</Link>}
              </>
            )}
            <button type="button" onClick={toggleTheme} className={`${linkClass} text-left`}>
              {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
            {user ? (
              <button
                onClick={async () => {
                  await logout();
                  setMobileOpen(false);
                  navigate('/');
                }}
                className={linkClass}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className={linkClass}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
