import { useTheme } from '../context/ThemeContext'
import rockyImg from '../assets/rocky.png'

function RockyRolling() {
  const { theme } = useTheme()
  if (theme !== 'hail-mary') return null
  return <img src={rockyImg} className="rocky-rolling" alt="" />
}

export default RockyRolling
