import { useNavigate } from 'react-router-dom'
import { useState, useRef, useCallback } from 'react'

const STAR_CHARS = ['✦', '✧', '✶', '✵', '✴', '★']
const STAR_COLORS = ['var(--gold)', 'var(--gold-bright)', 'var(--cream)', 'var(--gold-dim)']

function Home() {
  const navigate = useNavigate()
  const [stars, setStars] = useState([])
  const intervalRef = useRef(null)
  const idRef = useRef(0)

  const spawnFew = useCallback(() => {
    const newStars = Array.from({ length: 3 }, () => {
      const angle = Math.random() * 2 * Math.PI
      const distance = 120 + Math.random() * 220
      return {
        id: idRef.current++,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: 0.5 + Math.random() * 0.9,
        duration: 0.55 + Math.random() * 0.45,
        delay: Math.random() * 0.2,
        char: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }
    })
    setStars(prev => [...prev, ...newStars])
  }, [])

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
          ))}
        </div>

      </div>
      </div>
    </div>
  )
}

export default Home
