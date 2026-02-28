import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Shared layout: transparent header (moving navbar) + main + footer.
 * Use for Landing, User dashboard, Admin dashboard.
 */
export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
