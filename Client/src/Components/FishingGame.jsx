import { useCallback, useEffect, useRef, useState } from 'react'
import { INFO_ITEMS } from '../data/infoItems'
import shipImg from '../assets/hailMary-ship.png'
import hookImg from '../assets/phmCollectionBall.png'
import taumoebaImg from '../assets/taumoeba.png'

const GAME_WIDTH = 640
const GAME_HEIGHT = 440

// the pool is the visible cap of a much larger circle sitting mostly below
// the game box, so only its top arc shows — reads as the curve of a planet
const POOL_RADIUS = 600
const POOL_TOP = 180
const POOL_CENTER_X = GAME_WIDTH / 2
const POOL_CENTER_Y = POOL_TOP + POOL_RADIUS

const SHIP_ANCHOR_Y = 90
const HOOK_RADIUS = 20
const HOOK_EASE = 0.045 // how quickly the hook catches up to the cursor each frame — lower = more drag
const FISH_RADIUS = 11 // boundary margin — matches the taumoeba sprite's ~20px display size
const CATCH_RADIUS = 24
const FLEE_RADIUS = 130
const MAX_SPEED = 3.6
const WANDER_JITTER = 0.4
const DART_CHANCE = 0.035 // per-frame odds of a sudden burst in a new random direction

const ACTIVE_COUNT = 3

let uid = 0
const nextId = () => (uid += 1)

function shuffled(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// pulls (x, y) back inside the pool's circular boundary — and the game
// box's edges — if it strays past either
function clampToPool(x, y, margin) {
  const dx = x - POOL_CENTER_X
  const dy = y - POOL_CENTER_Y
  const maxDist = POOL_RADIUS - margin
  const dist = Math.sqrt(dx * dx + dy * dy)
  let cx = x
  let cy = y
  if (dist > maxDist) {
    const scale = maxDist / dist
    cx = POOL_CENTER_X + dx * scale
    cy = POOL_CENTER_Y + dy * scale
  }
  cx = Math.min(GAME_WIDTH - margin, Math.max(margin, cx))
  cy = Math.min(GAME_HEIGHT - margin, Math.max(POOL_TOP + margin, cy))
  return { x: cx, y: cy }
}

function randomPoolPoint(margin) {
  for (let i = 0; i < 30; i += 1) {
    const x = margin + Math.random() * (GAME_WIDTH - margin * 2)
    const y = POOL_TOP + margin + Math.random() * (GAME_HEIGHT - POOL_TOP - margin * 2)
    const dx = x - POOL_CENTER_X
    const dy = y - POOL_CENTER_Y
    if (dx * dx + dy * dy <= (POOL_RADIUS - margin) ** 2) return { x, y }
  }
  return { x: POOL_CENTER_X, y: GAME_HEIGHT - margin }
}

function spawnFish(itemId) {
  const { x, y } = randomPoolPoint(FISH_RADIUS)
  const angle = Math.random() * Math.PI * 2
  const speed = 0.6 + Math.random() * 0.8
  return {
    id: nextId(),
    itemId,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  }
}

function initialWorld() {
  const queue = shuffled(INFO_ITEMS.map(item => item.id))
  const initialIds = queue.splice(0, ACTIVE_COUNT)
  const start = { x: POOL_CENTER_X, y: POOL_TOP + 50 }
  return {
    hook: start, // eased position — what's rendered and used for collisions
    target: start, // raw cursor position — what the hook drags toward
    fish: initialIds.map(spawnFish),
    queue,
    collected: [],
  }
}

function FishingGame() {
  const gameRef = useRef(null)
  const [world, setWorld] = useState(initialWorld)

  const won = world.collected.length === INFO_ITEMS.length

  const handleMouseMove = useCallback((e) => {
    const rect = gameRef.current.getBoundingClientRect()
    const { x, y } = clampToPool(e.clientX - rect.left, e.clientY - rect.top, HOOK_RADIUS)
    setWorld(prev => ({ ...prev, target: { x, y } }))
  }, [])

  useEffect(() => {
    if (won) return undefined
    let raf

    const tick = () => {
      setWorld(prev => {
        if (prev.collected.length === INFO_ITEMS.length) return prev

        // the hook drags behind the cursor instead of snapping to it
        const hook = {
          x: prev.hook.x + (prev.target.x - prev.hook.x) * HOOK_EASE,
          y: prev.hook.y + (prev.target.y - prev.hook.y) * HOOK_EASE,
        }

        const caughtIds = new Set()
        const gainedItemIds = []

        const movedFish = prev.fish.map(f => {
          const dxHook = f.x - hook.x
          const dyHook = f.y - hook.y
          const distHook = Math.sqrt(dxHook * dxHook + dyHook * dyHook) || 1

          if (distHook < CATCH_RADIUS) {
            caughtIds.add(f.id)
            gainedItemIds.push(f.itemId)
            return f
          }

          let { vx, vy } = f
          if (distHook < FLEE_RADIUS) {
            // the closer the hook, the harder it flees
            const strength = (FLEE_RADIUS - distHook) / FLEE_RADIUS
            vx += (dxHook / distHook) * strength * 1.1
            vy += (dyHook / distHook) * strength * 1.1
          } else if (Math.random() < DART_CHANCE) {
            // sudden burst in a fresh random direction — the "darting" look
            const angle = Math.random() * Math.PI * 2
            vx = Math.cos(angle) * MAX_SPEED
            vy = Math.sin(angle) * MAX_SPEED
          } else {
            // otherwise zip around with a sharp-ish random course change
            const angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * WANDER_JITTER
            const speed = Math.max(1.2, Math.min(MAX_SPEED, Math.hypot(vx, vy)))
            vx = Math.cos(angle) * speed
            vy = Math.sin(angle) * speed
          }

          const speed = Math.hypot(vx, vy)
          if (speed > MAX_SPEED) {
            vx = (vx / speed) * MAX_SPEED
            vy = (vy / speed) * MAX_SPEED
          }

          let nx = f.x + vx
          let ny = f.y + vy
          const clamped = clampToPool(nx, ny, FISH_RADIUS)
          if (clamped.x !== nx || clamped.y !== ny) {
            vx *= -0.6
            vy *= -0.6
            nx = clamped.x
            ny = clamped.y
          }

          return { ...f, x: nx, y: ny, vx, vy }
        })

        if (caughtIds.size === 0) {
          return { ...prev, hook, fish: movedFish }
        }

        const survivingFish = movedFish.filter(f => !caughtIds.has(f.id))
        let queue = prev.queue
        const replacements = []
        while (survivingFish.length + replacements.length < ACTIVE_COUNT && queue.length > 0) {
          const [nextItemId, ...rest] = queue
          queue = rest
          replacements.push(spawnFish(nextItemId))
        }

        return {
          ...prev,
          hook,
          fish: [...survivingFish, ...replacements],
          queue,
          collected: [...prev.collected, ...gainedItemIds],
        }
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [won])

  const collectedSet = new Set(world.collected)
  const bySection = section => INFO_ITEMS.filter(item => item.section === section && collectedSet.has(item.id))
  const contact = bySection('contact')
  const about = bySection('about')
  const projects = bySection('projects')
  const links = bySection('links')

  return (
    <div className="asteroids-wrap">
      <div
        ref={gameRef}
        className="asteroids-game fishing-game"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onMouseMove={won ? undefined : handleMouseMove}
      >
        <div className="asteroids-progress">{world.collected.length} / {INFO_ITEMS.length} found</div>

        <img src={shipImg} alt="" className="fishing-ship" />

        <div className="fishing-pool" />

        {!won && (
          <svg className="fishing-line-svg" width={GAME_WIDTH} height={GAME_HEIGHT}>
            <line
              x1={POOL_CENTER_X}
              y1={SHIP_ANCHOR_Y}
              x2={world.hook.x}
              y2={world.hook.y}
              stroke="rgba(240, 208, 168, 0.55)"
              strokeWidth="2"
            />
          </svg>
        )}

        {!won && world.fish.map(f => (
          <div
            key={f.id}
            className="fishing-catch"
            style={{ left: f.x, top: f.y, backgroundImage: `url(${taumoebaImg})` }}
          />
        ))}

        {!won && (
          <img
            src={hookImg}
            alt=""
            className="fishing-hook"
            style={{ left: world.hook.x, top: world.hook.y }}
          />
        )}

        {!won && world.collected.length === 0 && (
          <div className="fishing-hint">Move your cursor into the pool to catch the circles</div>
        )}

        {won && (
          <div className="asteroids-win-overlay">
            <h2>You win!</h2>
            <p>You've collected everything.</p>
          </div>
        )}
      </div>

      <aside className="asteroids-inventory content-box">
        <h2>Brendon Stueben</h2>

        {world.collected.length === 0 && (
          <p>Catch the circles in the pool to reel in info…</p>
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

export default FishingGame
