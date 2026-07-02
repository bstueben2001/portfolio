import { useTheme } from '../context/ThemeContext'

const CYAN   = '#00c8ff'
const ORANGE = '#ff6a00'

const CYCLES = [
  { cls: 'lc-a', color: CYAN,   scale: 1.00, bottom: 26 },
  { cls: 'lc-b', color: CYAN,   scale: 0.68, bottom: 44 },
  { cls: 'lc-c', color: CYAN,   scale: 0.44, bottom: 58 },
  { cls: 'lc-d', color: ORANGE, scale: 0.80, bottom: 34, rtl: true },
]

/* TRON light cycle — side view silhouette
   ViewBox: -42 -60 134 65  (ground at y=0, cycle faces right)
   Rear wheel: cx=0  cy=-22 r=22
   Front wheel: cx=68 cy=-18 r=18                                */
function CycleShape({ color }) {
  return (
    <svg
      className="lc-svg"
      viewBox="-42 -60 134 65"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Rear wheel ── */}
      <circle cx="0"  cy="-22" r="22" fill="black" stroke={color} strokeWidth="3"   />
      <circle cx="0"  cy="-22" r="9"  fill="none"  stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="0"  cy="-22" r="3.5" fill={color} />

      {/* ── Front wheel ── */}
      <circle cx="68" cy="-18" r="18" fill="black" stroke={color} strokeWidth="2.5" />
      <circle cx="68" cy="-18" r="7"  fill="none"  stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="68" cy="-18" r="3"  fill={color} />

      {/* ── Main body / fairing ──
           Clockwise from top-rear fin:
           (6,-47) → rear axle area → chassis rear → chassis front
           → front axle → front upper fork → cockpit peak           */}
      <polygon
        points="6,-47 -1,-22 -6,-3 65,-3 68,-18 61,-31 33,-52"
        fill="black"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* ── Cockpit / canopy ── */}
      <polygon
        points="14,-32 29,-49 52,-37 37,-25"
        fill={color}
        opacity="0.09"
      />
      <polygon
        points="14,-32 29,-49 52,-37 37,-25"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.45"
      />

      {/* ── Ground reflection ── */}
      <ellipse cx="34" cy="2" rx="42" ry="2.5" fill={color} opacity="0.1" />
    </svg>
  )
}

function LightCycle({ cls, color, scale, bottom, rtl = false }) {
  const glowStyle = {
    filter: `drop-shadow(0 0 3px ${color}) drop-shadow(0 0 12px ${color}99)`,
  }

  return (
    <div
      className={`lc-wrap ${cls}${rtl ? ' lc-rtl' : ''}`}
      style={{ '--lc-scale': scale, bottom: `${bottom}px` }}
    >
      {/* trail behind the cycle (left for LTR, right for RTL) */}
      {!rtl && <div className="lc-trail lc-trail-cyan" />}

      <div style={rtl ? { transform: 'scaleX(-1)', ...glowStyle } : glowStyle}>
        <CycleShape color={color} />
      </div>

      {rtl && <div className="lc-trail lc-trail-orange" />}
    </div>
  )
}

function LightCycles() {
  const { theme } = useTheme()
  if (theme !== 'legacy') return null
  return <>{CYCLES.map(c => <LightCycle key={c.cls} {...c} />)}</>
}

export default LightCycles
