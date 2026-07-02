import { useTheme } from '../context/ThemeContext'

function LegacyEffects() {
  const { theme } = useTheme()
  if (theme !== 'legacy') return null
  return <div className="legacy-scanlines" />
}

export default LegacyEffects
