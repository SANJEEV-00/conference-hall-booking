import { BOOKING_STATUS } from '../../utils/constants'

function StatusBadge({ status }) {
  const cls =
    status === BOOKING_STATUS.APPROVED
      ? 'badge-approved'
      : status === BOOKING_STATUS.REJECTED
        ? 'badge-rejected'
        : 'badge-pending'
  const label = status === BOOKING_STATUS.PENDING ? 'Pending' : status === BOOKING_STATUS.APPROVED ? 'Approved' : 'Rejected'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}

// lenght to show booking details and status. if no booking show msg  . pending ,approved , rejected status .
export function BookingStatus({ bookings }) {
  if (!bookings?.length) {
    return (
      <div className="glass p-6 text-center text-slate-500 dark:text-slate-400">
        You have no bookings yet.
      </div>
    )
  }

  return (
    <div className="glass overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">My Bookings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-slate-600 dark:text-slate-400">
              <th className="p-3">Hall</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3 text-slate-800 dark:text-slate-200">{b.hallName || '—'}</td>
                <td className="p-3 text-slate-700 dark:text-slate-300">{b.date}</td>
                <td className="p-3 text-slate-700 dark:text-slate-300">{b.startTime} – {b.endTime}</td>
                <td className="p-3 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{b.purpose || '—'}</td>
                <td className="p-3">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
