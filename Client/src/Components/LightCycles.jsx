import { useTheme } from '../context/ThemeContext'
import blueCycleImg from '../assets/tronLightCycle-blue.png'
import orangeCycleImg from '../assets/tronLightCycle-orange.png'

const CYAN   = '#00c8ff'
const ORANGE = '#ff6a00'

const CYCLES = [
  { cls: 'lc-a', color: CYAN,   img: blueCycleImg,   scale: 1.80, bottom: -28 },
  { cls: 'lc-b', color: CYAN,   img: blueCycleImg,   scale: 1.20, bottom: -22 },
  { cls: 'lc-c', color: CYAN,   img: blueCycleImg,   scale: 0.75, bottom: -16 },
  { cls: 'lc-d', color: ORANGE, img: orangeCycleImg, scale: 1.45, bottom: -26, rtl: true },
]

function LightCycle({ cls, color, img, scale, bottom, rtl = false }) {
  const glowStyle = {
    filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 18px ${color}) drop-shadow(0 0 32px ${color}aa)`,
  }

  // The trail is positioned absolutely (not a flex sibling) so its 100vw
  // width doesn't push the cycle's own on-screen position around — only
  // the .lc-cycle box gets translated by the entrance/exit animation.
  return (
    <div
      className={`lc-wrap ${cls}${rtl ? ' lc-rtl' : ''}`}
      style={{ '--lc-scale': scale, bottom: `${bottom}px` }}
    >
      <div className={`lc-trail ${rtl ? 'lc-trail-orange' : 'lc-trail-cyan'}`} />

      <div className="lc-cycle" style={rtl ? { transform: 'scaleX(-1)', ...glowStyle } : glowStyle}>
        <img src={img} alt="" className="lc-img" />
      </div>
    </div>
  )
}

function LightCycles() {
  const { theme } = useTheme()
  if (theme !== 'legacy') return null
  return <>{CYCLES.map(c => <LightCycle key={c.cls} {...c} />)}</>
}

export default LightCycles
