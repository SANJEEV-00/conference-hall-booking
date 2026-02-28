# Conference Hall Booking System

A full-stack Conference Hall Booking System with role-based authentication (ADMIN and USER), built with React and optional Spring Boot + MySQL backend.

## Features

- **Authentication**: Login with email/password. Admin: `admin@example.com` / `admin@123`. Multiple users supported.
- **Admin**: Dashboard, view all bookings, approve/reject, filters (date, hall, status), analytics (total, approved, rejected), calendar view, double-booking prevention.
- **User**: View halls, search by capacity, book a hall (date, time, purpose), validation (no past dates, end > start, no overlap with approved slots), My Bookings, calendar view.
- **Extra**: Role-based protected routes, responsive UI, glassmorphism style, toast notifications, dark/light mode, admin analytics.

## Tech Stack

- **Frontend**: React, Vite, React Router, Tailwind CSS, date-fns, react-hot-toast
- **State**: React Context (Auth, Theme)
- **Persistence**: In-memory + localStorage (no backend required to run)

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Log in as admin or any email/password for user role.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run preview` – preview production build

## Project Structure

```
src/
  components/auth/     – Login
  components/booking/  – BookingForm, BookingStatus, AdminApproval
  components/calendar/ – CalendarView
  context/             – AuthContext, ThemeContext
  hooks/               – useAuth
  pages/               – AdminDashboard, UserDashboard
  routes/              – ProtectedRoute
  services/            – api (mock in-memory + localStorage)
  utils/               – constants, validators
```

## Optional Backend

The app uses a mock API layer (`src/services/api.js`). To connect a Spring Boot + MySQL backend, set `USE_MOCK = false` in `api.js` and implement the fetch calls to your REST endpoints (login, getHalls, getBookings, createBooking, updateBookingStatus).
