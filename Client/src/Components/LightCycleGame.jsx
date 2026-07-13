import { useCallback, useEffect, useState } from 'react'
import { INFO_ITEMS } from '../data/infoItems'
import StalwartWalkthrough from './StalwartWalkthrough'

const CELL = 40
const COLS = 16
const ROWS = 11
const GAME_WIDTH = COLS * CELL
const GAME_HEIGHT = ROWS * CELL
const BASE_TICK_MS = 120
const SPEED_STEP = 0.95 // 5% faster (shorter tick) per item collected

const DIRS = {
  ArrowUp:    { x: 0,  y: -1 },
  ArrowDown:  { x: 0,  y: 1  },
  ArrowLeft:  { x: -1, y: 0  },
  ArrowRight: { x: 1,  y: 0  },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
}

const START_SNAKE = [
  { x: 4, y: 5 },
  { x: 3, y: 5 },
  { x: 2, y: 5 },
  { x: 1, y: 5 },
]

function shuffled(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function randomEmptyCell(occupied) {
  let cell
  do {
    cell = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
  } while (occupied.some(seg => seg.x === cell.x && seg.y === cell.y))
  return cell
}

function initialWorld() {
  const queue = shuffled(INFO_ITEMS.map(item => item.id))
  const [firstId, ...rest] = queue
  return {
    snake: START_SNAKE,
    dir: { x: 1, y: 0 },
    queuedDir: { x: 1, y: 0 },
    queue: rest,
    item: firstId ? { id: firstId, ...randomEmptyCell(START_SNAKE) } : null,
    collected: [],
    started: false,
    dead: false,
  }
}

function LightCycleGame() {
  const [world, setWorld] = useState(initialWorld)

  const won = world.collected.length === INFO_ITEMS.length

  const restart = useCallback(() => {
    setWorld(initialWorld())
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      const dir = DIRS[e.key]
      if (!dir) return
      e.preventDefault()
      setWorld(prev => {
        if (prev.dead) return prev
        // ignore reversing straight back into the snake's own neck
        if (prev.snake.length > 1 && dir.x === -prev.dir.x && dir.y === -prev.dir.y) return prev
        return { ...prev, queuedDir: dir, started: true }
      })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!world.started || world.dead || won) return undefined

    const tickMs = BASE_TICK_MS * SPEED_STEP ** world.collected.length

    const interval = setInterval(() => {
      setWorld(prev => {
        if (prev.dead || prev.collected.length === INFO_ITEMS.length) return prev

        const dir = prev.queuedDir
        const head = prev.snake[0]
        const next = { x: head.x + dir.x, y: head.y + dir.y }

        const hitWall = next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS
        if (hitWall) return { ...prev, dead: true, dir }

        const ateItem = !!(prev.item && prev.item.x === next.x && prev.item.y === next.y)
        // the tail cell vacates this tick unless the snake is growing, so
        // exclude it from the collision check to avoid a false self-hit
        const bodyToCheck = ateItem ? prev.snake : prev.snake.slice(0, -1)
        const hitSelf = bodyToCheck.some(seg => seg.x === next.x && seg.y === next.y)
        if (hitSelf) return { ...prev, dead: true, dir }

        const grown = [next, ...prev.snake]
        const snake = ateItem ? grown : grown.slice(0, -1)

        if (!ateItem) {
          return { ...prev, snake, dir }
        }

        const collected = [...prev.collected, prev.item.id]
        const [nextId, ...restQueue] = prev.queue
        const item = nextId ? { id: nextId, ...randomEmptyCell(snake) } : null

        return { ...prev, snake, dir, collected, queue: restQueue, item }
      })
    }, tickMs)

    return () => clearInterval(interval)
  }, [world.started, world.dead, won, world.collected.length])

  const collectedSet = new Set(world.collected)
  const bySection = section => INFO_ITEMS.filter(item => item.section === section && collectedSet.has(item.id))
  const contact = bySection('contact')
  const about = bySection('about')
  const projects = bySection('projects')
  const links = bySection('links')

  return (
    <div className="asteroids-wrap">
      <div className="game-stage" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      <div
        className="asteroids-game cycle-game"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        <div className="asteroids-progress">{world.collected.length} / {INFO_ITEMS.length} found</div>

        {!world.started && !world.dead && (
          <div className="cycle-hint">Use arrow keys or WASD to ride</div>
        )}

        {world.snake.map((seg, i) => (
          <div
            key={i}
            className={i === 0 ? 'cycle-seg cycle-seg--head' : 'cycle-seg'}
            style={{
              left: seg.x * CELL,
              top: seg.y * CELL,
              width: CELL,
              height: CELL,
              opacity: Math.max(0.35, 1 - i * 0.03),
            }}
          />
        ))}

        {world.item && (
          <div
            className="cycle-item"
            style={{
              left: world.item.x * CELL,
              top: world.item.y * CELL,
              width: CELL,
              height: CELL,
            }}
          />
        )}

        {world.dead && !won && (
          <div className="asteroids-win-overlay">
            <h2>Derezzed</h2>
            <p>You collected {world.collected.length} of {INFO_ITEMS.length}.</p>
            <button type="button" className="cycle-restart" onClick={restart}>Try again</button>
          </div>
        )}

        {won && (
          <div className="asteroids-win-overlay">
            <h2>You win!</h2>
            <p>You've collected everything.</p>
          </div>
        )}
      </div>
      </div>

      <aside className="asteroids-inventory content-box">
        <h2>Brendon Stueben</h2>

        {world.collected.length === 0 && (
          <p>Ride the grid and collect the glowing data to reveal info…</p>
        )}

        {contact.map(item => <h3 key={item.id}>{item.label}</h3>)}

        {about.length > 0 && <p>{about[0].label}</p>}

        {projects.length > 0 && (
          <>
            <h2>highlight projects</h2>
            {projects.map(item => (
              <h3 key={item.id}>
                {item.id === 'stalwart' ? (
                  <StalwartWalkthrough label={item.label} />
                ) : (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
                )}
              </h3>
            ))}
          </>
        )}

        {links.length > 0 && (
          <>
            <h2>links</h2>
            {links.map(item => (
              <h3 key={item.id}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
              </h3>
            ))}
          </>
        )}
      </aside>
    </div>
  )
}

export default LightCycleGame
