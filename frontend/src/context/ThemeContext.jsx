import { createContext, useContext, useState, useEffect, useRef } from 'react'

const ThemeContext = createContext()

// order matters - this is the cycle the toggle button steps through
const THEME_CYCLE = ['light', 'dark', 'sepia']

export function ThemeProvider({ children }) {
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return getSystemTheme()
  }

  const [theme, setThemeState] = useState(getInitialTheme)

  // Whether the CURRENT theme came from an explicit user pick (toggle click)
  // rather than just the OS default. Only once this is true do we stop
  // silently following OS theme changes. A ref (not state) so the matchMedia
  // listener below always reads the latest value without needing to
  // re-subscribe every time it changes.
  const hasExplicitChoice = useRef(localStorage.getItem('theme') !== null)

  // Applies the theme to the page. Every CSS variable in index.css keys off
  // this attribute, so this one line is what makes the whole app switch.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Live-follow the OS theme in real time - but only until the user makes
  // their own explicit choice (including choosing sepia, which has no OS
  // equivalent). Once they've picked something themselves, their choice
  // sticks even if their OS theme changes afterward.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleSystemChange(e) {
      if (hasExplicitChoice.current) return // user already made their own choice - don't override it
      setThemeState(e.matches ? 'dark' : 'light')
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange)
      return () => mediaQuery.removeEventListener('change', handleSystemChange)
    }
    // fallback for older Safari
    mediaQuery.addListener(handleSystemChange)
    return () => mediaQuery.removeListener(handleSystemChange)
  }, [])

  // An explicit pick - persists to localStorage and locks out further
  // automatic OS-following.
  function setTheme(next) {
    hasExplicitChoice.current = true
    localStorage.setItem('theme', next)
    setThemeState(next)
  }

  function cycleTheme() {
    const nextIndex = (THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length
    setTheme(THEME_CYCLE[nextIndex])
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme: cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
