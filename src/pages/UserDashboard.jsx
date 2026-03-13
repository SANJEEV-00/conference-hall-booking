import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getBookings, getHalls } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { getAIRecommendedHalls } from '../utils/recommendations'
import { BookingForm } from '../components/booking/BookingForm'
import { BookingModal } from '../components/booking/BookingModal'
import { BookingStatus } from '../components/booking/BookingStatus'
import { CalendarView } from '../components/calendar/CalendarView'
import { HallCard } from '../components/halls/HallCard'
import { BOOKING_STATUS } from '../utils/constants'

export function UserDashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [allHalls, setAllHalls] = useState([])
  const [halls, setHalls] = useState([])
  const [capacityMin, setCapacityMin] = useState('')
  const [capacityMax, setCapacityMax] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedHallForBooking, setSelectedHallForBooking] = useState(null)
  const [recCapacity, setRecCapacity] = useState('')
  const [recDate, setRecDate] = useState('')
  const [recommended, setRecommended] = useState([])
  const [recommendedReasons, setRecommendedReasons] = useState({})

  const loadBookings = useCallback(async () => {
    const list = await getBookings({}, user?.email, false)
    setBookings(list)
  }, [user?.email])

  const loadAllBookings = useCallback(async () => {
    const list = await getBookings({}, null, true)
    setAllBookings(list)
  }, [])

  const loadHalls = useCallback(async () => {
    const filters = {}
    if (capacityMin !== '') filters.minCapacity = Number(capacityMin)
    if (capacityMax !== '') filters.maxCapacity = Number(capacityMax)
    const list = await getHalls(filters)
    setHalls(list)
  }, [capacityMin, capacityMax])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  useEffect(() => {
    loadAllBookings()
  }, [loadAllBookings])

  useEffect(() => {
    loadHalls()
  }, [loadHalls])

  useEffect(() => {
    getHalls().then(setAllHalls)
  }, [])

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.hash])

  useEffect(() => {
    const hallIdFromState = location.state?.hallId
    if (hallIdFromState) {
      getHalls().then((allHalls) => {
        const hall = allHalls.find((h) => h.id === hallIdFromState)
        if (hall) {
          setSelectedHallForBooking(hall)
          setShowModal(true)
        }
      })
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const approvedBookingsByHall = useMemo(() => {
    const approved = bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED)
    const byHall = {}
    approved.forEach((b) => {
      if (!byHall[b.hallId]) byHall[b.hallId] = []
      byHall[b.hallId].push(b)
    })
    return byHall
  }, [bookings])

  const handleGetRecommended = async (e) => {
    e.preventDefault()
    const capacity = parseInt(recCapacity, 10)
    if (!capacity || capacity <= 0) {
      setRecommended([])
      setRecommendedReasons({})
      return
    }
    const allHallsList = allHalls.length ? allHalls : await getHalls()
    const results = getAIRecommendedHalls(
      { capacity, date: recDate || undefined, attendeeCount: capacity },
      allHallsList,
      allBookings
    )
    setRecommended(results.map((r) => r.hall))
    const reasonsMap = {}
    results.forEach((r) => {
      reasonsMap[r.hall.id] = r.reason
    })
    setRecommendedReasons(reasonsMap)
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Search halls by capacity */}
        <div className="glass p-4 flex flex-wrap gap-4 items-end">
          <h2 className="w-full text-lg font-semibold text-slate-800 dark:text-slate-100">Available halls</h2>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Min capacity</label>
            <input
              type="number"
              min={0}
              value={capacityMin}
              onChange={(e) => setCapacityMin(e.target.value)}
              placeholder="Any"
              className="w-28 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Max capacity</label>
            <input
              type="number"
              min={0}
              value={capacityMax}
              onChange={(e) => setCapacityMax(e.target.value)}
              placeholder="Any"
              className="w-28 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white font-medium"
          >
            {showForm ? 'Hide form' : 'Book a hall'}
          </button>
        </div>

        {/* Recommended for you */}
        <div className="glass p-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Recommended for you</h3>
          <form onSubmit={handleGetRecommended} className="flex flex-wrap gap-4 items-end mb-4">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Capacity needed</label>
              <input
                type="number"
                min={1}
                value={recCapacity}
                onChange={(e) => setRecCapacity(e.target.value)}
                placeholder="e.g. 50"
                className="w-32 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Date (optional)</label>
              <input
                type="date"
                value={recDate}
                onChange={(e) => setRecDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
              Get recommendations
            </button>
          </form>
          {recommended.length > 0 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommended.map((hall) => (
                  <div key={hall.id}>
                    <HallCard
                      hall={hall}
                      variant="compact"
                      showBookButton={false}
                      onImageClick={(hall) => {
                        setSelectedHallForBooking(hall)
                        setShowModal(true)
                      }}
                    />
                    {recommendedReasons[hall.id] && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 italic">
                        {recommendedReasons[hall.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Conference halls</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {halls.map((h) => (
                  <HallCard
                    key={h.id}
                    hall={h}
                    variant="default"
                    showBookButton={false}
                    onImageClick={(hall) => {
                      setSelectedHallForBooking(hall)
                      setShowModal(true)
                    }}
                  />
                ))}
              </div>
              {halls.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400">No halls match capacity filter.</p>
              )}
            </div>

            {showForm && (
              <BookingForm
                halls={halls}
                approvedBookingsByHall={approvedBookingsByHall}
                userEmail={user?.email}
                preselectedHallId={selectedHallForBooking?.id}
                onSuccess={() => {
                  loadBookings()
                  setShowForm(false)
                  setSelectedHallForBooking(null)
                }}
                onCancel={() => {
                  setShowForm(false)
                  setSelectedHallForBooking(null)
                }}
              />
            )}

            <div id="bookings">
              <BookingStatus bookings={bookings} />
            </div>
          </div>
          <div>
            <CalendarView mode="user" bookings={bookings} halls={halls} />
          </div>
        </div>
      </div>
      {showModal && selectedHallForBooking && (
        <BookingModal
          hall={selectedHallForBooking}
          halls={halls}
          approvedBookingsByHall={approvedBookingsByHall}
          userEmail={user?.email}
          onSuccess={() => {
            loadBookings()
            setShowModal(false)
            setSelectedHallForBooking(null)
          }}
          onClose={() => {
            setShowModal(false)
            setSelectedHallForBooking(null)
          }}
        />
      )}
    </div>
  )
}
