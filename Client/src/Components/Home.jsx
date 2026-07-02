import { useNavigate } from 'react-router-dom'
import { useState, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'

const STAR_CHARS = ['✦', '✧', '✶', '✵', '✴', '★']
const STAR_COLORS = ['var(--gold)', 'var(--gold-bright)', 'var(--cream)', 'var(--gold-dim)']
const HAIL_MARY_STAR_COLORS = ['#ff3b30', '#ff6b52', '#e8281a', '#ff8a75']
const EMBER_COLORS = ['#fff4d6', '#ffb238', '#ff8c1a', '#ff6a1a']

function Home() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isMeliora = theme === 'meliora'
  const isSpace = theme === 'space'
  const isHailMary = theme === 'hail-mary'
  const [stars, setStars] = useState([])
  const intervalRef = useRef(null)
  const idRef = useRef(0)

  const spawnFew = useCallback(() => {
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
  }, [isMeliora, isSpace, isHailMary])

  const removeStar = useCallback((id) => {
    setStars(prev => prev.filter(s => s.id !== id))
  }, [])

  const handleMouseEnter = useCallback(() => {
    spawnFew()
    intervalRef.current = setInterval(spawnFew, 90)
  }, [spawnFew])

  const handleMouseLeave = useCallback(() => {
    clearInterval(intervalRef.current)
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
          className="mode-card fun-card"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate('/fun')}
        >
          <div className="card-content">
            <span className="card-icon">◉</span>
            <h2>Fun Mode</h2>
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
