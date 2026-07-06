import { useTheme } from '../context/ThemeContext'
import AsteroidsGame from './AsteroidsGame'
import LightCycleGame from './LightCycleGame'
import EmberRhythmGame from './EmberRhythmGame'
import FishingGame from './FishingGame'

function FunMode() {
  const { theme } = useTheme()

  if (theme === 'space') {
    return (
      <main className="fun-mode fun-mode--game">
        <AsteroidsGame />
      </main>
    )
  }

  if (theme === 'legacy') {
    return (
      <main className="fun-mode fun-mode--game">
        <LightCycleGame />
      </main>
    )
  }

  if (theme === 'meliora') {
    return (
      <main className="fun-mode fun-mode--game">
        <EmberRhythmGame />
      </main>
    )
  }

  if (theme === 'hail-mary') {
    return (
      <main className="fun-mode fun-mode--game">
        <FishingGame />
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
