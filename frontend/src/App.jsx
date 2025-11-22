import React, { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('tinylink:theme')
      if (saved) return saved === 'dark'
      return true   // <-- DEFAULT DARK MODE
    } catch {
      return true   // <-- fallback default dark
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('tinylink:theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="font-semibold text-xl flex items-center gap-3 dark:text-white ">
            <span className="inline-block w-8 h-8 rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 shadow-md " />
            TinyLink
          </Link>

          <div className="flex items-center gap-4">
            {/* <div className="text-sm text-gray-600 dark:text-gray-300">React · Express · Postgres</div> */}

            <button
              aria-label="Toggle theme"
              onClick={() => setIsDark(d => !d)}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition dark:text-white"
            >
              {isDark ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" /></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              )}
              <span className="text-sm">{isDark ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">Made By Soumya Halder — TinyLink</footer>
    </div>
  )
}
