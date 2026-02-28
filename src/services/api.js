import { DEFAULT_HALLS, BOOKING_STATUS, STORAGE_KEYS } from '../utils/constants'

const USE_MOCK = true

const MOCK_USERS = [
  { email: 'admin@jsrec.in', password: 'Admin@123', role: 'ADMIN' },
  { email: 'ad@jsrec.in', password: 'Ad@123', role: 'USER' },
  { email: 'cse@jsrec.in', password: 'Cse@123', role: 'USER' },
  { email: 'eee@jsrec.in', password: 'Eee@123', role: 'USER' },
  { email: 'ece@jsrec.in', password: 'Ece@123', role: 'USER' },
  { email: 'it@jsrec.in', password: 'It@123', role: 'USER' },
  { email: 'ft@jsrec.in', password: 'Ft@123', role: 'USER' },
  { email: 'mech@jsrec.in', password: 'Mech@123', role: 'USER' },
  { email: 'civil@jsrec.in', password: 'Civil@123', role: 'USER' },
  { email: 'mba@jsrec.in', password: 'Mba@123', role: 'USER' },
  { email: 'snh@jsrec.in', password: 'Snh@123', role: 'USER' },
  { email: 'office@jsrec.in', password: 'Office@123', role: 'USER' },
  { email: 'tpc@jsrec.in', password: 'Tpc@123', role: 'USER' },
]

function getStoredHalls() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HALLS)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return [...DEFAULT_HALLS]
}

function setStoredHalls(halls) {
  localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(halls))
}

function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return []
}

function setStoredBookings(bookings) {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
}

export function login(email, password) {
  if (USE_MOCK) {
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (!user) {
      return { success: false, message: 'Invalid email or password.' }
    }
    return {
      success: true,
      user: { email: user.email, role: user.role },
      token: 'mock-auth-token',
    }
  }
  return Promise.resolve({ success: false, message: 'Backend not configured' })
}

export function getHalls(filters = {}) {
  if (USE_MOCK) {
    let halls = getStoredHalls()
    const { minCapacity, maxCapacity } = filters
    if (minCapacity != null) halls = halls.filter((h) => h.capacity >= minCapacity)
    if (maxCapacity != null) halls = halls.filter((h) => h.capacity <= maxCapacity)
    return Promise.resolve(halls)
  }
  // TODO: GET /api/halls
  return Promise.resolve([])
}

export function getBookings(filters = {}, userEmail = null, isAdmin = false) {
  if (USE_MOCK) {
    let list = getStoredBookings()
    if (!isAdmin && userEmail) list = list.filter((b) => b.userEmail === userEmail)
    if (filters.date) list = list.filter((b) => b.date === filters.date)
    if (filters.hallId) list = list.filter((b) => b.hallId === filters.hallId)
    if (filters.status) list = list.filter((b) => b.status === filters.status)
    return Promise.resolve(list)
  }
  return Promise.resolve([])
}

export function createBooking(data) {
  if (USE_MOCK) {
    const bookings = getStoredBookings()
    const id = String(Date.now())
    const hall = getStoredHalls().find((h) => h.id === data.hallId)
    const newBooking = {
      id,
      hallId: data.hallId,
      hallName: hall?.name ?? 'Unknown',
      userEmail: data.userEmail,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose || '',
      status: BOOKING_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      attendeeCount: data.attendeeCount ?? null,
      specialRequests: data.specialRequests ?? null,
      contactPhone: data.contactPhone ?? null,
    }
    bookings.push(newBooking)
    setStoredBookings(bookings)
    return Promise.resolve(newBooking)
  }
  return Promise.reject(new Error('Backend not configured'))
}

export function updateBookingStatus(id, status) {
  if (USE_MOCK) {
    const bookings = getStoredBookings()
    const idx = bookings.findIndex((b) => b.id === id)
    if (idx === -1) return Promise.reject(new Error('Booking not found'))
    bookings[idx].status = status
    setStoredBookings(bookings)
    return Promise.resolve(bookings[idx])
  }
  return Promise.reject(new Error('Backend not configured'))
}

export function deleteBooking(id) {
  if (USE_MOCK) {
    const bookings = getStoredBookings()
    const next = bookings.filter((b) => b.id !== id)
    setStoredBookings(next)
    return Promise.resolve()
  }
  return Promise.reject(new Error('Backend not configured'))
}
