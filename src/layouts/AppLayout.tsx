import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import NavRail from '../components/NavRail'

type ThemeMode = 'white' | 'black'

const THEME_STORAGE_KEY = 'support-ticket-theme'

function useGlobalDpad(navigate: ReturnType<typeof useNavigate>, pathname: string) {
  useEffect(() => {
    const routes = ['/', '/clients', '/tickets', '/team']

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'PageDown' && event.key !== 'PageUp') {
        return
      }

      event.preventDefault()
      const currentIndex = Math.max(routes.indexOf(pathname), 0)
      const nextIndex =
        event.key === 'PageDown'
          ? (currentIndex + 1) % routes.length
          : (currentIndex - 1 + routes.length) % routes.length

      navigate(routes[nextIndex])
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, pathname])
}

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'white'
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'black' ? 'black' : 'white'
  })

  useGlobalDpad(navigate, location.pathname)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <div className="app-shell">
      <div className="content-surface">
        <NavRail theme={theme} onThemeChange={setTheme} />
        <main className="screen-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
