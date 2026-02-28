import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns'
import { BOOKING_STATUS } from '../../utils/constants'


export function CalendarView({ mode = 'user', bookings = [], halls = [] }) {
  const [current, setCurrent] = useState(() => new Date())

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = useMemo(() => {
    const d = []
    let day = calendarStart
    while (day <= calendarEnd) {
      d.push(day)
      day = addDays(day, 1)
    }
    return d
  }, [calendarStart, calendarEnd])

  const bookingsByDate = useMemo(() => {
    const map = {}
    bookings.forEach((b) => {
      if (!map[b.date]) map[b.date] = []
      map[b.date].push(b)
    })
    return map
  }, [bookings])

  const getStatusColor = (status) => {
    if (status === BOOKING_STATUS.APPROVED) return 'bg-emerald-500/80 text-white'
    if (status === BOOKING_STATUS.REJECTED) return 'bg-red-500/80 text-white'
    return 'bg-amber-500/80 text-white'
  }

  const showPending = true
  const showRejected = mode === 'user'

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrent(subMonths(current, 1))}
          className="p-2 rounded-lg hover:bg-white/20 text-slate-700 dark:text-slate-300"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {format(current, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          onClick={() => setCurrent(addMonths(current, 1))}
          className="p-2 rounded-lg hover:bg-white/20 text-slate-700 dark:text-slate-300"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-600 dark:text-slate-400 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayBookings = bookingsByDate[dateStr] || []
          const inMonth = isSameMonth(day, current)
          return (
            <div
              key={dateStr}
              className={`min-h-[80px] p-1 rounded-lg border ${
                inMonth
                  ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
              <div className="space-y-0.5">
                {dayBookings
                  .filter((b) => b.status === BOOKING_STATUS.APPROVED || (showPending && b.status === BOOKING_STATUS.PENDING) || (showRejected && b.status === BOOKING_STATUS.REJECTED))
                  .slice(0, 3)
                  .map((b) => (
                    <div
                      key={b.id}
                      className={`text-[10px] px-1 py-0.5 rounded truncate ${getStatusColor(b.status)}`}
                      title={`${b.hallName} ${b.startTime}-${b.endTime}`}
                    >
                      {b.hallName} {b.startTime}
                    </div>
                  ))}
                {dayBookings.filter((b) => b.status === BOOKING_STATUS.APPROVED || (showPending && b.status === BOOKING_STATUS.PENDING) || (showRejected && b.status === BOOKING_STATUS.REJECTED)).length > 3 && (
                  <div className="text-[10px] text-slate-500">+more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/80" /> Approved</span>
        {showPending && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/80" /> Pending</span>}
        {showRejected && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/80" /> Rejected</span>}
      </div>
    </div>
  )
}
