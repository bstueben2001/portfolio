import { useTheme } from '../context/ThemeContext'

function MelioraRays() {
  const { theme } = useTheme()
  if (theme !== 'meliora') return null
  return <div className="meliora-rays" />
}

export default MelioraRays
