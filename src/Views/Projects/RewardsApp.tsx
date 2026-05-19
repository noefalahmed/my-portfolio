import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './RewardsApp.module.css'
import Header from '../../components/Header'

const CACHE_BUST = Date.now()

// Box covers positioned over the SVG (percentages of 1239×301 viewBox), left to right
const OBJECTIVE_BOXES = [
  { left: '0.08%',  top: '65.7%', width: '23%',   height: '11.7%' },
  { left: '23.1%',  top: '77.3%', width: '27%',   height: '12%'   },
  { left: '50%',    top: '65%',   width: '17.4%',  height: '12%'   },
  { left: '67.3%',  top: '76.7%', width: '17.4%',  height: '11.7%' },
  { left: '84.6%',  top: '88.3%', width: '15.4%',  height: '11.7%' },
]

const DS_PROCESS_BOXES = [
  { left: '0.08%',  top: '58.2%', width: '14%',   height: '10.4%' },
  { left: '14.04%', top: '68.6%', width: '20.7%',  height: '10.7%' },
  { left: '34.7%',  top: '79.2%', width: '32.6%',  height: '10.4%' },
  { left: '67.3%',  top: '89.6%', width: '32.6%',  height: '10.4%' },
]

const DSProcessSlide = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true) },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <img src={`/esr/ds-process.svg?v=${CACHE_BUST}`} style={{ width: '100%', height: 'auto', display: 'block', background: 'transparent', border: 'none' }} />
      {DS_PROCESS_BOXES.map((box, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            background: '#000309',
            transformOrigin: 'right',
            transform: revealed ? 'scaleX(0)' : 'scaleX(1)',
            transition: `transform 0.5s cubic-bezier(0.4,0,0.2,1) ${revealed ? 0.3 + i * 0.15 : 0}s`,
          }}
        />
      ))}
    </div>
  )
}

const ObjectivesSlide = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true) },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: '100%', alignItems: 'flex-start', marginTop: -48 }}>
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <img src={`/esr/objectives.svg?v=${CACHE_BUST}`} style={{ width: '100%', height: 'auto', display: 'block', background: 'transparent', border: 'none' }} />
      {OBJECTIVE_BOXES.map((box, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            background: '#000309',
            transformOrigin: 'right',
            transform: revealed ? 'scaleX(0)' : 'scaleX(1)',
            transition: `transform 0.5s cubic-bezier(0.4,0,0.2,1) ${revealed ? 0.3 + i * 0.15 : 0}s`,
          }}
        />
      ))}
    </div>
      <div style={{ width: '100%' }}>
        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, letterSpacing: 0, margin: 0, marginBottom: 4 }}>Objectives</h2>
        <ol style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0, paddingLeft: 32 }}>
          <li>Creating a design system from the ground up in Figma and React.</li>
          <li>Designing, iterating, and optimizing the visual design for the mobile app.</li>
        </ol>
      </div>
    </div>
  )
}
const PRINCIPLE_CARDS = [
  { label: 'Salience',  src: '/esr/salience.png'  },
  { label: 'Immediacy', src: '/esr/immediacy.png' },
  { label: 'Atomicity', src: '/esr/atomicity.png' },
]

const PrincipleCards = () => {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', marginTop: -20 }}>
      <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>Principles</h2>
    <div style={{ display: 'flex', gap: 16, width: '100%', alignItems: 'center' }}>
      {PRINCIPLE_CARDS.map(({ label, src }, i) => {
        const flexValue = hovered === null ? 1 : hovered === i ? 1.5 : 0.75
        return (
          <div
            key={label}
            style={{ flex: flexValue, display: 'flex', flexDirection: 'column', gap: 12, transition: 'flex 400ms cubic-bezier(0.4,0,0.2,1)', minWidth: 0 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ background: '#111214', border: '1px solid #222428', borderRadius: 12, height: 320, overflow: 'hidden' }}>
              <img src={`${src}?v=${CACHE_BUST}`} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <span style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, letterSpacing: 0 }}>{label}</span>
          </div>
        )
      })}
    </div>
    </div>
  )
}

const BENTO_CELLS_3X3 = [
  { img: '/esr/tokens.png'  }, { img: '/esr/spacing.png'   }, { img: '/esr/spacing-2.png' },
  { img: '/esr/progress.png' }, { img: '/esr/cover.png'     }, { img: '/esr/icon.png'      },
  { img: '/esr/styles.png'  }, { img: '/esr/buttons.png'   }, { img: '/esr/inputs.png' },
]

const BentoGrid2x2 = ({ label, images, fit = 'cover', positions, fits, backgrounds }: { label?: string; images?: (string | null)[]; fit?: 'cover' | 'contain'; positions?: string[]; fits?: string[]; backgrounds?: (string | undefined)[] }) => {
  const [hovered, setHovered] = useState<number | null>(null)

  const hoveredCol = hovered !== null ? hovered % 2 : null
  const hoveredRow = hovered !== null ? Math.floor(hovered / 2) : null

  const cols = hoveredCol === null ? '1fr 1fr'
    : [0, 1].map(c => c === hoveredCol ? '1.6fr' : '0.4fr').join(' ')
  const rows = hoveredRow === null ? '1fr 1fr'
    : [0, 1].map(r => r === hoveredRow ? '1.6fr' : '0.4fr').join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {label && <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.6, alignSelf: 'flex-start' }}>{label}</span>}
    <div style={{
      display: 'grid',
      gridTemplateColumns: cols,
      gridTemplateRows: rows,
      gap: 12,
      width: '68vw',
      height: '68vh',
      transition: 'grid-template-columns 400ms cubic-bezier(0.4,0,0.2,1), grid-template-rows 400ms cubic-bezier(0.4,0,0.2,1)',
    }}>
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            background: backgrounds?.[i] ?? '#0a0a0d',
            border: '1px solid #222428',
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'border-color 0.2s',
            position: 'relative',
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          {images?.[i] && (
            <img
              src={`${images[i]}?v=${CACHE_BUST}`}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: (fits?.[i] ?? fit) as 'cover' | 'contain', objectPosition: positions?.[i] ?? 'center', display: 'block', transform: hovered === i ? 'scale(1.04)' : 'scale(1)', transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)' }}
            />
          )}
        </div>
      ))}
    </div>
    </div>
  )
}

const TokensBentoGrid = () => {
  const [hovered, setHovered] = useState<number | null>(null)

  const hoveredCol = hovered !== null ? hovered % 3 : null
  const hoveredRow = hovered !== null ? Math.floor(hovered / 3) : null

  const cols = hoveredCol === null ? '1fr 1fr 1fr'
    : [0,1,2].map(c => c === hoveredCol ? '2fr' : '0.5fr').join(' ')
  const rows = hoveredRow === null ? '1fr 1fr 1fr'
    : [0,1,2].map(r => r === hoveredRow ? '2fr' : '0.5fr').join(' ')

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 100px)' }}>
      <div style={{ position: 'absolute', top: 0, left: 'calc(50% - 50vw)', width: '100vw', height: '100%', display: 'grid', gridTemplateColumns: cols, gridTemplateRows: rows, gap: 12, padding: 24, boxSizing: 'border-box', transition: 'grid-template-columns 400ms cubic-bezier(0.4,0,0.2,1), grid-template-rows 400ms cubic-bezier(0.4,0,0.2,1)' }}>
        {BENTO_CELLS_3X3.map((cell, i) => (
          <div
            key={i}
            style={{ background: cell.img ? '#fff' : '#111214', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden', position: 'relative' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {cell.img && <img src={`${cell.img}?v=${CACHE_BUST}`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block', transform: hovered === i ? 'scale(1.06)' : 'scale(1)', transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

const LARGE_TEXT = "How do you design an experience that surfaces the right restaurant, at the right moment, for users who had no reliable way to find it before?"

type CharDef = { char: string; color: string }

const QUOTE_CHARS: CharDef[] = [
    ...Array.from('Built in ').map(c => ({ char: c, color: '#d8d8d8' })),
    ...Array.from('Figma').map(c => ({ char: c, color: '#A259FF' })),
    { char: '.', color: '#d8d8d8' },
    ...Array.from(' Shipped in ').map(c => ({ char: c, color: '#d8d8d8' })),
    ...Array.from('React').map(c => ({ char: c, color: '#61DAFB' })),
    { char: '.', color: '#d8d8d8' },
    ...Array.from(' Validated with ').map(c => ({ char: c, color: '#d8d8d8' })),
    ...Array.from('users').map(c => ({ char: c, color: '#F7A531' })),
    { char: '.', color: '#d8d8d8' },
]
// indices of characters after which to pause (the two sentence-ending periods)
const PAUSE_AFTER = new Set([14, 32])

// Offsets from slide center — centroid is exactly (0,0)
const DOT_OFFSETS = [
    { x: -340, y: -140 },
    {  x: 380, y: -120 },
    {  x: 60,  y: 160 },
]

type CardData = {
    dotColor: string
    initials: string
    name: string
    handle: string
    date: string
    text: string
    score: string
    media: { type: 'image' | 'video'; src: string }
}

const CARD_DATA: CardData[] = [
    {
        dotColor: '#c94444',
        initials: 'HD',
        name: 'Haniya Daniyal',
        handle: '@singapori_kitchen',
        date: 'April 20',
        text: 'Tried @singapori_kitchen and it turned out to be a great experience. The chicken chow mein was flavorful, well-seasoned, and cooked perfectly.',
        score: '10/10',
        media: { type: 'image', src: '/esr/review1.png' },
    },
    {
        dotColor: '#5b6af0',
        initials: 'MR',
        name: 'Marcus Reid',
        handle: '@thespicehouse',
        date: 'March 14',
        text: 'Best biryani in the city. The portion sizes are generous and every dish came out exactly as described. Will definitely be back.',
        score: '9/10',
        media: { type: 'video', src: '/esr/review2.mov' },
    },
    {
        dotColor: '#2da87e',
        initials: 'SP',
        name: 'Sara Patel',
        handle: '@lazizdine',
        date: 'Feb 3',
        text: 'Really loved the ambiance and the staff was so friendly. The lamb karahi was rich and perfectly spiced. A hidden gem.',
        score: '8/10',
        media: { type: 'video', src: '/esr/review3.mov' },
    },
]

const ReviewCard = ({ data }: { data: CardData }) => (
    <div style={{ width: '100%', height: '100%' }}>
        {data.media.type === 'image'
            ? <img src={`${data.media.src}?v=${CACHE_BUST}`} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
            : <video src={`${data.media.src}?v=${CACHE_BUST}`} autoPlay muted loop playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
        }
    </div>
)

const FloatingDots = () => {
    const [hovered, setHovered] = useState<number | null>(null)
    const [visible, setVisible] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.4 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
            {DOT_OFFSETS.map((offset, i) => {
                const isHovered = hovered === i
                const card = CARD_DATA[i]
                return (
                    <div
                        key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                            position: 'absolute',
                            left: offset.x,
                            top: offset.y,
                            transform: `translate(-50%, -50%) scale(${visible ? 1 : 0})`,
                            transition: `transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.1 + i * 0.12}s`,
                            zIndex: isHovered ? 10 : 1,
                            cursor: 'pointer',
                        }}
                    >
                        {/* Dot */}
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: '#2a1015',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: '#c94444',
                            }} />
                        </div>
                        {/* Card — fades in on top of the dot */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) translateY(${isHovered ? 0 : 8}px)`,
                            width: 520,
                            opacity: isHovered ? 1 : 0,
                            pointerEvents: isHovered ? 'auto' : 'none',
                            transition: 'opacity 0.22s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1)',
                            borderRadius: 12,
                            overflow: 'hidden',
                        }}>
                            <ReviewCard data={card} />
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}


const HOW_CARDS = [
    { label: 'Video Forward Content', src: '/esr/future-video.png' },
    { label: 'Multi-platform translation', src: '/esr/future-scale.png' },
]

const HowIWouldCards = () => {
    const [hovered, setHovered] = useState<number | null>(null)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
            <div style={{ display: 'flex', gap: 16, width: '100%', alignItems: 'center' }}>
                {HOW_CARDS.map(({ label, src }, i) => {
                    const flexValue = hovered === null ? 1 : hovered === i ? 1.5 : 0.75
                    return (
                        <div
                            key={label}
                            style={{ flex: flexValue, display: 'flex', flexDirection: 'column', gap: 12, transition: 'flex 400ms cubic-bezier(0.4,0,0.2,1)', minWidth: 0 }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div style={{ background: '#111214', border: '1px solid #222428', borderRadius: 12, height: 320, overflow: 'hidden' }}>
                                <img src={`${src}?v=${CACHE_BUST}`} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </div>
                            <span style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, letterSpacing: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const RewardsApp: React.FC = () => {
    const [typedText, setTypedText] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const slideRef = useRef<HTMLDivElement>(null)
    const pageRef = useRef<HTMLDivElement>(null)
    const [diagramVisible, setDiagramVisible] = useState(false)
    const diagramRef = useRef<HTMLDivElement>(null)
    const [quoteVisible, setQuoteVisible] = useState(false)
    const [typedQuote, setTypedQuote] = useState(0)
    const quoteRef = useRef<HTMLDivElement>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [totalSlides, setTotalSlides] = useState(0)

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!pageRef.current) return
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                pageRef.current.scrollBy({ top: window.innerHeight })
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                pageRef.current.scrollBy({ top: -window.innerHeight })
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [])

    useEffect(() => {
        const el = pageRef.current
        if (!el) return
        setTotalSlides(el.children.length)
        const handleScroll = () => {
            setCurrentSlide(Math.round(el.scrollTop / window.innerHeight))
        }
        el.addEventListener('scroll', handleScroll, { passive: true })
        return () => el.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const el = quoteRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setQuoteVisible(true) },
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!quoteVisible || typedQuote >= QUOTE_CHARS.length) return
        const delay = PAUSE_AFTER.has(typedQuote - 1) ? 700 : 38
        const timer = setTimeout(() => setTypedQuote(prev => prev + 1), delay)
        return () => clearTimeout(timer)
    }, [quoteVisible, typedQuote])

    useEffect(() => {
        const el = diagramRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setDiagramVisible(true) },
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const el = slideRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isTyping) {
                    setIsTyping(true)
                    let i = 0
                    const interval = setInterval(() => {
                        i++
                        setTypedText(LARGE_TEXT.slice(0, i))
                        if (i >= LARGE_TEXT.length) clearInterval(interval)
                    }, 30)
                }
            },
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [isTyping])

    return (
        <>
        <div className={styles.page} ref={pageRef}>

            {/* Slide 1: Header */}
            <div className={styles.projectSlide}>
                <Header
                    title="i designed the user experience for a Rewards App."
                    imageSrc={`./assets/proj2.png?v=${CACHE_BUST}`}
                    imageAlt="Description of image"
                    details={[
                        { label: "Company", value: "Eat Sleep Repeat" },
                        { label: "Role", value: "UX Designer" },
                        { label: "Duration", value: "7 Months" },
                        { label: "Skills", value: "Design Systems, UI, Product Design" },
                    ]}/>
            </div>

            {/* Slide 2: Images */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <img data-zoom src={`./assets/main2.png?v=${CACHE_BUST}`} className={`${styles.image} ${styles['image-full']}`} />
                </div>
            </div>

            {/* Slide 3: Floating persona dots */}
            <div className={styles.projectSlide} style={{ overflow: 'visible' }}>
                <FloatingDots />
            </div>

            {/* Slide 4: Large text */}
            <div className={styles.projectSlideTop} ref={slideRef}>
                <div className={styles.contentcontainer}>
                    <div className={styles.largeTextBlock}>
                        <span className={styles.problemTag}>Problem Statement</span>
                        <div className={styles.largeTextWrapper}>
                            <div className={styles.largeTextGhost}>{LARGE_TEXT}</div>
                            <div className={styles.largeTextTyped}>
                                {typedText}<span className={styles.typedCursor} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide 5: Process diagram */}
            <div className={styles.projectSlide} ref={diagramRef} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className={styles.contentcontainer} style={{ gap: 48, alignItems: 'flex-start' }}>
                <svg viewBox="-50 0 1100 600" className={styles.processDiagram} style={{ maxWidth: 'none', width: '120%', marginLeft: '-10%' }} xmlns="http://www.w3.org/2000/svg">
                    {/* Concentric circles — expand one after another from center */}
                    <circle cx="500" cy="300" r="265" fill="rgba(30,16,21,0.9)"
                        className={diagramVisible ? styles.circleAnimate : styles.circleHidden}
                        style={{ animationDelay: '0s' }}/>
                    <circle cx="500" cy="300" r="200" fill="rgba(51,20,25,0.85)"
                        className={diagramVisible ? styles.circleAnimate : styles.circleHidden}
                        style={{ animationDelay: '0.25s' }}/>
                    <circle cx="500" cy="300" r="140" fill="rgba(113,38,41,0.85)"
                        className={diagramVisible ? styles.circleAnimate : styles.circleHidden}
                        style={{ animationDelay: '0.5s' }}/>

                    {/* Everything else fades in after circles */}
                    <g className={diagramVisible ? styles.diagramContent : styles.diagramContentHidden}
                       style={{ animationDelay: '1s' }}>

                    {/* Left input line + arrowhead: outer left edge (235) → inner left edge (360) */}
                    <line x1="235" y1="300" x2="350" y2="300" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
                    <polygon points="0,-4 10,0 0,4" fill="rgba(255,255,255,0.55)" transform="translate(350,300)"/>

                    {/* Right output line + arrowhead: inner right edge (640) → outer right edge (765) */}
                    <line x1="640" y1="300" x2="755" y2="300" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8"/>
                    <polygon points="0,-4 10,0 0,4" fill="rgba(255,255,255,0.55)" transform="translate(755,300)"/>

                    {/* Clockwise ring arrows on R=200 */}
                    {/* Upper-right: θ=315°, rot=45° */}
                    <polygon points="-4.33,-5 4.33,0 -4.33,5" fill="rgba(255,255,255,0.65)"
                        transform="translate(641,159) rotate(45)"/>
                    {/* Lower-left: θ=150°, rot=240° */}
                    <polygon points="-4.33,-5 4.33,0 -4.33,5" fill="rgba(255,255,255,0.65)"
                        transform="translate(327,400) rotate(240)"/>
                    {/* Lower-right: θ=50°, rot=140° */}
                    <polygon points="-4.33,-5 4.33,0 -4.33,5" fill="rgba(255,255,255,0.65)"
                        transform="translate(629,453) rotate(140)"/>

                    {/* Blip: Product Leadership — just inside inner circle edge (r≈130) */}
                    <circle cx="391" cy="229" r="5" fill="#c94444"/>
                    <circle cx="391" cy="229" r="9" fill="none" stroke="#c94444" strokeWidth="1" opacity="0.4"/>
                    <text x="403" y="226" textAnchor="start" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="14">Product</text>
                    <text x="403" y="243" textAnchor="start" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="14">Leadership</text>

                    {/* Blip: Development — just inside inner circle edge (r≈130) */}
                    <circle cx="434" cy="412" r="6" fill="#c94444"/>
                    <circle cx="434" cy="412" r="10" fill="none" stroke="#c94444" strokeWidth="1.5" opacity="0.4"/>
                    <text x="446" y="416" textAnchor="start" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="14">Development</text>

                    {/* Blip: Me */}
                    <circle cx="588" cy="300" r="24" fill="#111"/>
                    <text x="588" y="306" textAnchor="middle" fill="white" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="500">Me</text>

                    {/* Left text — right-aligned ending just before outer circle edge (x=235) */}
                    <text x="215" y="265" textAnchor="end" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="16">Concepts</text>
                    <text x="215" y="300" textAnchor="end" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="16">Needs</text>
                    <text x="215" y="335" textAnchor="end" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="16">Pain Points</text>

                    {/* Right text — left-aligned starting just after outer circle edge (x=765) */}
                    <text x="785" y="265" textAnchor="start" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="16">Mockups</text>
                    <text x="785" y="300" textAnchor="start" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="16">Components</text>
                    <text x="785" y="335" textAnchor="start" fill="#d8d8d8" fontFamily="Inter, sans-serif" fontSize="16">Standards</text>

                    </g>
                </svg>
                <div style={{ width: '100%' }}>
                  <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, letterSpacing: 0, margin: 0, marginBottom: 4 }}>My Role</h2>
                  <p style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>I was the sole visual designer who owned the visual and interaction design end-to-end from the design system to the content experience built on top of it.</p>
                </div>
              </div>
            </div>

            {/* ── THE PROCESS ── */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ width: '100%' }}>
                        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 56, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>The Process</h2>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <ObjectivesSlide />
                </div>
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <PrincipleCards />
                </div>
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 64, width: '100%' }}>
                        <DSProcessSlide />
                        <div>
                            <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0, marginBottom: 4 }}>Design System Timeline</h2>
                            <p style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>The process was quite linear. We started by going from abstract directions to actual components in a month. This process started with us defining the brand's visual language, then defining the tokens, building the components, and producing guidelines for smooth handoff to development.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlide}>
                <TokensBentoGrid />
            </div>

            <div className={styles.projectSlide}>
                <BentoGrid2x2 label="Typography" images={['/esr/type-1.png', '/esr/type-2.png', '/esr/type-3.png', '/esr/type-4.png']}/>
            </div>

            <div className={styles.projectSlide}>
                <BentoGrid2x2 label="Colour" images={['/esr/color1.png', '/esr/color2.png', '/esr/color3.png', '/esr/color4.png']} />
            </div>

            <div className={styles.projectSlide}>
                <BentoGrid2x2 label="Grid System" images={['/esr/grid1.png', '/esr/grid2.png', '/esr/grid3.png', '/esr/grid4.png']} positions={['center', 'top', 'center', 'center']} fits={['contain', 'cover', 'cover', 'cover']} backgrounds={['#fff', undefined, undefined, undefined]} />
            </div>

            <div className={styles.projectSlide}>
                <BentoGrid2x2 label="Iconography" images={['/esr/icon1.png', '/esr/icon2.png', '/esr/icon3.png', '/esr/icon4.png']}/>
            </div>

            <div className={styles.projectSlide}>
                <BentoGrid2x2 label="Components" images={['/esr/comp1.png', '/esr/comp2.png', '/esr/comp3.png', '/esr/comp4.png']} backgrounds={[undefined, undefined, undefined, '#fff']} />
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', gap: 32 }}>
                        <img src={`/esr/feed.png?v=${CACHE_BUST}`} alt="App feed screen" style={{ maxHeight: '72vh', maxWidth: '100%', width: 'auto', display: 'block', marginTop: '-40px' }} />
                        <div style={{ width: '100%' }}>
                            <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>Feed Architecture</h2>
                            <p style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>The feed architecture needed to be optimised for findability, system status, and discovery.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', gap: 32 }}>
                        <img src={`/esr/cards-1.png?v=${CACHE_BUST}`} alt="Restaurant cards" style={{ maxHeight: '72vh', maxWidth: '100%', width: 'auto', display: 'block', flex: 1, objectFit: 'contain' }} />
                        <div style={{ width: '100%' }}>
                            <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>Card Explorations: Offers</h2>
                            <p style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>I designed card variants to assess which ones had the best rhythm, hierarchy, and content relevance.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', gap: 32 }}>
                        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0, width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minWidth: 0 }}>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/rating-cards-1.png?v=${CACHE_BUST}`} alt="Rating card explorations" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/rating-cards-2.png?v=${CACHE_BUST}`} alt="Review card explorations" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                            </div>
                            <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                <img src={`/esr/rating-2.png?v=${CACHE_BUST}`} alt="Average ratings" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                            </div>
                        </div>
                        <div style={{ width: '100%' }}>
                            <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>Card Explorations: Review</h2>
                            <p style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>Reviews had to inform user decisions so I designed ways to surface important information.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
                        <div style={{ display: 'flex', gap: 16, width: '100%', height: '56vh' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minWidth: 0 }}>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/o2.png?v=${CACHE_BUST}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/o3.png?v=${CACHE_BUST}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                            </div>
                            <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                <img src={`/esr/o1.png?v=${CACHE_BUST}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minWidth: 0 }}>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/o4.png?v=${CACHE_BUST}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/o5.png?v=${CACHE_BUST}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/o5.png?v=${CACHE_BUST}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%' }}>
                            <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>Offer Card Exploration</h2>
                            <p style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>Users gave good feedback on seeing the discount amount upfront.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
                        <div style={{ display: 'flex', gap: 16, width: '100%', height: '70vh' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1.5, minWidth: 0 }}>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/stepper-1.png?v=${CACHE_BUST}`} alt="Stepper exploration" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1, background: '#fff', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                    <img src={`/esr/stepper-2.png?v=${CACHE_BUST}`} alt="Stepper exploration 2" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                                </div>
                            </div>
                            <div style={{ flex: 0.75, background: '#111214', border: '1px solid #222428', borderRadius: 12, overflow: 'hidden' }}>
                                <video src={`/esr/screen-recording.mov?v=${CACHE_BUST}`} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </div>
                        </div>
                        <div style={{ width: '100%' }}>
                            <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>Discount Redemption Flow</h2>
                            <p style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400, lineHeight: 1.6, margin: 0 }}>The problem I wanted to solve for was drop-off and abandonment and clarity of system status.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── THE RESULT ── */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ width: '100%' }}>
                        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 56, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>The Result</h2>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, flex: 1, position: 'relative' }}>
                            <span style={{ color: '#4ade80', fontFamily: '"IBM Plex Mono", monospace', fontSize: 22, fontWeight: 400, position: 'absolute', top: 0, right: 0 }}>↓</span>
                            <span style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Production Lifecycle</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                <span style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 48, fontWeight: 500, lineHeight: 1, letterSpacing: '-2px' }}>2</span>
                                <span style={{ color: '#888', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400 }}>weeks</span>
                            </div>
                            <span style={{ color: '#888', fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 400, lineHeight: 1.5 }}>Design system shipped in 2 weeks from zero</span>
                        </div>
                        <div style={{ width: '1px', height: '160px', background: '#222428', alignSelf: 'center', flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, flex: 1, position: 'relative' }}>
                            <span style={{ color: '#4ade80', fontFamily: '"IBM Plex Mono", monospace', fontSize: 22, fontWeight: 400, position: 'absolute', top: 0, right: 0 }}>↓</span>
                            <span style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Time to Value</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                <span style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 48, fontWeight: 500, lineHeight: 1, letterSpacing: '-2px' }}>2</span>
                                <span style={{ color: '#888', fontFamily: '"IBM Plex Mono", monospace', fontSize: 18, fontWeight: 400 }}>min</span>
                            </div>
                            <span style={{ color: '#888', fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 400, lineHeight: 1.5 }}>End-to-end user journey in 2 minutes</span>
                        </div>
                        <div style={{ width: '1px', height: '160px', background: '#222428', alignSelf: 'center', flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                            <span style={{ color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase' }}>One Platform</span>
                            <span style={{ color: '#888', fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 20, fontWeight: 300, lineHeight: 1.5 }}>
                                For <span style={{ color: '#fff' }}>users</span> to discover, <span style={{ color: '#fff' }}>restaurants</span> to build reputation, and a <span style={{ color: '#fff' }}>business</span> to monetize.
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── HOW I WOULD DO THIS TODAY ── */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div style={{ width: '100%' }}>
                        <h2 style={{ color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: 56, fontWeight: 300, margin: 0, lineHeight: 1.1 }}>How I Would Do This Today</h2>
                    </div>
                </div>
            </div>

            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <HowIWouldCards />
                </div>
            </div>

            {/* End slide */}
            <div className={styles.projectSlide}>
                <div style={{ display: 'flex', gap: 16, padding: '0 240px', width: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    <button onClick={() => { const page = document.querySelector('[class*="page"]') as HTMLElement; if (page) page.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ padding: '20px 48px', background: 'transparent', border: '1px solid #333', borderRadius: 999, color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 400, cursor: 'pointer', letterSpacing: '0.04em' }}>
                        ↑  BACK TO TOP
                    </button>
                    <a href="/voiceux" style={{ padding: '20px 48px', background: 'transparent', border: '1px solid #333', borderRadius: 999, color: '#d8d8d8', fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, fontWeight: 400, cursor: 'pointer', letterSpacing: '0.04em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        NEXT CASE  →
                    </a>
                </div>
            </div>

        </div>

        {createPortal(
            <>
                <a href="/slides?s=1" style={{ position: 'fixed', left: 24, top: 24, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 400, color: '#fff', letterSpacing: '0.08em', textDecoration: 'none', zIndex: 9999, pointerEvents: 'auto', textTransform: 'uppercase' }}>
                    ‹ Cases
                </a>
                <div style={{ position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999, pointerEvents: 'none' }}>
                    {Array.from({ length: totalSlides }).map((_, i) => (
                        <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === currentSlide ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', transform: i === currentSlide ? 'scale(1.4)' : 'scale(1)', transition: 'background 0.25s ease, transform 0.25s ease', alignSelf: 'center' }} />
                    ))}
                </div>
                <div style={{ position: 'fixed', right: 24, bottom: 24, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 400, color: '#fff', letterSpacing: '0.08em', zIndex: 9999, pointerEvents: 'none' }}>
                    {String(currentSlide + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
                </div>
            </>,
            document.body
        )}

        </>
    );
  };
  
export default RewardsApp;