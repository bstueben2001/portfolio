import { useEffect, useState } from 'react'
import council from '../assets/council.JPG'
import battleAdvisor from '../assets/battleAdvisor.JPG'
import diplomacy from '../assets/diplomacy.JPG'
import calendar from '../assets/calendar.JPG'

const SLIDES = [
  {
    text: 'Stalwart is a life-management tool currently in it\'s alpha stage of development. You can access a council of "advisors" to help track certain aspects of life:',
    image: council,
  },
  {
    text: 'Some of the highlights include gamifying to-do lists and projects:',
    image: battleAdvisor,
  },
  {
    text: 'Keeping visibility on the social connections:',
    image: diplomacy,
  },
  {
    text: 'And maintaining a calendar overview of all events:',
    image: calendar,
  },
]

const STALWART_HREF = 'https://stalwart-v1-0.onrender.com/'

function StalwartWalkthrough({ label }) {
  const [open, setOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState(null)

  function close() {
    setOpen(false)
    setZoomedImage(null)
  }

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key !== 'Escape') return
      if (zoomedImage) setZoomedImage(null)
      else close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, zoomedImage])

  return (
    <>
      <a href="#" onClick={(e) => { e.preventDefault(); setOpen(true) }}>
        {label}
      </a>
      {open && (
        <div className="walkthrough-overlay" onClick={close}>
          <div className="walkthrough-panel" onClick={(e) => e.stopPropagation()}>
            <button className="walkthrough-close" onClick={close} aria-label="Close">×</button>
            {SLIDES.map((slide, i) => (
              <div className="walkthrough-slide" key={i}>
                <p>{slide.text}</p>
                <img
                  src={slide.image}
                  alt={`Stalwart walkthrough step ${i + 1}`}
                  onClick={() => setZoomedImage(slide.image)}
                />
              </div>
            ))}
            <p className="walkthrough-cta">
              Want to give it a try?{' '}
              <a href={STALWART_HREF} target="_blank" rel="noopener noreferrer">
                Click here!
              </a>
            </p>
          </div>
        </div>
      )}
      {zoomedImage && (
        <div className="walkthrough-zoom-overlay" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Stalwart walkthrough enlarged" />
        </div>
      )}
    </>
  )
}

export default StalwartWalkthrough
