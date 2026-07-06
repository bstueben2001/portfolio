import { useEffect, useRef, useState } from 'react'
import { INFO_ITEMS } from '../data/infoItems'

const GAME_WIDTH = 640
const GAME_HEIGHT = 440
const SHIP_X = GAME_WIDTH / 2
const SHIP_Y = GAME_HEIGHT / 2
const SHIP_MUZZLE = 24
const BULLET_SPEED = 7
const ASTEROID_RADIUS = 34
const SPAWN_INTERVAL_MS = 2200
const INITIAL_SPAWN_COUNT = 3

let uid = 0
const nextId = () => (uid += 1)

function spawnPoint() {
  const edge = Math.floor(Math.random() * 4)
  let x, y
  if (edge === 0)      { x = Math.random() * GAME_WIDTH; y = -ASTEROID_RADIUS }
  else if (edge === 1) { x = GAME_WIDTH + ASTEROID_RADIUS; y = Math.random() * GAME_HEIGHT }
  else if (edge === 2) { x = Math.random() * GAME_WIDTH; y = GAME_HEIGHT + ASTEROID_RADIUS }
  else                 { x = -ASTEROID_RADIUS; y = Math.random() * GAME_HEIGHT }

  const angle = Math.atan2(SHIP_Y - y, SHIP_X - x) + (Math.random() - 0.5) * 1.4
  const speed = 0.35 + Math.random() * 0.45
  return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
}

function shuffled(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function initialWorld() {
  const queue = shuffled(INFO_ITEMS.map(item => item.id))
  const initialIds = queue.splice(0, INITIAL_SPAWN_COUNT)
  return {
    bullets: [],
    asteroids: initialIds.map(itemId => ({ id: nextId(), itemId, ...spawnPoint() })),
    queue,
  }
}

function AsteroidsGame() {
  const gameRef = useRef(null)
  const [shipAngle, setShipAngle] = useState(0)
  const [world, setWorld] = useState(initialWorld)
  const [collected, setCollected] = useState([])

  const won = collected.length === INFO_ITEMS.length

  useEffect(() => {
    const interval = setInterval(() => {
      setWorld(prev => {
        if (prev.queue.length === 0) return prev
        const [itemId, ...rest] = prev.queue
        return {
          ...prev,
          queue: rest,
          asteroids: [...prev.asteroids, { id: nextId(), itemId, ...spawnPoint() }],
        }
      })
    }, SPAWN_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (won) return undefined
    let raf

    const tick = () => {
      const gainedIds = []

      setWorld(prev => {
        const bullets = prev.bullets
          .map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
          .filter(b => b.x > -20 && b.x < GAME_WIDTH + 20 && b.y > -20 && b.y < GAME_HEIGHT + 20)

        const asteroids = prev.asteroids.map(a => {
          let x = a.x + a.vx
          let y = a.y + a.vy
          if (x < -ASTEROID_RADIUS) x = GAME_WIDTH + ASTEROID_RADIUS
          if (x > GAME_WIDTH + ASTEROID_RADIUS) x = -ASTEROID_RADIUS
          if (y < -ASTEROID_RADIUS) y = GAME_HEIGHT + ASTEROID_RADIUS
          if (y > GAME_HEIGHT + ASTEROID_RADIUS) y = -ASTEROID_RADIUS
          return { ...a, x, y }
        })

        const hitBulletIds = new Set()
        const hitAsteroidIds = new Set()

        for (const bullet of bullets) {
          for (const asteroid of asteroids) {
            if (hitAsteroidIds.has(asteroid.id)) continue
            const dx = bullet.x - asteroid.x
            const dy = bullet.y - asteroid.y
            if (Math.sqrt(dx * dx + dy * dy) < ASTEROID_RADIUS) {
              hitBulletIds.add(bullet.id)
              hitAsteroidIds.add(asteroid.id)
              gainedIds.push(asteroid.itemId)
              break
            }
          }
        }

        return {
          ...prev,
          bullets: bullets.filter(b => !hitBulletIds.has(b.id)),
          asteroids: asteroids.filter(a => !hitAsteroidIds.has(a.id)),
        }
      })

      if (gainedIds.length > 0) {
        setCollected(prev => {
          const merged = new Set(prev)
          gainedIds.forEach(id => merged.add(id))
          return [...merged]
        })
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [won])

  function pointerPos(e) {
    const rect = gameRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function handleMouseMove(e) {
    const { x, y } = pointerPos(e)
    setShipAngle(Math.atan2(y - SHIP_Y, x - SHIP_X) * (180 / Math.PI))
  }

  function handleClick(e) {
    if (won) return
    const { x, y } = pointerPos(e)
    const angle = Math.atan2(y - SHIP_Y, x - SHIP_X)
    const bullet = {
      id: nextId(),
      x: SHIP_X + Math.cos(angle) * SHIP_MUZZLE,
      y: SHIP_Y + Math.sin(angle) * SHIP_MUZZLE,
      vx: Math.cos(angle) * BULLET_SPEED,
      vy: Math.sin(angle) * BULLET_SPEED,
    }
    setWorld(prev => ({ ...prev, bullets: [...prev.bullets, bullet] }))
  }

  const collectedSet = new Set(collected)
  const bySection = section => INFO_ITEMS.filter(item => item.section === section && collectedSet.has(item.id))
  const contact = bySection('contact')
  const about = bySection('about')
  const projects = bySection('projects')
  const links = bySection('links')

  return (
    <div className="asteroids-wrap">
      <div
        ref={gameRef}
        className="asteroids-game"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div className="asteroids-progress">{collected.length} / {INFO_ITEMS.length} found</div>

        <div
          className="asteroids-ship"
          style={{ left: SHIP_X, top: SHIP_Y, transform: `translate(-50%, -50%) rotate(${shipAngle}deg)` }}
        />

        {world.bullets.map(b => (
          <div key={b.id} className="asteroids-bullet" style={{ left: b.x, top: b.y }} />
        ))}

        {world.asteroids.map(a => {
          const item = INFO_ITEMS.find(i => i.id === a.itemId)
          return (
            <div
              key={a.id}
              className="asteroids-rock"
              style={{ left: a.x, top: a.y, width: ASTEROID_RADIUS * 2, height: ASTEROID_RADIUS * 2 }}
            >
              <span className="asteroids-rock-label">{item.label}</span>
            </div>
          )
        })}

        {won && (
          <div className="asteroids-win-overlay">
            <h2>You win!</h2>
            <p>You've collected everything.</p>
          </div>
        )}
      </div>

      <aside className="asteroids-inventory content-box">
        <h2>Brendon Stueben</h2>

        {collected.length === 0 && (
          <p>Blast the asteroids to collect info…</p>
        )}

        {contact.map(item => <h3 key={item.id}>{item.label}</h3>)}

        {about.length > 0 && <p>{about[0].label}</p>}

        {projects.length > 0 && (
          <>
            <h2>highlight projects</h2>
            {projects.map(item => (
              <h3 key={item.id}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
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

export default AsteroidsGame
