import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'

const BLOB_COUNT = 50
const EASE = 0.6
const STREAK_LENGTH = 18
const MAX_STREAK = 100
const TAIL_STREAK_COUNT = 9

function CursorFluid() {
  const { theme } = useTheme()
  const blobRefs = useRef([])
  const tailStreakRefs = useRef([])
  const leadLineRef = useRef(null)
  const headGlowRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const lastMouse = useRef({ x: -100, y: -100 })
  const lastBlobPos = useRef({ x: -100, y: -100 })
  const tailVelocity = useRef({ x: 0, y: 0 })
  const points = useRef(
    Array.from({ length: BLOB_COUNT }, () => ({ x: -100, y: -100 }))
  )
  const jitterOffset = useRef({ x: 0, y: 0 })
  const jitterTarget = useRef({ x: 0, y: 0 })
  const jitterTimer = useRef(0)
  const rafRef = useRef(null)
  const timeRef = useRef(0)
  const idRef = useRef(0)
  const [droplets, setDroplets] = useState([])

  const removeDroplet = useCallback((id) => {
    setDroplets(prev => prev.filter(d => d.id !== id))
  }, [])

  useEffect(() => {
    if (theme !== 'space') return

    function spawnDroplets(x, y, count) {
      const next = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        const distance = 16 + Math.random() * 60
        return {
          id: idRef.current++,
          x, y,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          size: 3 + Math.random() * 9,
          duration: (0.35 + Math.random() * 0.35).toFixed(2),
        }
      })
      setDroplets(prev => [...prev.slice(-40), ...next])
    }

    function handleMove(e) {
      const dx = e.clientX - mouse.current.x
      const dy = e.clientY - mouse.current.y
      const dist = Math.hypot(dx, dy)
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      if (dist > 5 && Math.random() < 0.6) {
        spawnDroplets(e.clientX, e.clientY, dist > 40 ? 2 : 1)
      }
    }
    window.addEventListener('mousemove', handleMove)

    function tick() {
      timeRef.current += 1

      // mouse speed drives both how often the shake changes direction and how big it is —
      // slow smooth drift when idle, quick wide shake while moving
      const speed = Math.hypot(mouse.current.x - lastMouse.current.x, mouse.current.y - lastMouse.current.y)
      lastMouse.current.x = mouse.current.x
      lastMouse.current.y = mouse.current.y

      jitterTimer.current -= 1
      if (jitterTimer.current <= 0) {
        const amp = 1.5 + Math.min(speed, 50) * 0.32
        jitterTarget.current.x = (Math.random() - 0.5) * amp
        jitterTarget.current.y = (Math.random() - 0.5) * amp
        jitterTimer.current = Math.max(3, 22 - speed * 0.7)
      }
      jitterOffset.current.x += (jitterTarget.current.x - jitterOffset.current.x) * 0.25
      jitterOffset.current.y += (jitterTarget.current.y - jitterOffset.current.y) * 0.25

      const pts = points.current
      pts[0].x += (mouse.current.x - pts[0].x) * EASE + jitterOffset.current.x
      pts[0].y += (mouse.current.y - pts[0].y) * EASE + jitterOffset.current.y
      for (let i = 1; i < pts.length; i++) {
        const falloff = 1 - i / pts.length
        pts[i].x += (pts[i - 1].x - pts[i].x) * EASE + jitterOffset.current.x * falloff * 0.5
        pts[i].y += (pts[i - 1].y - pts[i].y) * EASE + jitterOffset.current.y * falloff * 0.5
      }

      // smoothed velocity of the last blob — used to draw a streak that always
      // clings to its exact position and stretches out behind it, rather than
      // an independently-lagging point that can drift apart from it
      const lastBlob = pts[BLOB_COUNT - 1]
      const rawVX = lastBlob.x - lastBlobPos.current.x
      const rawVY = lastBlob.y - lastBlobPos.current.y
      lastBlobPos.current.x = lastBlob.x
      lastBlobPos.current.y = lastBlob.y
      tailVelocity.current.x += (rawVX - tailVelocity.current.x) * 0.2
      tailVelocity.current.y += (rawVY - tailVelocity.current.y) * 0.2
      pts.forEach((p, i) => {
        const el = blobRefs.current[i]
        if (!el) return
        const pulse = 1 + Math.sin(timeRef.current * 0.15 + i * 1.3) * 0.18
        const transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${pulse.toFixed(3)})`
        el.style.transform = transform
        if (i === 0 && headGlowRef.current) headGlowRef.current.style.transform = transform
      })
      if (leadLineRef.current) {
        leadLineRef.current.setAttribute('x1', mouse.current.x)
        leadLineRef.current.setAttribute('y1', mouse.current.y)
        leadLineRef.current.setAttribute('x2', pts[0].x)
        leadLineRef.current.setAttribute('y2', pts[0].y)
      }
      // extend a chain of small blobs — same group, same goo filter — past the
      // last dot so the streak physically merges with it instead of just touching it
      let streakX = tailVelocity.current.x * STREAK_LENGTH
      let streakY = tailVelocity.current.y * STREAK_LENGTH
      const streakMag = Math.hypot(streakX, streakY)
      if (streakMag > MAX_STREAK) {
        const scale = MAX_STREAK / streakMag
        streakX *= scale
        streakY *= scale
      }
      const tipX = lastBlob.x - streakX
      const tipY = lastBlob.y - streakY
      for (let i = 0; i < TAIL_STREAK_COUNT; i++) {
        const el = tailStreakRefs.current[i]
        if (!el) continue
        const s = (i + 1) / TAIL_STREAK_COUNT
        const sx = lastBlob.x + (tipX - lastBlob.x) * s
        const sy = lastBlob.y + (tipY - lastBlob.y) * s
        el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [theme])

  if (theme !== 'space') return null

  return (
    <div className="cursor-fluid">
      <svg width="0" height="0">
        <defs>
          <filter id="cursor-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
          </filter>
        </defs>
      </svg>
      <div className="cursor-fluid-head-glow" ref={headGlowRef} />
      <div className="cursor-fluid-blobs">
        {Array.from({ length: BLOB_COUNT }).map((_, i) => {
          const t = i / (BLOB_COUNT - 1)
          const size = (28 - t * 18) * 0.8
          return (
            <div
              key={i}
              ref={el => (blobRefs.current[i] = el)}
              className="cursor-fluid-blob"
              style={{
                width:   `${size.toFixed(2)}px`,
                height:  `${size.toFixed(2)}px`,
                opacity: (1 - t * 0.6).toFixed(2),
              }}
            />
          )
        })}
        {Array.from({ length: TAIL_STREAK_COUNT }).map((_, i) => {
          const s = (i + 1) / TAIL_STREAK_COUNT
          const size = 8 * (1 - s) + 1.5 * s
          return (
            <div
              key={`tail-${i}`}
              ref={el => (tailStreakRefs.current[i] = el)}
              className="cursor-fluid-blob"
              style={{
                width:   `${size.toFixed(2)}px`,
                height:  `${size.toFixed(2)}px`,
                opacity: (0.4 * (1 - s)).toFixed(2),
              }}
            />
          )
        })}
        {droplets.map(d => (
          <div
            key={d.id}
            className="cursor-fluid-droplet"
            style={{
              left:   `${d.x}px`,
              top:    `${d.y}px`,
              width:  `${d.size}px`,
              height: `${d.size}px`,
              '--tx': `${d.tx}px`,
              '--ty': `${d.ty}px`,
              animationDuration: `${d.duration}s`,
            }}
            onAnimationEnd={() => removeDroplet(d.id)}
          />
        ))}
      </div>
      <svg className="cursor-fluid-line-layer">
        <line ref={leadLineRef} className="cursor-fluid-line cursor-fluid-line-lead" />
      </svg>
    </div>
  )
}

export default CursorFluid
