import { useTheme } from '../context/ThemeContext'

function ShootingStars() {
  const { theme } = useTheme()
  if (theme !== 'space') return null

  return (
    <>
      <div className="shooting-star shoot-a" />
      <div className="shooting-star shoot-b" />
      <div className="shooting-star shoot-c" />
    </>
  )
}

export default ShootingStars
