import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ThemeDropdown from './Components/ThemeDropdown'
import SparkleBackground from './Components/SparkleBackground'
import RockyRolling from './Components/RockyRolling'
import MelioraRays from './Components/MelioraRays'
import MelioraZeppelins from './Components/MelioraZeppelins'
import LegacyEffects from './Components/LegacyEffects'
import LightCycles from './Components/LightCycles'
import SpaceStars from './Components/SpaceStars'
import ShootingStars from './Components/ShootingStars'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import InfoMode from './Components/InfoMode'
import FunMode from './Components/FunMode'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SparkleBackground />
        <RockyRolling />
        <MelioraRays />
        <MelioraZeppelins />
        <LightCycles />
        <SpaceStars />
        <ShootingStars />
        <div className="vignette" />
        <LegacyEffects />
        <ThemeDropdown />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/info"
              element={
                <>
                  <Navbar />
                  <InfoMode />
                </>
              }
            />
            <Route
              path="/fun"
              element={
                <>
                  <Navbar />
                  <FunMode />
                </>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
