import { useCallback, useEffect, useRef, useState } from 'react'
import { INFO_ITEMS } from '../data/infoItems'
import StalwartWalkthrough from './StalwartWalkthrough'

const ARROWS = ['up', 'down', 'left', 'right']
const ARROW_GLYPHS = { up: '▲', down: '▼', left: '◀', right: '▶' }
const KEY_TO_ARROW = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }

const ROUND_LENGTH = 4
const BASE_TIME_PER_ARROW_MS = 4000
const SPEED_STEP = 0.9 // each completed round is 10% faster than the last
const CELEBRATE_MS = 1500

const ENCOURAGEMENTS = [
  'Certified banger!',
  'Heavy!',
  'Absolute anthem!',
  "That's a hit!",
  'Platinum record!',
  'Chart-topper!',
]

const GAME_WIDTH = 640
const GAME_HEIGHT = 440

function shuffled(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function randomRound() {
  return Array.from({ length: ROUND_LENGTH }, () => ARROWS[Math.floor(Math.random() * ARROWS.length)])
}

// round 1 (0 collected so far) gets the full base time; every round
// completed after that shaves another 10% off, compounding
function timeForRound(collectedCount) {
  return BASE_TIME_PER_ARROW_MS * SPEED_STEP ** collectedCount
}

function initialWorld() {
  return {
    phase: 'start', // 'start' | 'playing' | 'celebrating'
    round: randomRound(),
    activeIndex: 0,
    queue: shuffled(INFO_ITEMS.map(item => item.id)),
    collected: [],
    feedback: null, // 'hit' | 'miss' — transient flash
    message: null,
  }
}

function EmberRhythmGame() {
  const [world, setWorld] = useState(initialWorld)
  const worldRef = useRef(world)
  worldRef.current = world
  const feedbackTimeoutRef = useRef(null)

  const won = world.collected.length === INFO_ITEMS.length

  const flashFeedback = useCallback((kind) => {
    setWorld(prev => ({ ...prev, feedback: kind }))
    clearTimeout(feedbackTimeoutRef.current)
    feedbackTimeoutRef.current = setTimeout(() => {
      setWorld(prev => ({ ...prev, feedback: null }))
    }, 300)
  }, [])

  const startGame = useCallback(() => {
    setWorld(prev => ({ ...prev, phase: 'playing' }))
  }, [])

  // failing a round bumps you back down a level: the most recently earned
  // item is un-collected and put back at the front of the queue, so the
  // next successful round re-awards that same item
  const missRound = useCallback(() => {
    setWorld(prev => {
      if (prev.collected.length === 0) {
        return { ...prev, round: randomRound(), activeIndex: 0 }
      }
      const lastItemId = prev.collected[prev.collected.length - 1]
      return {
        ...prev,
        round: randomRound(),
        activeIndex: 0,
        collected: prev.collected.slice(0, -1),
        queue: [lastItemId, ...prev.queue],
      }
    })
    flashFeedback('miss')
  }, [flashFeedback])

  const currentTimeMs = timeForRound(world.collected.length)

  // gives the player currentTimeMs to hit the active arrow — resets
  // whenever a new round starts or the active arrow advances, and pauses
  // entirely during the between-rounds celebration message
  useEffect(() => {
    if (won || world.phase !== 'playing') return undefined
    const timeout = setTimeout(missRound, currentTimeMs)
    return () => clearTimeout(timeout)
  }, [world.round, world.activeIndex, world.phase, won, missRound, currentTimeMs])

  // holds on the encouragement message for a beat, then serves up a new round
  useEffect(() => {
    if (world.phase !== 'celebrating') return undefined
    const timeout = setTimeout(() => {
      if (worldRef.current.collected.length === INFO_ITEMS.length) return
      setWorld(prev => ({ ...prev, phase: 'playing', round: randomRound(), activeIndex: 0, message: null }))
    }, CELEBRATE_MS)
    return () => clearTimeout(timeout)
  }, [world.phase])

  useEffect(() => {
    function handleKeyDown(e) {
      const arrow = KEY_TO_ARROW[e.key]
      if (!arrow) return
      e.preventDefault()

      const current = worldRef.current
      if (current.phase !== 'playing' || current.collected.length === INFO_ITEMS.length) return

      const expected = current.round[current.activeIndex]
      if (arrow !== expected) {
        missRound()
        return
      }

      const nextIndex = current.activeIndex + 1
      if (nextIndex < ROUND_LENGTH) {
        setWorld(prev => ({ ...prev, activeIndex: nextIndex }))
        flashFeedback('hit')
        return
      }

      // completed all four — award the next queued item, then pause on an
      // encouragement message before the next round starts
      const [itemId, ...restQueue] = current.queue
      const collected = itemId ? [...current.collected, itemId] : current.collected
      const message = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
      setWorld(prev => ({
        ...prev,
        phase: 'celebrating',
        message,
        queue: restQueue,
        collected,
      }))
      flashFeedback('hit')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [missRound, flashFeedback])

  const collectedSet = new Set(world.collected)
  const bySection = section => INFO_ITEMS.filter(item => item.section === section && collectedSet.has(item.id))
  const contact = bySection('contact')
  const about = bySection('about')
  const projects = bySection('projects')
  const links = bySection('links')

  return (
    <div className="asteroids-wrap">
      <div className="game-stage" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      <div
        className={`asteroids-game rhythm-game${world.feedback ? ` rhythm-game--${world.feedback}` : ''}`}
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        <div className="asteroids-progress">{world.collected.length} / {INFO_ITEMS.length} found</div>

        {!won && <h2 className="rhythm-title">Create a rockin' album</h2>}

        {!won && world.phase === 'playing' && (
          <>
            <div className="rhythm-hint">Hit the arrow keys before each bar runs out</div>
            <div className="rhythm-strip">
              {world.round.map((dir, i) => (
                <div
                  key={i}
                  className={
                    'rhythm-tile' +
                    (i < world.activeIndex ? ' rhythm-tile--done' : '') +
                    (i === world.activeIndex ? ' rhythm-tile--active' : '')
                  }
                >
                  <span className="rhythm-arrow">{ARROW_GLYPHS[dir]}</span>
                  {i === world.activeIndex && (
                    <div
                      key={`${world.round.join('')}-${world.activeIndex}`}
                      className="rhythm-timer-bar"
                      style={{ animationDuration: `${currentTimeMs}ms` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!won && world.phase === 'celebrating' && (
          <div className="rhythm-message">{world.message}</div>
        )}

        {!won && world.phase === 'start' && (
          <div className="asteroids-win-overlay">
            <h2>Let's make a rockin' album.</h2>
            <p className="rhythm-start-text">Hit all 4 arrows before each bar runs out to earn a track. Miss one and you'll drop a track and slow back down.</p>
            <button type="button" className="rhythm-start-button" onClick={startGame}>Start</button>
          </div>
        )}

        {won && (
          <div className="asteroids-win-overlay">
            <h2>You win!</h2>
            <p>You've collected everything.</p>
          </div>
        )}
      </div>
      </div>

      <aside className="asteroids-inventory content-box">
        <h2>Brendon Stueben</h2>

        {world.collected.length === 0 && (
          <p>Hit four arrows in a row to reveal info…</p>
        )}

        {contact.map(item => <h3 key={item.id}>{item.label}</h3>)}

        {about.length > 0 && <p>{about[0].label}</p>}

        {projects.length > 0 && (
          <>
            <h2>highlight projects</h2>
            {projects.map(item => (
              <h3 key={item.id}>
                {item.id === 'stalwart' ? (
                  <StalwartWalkthrough label={item.label} />
                ) : (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
                )}
              </h3>
            ))}
          </>
        )}

        {links.length > 0 && (
          <>
            <h2>links</h2>
            {links.map(item => (
              <h3 key={item.id}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
              </h3>
            ))}
          </>
        )}
      </aside>
    </div>
  )
}

export default EmberRhythmGame
