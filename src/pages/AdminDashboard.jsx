import { useState, useEffect, useCallback } from 'react'
import { getBookings, getHalls, deleteBooking } from '../services/api'
import { BOOKING_STATUS } from '../utils/constants'
import { AdminApproval } from '../components/booking/AdminApproval'
import { CalendarView } from '../components/calendar/CalendarView'

export function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [halls, setHalls] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [filterHallId, setFilterHallId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const loadBookings = useCallback(async () => {
    const filters = {}
    if (filterDate) filters.date = filterDate
    if (filterHallId) filters.hallId = filterHallId
    if (filterStatus) filters.status = filterStatus
    const list = await getBookings(filters, null, true)
    setBookings(list)
  }, [filterDate, filterHallId, filterStatus])

  const loadHalls = useCallback(async () => {
    const list = await getHalls()
    setHalls(list)
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  useEffect(() => {
    loadHalls()
  }, [loadHalls])

  const approvedBookings = bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED)
  const total = bookings.length
  const approvedCount = bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED).length
  const rejectedCount = bookings.filter((b) => b.status === BOOKING_STATUS.REJECTED).length
  const pendingCount = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length

  const statusBadge = (status) => {
    const c = status === BOOKING_STATUS.APPROVED ? 'badge-approved' : status === BOOKING_STATUS.REJECTED ? 'badge-rejected' : 'badge-pending'
    const label = status === BOOKING_STATUS.PENDING ? 'Pending' : status === BOOKING_STATUS.APPROVED ? 'Approved' : 'Rejected'
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${c}`}>{label}</span>
  }

  const isPastBooking = (booking) => {
    if (!booking?.date) return false
    const endTime = booking.endTime || '23:59'
    const endDateTime = new Date(`${booking.date}T${endTime}`)
    if (Number.isNaN(endDateTime.getTime())) return false
    return endDateTime.getTime() < Date.now()
  }

  const handleRemoveBooking = async (booking) => {
    if (!isPastBooking(booking)) {
      window.alert('Only past bookings can be removed.')
      return
    }
    const ok = window.confirm('Are you sure you want to permanently remove this booking?')
    if (!ok) return
    try {
      await deleteBooking(booking.id)
      await loadBookings()
    } catch (e) {
      // Optionally attach toast / error UI here later
      console.error('Failed to delete booking', e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Analytics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total bookings</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{total}</p>
          </div>
          <div className="glass p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Approved</p>
            <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
          </div>
          <div className="glass p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
          </div>
          <div className="glass p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Hall</label>
            <select
              value={filterHallId}
              onChange={(e) => setFilterHallId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">All</option>
              {halls.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">All</option>
              <option value={BOOKING_STATUS.PENDING}>Pending</option>
              <option value={BOOKING_STATUS.APPROVED}>Approved</option>
              <option value={BOOKING_STATUS.REJECTED}>Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">All booking requests</h2>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-100/95 dark:bg-slate-800/95">
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
                      <th className="p-3">Hall</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500 dark:text-slate-400">
                          No bookings match filters.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 text-slate-800 dark:text-slate-200">
                            {b.hallName || halls.find(h => h.id === b.hallId)?.name || '—'}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">{b.userEmail}</td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">{b.date}</td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">{b.startTime} – {b.endTime}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">{b.purpose || '—'}</td>
                          <td className="p-3">{statusBadge(b.status)}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <AdminApproval
                                booking={b}
                                approvedBookings={approvedBookings}
                                onUpdated={loadBookings}
                              />
                              {isPastBooking(b) && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBooking(b)}
                                  className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                  aria-label="Remove booking"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <CalendarView mode="admin" bookings={bookings} halls={halls} />
          </div>
        </div>
      </div>
    </div>
  )
}
