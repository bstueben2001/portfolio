import { useTheme } from '../context/ThemeContext'

function Zeppelin({ driftClass, flipped = false }) {
  return (
    <g className={driftClass}>
      <g transform={flipped ? 'scale(-1, 1)' : undefined}>
        <ellipse cx="0" cy="0" rx="92" ry="14" fill="black" />
        <ellipse cx="72" cy="0" rx="24" ry="9"  fill="black" />
        <polygon points="-78,0 -92,-24 -64,-8"  fill="black" />
        <polygon points="-78,0 -92,24  -64,8"   fill="black" />
        <polygon points="-78,0 -94,0   -68,-10" fill="black" />
        <rect x="-18" y="13" width="38" height="9" rx="2.5" fill="black" />
      </g>
    </g>
  )
}

function MelioraZeppelins() {
  const { theme } = useTheme()
  if (theme !== 'meliora') return null

  return (
    <svg
      className="meliora-zeppelins"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <Zeppelin driftClass="zep-1" />
      <Zeppelin driftClass="zep-2" />
      <Zeppelin driftClass="zep-3" />
      <Zeppelin driftClass="zep-4" flipped />
      <Zeppelin driftClass="zep-5" flipped />
      <Zeppelin driftClass="zep-6" />
      <Zeppelin driftClass="zep-7" flipped />
    </svg>
  )
}

export default MelioraZeppelins
