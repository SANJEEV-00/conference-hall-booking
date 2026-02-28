import { useEffect } from 'react'
import { BookingForm } from './BookingForm'


export function BookingModal({ hall, halls, approvedBookingsByHall, userEmail, onSuccess, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div className="glass-strong w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="sticky top-0 glass-strong border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {hall ? `Book ${hall.name}` : 'Book a hall'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 text-slate-700 dark:text-slate-300 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <BookingForm
            halls={halls}
            approvedBookingsByHall={approvedBookingsByHall}
            userEmail={userEmail}
            preselectedHallId={hall?.id}
            onSuccess={() => {
              onSuccess?.()
              onClose?.()
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}
