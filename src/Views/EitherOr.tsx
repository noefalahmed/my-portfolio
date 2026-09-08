import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './EitherOr.module.css'
import AnimatedHeroTitle from '../components/AnimatedHeroTitle'
import RewardsApp, { REWARDS_SLIDE_COUNT, RewardsAppHandle } from './Projects/RewardsApp'
import VoiceUX, { VOICEUX_SLIDE_COUNT, VoiceUXHandle } from './Projects/VoiceUX'

const EITHEROR_SLIDES = 2 // title + background
const CORNELL_SLIDE_START = EITHEROR_SLIDES + REWARDS_SLIDE_COUNT
const MISC_SLIDE_START = CORNELL_SLIDE_START + VOICEUX_SLIDE_COUNT
const MISC_SLIDE_COUNT = 3
const TOTAL_SLIDES = MISC_SLIDE_START + MISC_SLIDE_COUNT

const sectionOf = (s: number): string | null => {
  if (s === 0) return null
  if (s === 1) return 'background'
  if (s >= MISC_SLIDE_START) return 'misc'
  if (s >= CORNELL_SLIDE_START) return 'cornell'
  return 'esr'
}

const NAV_ITEMS = [
  { id: 'background', label: 'Background', slide: 1 },
  { id: 'esr',        label: 'ESR',        slide: EITHEROR_SLIDES },
  { id: 'cornell',    label: 'Cornell',    slide: CORNELL_SLIDE_START },
  { id: 'misc',       label: 'Misc',       slide: MISC_SLIDE_START, section: true },
]

const EitherOr: React.FC = () => {
  const initialSlide = parseInt(new URLSearchParams(window.location.search).get('s') ?? '0') || 0
  const [slide, setSlide] = useState(initialSlide)
  const [navVisible, setNavVisible] = useState(false)

  // Project component refs (for slide previews)
  const rewardsRef = useRef<RewardsAppHandle>(null)
  const voiceuxRef = useRef<VoiceUXHandle>(null)

  // Bg + misc slide refs (for preview)
  const bgSlideRefs = useRef<Array<HTMLDivElement | null>>([])
  const miscSlideRefs = useRef<Array<HTMLDivElement | null>>([])

  // Global dot counter
  const [hoverDot, setHoverDot] = useState<number | null>(null)
  const globalDotRefs = useRef<Array<HTMLDivElement | null>>([])
  const globalPreviewContainerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSlide(s => (s + 1) % TOTAL_SLIDES)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSlide(s => (s - 1 + TOTAL_SLIDES) % TOTAL_SLIDES)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useLayoutEffect(() => {
    const container = globalPreviewContainerRef.current
    if (!container) return
    while (container.firstChild) container.removeChild(container.firstChild)
    if (hoverDot === null) return
    let slideEl: HTMLElement | null = null
    if (hoverDot < EITHEROR_SLIDES) {
      slideEl = bgSlideRefs.current[hoverDot]
    } else if (hoverDot < CORNELL_SLIDE_START) {
      slideEl = rewardsRef.current?.getSlideEl(hoverDot - EITHEROR_SLIDES) ?? null
    } else if (hoverDot < MISC_SLIDE_START) {
      slideEl = voiceuxRef.current?.getSlideEl(hoverDot - CORNELL_SLIDE_START) ?? null
    } else {
      slideEl = miscSlideRefs.current[hoverDot - MISC_SLIDE_START]
    }
    if (!slideEl) return
    const clone = slideEl.cloneNode(true) as HTMLElement
    clone.style.position = 'absolute'; clone.style.inset = '0'
    clone.style.opacity = '1'; clone.style.pointerEvents = 'none'; clone.style.transform = 'none'
    container.appendChild(clone)
  }, [hoverDot])

  const activeSection = sectionOf(slide)

  return (
    <div className={styles.slideshow}>
      {/* <GridOverlay /> */}

      {/* Left edge trigger */}
      <div className={`${styles.navTrigger} ${navVisible ? styles.navTriggerHidden : ''}`} onMouseEnter={() => setNavVisible(true)}>
        <svg width="14" height="14" viewBox="0 0 10 10" fill="none" className={styles.navTriggerIcon}>
          <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.35)" />
          <circle cx="8" cy="2" r="1.5" fill="rgba(255,255,255,0.35)" />
          <circle cx="2" cy="8" r="1.5" fill="rgba(255,255,255,0.35)" />
          <circle cx="8" cy="8" r="1.5" fill="rgba(255,255,255,0.35)" />
        </svg>
      </div>

      {/* Persistent left nav */}
      <nav
        className={`${styles.slideNav} ${navVisible ? styles.slideNavVisible : ''}`}
        onMouseEnter={() => setNavVisible(true)}
        onMouseLeave={() => setNavVisible(false)}
      >
        {NAV_ITEMS.map(item => (
          <span
            key={item.id}
            className={`${styles.slideNavItem} ${item.section ? styles.slideNavSection : ''} ${activeSection === item.id ? styles.slideNavActive : ''}`}
            onClick={() => setSlide(item.slide)}
          >
            {activeSection === item.id && <span className={styles.slideNavDot} />}
            {item.label}
          </span>
        ))}
      </nav>

      {/* Slide 1 — Title */}
      <div ref={el => { bgSlideRefs.current[0] = el }} className={`${styles.slide} ${slide === 0 ? styles.active : styles.hidden}`}>
        <div className={styles.iconRow}>
          <img src="/assets/a.svg" className={styles.cornerIcon} alt="" />
          <img src="/assets/b.svg" className={styles.cornerIcon} alt="" />
          <img src="/assets/e.svg" className={styles.cornerIcon} alt="" />
          <img src="/assets/p.svg" className={styles.cornerIcon} alt="" />
        </div>
        <div className={styles.titleSlide}>
          <AnimatedHeroTitle />
          <div className={styles.titleSub}>
            <p>Product Design</p>
            <p>Human-AI Interaction</p>
            <p>Systems Thinking</p>
          </div>
        </div>
        <span className={styles.navHint}>USE ARROW KEYS TO NAVIGATE</span>
      </div>

      {/* Slide 2 — Background */}
      <div ref={el => { bgSlideRefs.current[1] = el }} className={`${styles.slide} ${slide === 1 ? styles.active : styles.hidden}`}>
        <div className={styles.iconRow}>
          <img src="/assets/a.svg" className={styles.cornerIcon} alt="" />
          <img src="/assets/b.svg" className={styles.cornerIcon} alt="" />
          <img src="/assets/e.svg" className={styles.cornerIcon} alt="" />
          <img src="/assets/p.svg" className={styles.cornerIcon} alt="" />
        </div>
        <span className={styles.breadcrumb}>Background / History</span>
        <div className={styles.workHistory}>
          <div className={styles.workEntry}>
            <span className={styles.workPeriod}>2020</span>
            <div className={styles.workRole}>
              <span className={styles.workCompany}>Eat Sleep Repeat</span>
              <span className={styles.workDots} />
              <span className={styles.workTitle}>Visual Designer</span>
            </div>
          </div>
          <div className={styles.workEntry}>
            <span className={styles.workPeriod}>2021 – 2024</span>
            <div className={styles.workRole}>
              <span className={styles.workCompany}>Upland Software</span>
              <span className={styles.workDots} />
              <span className={styles.workTitle}>Product Designer II</span>
            </div>
          </div>
          <div className={styles.workEntry}>
            <span className={styles.workPeriod}>2025 – Present</span>
            <div className={styles.workRole}>
              <span className={styles.workCompany}>Cornell University</span>
              <span className={styles.workDots} />
              <span className={styles.workTitle}>Lead Product Designer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 3 — Artwork grid extended (commented out) */}
      {false && (
      <div className={`${styles.slide} ${slide === 2 ? styles.active : styles.hidden}`}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 12,
            height: 'min(calc(75vw - 100px), calc(100vh - 128px))',
            width: '100%',
            alignItems: 'stretch',
          }}>
          {/* Left side — 2-col grid matching center cell size */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: 12,
            width: 'calc((min(calc(75vw - 100px), calc(100vh - 128px)) - 36px) / 2 + 12px)',
            height: '100%',
            flexShrink: 0,
          }}>
            <div style={{ gridColumn: '1', gridRow: '1', background: '#111214', overflow: 'hidden' }}>
              <img src="/assets/misc-b.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '2', gridRow: '1 / 3', background: '#111214' }} />
            <div style={{ gridColumn: '1', gridRow: '2 / 4', background: '#111214', overflow: 'hidden' }}>
              <img src="/assets/misc-g.png" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '2', gridRow: '3', background: '#111214' }} />
            <div style={{ gridColumn: '1 / 3', gridRow: '4', background: '#111214', overflow: 'hidden' }}>
              <video src="/assets/misc-h.mp4" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: 12,
            width: 'min(calc(75vw - 100px), calc(100vh - 128px))',
            height: '100%',
            flexShrink: 0,
          }}>
            <div style={{ gridColumn: '1', gridRow: '1 / 3', background: '#111214' }} />
            <div style={{ gridColumn: '2', gridRow: '1', background: '#111214', overflow: 'hidden' }}>
              <img src="/assets/misc-d.png" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '3 / 5', gridRow: '1 / 3', background: '#111214', overflow: 'hidden' }}>
              <img src="/assets/misc-c.png" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '2', gridRow: '2', background: '#111214' }} />
            <div style={{ gridColumn: '1 / 3', gridRow: '3', background: '#111214' }} />
            <div style={{ gridColumn: '3', gridRow: '3', background: '#111214', overflow: 'hidden' }}>
              <img src="/assets/misc-f.png" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '4', gridRow: '3', background: '#111214' }} />
            <div style={{ gridColumn: '1 / 3', gridRow: '4', background: '#111214' }} />
            <div style={{ gridColumn: '3', gridRow: '4', background: '#111214', overflow: 'hidden' }}>
              <video src="/assets/misc-i.mp4" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '4', gridRow: '4', background: '#111214' }} />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: 12,
            width: 'calc((min(calc(75vw - 100px), calc(100vh - 128px)) - 36px) / 2 + 12px)',
            height: '100%',
            flexShrink: 0,
          }}>
            <div style={{ gridColumn: '1 / 3', gridRow: '1', background: '#111214', overflow: 'hidden' }}>
              <img src="/assets/misc-a.png" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '1', gridRow: '2 / 4', background: '#111214', overflow: 'hidden' }}>
              <video src="/assets/misc-e.mov" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.2) translateX(-8%)' }} />
            </div>
            <div style={{ gridColumn: '2', gridRow: '2', background: '#111214' }} />
            <div style={{ gridColumn: '1', gridRow: '4', background: '#111214', overflow: 'hidden' }}>
              <img src="/assets/misc-j.png" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ gridColumn: '2', gridRow: '3 / 5', background: '#111214' }} />
          </div>
          </div>
        </div>
      </div>
      )}

      {/* Slides 4+ — ESR / Rewards App */}
      <div className={`${styles.slide} ${slide >= EITHEROR_SLIDES && slide < CORNELL_SLIDE_START ? styles.active : styles.hidden}`}>
        <RewardsApp ref={rewardsRef} slideIndex={slide - EITHEROR_SLIDES} onNavigate={setSlide} slideStart={EITHEROR_SLIDES} />
      </div>

      {/* Cornell / VoiceUX */}
      <div className={`${styles.slide} ${slide >= CORNELL_SLIDE_START && slide < MISC_SLIDE_START ? styles.active : styles.hidden}`}>
        <VoiceUX ref={voiceuxRef} slideIndex={slide - CORNELL_SLIDE_START} onNavigate={setSlide} slideStart={CORNELL_SLIDE_START} />
      </div>

      {/* Misc */}
      <div ref={el => { miscSlideRefs.current[0] = el }} className={`${styles.slide} ${slide === MISC_SLIDE_START ? styles.active : styles.hidden}`}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: 12,
            width: 'min(calc(75vw - 100px), calc(100vh - 128px))',
            height: 'min(calc(75vw - 100px), calc(100vh - 128px))',
          }}>
            {[
              { col: '1',     row: '1 / 3', label: 'A', image: '/assets/misc-a.png' },
              { col: '2',     row: '1',     label: 'B', image: '/assets/misc-b.jpg' },
              { col: '3 / 5', row: '1 / 3', label: 'C', image: '/assets/misc-c.png' },
              { col: '2',     row: '2',     label: 'D', image: '/assets/misc-d.png' },
              { col: '1 / 3', row: '3',     label: 'E', video: '/assets/misc-e.mov', scale: 1.2, offsetX: -8 },
              { col: '3',     row: '3',     label: 'F', image: '/assets/misc-f.png' },
              { col: '4',     row: '3',     label: 'G', image: '/assets/misc-g.png' },
              { col: '1 / 3', row: '4',     label: 'H', video: '/assets/misc-h.mp4' },
              { col: '3',     row: '4',     label: 'I', video: '/assets/misc-i.mp4' },
              { col: '4',     row: '4',     label: 'J', image: '/assets/misc-j.png' },
            ].map(({ col, row, label, video, image, scale, offsetX }: { col: string; row: string; label: string; video?: string; image?: string; scale?: number; offsetX?: number }) => {
              const transform = [scale && `scale(${scale})`, offsetX && `translateX(${offsetX}%)`].filter(Boolean).join(' ') || undefined
              return (
                <div key={label} style={{ gridColumn: col, gridRow: row, background: '#111214', borderRadius: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {video
                    ? <video src={video} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform }} />
                    : image
                    ? <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform }} />
                    : <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, color: '#444', letterSpacing: '0.05em' }}>{label}</span>
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Ghost Stories slide */}
      <div ref={el => { miscSlideRefs.current[1] = el }} className={`${styles.slide} ${slide === MISC_SLIDE_START + 1 ? styles.active : styles.hidden}`}>
        <div key={slide === MISC_SLIDE_START + 1 ? 'gs-active' : 'gs'} className={styles.ghostStoriesBg} />
        <img
          src="/assets/gs-artwork.png"
          style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 'auto', display: 'block' }}
          alt=""
        />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '0 200px 96px 64px',
          boxSizing: 'border-box',
        }}>
          <h1 style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 68, fontWeight: 200,
            lineHeight: 1.1, letterSpacing: '-0.09em',
            color: '#ffffff', margin: 0,
          }}>Ghost<br />Stories</h1>
          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 20, fontWeight: 300,
            color: '#e8e8e8', margin: '16px 0 0',
            letterSpacing: 0, lineHeight: 1.4,
          }}>artwork inspired by the coldplay album.</p>
        </div>
      </div>

      {/* Ghost Stories grid slide */}
      <div ref={el => { miscSlideRefs.current[2] = el }} className={`${styles.slide} ${slide === MISC_SLIDE_START + 2 ? styles.active : styles.hidden}`}>
        <div className={styles.ghostStoriesBg} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 16,
            width: 'min(calc(100vw - 64px), calc(100vh - 64px))',
            height: 'min(calc(100vw - 64px), calc(100vh - 64px))',
          }}>
            {['gs-3', 'gs-6', 'gs-9', 'gs-8', 'gs-1', 'gs-7', 'gs-2', 'gs-5', 'gs-4'].map(name => (
              <img key={name} src={`/assets/${name}.png`} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} alt="" />
            ))}
          </div>
        </div>
      </div>

      {/* Global slide counter (all sections) */}
      {createPortal(
        <>
          <div style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', zIndex: 9999 }}>
            {/* Bg section */}
            {Array.from({ length: EITHEROR_SLIDES }, (_, i) => (
              <div key={`bg-${i}`} ref={el => { globalDotRefs.current[i] = el }}
                onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); setHoverDot(i) }}
                onMouseLeave={() => { hoverTimeoutRef.current = setTimeout(() => setHoverDot(null), 150) }}
                onClick={() => setSlide(i)}
                style={{ padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: slide === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transform: hoverDot === i ? 'scale(1.8)' : slide === i ? 'scale(1.4)' : 'scale(1)', transition: 'background 0.25s ease, transform 0.25s ease', flexShrink: 0 }} />
              </div>
            ))}
            {/* ESR section */}
            {Array.from({ length: REWARDS_SLIDE_COUNT }, (_, i) => {
              const g = EITHEROR_SLIDES + i
              return (
                <div key={`esr-${i}`} ref={el => { globalDotRefs.current[g] = el }}
                  onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); setHoverDot(g) }}
                  onMouseLeave={() => { hoverTimeoutRef.current = setTimeout(() => setHoverDot(null), 150) }}
                  onClick={() => setSlide(g)}
                  style={{ padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: slide === g ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transform: hoverDot === g ? 'scale(1.8)' : slide === g ? 'scale(1.4)' : 'scale(1)', transition: 'background 0.25s ease, transform 0.25s ease', flexShrink: 0 }} />
                </div>
              )
            })}
            {/* Cornell section */}
            {Array.from({ length: VOICEUX_SLIDE_COUNT }, (_, i) => {
              const g = CORNELL_SLIDE_START + i
              return (
                <div key={`cornell-${i}`} ref={el => { globalDotRefs.current[g] = el }}
                  onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); setHoverDot(g) }}
                  onMouseLeave={() => { hoverTimeoutRef.current = setTimeout(() => setHoverDot(null), 150) }}
                  onClick={() => setSlide(g)}
                  style={{ padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: slide === g ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transform: hoverDot === g ? 'scale(1.8)' : slide === g ? 'scale(1.4)' : 'scale(1)', transition: 'background 0.25s ease, transform 0.25s ease', flexShrink: 0 }} />
                </div>
              )
            })}
            {/* Misc section */}
            {Array.from({ length: MISC_SLIDE_COUNT }, (_, i) => {
              const g = MISC_SLIDE_START + i
              return (
                <div key={`misc-${i}`} ref={el => { globalDotRefs.current[g] = el }}
                  onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); setHoverDot(g) }}
                  onMouseLeave={() => { hoverTimeoutRef.current = setTimeout(() => setHoverDot(null), 150) }}
                  onClick={() => setSlide(g)}
                  style={{ padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: slide === g ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transform: hoverDot === g ? 'scale(1.8)' : slide === g ? 'scale(1.4)' : 'scale(1)', transition: 'background 0.25s ease, transform 0.25s ease', flexShrink: 0 }} />
                </div>
              )
            })}
          </div>
          {hoverDot !== null && (() => {
            const dotEl = globalDotRefs.current[hoverDot]
            const dotRect = dotEl?.getBoundingClientRect()
            const previewW = 240; const previewH = Math.round(240 * window.innerHeight / window.innerWidth)
            const scale = previewW / window.innerWidth
            const centerY = dotRect ? dotRect.top + dotRect.height / 2 : window.innerHeight / 2
            const top = Math.min(Math.max(centerY - previewH / 2, 16), window.innerHeight - previewH - 16)
            return (
              <div onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current) }} onMouseLeave={() => { hoverTimeoutRef.current = setTimeout(() => setHoverDot(null), 150) }} onClick={() => setSlide(hoverDot)}
                style={{ position: 'fixed', right: 48, top, width: previewW, height: previewH, overflow: 'hidden', borderRadius: 8, border: '1px solid #2a2a2a', background: '#0d0d0d', zIndex: 9998, cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ position: 'relative', width: window.innerWidth, height: window.innerHeight, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
                  <div ref={globalPreviewContainerRef} style={{ position: 'absolute', inset: 0 }} />
                </div>
              </div>
            )
          })()}
        </>,
        document.body
      )}

      {/* Global slide counter — bottom right */}
      {createPortal(
        <span style={{ position: 'fixed', bottom: 32, right: 32, fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', zIndex: 9999, pointerEvents: 'none' }}>
          {String(slide + 1).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
        </span>,
        document.body
      )}

      {/* Misc breadcrumb */}
      {slide >= MISC_SLIDE_START && createPortal(
        <span style={{ position: 'fixed', top: 64, left: 64, fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 400, color: '#e8e8e8', letterSpacing: '0.02em', zIndex: 9999, pointerEvents: 'none' }}>
          {slide >= MISC_SLIDE_START + 1 ? 'Misc / Ghost Stories' : 'Misc / Artwork'}
        </span>,
        document.body
      )}

    </div>
  )
}

export default EitherOr
