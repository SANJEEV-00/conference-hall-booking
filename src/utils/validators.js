import { isBefore, startOfDay, parseISO } from 'date-fns'

// cannot book past date , start time less than end time , must fill time 
export function validateBooking(fields, approvedBookingsForHall = []) {
  const { date, startTime, endTime } = fields
  const chosenDate = typeof date === 'string' ? parseISO(date) : date
  const today = startOfDay(new Date())

  if (isBefore(chosenDate, today)) {
    return { valid: false, message: 'Cannot book past dates.....!!!' }
  }

  if (!startTime || !endTime) {
    return { valid: false, message: 'Start time and end time are required...???' }
  }

  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  if (endMinutes <= startMinutes) {
    return { valid: false, message: 'End time must be greater than start time...!!!' }
  }
// booking overlap time based on cheaking 
  for (const b of approvedBookingsForHall) {
    const [bStartH, bStartM] = b.startTime.split(':').map(Number)
    const [bEndH, bEndM] = b.endTime.split(':').map(Number)
    const bStart = bStartH * 60 + bStartM
    const bEnd = bEndH * 60 + bEndM
    if (startMinutes < bEnd && endMinutes > bStart) {
      return { valid: false, message: 'This time slot overlaps with an approved booking.' }
    }
  }

  return { valid: true }
}

// double booking, samehall , same date 
export function wouldOverlap(booking, allApprovedBookings) {
  const sameHallSameDate = allApprovedBookings.filter(
    (b) => b.hallId === booking.hallId && b.date === booking.date && b.id !== booking.id
  )
  const [startH, startM] = booking.startTime.split(':').map(Number)
  const [endH, endM] = booking.endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  for (const b of sameHallSameDate) {
    const [bStartH, bStartM] = b.startTime.split(':').map(Number)
    const [bEndH, bEndM] = b.endTime.split(':').map(Number)
    const bStart = bStartH * 60 + bStartM
    const bEnd = bEndH * 60 + bEndM
    if (startMinutes < bEnd && endMinutes > bStart) return true
  }
  return false
}
