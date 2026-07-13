import { useTheme } from '../context/ThemeContext'

const THEMES = [
  { value: 'space',     label: 'Beyond'    },
  { value: 'meliora',   label: 'Meliora'   },
  { value: 'hail-mary', label: 'Hail Mary' },
  { value: 'legacy',    label: 'Legacy'    },
]

function ThemeDropdown() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-dropdown">
      <span className="theme-label">Themes:</span>
      <span className="theme-caret">▾</span>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {THEMES.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
  )
}

export default ThemeDropdown
