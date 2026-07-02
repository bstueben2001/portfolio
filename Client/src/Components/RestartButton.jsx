import { Link, useLocation } from 'react-router-dom'

function RestartButton() {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  return (
    <Link to="/" className="restart-button">
      ← Restart
    </Link>
  )
}

export default RestartButton
