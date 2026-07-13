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
  const controlRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(0.35)
  const [showSlider, setShowSlider] = useState(false)

  const track = TRACKS[theme]

  useEffect(() => {
    if (!showSlider) return
    function handleOutsideClick(e) {
      if (controlRef.current && !controlRef.current.contains(e.target)) setShowSlider(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [showSlider])

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
    setShowSlider(true)
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
    <div className="audio-control" ref={controlRef}>
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
        {muted ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3,9 3,15 7,15 12,20 12,4 7,9" />
            <line x1="16" y1="9" x2="22" y2="15" />
            <line x1="22" y1="9" x2="16" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3,9 3,15 7,15 12,20 12,4 7,9" />
            <path d="M16 8a5 5 0 0 1 0 8" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        )}
      </button>
      {showSlider && (
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
      )}
    </div>
  )
}

export default AmbientAudio
