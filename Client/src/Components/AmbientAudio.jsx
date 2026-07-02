import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import spaceAmbience from '../assets/audio/space-ambience.mp3'
import melioraAmbience from '../assets/audio/melioraAmbience.mp3'
import hailMaryAmbience from '../assets/audio/hailMaryAmbiance.mp3'
import legacyAmbience from '../assets/audio/tronLegacyAmbience.mp3'

const TRACKS = {
  space: spaceAmbience,
  meliora: melioraAmbience,
  'hail-mary': hailMaryAmbience,
  legacy: legacyAmbience,
}

function AmbientAudio() {
  const { theme } = useTheme()
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const track = TRACKS[theme]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    audio.volume = 0.35
    audio.load()
    audio.play().catch(() => {})
  }, [track])

  if (!track) return null

  function handleToggle() {
    const audio = audioRef.current
    const next = !muted
    setMuted(next)
    if (audio) {
      audio.muted = next
      if (!next) audio.play().catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src={track} loop muted={muted} />
      <button
        type="button"
        className="audio-toggle"
        onClick={handleToggle}
        aria-label={muted ? 'Unmute ambient music' : 'Mute ambient music'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </>
  )
}

export default AmbientAudio
