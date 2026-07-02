import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const THEMES = [
  { value: 'space',     label: 'Beyond'    },
  { value: 'meliora',   label: 'Meliora'   },
  { value: 'hail-mary', label: 'Hail Mary' },
  { value: 'legacy',    label: 'Legacy'    },
]

function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  function handleChange(e) {
    setTheme(e.target.value)
    setShowHint(false)
  }

  return (
    <div className="theme-dropdown">
      {showHint && (
        <div className="theme-hint">
          Try different themes based on some of my favorite things!
        </div>
      )}
      <span className="theme-caret">▾</span>
      <select value={theme} onChange={handleChange}>
        {THEMES.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
  )
}

export default ThemeDropdown
