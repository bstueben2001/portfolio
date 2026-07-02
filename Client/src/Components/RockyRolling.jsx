import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import rockyImg from '../assets/rocky.png'

const DIALOGUE_OPTIONS = [
  'Amaze amaze amaze!',
  'Fist my bump!',
  'Grace Rocky save stars.',
  'Words of encouragement!',
  'Words of GREAT encouragement!',
]

function RockyRolling() {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [dialogue, setDialogue] = useState('')

  if (theme !== 'hail-mary') return null

  function handleMouseEnter() {
    setHovered(true)
    setShaking(true)
    setShowBubble(false)
    setDialogue(DIALOGUE_OPTIONS[Math.floor(Math.random() * DIALOGUE_OPTIONS.length)])
  }

  function handleMouseLeave() {
    setHovered(false)
    setShaking(false)
    setShowBubble(false)
  }

  function handleShakeEnd() {
    setShaking(false)
    if (hovered) setShowBubble(true)
  }

  return (
    <div
      className={`rocky-rolling-wrap${hovered ? ' is-paused' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="rocky-rolling-spin">
        <img
          src={rockyImg}
          alt=""
          className={`rocky-rolling${shaking ? ' rocky-shake' : ''}`}
          onAnimationEnd={handleShakeEnd}
        />
      </div>
      {showBubble && <div className="rocky-speech-bubble">{dialogue}</div>}
    </div>
  )
}

export default RockyRolling
