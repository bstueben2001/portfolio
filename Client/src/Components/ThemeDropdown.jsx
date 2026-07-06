import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const THEMES = [
  { value: 'space',     label: 'Beyond'    },
  { value: 'meliora',   label: 'Meliora'   },
  { value: 'hail-mary', label: 'Hail Mary' },
  { value: 'legacy',    label: 'Legacy'    },
]

function ThemeDropdown({ showHint: showHintProp = false }) {
  const { theme, setTheme } = useTheme()
  const [dismissed, setDismissed] = useState(false)

  const showHint = showHintProp && !dismissed

  function handleChange(e) {
    setTheme(e.target.value)
    setDismissed(true)
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
