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
  { path: '/summary', element: <Summary API_BASE_URL={API_BASE_URL} /> },
  { path: '/flashcards', element: <Flashcards API_BASE_URL={API_BASE_URL} /> },
  {
    path: '*',
    element: <p className="text-center text-red-400 mt-10">Page not found</p>,
  },
]

// App component
function App() {
  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>

      {/* NavBar must be inside Router */}
      <NavBar />
    </Router>
  )
}

export default App
