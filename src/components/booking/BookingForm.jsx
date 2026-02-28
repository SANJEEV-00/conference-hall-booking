import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { validateBooking } from '../../utils/validators'
import { createBooking } from '../../services/api'
import { BOOKING_STATUS } from '../../utils/constants'

const TIME_OPTIONS = (() => {
  const opts = []
  for (let h = 8; h <= 20; h++) {
    for (const m of [0, 30]) {
      opts.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return opts
})()



export function BookingForm({ halls, approvedBookingsByHall, userEmail, onSuccess, onCancel, preselectedHallId }) {
  const [hallId, setHallId] = useState(preselectedHallId || (halls[0]?.id ?? ''))
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [purpose, setPurpose] = useState('')
  const [attendeeCount, setAttendeeCount] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (preselectedHallId) setHallId(preselectedHallId)
  }, [preselectedHallId])

  const selectedHall = halls.find((h) => h.id === hallId)
  const hallCapacity = selectedHall?.capacity ?? 0
  const approvedForHall = approvedBookingsByHall[hallId] || []

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (!contactPhone.trim()) {
        toast.error('Contact phone is required.')
        return
      }
      if (!validatePhone(contactPhone)) {
        toast.error('Please enter a valid phone number.')
        return
      }

      const attendeeNum = parseInt(attendeeCount, 10)
      if (attendeeCount && (attendeeNum < 1 || attendeeNum > hallCapacity)) {
        toast.error(`Attendee count must be between 1 and ${hallCapacity} (hall capacity).`)
        return
      }

      const validation = validateBooking(
        { date, startTime, endTime },
        approvedForHall.filter((b) => b.date === date)
      )
      if (!validation.valid) {
        toast.error(validation.message)
        return
      }

      setSubmitting(true)
      try {
        await createBooking({
          hallId,
          userEmail,
          date,
          startTime,
          endTime,
          purpose,
          attendeeCount: attendeeNum || null,
          specialRequests: specialRequests.trim() || null,
          contactPhone: contactPhone.trim(),
        })
        toast.success('Booking request submitted.')
        onSuccess?.()
        setDate('')
        setPurpose('')
        setAttendeeCount('')
        setSpecialRequests('')
        setContactPhone('')
      } catch (err) {
        toast.error(err?.message || 'Failed to create booking.')
      } finally {
        setSubmitting(false)
      }
    },
    [
      hallId,
      date,
      startTime,
      endTime,
      purpose,
      attendeeCount,
      specialRequests,
      contactPhone,
      userEmail,
      approvedForHall,
      hallCapacity,
      onSuccess,
    ]
  )

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Book a hall</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hall</label>
          <select
            value={hallId}
            onChange={(e) => setHallId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {halls.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} (capacity: {h.capacity})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Attendee count {hallCapacity > 0 && `(max: ${hallCapacity})`}
            </label>
            <input
              type="number"
              min={1}
              max={hallCapacity}
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start time *</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End time *</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact phone *</label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+1 234 567 8900"
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Purpose</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            placeholder="Meeting purpose..."
          />
        </div>

      

       


        

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white font-medium disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit request'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
