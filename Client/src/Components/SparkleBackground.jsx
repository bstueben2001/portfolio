import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

const COLS = 15
const ROWS = 11

function SparkleBackground() {
  const { theme } = useTheme()

  const sparkles = useMemo(() => (
    Array.from({ length: COLS * ROWS }, (_, i) => {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      return {
        id: i,
        left:     `${((col + Math.random()) / COLS) * 100}%`,
        top:      `${((row + Math.random()) / ROWS) * 100}%`,
        delay:    `${(Math.random() * 4).toFixed(2)}s`,
        duration: `${(1.5 + Math.random() * 3).toFixed(2)}s`,
      }
    })
  ), [])

  if (theme !== 'hail-mary') return null

  return (
    <div className="sparkle-layer">
      {sparkles.map(s => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left:              s.left,
            top:               s.top,
            animationDelay:    s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  )
}

export default SparkleBackground
