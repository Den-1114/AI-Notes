// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
} from 'react-router-dom'
import type { ReactNode } from 'react'
import Summary from './components/Summary/Summary'
import Flashcards from './components/Flashcards/Flashcards'
import SignupPage from './components/Auth/SignUp'
import LoginPage from './components/Auth/Login'
import ComingSoon from './components/ComingSoon'
import LockPage from './components/Auth/Lock'
import { useLocation } from 'react-router-dom'
import { checkAuth } from './auth'
import { useEffect, useState } from 'react'

const API_BASE_URL = '127.0.0.1:5000'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

// Define nav items
const navItems: NavItem[] = [
  {
    to: '/summary',
    label: 'Summary',
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        />
      </svg>
    ),
  },
  {
    to: '/flashcards',
    label: 'Flashcards',
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z"
        />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
        />
        <path
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.66 0 1.25-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06c.46.46 1.19.52 1.82.33.51-.16 1-.48 1-1.51V3a2 2 0 0 1 4 0v.09c0 1.03.49 1.35 1 1.51.63.19 1.36.13 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06c-.46.46-.52 1.19-.33 1.82.16.51.48 1 1.51 1H21a2 2 0 0 1 0 4h-.09c-1.03 0-1.35.49-1.51 1z"
        />
      </svg>
    ),
  },
]

function PrivateRoute({ element }: { element: JSX.Element }) {
  const [isAuthed, setAuthed] = useState<boolean | null>(null)
  const location = useLocation()

  useEffect(() => {
    setAuthed(null) // reset to trigger loading screen
    ;(async () => {
      const authed = await checkAuth(API_BASE_URL)
      setTimeout(() => setAuthed(authed), 200) // slight delay
    })()
  }, [location.pathname]) // re‑run on path change

  if (isAuthed === null) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen text-gray-100 overflow-hidden bg-gray-900">
        {/* Ambient background glow */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-700/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-700/10 blur-[130px] rounded-full"></div>

        {/* Center spinner */}
        <div className="relative w-16 h-16 mb-6 z-10">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-l-4 border-t-4 border-blue-400 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
        </div>

        <h2 className="text-2xl font-semibold tracking-wide mb-2 z-10">
          Checking authentication…
        </h2>
        <p className="text-gray-400 text-sm animate-pulse z-10">
          Please hold tight while we prepare your workspace ✨
        </p>
      </div>
    )
  }

  return isAuthed ? element : <Navigate to="/lock" replace />
}

// NavBar component
function NavBar() {
  return (
    <nav
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50
               bg-gray-800/80 backdrop-blur-md px-3 py-2 rounded-full shadow-lg
               flex items-center gap-2"
      role="navigation"
    >
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-transform transform
             ${
               isActive
                 ? 'text-blue-400 scale-110'
                 : 'text-gray-400 hover:text-white hover:scale-105'
             }`
          }
          aria-label={label}
          title={label}
        >
          {icon}
          <span className="text-xs select-none">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

// Define pages in an array for cleaner routing
interface RouteItem {
  path: string
  element: JSX.Element
}

const routes: RouteItem[] = [
  { path: '/', element: <Navigate to="/summary" replace /> },
  {
    path: '/summary',
    element: <PrivateRoute element={<Summary API_BASE_URL={API_BASE_URL} />} />,
  },
  {
    path: '/flashcards',
    element: (
      <PrivateRoute element={<Flashcards API_BASE_URL={API_BASE_URL} />} />
    ),
  },
  { path: '/login', element: <LoginPage API_BASE_URL={API_BASE_URL} /> },
  { path: '/signup', element: <SignupPage API_BASE_URL={API_BASE_URL} /> },
  {
    path: '/settings',
    element: <ComingSoon />,
  },
  { path: '/lock', element: <LockPage /> },
  {
    path: '*',
    element: <p className="text-center text-red-400 mt-10">Page not found</p>,
  },
]

// App component
function App() {
  return (
    <Router>
      <div className="flex-1 overflow-y-auto pb-24 bg-gray-900">
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>

      <NavBar />
    </Router>
  )
}

export default App
