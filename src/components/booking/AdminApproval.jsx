import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { BOOKING_STATUS } from '../../utils/constants'
import { wouldOverlap } from '../../utils/validators'
import { updateBookingStatus } from '../../services/api'

 // Approve/Reject buttons for admin. Prevents double booking on approve.

export function AdminApproval({ booking, approvedBookings, onUpdated }) {
  const isPending = booking.status === BOOKING_STATUS.PENDING

  const handleApprove = useCallback(async () => {
    if (wouldOverlap(booking, approvedBookings)) {
      toast.error('Cannot approve: this slot overlaps with an existing approved booking.')
      return
    }
    try {
      await updateBookingStatus(booking.id, BOOKING_STATUS.APPROVED)
      toast.success('Booking approved.')
      onUpdated?.()
    } catch (e) {
      toast.error(e?.message || 'Failed to approve.')
    }
  }, [booking, approvedBookings, onUpdated])

  const handleReject = useCallback(async () => {
    try {
      await updateBookingStatus(booking.id, BOOKING_STATUS.REJECTED)
      toast.success('Booking rejected.')
      onUpdated?.()
    } catch (e) {
      toast.error(e?.message || 'Failed to reject.')
    }
  }, [booking.id, onUpdated])

  if (!isPending) return null

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleApprove}
        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
      >
        Approve
      </button>
      <button
        type="button"
        onClick={handleReject}
        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
      >
        Reject
      </button>
    </div>
  )
}
