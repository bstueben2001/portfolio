import { useTheme } from '../context/ThemeContext'
import AsteroidsGame from './AsteroidsGame'

function FunMode() {
  const { theme } = useTheme()

  if (theme === 'space') {
    return (
      <main className="fun-mode fun-mode--game">
        <AsteroidsGame />
      </main>
    )
  }

  return (
    <main className="fun-mode">
      <div className="content-box">
        <h2>Fun Mode</h2>
        <p>Placeholder — interactive experience coming soon.</p>
      </div>
    </main>
  )
}

export default FunMode
