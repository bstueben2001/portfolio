import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

const COLS = 18
const ROWS = 13

const LAYERS = [
  { key: 'far',  sizeRange: [0.6, 1.2], durationRange: [3,   6]   },
  { key: 'mid',  sizeRange: [1.2, 2],   durationRange: [2.4, 4.5] },
  { key: 'near', sizeRange: [2,   3.4], durationRange: [1.8, 3.4] },
]

function makeLayer({ key, sizeRange, durationRange }) {
  const [minSize, maxSize] = sizeRange
  const [minDuration, maxDuration] = durationRange

  return Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return {
      id:       `${key}-${i}`,
      left:     `${((col + Math.random()) / COLS) * 100}%`,
      top:      `${((row + Math.random()) / ROWS) * 100}%`,
      size:     `${(minSize + Math.random() * (maxSize - minSize)).toFixed(2)}px`,
      delay:    `${(Math.random() * 4).toFixed(2)}s`,
      duration: `${(minDuration + Math.random() * (maxDuration - minDuration)).toFixed(2)}s`,
    }
  })
}

function SpaceStars() {
  const { theme } = useTheme()

  const layers = useMemo(() => (
    LAYERS.map(layer => ({ key: layer.key, stars: makeLayer(layer) }))
  ), [])

  if (theme !== 'space') return null

  return (
    <div className="star-field">
      {layers.map(({ key, stars }) => (
        stars.map(s => (
          <div
            key={s.id}
            className={`star star-${key}`}
            style={{
              left:              s.left,
              top:               s.top,
              width:             s.size,
              height:            s.size,
              animationDelay:    s.delay,
              animationDuration: s.duration,
            }}
          />
        ))
      ))}
    </div>
  )
}

export default SpaceStars
