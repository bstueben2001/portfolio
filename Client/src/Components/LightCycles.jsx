import { useTheme } from '../context/ThemeContext'
import blueCycleImg from '../assets/tronLightCycle-blue.png'
import orangeCycleImg from '../assets/tronLightCycle-orange.png'

const CYAN   = '#00c8ff'
const ORANGE = '#ff6a00'

const CYCLES = [
  { cls: 'lc-a', color: CYAN,   img: blueCycleImg,   scale: 1.00, bottom: 26 },
  { cls: 'lc-b', color: CYAN,   img: blueCycleImg,   scale: 0.68, bottom: 44 },
  { cls: 'lc-c', color: CYAN,   img: blueCycleImg,   scale: 0.44, bottom: 58 },
  { cls: 'lc-d', color: ORANGE, img: orangeCycleImg, scale: 0.80, bottom: 34, rtl: true },
]

function LightCycle({ cls, color, img, scale, bottom, rtl = false }) {
  const glowStyle = {
    filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 18px ${color}) drop-shadow(0 0 32px ${color}aa)`,
  }

  // Source art faces left (nose left, seat hump right), so LTR cycles need
  // a horizontal flip to face their direction of travel; the RTL cycle doesn't.
  return (
    <div
      className={`lc-wrap ${cls}${rtl ? ' lc-rtl' : ''}`}
      style={{ '--lc-scale': scale, bottom: `${bottom}px` }}
    >
      {/* trail behind the cycle (left for LTR, right for RTL) */}
      {!rtl && <div className="lc-trail lc-trail-cyan" />}

      <div style={!rtl ? { transform: 'scaleX(-1)', ...glowStyle } : glowStyle}>
        <img src={img} alt="" className="lc-img" />
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
