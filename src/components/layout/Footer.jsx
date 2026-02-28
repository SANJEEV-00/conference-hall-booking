import { Link } from 'react-router-dom'

const footerLink = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition'

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="glass border-t border-white/10">
        <div className="w-full px-4 md:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Jai Shriram Engineering College</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Book conference halls and meeting rooms in one place.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">Quick links</h4>
              <ul className="space-y-1">
                <li><a href="/#halls" className={footerLink}>Halls</a></li>
                <li><a href="/#recommend" className={footerLink}>Get recommendation</a></li>
                <li><Link to="/login" className={footerLink}>Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">Support</h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>Contact: jsrec@gmail.com</li>
                <li>Phone: +1 234 567 890</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">Legal</h4>
              <ul className="space-y-1">
                <li><a href="#" className={footerLink}>Privacy</a></li>
                <li><a href="#" className={footerLink}>Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()}  Hall Booking Management System. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
