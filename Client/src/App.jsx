import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ThemeDropdown from './Components/ThemeDropdown'
import SparkleBackground from './Components/SparkleBackground'
import RockyRolling from './Components/RockyRolling'
import MelioraRays from './Components/MelioraRays'
import MelioraZeppelins from './Components/MelioraZeppelins'
import MelioraSmoke from './Components/MelioraSmoke'
import LegacyEffects from './Components/LegacyEffects'
import LightCycles from './Components/LightCycles'
import SpaceStars from './Components/SpaceStars'
import ShootingStars from './Components/ShootingStars'
import AmbientAudio from './Components/AmbientAudio'
import RestartButton from './Components/RestartButton'
import CursorFluid from './Components/CursorFluid'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import InfoMode from './Components/InfoMode'
import FunMode from './Components/FunMode'

function App() {
  const [introPhase, setIntroPhase] = useState('audio')

  useEffect(() => {
    if (introPhase === 'audio') {
      const timer = setTimeout(() => setIntroPhase('gap'), 3000)
      return () => clearTimeout(timer)
    }
    if (introPhase === 'gap') {
      const timer = setTimeout(() => setIntroPhase('theme'), 6000)
      return () => clearTimeout(timer)
    }
    if (introPhase === 'theme') {
      const timer = setTimeout(() => setIntroPhase('done'), 6000)
      return () => clearTimeout(timer)
    }
  }, [introPhase])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <SparkleBackground />
        <RockyRolling />
        <MelioraRays />
        <MelioraZeppelins />
        <MelioraSmoke />
        <LightCycles />
        <SpaceStars />
        <ShootingStars />
        <div className="vignette" />
        <LegacyEffects />
        <CursorFluid />
        {introPhase === 'audio' && <div className="intro-blur-overlay" />}
        <div className="ui-controls-left">
          <AmbientAudio showIntro={introPhase === 'audio'} />
          <RestartButton />
        </div>
        <div className="ui-controls">
          <ThemeDropdown />
        </div>
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
