import { useTheme } from '../context/ThemeContext'

function MelioraSmoke() {
  const { theme } = useTheme()
  if (theme !== 'meliora') return null

  return (
    <div className="meliora-smoke">
      <div className="smoke-puff layer-far smoke-far-1" />
      <div className="smoke-puff layer-far smoke-far-2" />
      <div className="smoke-puff layer-far smoke-far-3" />
      <div className="smoke-puff layer-far smoke-far-4" />
      <div className="smoke-puff layer-mid smoke-mid-1" />
      <div className="smoke-puff layer-mid smoke-mid-2" />
      <div className="smoke-puff layer-mid smoke-mid-3" />
      <div className="smoke-puff layer-mid smoke-mid-4" />
      <div className="smoke-puff layer-near smoke-near-1" />
      <div className="smoke-puff layer-near smoke-near-2" />
      <div className="smoke-puff layer-near smoke-near-3" />
      <div className="smoke-puff layer-near smoke-near-4" />
    </div>
  )
}

export default MelioraSmoke
