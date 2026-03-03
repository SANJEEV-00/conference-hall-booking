import { supabase } from '../lib/supabase'
import { BOOKING_STATUS } from '../utils/constants'

// --- Auth ---
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  // Get user role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  return {
    success: true,
    user: {
      email: data.user.email,
      role: profile?.role || 'USER'
    },
    token: data.session.access_token,
  }
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) return { success: false, message: error.message }

  // Create a profile record
  await supabase.from('profiles').insert([
    { id: data.user.id, email: data.user.email, role: 'USER' }
  ])

  return { success: true, user: data.user }
}

export async function logout() {
  await supabase.auth.signOut()
}

// --- Halls ---
export async function getHalls(filters = {}) {
  let query = supabase.from('halls').select('*')

  const { minCapacity, maxCapacity } = filters
  if (minCapacity != null) query = query.gte('capacity', minCapacity)
  if (maxCapacity != null) query = query.lte('capacity', maxCapacity)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching halls:', error)
    return []
  }
  return data
}

// --- Bookings ---
export async function getBookings(filters = {}, userEmail = null, isAdmin = false) {
  let query = supabase.from('bookings').select('*')

  if (!isAdmin && userEmail) {
    query = query.eq('user_email', userEmail)
  }

  if (filters.date) query = query.eq('date', filters.date)
  if (filters.hallId) query = query.eq('hall_id', filters.hallId)
  if (filters.status) query = query.eq('status', filters.status)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
  return data
}

export async function createBooking(data) {
  const { data: newBooking, error } = await supabase
    .from('bookings')
    .insert([
      {
        hall_id: data.hallId,
        hall_name: data.hallName,
        user_email: data.userEmail,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        purpose: data.purpose || '',
        status: BOOKING_STATUS.PENDING,
        attendee_count: data.attendeeCount ?? null,
        special_requests: data.specialRequests ?? null,
        contact_phone: data.contactPhone ?? null,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return newBooking
}

export async function updateBookingStatus(id, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function deleteBooking(id) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}
