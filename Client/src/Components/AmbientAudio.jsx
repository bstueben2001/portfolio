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

// Caps how loud any track can get relative to the slider, so "100%" on
// the slider only ever plays back at half volume.
const MAX_VOLUME = 0.5

function effectiveVolume(rawVolume) {
  return rawVolume * MAX_VOLUME
}

function AmbientAudio({ showIntro = false }) {
  const { theme } = useTheme()
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(0.35)

  const track = TRACKS[theme]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    // Legacy always starts at a lower volume on switching in, rather than
    // carrying over whatever the slider was left at for another theme.
    const nextVolume = theme === 'legacy' ? 0.2 : volume
    setVolume(nextVolume)
    audio.load()
    audio.volume = effectiveVolume(nextVolume)
    audio.play().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function handleVolumeChange(e) {
    const next = Number(e.target.value)
    setVolume(next)
    if (audioRef.current) audioRef.current.volume = effectiveVolume(next)
    if (muted && next > 0) {
      setMuted(false)
      if (audioRef.current) {
        audioRef.current.muted = false
        audioRef.current.play().catch(() => {})
      }
    }
  }

  return (
    <div className="audio-control">
      <audio ref={audioRef} src={track} loop muted={muted} />
      {showIntro && (
        <div className="audio-hint">
          Turn on volume for a more immersive experience!
        </div>
      )}
      <button
        type="button"
        className={`audio-toggle${showIntro ? ' audio-toggle--glow' : ''}`}
        onClick={handleToggle}
        aria-label={muted ? 'Unmute ambient music' : 'Mute ambient music'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <input
        type="range"
        className="audio-volume-slider"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleVolumeChange}
        aria-label="Ambient volume"
      />
    </div>
  )
}

export default AmbientAudio
