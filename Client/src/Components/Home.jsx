import { useNavigate } from 'react-router-dom'
import { useState, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'

const STAR_CHARS = ['✦', '✧', '✶', '✵', '✴', '★']
const STAR_COLORS = ['var(--gold)', 'var(--gold-bright)', 'var(--cream)', 'var(--gold-dim)']
const HAIL_MARY_STAR_COLORS = ['#ff3b30', '#ff6b52', '#e8281a', '#ff8a75']
const EMBER_COLORS = ['#fff4d6', '#ffb238', '#ff8c1a', '#ff6a1a']
const GLITCH_WORDS = ['_derezz', '.rECTIFY', '//reboot', '_SYS.ERR', '0xDE23']
const GLITCH_PIXEL_COLORS = ['#00e5ff', '#60e8ff', '#ff2b6d', '#ffffff']

function Home() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isMeliora = theme === 'meliora'
  const isSpace = theme === 'space'
  const isHailMary = theme === 'hail-mary'
  const isLegacy = theme === 'legacy'
  const [stars, setStars] = useState([])
  const [glitching, setGlitching] = useState(false)
  const [glitchWord, setGlitchWord] = useState(null)
  const intervalRef = useRef(null)
  const pixelIntervalRef = useRef(null)
  const glitchTimeoutRef = useRef(null)
  const idRef = useRef(0)

  const spawnFew = useCallback(() => {
    if (isLegacy) return
    const newStars = Array.from({ length: 3 }, () => {
      if (isMeliora) {
        // fan evenly from -70° to +70° off straight up, rather than a binary left/right split
        const angle = (Math.random() * 140 - 70) * (Math.PI / 180)
        const distance = 90 + Math.random() * 160
        return {
          id: idRef.current++,
          kind: 'ember',
          tx: Math.sin(angle) * distance,
          ty: -Math.cos(angle) * distance,
          size: 0.25 + Math.random() * 0.3,
          duration: 1.2 + Math.random() * 1.0,
          delay: Math.random() * 0.2,
          color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
        }
      }
      if (isSpace) {
        const angle = Math.random() * 360
        const distance = -(140 + Math.random() * 200)
        return {
          id: idRef.current++,
          kind: 'hyperline',
          angle: `${angle}deg`,
          distance: `${distance}px`,
          stretch: (8 + Math.random() * 8).toFixed(2),
          duration: 0.35 + Math.random() * 0.3,
          delay: Math.random() * 0.15,
        }
      }
      const angle = Math.random() * 2 * Math.PI
      const distance = 120 + Math.random() * 220
      const palette = isHailMary ? HAIL_MARY_STAR_COLORS : STAR_COLORS
      return {
        id: idRef.current++,
        kind: 'star',
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: 0.5 + Math.random() * 0.9,
        duration: 0.55 + Math.random() * 0.45,
        delay: Math.random() * 0.2,
        char: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
        color: palette[Math.floor(Math.random() * palette.length)],
      }
    })
    setStars(prev => [...prev, ...newStars])
  }, [isMeliora, isSpace, isHailMary, isLegacy])

  const removeStar = useCallback((id) => {
    setStars(prev => prev.filter(s => s.id !== id))
  }, [])

  const triggerGlitch = useCallback(() => {
    setGlitchWord(GLITCH_WORDS[Math.floor(Math.random() * GLITCH_WORDS.length)])
    clearTimeout(glitchTimeoutRef.current)
    glitchTimeoutRef.current = setTimeout(() => setGlitchWord(null), 130 + Math.random() * 150)
  }, [])

  const spawnPixels = useCallback(() => {
    const newPixels = Array.from({ length: 6 }, () => {
      const size = 3 + Math.random() * 6
      const color = GLITCH_PIXEL_COLORS[Math.floor(Math.random() * GLITCH_PIXEL_COLORS.length)]
      // spawn from a random spot across the card's footprint, not just dead-center
      const originX = 10 + Math.random() * 80
      const originY = 10 + Math.random() * 80

      // some pixels teleport between a few nearby spots instead of drifting off
      if (Math.random() < 0.35) {
        const radius = 34
        const waypoint = () => (Math.random() * 2 - 1) * radius
        return {
          id: idRef.current++,
          kind: 'pixel',
          variant: 'shift',
          originX, originY,
          sx1: waypoint(), sy1: waypoint(),
          sx2: waypoint(), sy2: waypoint(),
          sx3: waypoint(), sy3: waypoint(),
          size,
          duration: 2 + Math.random() * 1.4,
          delay: Math.random() * 0.2,
          color,
        }
      }

      // the rest drift slowly along a single axis — never both at once
      const horizontal = Math.random() < 0.5
      const distance = (50 + Math.random() * 160) * (Math.random() < 0.5 ? -1 : 1)
      return {
        id: idRef.current++,
        kind: 'pixel',
        variant: 'drift',
        originX, originY,
        tx: horizontal ? distance : 0,
        ty: horizontal ? 0 : distance,
        size,
        duration: 1.4 + Math.random() * 1.4,
        delay: Math.random() * 0.2,
        color,
      }
    })
    setStars(prev => [...prev, ...newPixels])
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (isLegacy) {
      setGlitching(true)
      triggerGlitch()
      spawnPixels()
      intervalRef.current = setInterval(triggerGlitch, 650)
      pixelIntervalRef.current = setInterval(spawnPixels, 260)
      return
    }
    spawnFew()
    intervalRef.current = setInterval(spawnFew, 90)
  }, [isLegacy, spawnFew, triggerGlitch, spawnPixels])

  const handleMouseLeave = useCallback(() => {
    clearInterval(intervalRef.current)
    clearInterval(pixelIntervalRef.current)
    clearTimeout(glitchTimeoutRef.current)
    setGlitching(false)
    setGlitchWord(null)
  }, [])

  return (
    <div className="home">
      <div className="home-box">
      <h1>welcome to my portfolio</h1>
      <p>how would you like to explore?</p>
      <div className="home-cards">

        <div className="mode-card info-card" onClick={() => navigate('/info')}>
          <span className="card-icon">◈</span>
          <h2>Info Mode</h2>
          <p>A clean overview of my background, skills, and experience.</p>
        </div>

        <div
          className={`mode-card fun-card${glitching ? ' fun-card--glitching' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate('/fun')}
        >
          <div className="card-content">
            <span className="card-icon">◉</span>
            <h2 className={glitchWord ? 'glitch-word-active' : ''}>{glitchWord ?? 'Fun Mode'}</h2>
            <p>An interactive, game-like way to get to know me.</p>
          </div>
          {stars.map(star => (
            star.kind === 'hyperline' ? (
              <span
                key={star.id}
                className="card-hyperline"
                style={{
                  '--angle':    star.angle,
                  '--distance': star.distance,
                  '--stretch':  star.stretch,
                  '--duration': `${star.duration}s`,
                  '--delay':    `${star.delay}s`,
                }}
                onAnimationEnd={() => removeStar(star.id)}
              />
            ) : star.kind === 'ember' ? (
              <span
                key={star.id}
                className="card-ember"
                style={{
                  '--tx': `${star.tx}px`,
                  '--ty': `${star.ty}px`,
                  '--size': `${star.size}rem`,
                  '--duration': `${star.duration}s`,
                  '--delay': `${star.delay}s`,
                  '--color': star.color,
                }}
                onAnimationEnd={() => removeStar(star.id)}
              />
            ) : star.kind === 'pixel' ? (
              <span
                key={star.id}
                className={`card-pixel card-pixel--${star.variant}`}
                style={star.variant === 'shift' ? {
                  left: `${star.originX}%`, top: `${star.originY}%`,
                  '--sx1': `${star.sx1}px`, '--sy1': `${star.sy1}px`,
                  '--sx2': `${star.sx2}px`, '--sy2': `${star.sy2}px`,
                  '--sx3': `${star.sx3}px`, '--sy3': `${star.sy3}px`,
                  '--size': `${star.size}px`,
                  '--duration': `${star.duration}s`,
                  '--delay': `${star.delay}s`,
                  '--color': star.color,
                } : {
                  left: `${star.originX}%`, top: `${star.originY}%`,
                  '--tx': `${star.tx}px`,
                  '--ty': `${star.ty}px`,
                  '--size': `${star.size}px`,
                  '--duration': `${star.duration}s`,
                  '--delay': `${star.delay}s`,
                  '--color': star.color,
                }}
                onAnimationEnd={() => removeStar(star.id)}
              />
            ) : (
              <span
                key={star.id}
                className="card-star"
                style={{
                  '--tx': `${star.tx}px`,
                  '--ty': `${star.ty}px`,
                  '--size': `${star.size}rem`,
                  '--duration': `${star.duration}s`,
                  '--delay': `${star.delay}s`,
                  '--color': star.color,
                }}
                onAnimationEnd={() => removeStar(star.id)}
              >
                {star.char}
              </span>
            )
          ))}
        </div>

      </div>
      </div>
    </div>
  )
}

export default Home
