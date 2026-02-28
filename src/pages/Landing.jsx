import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHalls, getBookings } from '../services/api'
import { getAIRecommendedHalls } from '../utils/recommendations'
import { HallCard } from '../components/halls/HallCard'
import { Layout } from '../components/layout/Layout'
import bgimg from '../assets/Collage-Campus.png'
import toast from 'react-hot-toast'

export function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [halls, setHalls] = useState([])
  const [bookings, setBookings] = useState([])
  const [recCapacity, setRecCapacity] = useState('')
  const [recDate, setRecDate] = useState('')
  const [recPurpose, setRecPurpose] = useState('')
  const [recommended, setRecommended] = useState(null)
  const [recommendedReasons, setRecommendedReasons] = useState({})

  const handleHallImageClick = (hall) => {
    if (!user) {
      toast.error('Please log in to book a hall.')
      navigate('/login', { state: { returnTo: '/user', hallId: hall.id } })
    } else {
      navigate('/user', { state: { hallId: hall.id } })
    }
  }

  useEffect(() => {
    getHalls().then(setHalls)
    getBookings({}, null, true).then(setBookings)
  }, [])

  const handleRecommend = (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to get personalized AI recommendations.')
      navigate('/login', { state: { returnTo: '/#recommend' } })
      return
    }
    const capacity = parseInt(recCapacity, 10)
    if (!capacity || capacity <= 0) {
      setRecommended([])
      return
    }
    const results = getAIRecommendedHalls(
      { capacity, date: recDate || undefined, purpose: recPurpose || undefined, attendeeCount: capacity },
      halls,
      bookings
    )
    setRecommended(results.map((r) => r.hall))
    const reasonsMap = {}
    results.forEach((r) => {
      reasonsMap[r.hall.id] = r.reason
    })
    setRecommendedReasons(reasonsMap)
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-30"
          style={{
            backgroundImage:  `url(${bgimg})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-slate-50 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950" />
        <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 mx-auto text-center max-w-6xl">
           <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent tracking-tight leading-tight">
                Jai Shriram Engineering College
          </h1>
          <h1 className="text-2xl md:text-2xl font-bold text-slate-900 dark:text-slate-500 tracking-tight">
            Book the perfect Event hall Booking
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Choose from multiple venues, get recommendations by capacity and date, and manage your bookings in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="#halls"
              onClick={(e) => { e.preventDefault(); document.getElementById('halls')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white font-medium shadow-lg transition"
            >
              View halls
            </a>
            <a
              href="#recommend"
              onClick={(e) => { e.preventDefault(); document.getElementById('recommend')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-6 py-3 rounded-xl glass border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-medium hover:bg-white/20 transition"
            >
              Get recommendation
            </a>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-medium hover:opacity-90 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Halls */}
      <section id="halls" className="py-16 px-4 scroll-mt-20">
        <div className="w-full px-4 md:px-6 lg:px-8 mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
            Our halls
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Modern spaces for conferences, meetings, and events. Select a hall and book in a few clicks.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {halls.map((hall) => (
              <HallCard key={hall.id} hall={hall} variant="default" showBookButton onImageClick={handleHallImageClick} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation */}
      <section id="recommend" className="py-16 px-4 scroll-mt-20">
        <div className="w-full px-4 md:px-6 lg:px-8 mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
            Recommend halls for me
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Enter your requirements and we&apos;ll suggest the best halls.
          </p>
          <div className="glass w-full max-w-2xl mx-auto p-6 mb-10">
            <form onSubmit={handleRecommend} className="space-y-4">
              <div>
                <label htmlFor="rec-capacity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Capacity needed *
                </label>
                <input
                  id="rec-capacity"
                  type="number"
                  min={1}
                  value={recCapacity}
                  onChange={(e) => setRecCapacity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="rec-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Preferred date (optional)
                </label>
                <input
                  id="rec-date"
                  type="date"
                  value={recDate}
                  onChange={(e) => setRecDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="rec-purpose" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Purpose (optional)
                </label>
                <select
                  id="rec-purpose"
                  value={recPurpose}
                  onChange={(e) => setRecPurpose(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="">Any</option>
                  <option value="conference">Conference</option>
                  <option value="meeting">Meeting</option>
                  <option value="workshop">Workshop</option>
                  <option value="training">Training</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white font-medium transition"
              >
                Get recommendations
              </button>
            </form>
          </div>
          {recommended !== null && (
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                {recommended.length ? 'Recommended for you' : 'No halls match your criteria'}
              </h3>
              {recommended.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommended.map((hall) => (
                    <div key={hall.id}>
                      <HallCard hall={hall} variant="featured" showBookButton onImageClick={handleHallImageClick} />
                      {recommendedReasons[hall.id] && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                          {recommendedReasons[hall.id]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="w-full px-4 md:px-6 lg:px-8 mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-10">
            Why book with us
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Easy booking', desc: 'Select date, time, and hall in a few clicks.' },
              { title: 'Multiple halls', desc: 'Choose from various capacities and setups.' },
              { title: 'Quick approval', desc: 'Admin reviews and approves requests promptly.' },
              { title: 'Transparent status', desc: 'Track your booking status in real time.' },
            ].map((item) => (
              <div key={item.title} className="glass p-6 rounded-2xl hover:shadow-lg transition">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
