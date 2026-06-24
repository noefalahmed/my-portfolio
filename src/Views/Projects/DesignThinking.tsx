import { useEffect, useRef, useState } from 'react'
import styles from './Projects.module.css'
import Header from '../../components/Header'
import Accordion from "../../components/Accordion"
import Footer from '../../components/Footer'

function SequentialVideo({ srcs, className }: { srcs: string[]; className?: string }) {
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const indexRef = useRef(0)
  const activeRef = useRef<'a' | 'b'>('a')
  const switchingRef = useRef(false)

  useEffect(() => {
    const a = aRef.current!
    const b = bRef.current!

    const getActive = () => activeRef.current === 'a' ? a : b
    const getInactive = () => activeRef.current === 'a' ? b : a

    const prepareNext = () => {
      const nextIdx = (indexRef.current + 1) % srcs.length
      const inactive = getInactive()
      inactive.src = srcs[nextIdx]
      inactive.load()
    }

    const swap = () => {
      if (switchingRef.current) return
      switchingRef.current = true
      const inactive = getInactive()
      inactive.currentTime = 1
      inactive.play().then(() => {
        getActive().style.display = 'none'
        getActive().pause()
        inactive.style.display = 'block'
        activeRef.current = activeRef.current === 'a' ? 'b' : 'a'
        indexRef.current = (indexRef.current + 1) % srcs.length
        switchingRef.current = false
        prepareNext()
      })
    }

    const onTimeUpdate = (e: Event) => {
      const video = e.target as HTMLVideoElement
      if (video !== getActive()) return
      if (video.duration && video.currentTime >= video.duration - 1) swap()
    }

    b.style.display = 'none'
    a.src = srcs[0]
    a.load()
    a.addEventListener('loadedmetadata', () => { a.currentTime = 1; a.play() }, { once: true })
    a.addEventListener('timeupdate', onTimeUpdate)
    b.addEventListener('timeupdate', onTimeUpdate)

    b.src = srcs[1 % srcs.length]
    b.load()

    return () => {
      a.removeEventListener('timeupdate', onTimeUpdate)
      b.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [srcs])

  return (
    <>
      <video ref={aRef} muted playsInline className={className} />
      <video ref={bRef} muted playsInline className={className} />
    </>
  )
}

function SegmentVideo({ src, start, end, className }: { src: string; start: number; end: number; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const onLoaded = () => { video.currentTime = start }
    const onTimeUpdate = () => {
      if (end !== Infinity && video.currentTime >= end) video.currentTime = start
    }
    const onEnded = () => {
      video.currentTime = start
      video.play()
    }
    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [start, end])

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      playsInline
      className={className}
    />
  )
}

const BRANCH_ITEMS: [string, string][] = [
  ['How do we structure information', 'around how managers think?'],
  ['How do we create', 'predictable workflows?'],
  ['How do we give users control', 'over complex datasets?'],
  ['How do we make information', 'easier to consume?'],
  ['How do we establish', 'consistency at scale?'],
]

const PILL_RX = 150
const PILL_CY = 170
const BRANCH_END_X = 340
const LABEL_X = 356
const BRANCH_YS = [42, 106, 170, 234, 298]

function BranchDiagram() {
  const ref = useRef<SVGSVGElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true) },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <svg ref={ref} viewBox="10 20 590 300" width="100%" height="380" style={{ overflow: 'visible' }}>
      {/* Pill */}
      <rect x="20" y="153" width="130" height="34" rx="14" ry="14" fill="#2574DB" />
      <text x="85" y="175" textAnchor="middle" fill="white"
        fontFamily="'IBM Plex Mono', monospace" fontSize="13" fontWeight="400">
        Account Data
      </text>

      {/* Horizontal connector */}
      <line x1={PILL_RX} y1={PILL_CY} x2={PILL_RX + 16} y2={PILL_CY} stroke="#2574DB" strokeWidth="4" />

      {BRANCH_ITEMS.map(([line1, line2], i) => (
        <g key={i}>
          <path
            d={`M ${PILL_RX + 16} ${PILL_CY} C ${PILL_RX + 16} ${PILL_CY}, ${PILL_RX + 16} ${BRANCH_YS[i]}, ${BRANCH_END_X} ${BRANCH_YS[i]} L ${LABEL_X - 8} ${BRANCH_YS[i]}`}
            stroke="#2574DB"
            strokeWidth="4"
            fill="none"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={animate ? 0 : 1}
            style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.1,1) 0.3s' }}
          />
          <text
            fill="#D9D9D9"
            fontFamily="'IBM Plex Mono', monospace"
            fontSize="13"
            opacity={animate ? 1 : 0}
            style={{ transition: 'opacity 0.4s ease 1.1s' }}
          >
            <tspan x={LABEL_X} y={BRANCH_YS[i] - 7}>{line1}</tspan>
            <tspan x={LABEL_X} dy="18">{line2}</tspan>
          </text>
        </g>
      ))}
    </svg>
  )
}

const STATIC_TEXT = "When critical information is hard to find, it's often a symptom of poor interface design, or worse, fundamentally disorganised architecture."
const TYPED_TEXT = "Here, it was both."

const RESULT_TEXT = "Over the course of 2 months, I rebuilt the dashboard into a single operational workspace, one where managers could see account relationships clearly, complete tasks quickly, and keep their work inside the platform."

function ResultSlide() {
  const [typed, setTyped] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let i = 0
          const interval = setInterval(() => {
            i++
            setTyped(RESULT_TEXT.slice(0, i))
            if (i >= RESULT_TEXT.length) clearInterval(interval)
          }, 18)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={styles.projectSlide}>
      <div className={styles.contentcontainer}>
        <div className={styles.largetext}>
          <span className={styles.typedSuffix}>{typed}</span>
          <span style={{ opacity: 0 }}>{RESULT_TEXT.slice(typed.length)}</span>
        </div>
      </div>
    </div>
  )
}

function BentoShowcase() {
  const [hovered, setHovered] = useState<string | null>(null)

  const cols = hovered === 'main'    ? '2fr 2fr 0.6fr 0.6fr'
             : hovered === 'stat'    ? '0.7fr 0.7fr 2fr 0.7fr'
             : hovered === 'expl7'   ? '0.7fr 0.7fr 0.7fr 2fr'
             : hovered === 'cimpl7'  ? '0.7fr 0.7fr 2fr 0.7fr'
             : hovered === 'newacct' ? '2fr 2fr 0.6fr 0.6fr'
             : hovered === 'costs'   ? '0.6fr 0.6fr 1fr 2fr'
             : '1fr 1fr 1fr 1fr'

  const rows = hovered === 'main'    ? '2fr 2fr 0.5fr'
             : hovered === 'stat'    ? '2fr 1fr 0.6fr'
             : hovered === 'expl7'   ? '2fr 1fr 0.6fr'
             : hovered === 'cimpl7'  ? '1fr 2fr 0.6fr'
             : hovered === 'newacct' ? '0.6fr 0.6fr 2fr'
             : hovered === 'costs'   ? '0.6fr 0.6fr 2fr'
             : '1.5fr 1.5fr 1fr'

  const cell = (key: string): React.CSSProperties => ({
    background: '#F1F3F3',
    borderRadius: 8,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease',
    opacity: hovered && hovered !== key ? 0.88 : 1,
  })

  return (
    <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: cols, gridTemplateRows: rows, gap: 8, transition: 'grid-template-columns 0.25s ease, grid-template-rows 0.25s ease' }}
      onMouseLeave={() => setHovered(null)}
    >
      <div style={{ ...cell('main'), gridColumn: '1 / 3', gridRow: '1 / 3' }} onMouseEnter={() => setHovered('main')}>
        <video src="./assets/Exploration5.mov" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'left center', display: 'block' }} />
      </div>
      <div style={{ ...cell('stat'), gridColumn: '3', gridRow: '1' }} onMouseEnter={() => setHovered('stat')}>
        <img src="./assets/stat-cards-states.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
      </div>
      <div style={{ ...cell('expl7'), gridColumn: '4', gridRow: '1 / 3' }} onMouseEnter={() => setHovered('expl7')}>
        <video src="./assets/Exploration7.mov" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', display: 'block' }} />
      </div>
      <div style={{ ...cell('cimpl7'), gridColumn: '3', gridRow: '2' }} onMouseEnter={() => setHovered('cimpl7')}>
        <img src="./assets/cimple-7.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
      </div>
      <div style={{ ...cell('newacct'), gridColumn: '1 / 3', gridRow: '3' }} onMouseEnter={() => setHovered('newacct')}>
        <img src="./assets/new-account-flow.png" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
      </div>
      <div style={{ ...cell('costs'), gridColumn: '3 / 5', gridRow: '3', position: 'relative' }} onMouseEnter={() => setHovered('costs')}>
        <img src="./assets/cimple-18.png" style={{ position: 'absolute', width: '100%', top: '-45%', display: 'block' }} />
      </div>
    </div>
  )
}

function TypedSlide() {
  const [typed, setTyped] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let i = 0
          const interval = setInterval(() => {
            i++
            setTyped(TYPED_TEXT.slice(0, i))
            if (i >= TYPED_TEXT.length) clearInterval(interval)
          }, 55)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={styles.projectSlide}>
      <div className={styles.contentcontainer}>
        <div className={styles.largetext}>
          {STATIC_TEXT}
          <br /><br />
          <span className={styles.typedSuffix}>{typed}</span>
          <span style={{ opacity: 0 }}>{TYPED_TEXT.slice(typed.length)}</span>
        </div>
      </div>
    </div>
  )
}

const accordionItems = [
  {
    title: "The Process",
    content: (
      <>
        <div className={styles.subsection}>
            {/* <img data-zoom src="./assets/cimple-2.png" className={`${styles.image} ${styles['image-dynamic']} `} /> */}
          <h1 className={styles.sh1}>How do we make information easier to consume?</h1>
            <h2 className={styles.sh2}>Data Table Redesign</h2>
            <p className={styles.p1}>Dense screens with layered data only work when there's a clear hierarchy and rythm to them. In this case, the table was the highest-stakes surface. So, I focused on table data size and hierarchy, exploring visual weight, distinction, and row density, to find the right balance between fitting more data on screen and keeping rows readable.</p>
            <div style={{ width: '100%', background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden', padding: 80, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 48, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src="./assets/columns-exploration.png" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src="./assets/tags-exploration.png" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', left: -40, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, color: '#252B31', fontFamily: "'Open Sans', sans-serif" }}>Before</span>
                  <span style={{ fontSize: 12, color: '#252B31', fontFamily: "'Open Sans', sans-serif" }}>After</span>
                </div>
                <img src="./assets/table-rows-exploration.png" style={{ width: '170%', height: 'auto', display: 'block', paddingLeft: 284 }} />
              </div>
            </div>
            <p className={styles.p1}>Some more explorations...</p>
            <div style={{ width: '100%', background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden', padding: 80, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 48 }}>
              <img src="./assets/table-larger-row-exploration.png" style={{ width: '180%', height: 'auto', display: 'block', paddingLeft: 0 }} />
              <img src="./assets/table-compact-exploration.png" style={{ width: '180%', height: 'auto', display: 'block', paddingLeft: 0 }} />
            </div>
            <p className={styles.p1}>I standardized minimum and maximum column widths to make column stretching possible based on viewport size. This ensured the least amount of data would be truncated at regular width.</p>
            <div style={{ width: '100%', background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden', padding: 80, paddingLeft: 320, boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }}>
              <img src="./assets/specs-exploration.png" style={{ width: '180%', height: 'auto', display: 'block' }} />
            </div>
            <h2 className={styles.sh2}>Info at-a-glance</h2>
            <p className={styles.p1}>The most frequently used path to getting to an account was through it's status. It was also the most critical path once a manager needed to change an account's status. That's when I decided to make account statuses viewable at a glance. For this, i explored three directions..</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className={styles.p1}>Dropdowns</p>
              <div style={{ width: '100%', background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden' }}>
                <img src="./assets/dropdown-exploration.png" style={{ width: '160%', height: 'auto', display: 'block', paddingLeft: 80, paddingTop: 40 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className={styles.p1}>Chips</p>
              <div style={{ width: '100%', background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden' }}>
                <img src="./assets/chips-exploration.png" style={{ width: '160%', height: 'auto', display: 'block', paddingLeft: 80, paddingTop: 40 }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className={styles.p1}>Cards</p>
              <div style={{ width: '100%', background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden' }}>
                <img src="./assets/stat-cards-exploration.png" style={{ width: '160%', height: 'auto', display: 'block', paddingLeft: 80, paddingTop: 40 }} />
              </div>
            </div>
            <p className={styles.p1}>Cards caught the most attention during A/B testing and users reported being able to locate status through color, represented in both the cards and tags.</p>

          <h1 className={styles.sh1} style={{ marginTop: 64 }}>How do we structure information around how managers think?</h1>
          <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Creating the Taxonomy</h2>
                                <p className={styles.p1}>Conducting interviews with Account Managers, we found that the existing account relationships were flat and needed parent-child relations to match users&apos; mental model.</p>
                              <img data-zoom src="./assets/cimple-3.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Adding Missing Data Points</h2>
                                <p className={styles.p1}>With insights from the product owner and software development, I identified the key information that lived outside of Cimpl. By centralizing it,  we would simplify workflows and give account managers everything they needed in one place.</p>
                                 <img data-zoom src="./assets/cimple-4.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Updating the Sitemap</h2>
                                <p className={styles.p1}>Redefining the parent-child structure and adding new data meant that I needed to rethink the entire architecture. We designed a new framework to reflect how the system actually worked by building out more intuitive tabs and sections.</p>
                                <img data-zoom src="./assets/cimple-5.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                                <img data-zoom src="./assets/tabs.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Explorations</h2>
                                <p className={styles.p1}>Related Accounts Tab</p>
                                <SegmentVideo src="./assets/Exploration2.mov" start={2} end={Infinity} className={`${styles.image} ${styles['image-large']}`} />
                                <p className={styles.p1}>Multi-level Table</p>
                                <SegmentVideo src="./assets/Exploration1.mov" start={12} end={25} className={`${styles.image} ${styles['image-large']}`} />
                                <p className={styles.p1}>A multi-level table kept relationships inline but became visually ambiguous at scale e.g. if accounts had 3 levels or more. A Related Accounts tab was better for scalability and provided more space to navigate account relationships.</p>
                            </div>
            </div>

            <h1 className={styles.sh1} style={{ marginTop: 64 }}>How do we make workflows fast and predictable?</h1>
            <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                {/* <img data-zoom src="./assets/cimple-6.png" className={`${styles.image} ${styles['image-dynamic']}`} /> */}
                                <img data-zoom src="./assets/cimple-7.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                                <p className={styles.p1}>By introducing a "Focus Mode" in the shape of a centered layout with consistent vertical rythm, I was able to meet users in their day to day data finding and updating.</p>
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Explorations</h2>
                                <p className={styles.p1}>I explored two navigation models for moving through these workflows.</p>
                                <p className={styles.p1}>Accordions</p>
                                <video src="./assets/Exploration3.mov" autoPlay loop muted playsInline className={`${styles.image} ${styles['image-large']}`} />
                                <p className={styles.p1} style={{ marginTop: 16 }}>Contextual Navigation</p>
                                <video src="./assets/Exploration4.mov" autoPlay loop muted playsInline className={`${styles.image} ${styles['image-large']}`} />
                                <p className={styles.p1}>Both tested well. Users said the centered layout kept them focused and the new hierarchy made information easier to understand. I went with contextual nav to stay consistent with other parts of the platform that needed the same pattern.</p>
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Creating New Accounts</h2>
                                <p className={styles.p1}>Account creation and account update shared the same centered layout and component set, keeping the experience consistent regardless of where a manager was in their work.</p>
                                <img data-zoom src="./assets/new-account-flow.png" className={`${styles.image} ${styles['image-large']}`} />
                            </div>
            </div>

            <h1 className={styles.sh1} style={{ marginTop: 64 }}>How do we give users control over complex datasets?</h1>
            <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <img data-zoom src="./assets/cimple-11.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                                <p className={styles.p1}>Account managers work with dense, multi-layered data. Control meant giving them ways to shape what they saw without leaving the screen.</p>
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Quick Filters</h2>
                                <p className={styles.p1}>Based on the previously validated at-a-glance stat cards, I intorudced quick filters by making the cards interactive. The tags in the table served as visual affordances to know which set of accounts the user is viewing.</p>
                                <div style={{ width: '100%', background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden', padding: 40, boxSizing: 'border-box' }}>
                                  <img src="./assets/stat-cards-states.png" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <video src="./assets/Exploration5.mov" autoPlay loop muted playsInline className={`${styles.image} ${styles['image-large']}`} />
                                <h2 className={styles.sh2} style={{ marginTop: 16 }}>Column Visibility</h2>
                                <p className={styles.p1}>Column visibility let managers reduce or expand the data in view as some managers requested the ability to hide underused column cells.</p>
                                <video src="./assets/Exploration6.mov" autoPlay loop muted playsInline className={`${styles.image} ${styles['image-large']}`} />
                                <h2 className={styles.sh2} style={{ marginTop: 16 }}>Filters Sidebar</h2>
                                <p className={styles.p1}>The filters for this table previously sat within an accordion/tab that could be expanded, shifting the contents of the page down when used. This was not only annoying for smaller screens, but also was a missed opportunity to create a home for filters for all such tables.</p>
                                <p className={styles.p1}>So, I created a filters sidebar with the ability to add complex filtering conditions.</p>
                                <video src="./assets/Exploration7.mov" autoPlay loop muted playsInline className={`${styles.image} ${styles['image-large']}`} />
                                {/* <p className={styles.p1}>We introduced smart filters and progressive disclosure, allowing users to reveal relevant information while hiding the rest.</p> */}
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Search with Highlights..</h2>
                                <p className={styles.p1}>Search is available across the main table, any modal containing a table, and activity logs, with highlights on matched queries so managers never lose their place.</p>
                                <SequentialVideo srcs={['./assets/Exploration8.mov', './assets/Exploration9.mov', './assets/Exploration10.mov']} className={`${styles.image} ${styles['image-large']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Subaccounts Toggle</h2>
                                <p className={styles.p1}>A show subaccounts toggle surfaced child account data inline, increasing density only when needed.</p>
                                <video src="./assets/subaccounts-toggle.mov" autoPlay loop muted playsInline className={`${styles.image} ${styles['image-large']}`} />
                            </div>
            </div>

            <div className={styles.sub1section}>
                            {/* <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>How do we show account relationships?</h2>
                                <p className={styles.p1}>We designed multi-level tables that let users see relationships clearly and drill down into details without losing context.</p>
                                 <img data-zoom src="./assets/cimple-8.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>How do we communicate progress?</h2>
                                <p className={styles.p1}>We added a step-by-step progress indicator that guided users through account creation, showing exactly where they were and what came next.</p>
                                <img data-zoom src="./assets/cimple-9.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>How do we make content findable?</h2>
                                <p className={styles.p1}>We matched section names to users' mental models, making it faster to find what they needed and complete tasks without guesswork.</p>
                                <img data-zoom src="./assets/cimple-10.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> */}
            </div>

            {/* <h1 className={styles.sh1}>Validation</h1>
            <p>We ran internal guerrilla tests and A/B tests with account managers to choose between competing concepts. We corroborated design decisions based on users&apos; simple majority.
            </p>
            <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>A/B Testing</h2>
                              <img data-zoom src="./assets/cimple-12.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Usability Testing Sessions</h2>
                                 <img data-zoom src="./assets/cimple-13.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>

            </div> */}

            <h1 className={styles.sh1} style={{ marginTop: 64 }}>How do we establish consistency at scale?</h1>
            <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <p className={styles.p1}>Cimpl sat within Upland&apos;s broader design system, shared across approximately 20 SaaS products. The job was to work within what existed, extend it responsibly at the product level, and contribute back to Upland when what we built had value beyond Cimpl.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>
                                  <div style={{ height: 460, overflow: 'hidden', background: '#F1F3F3', borderRadius: 8 }}>
                                    <img src="./assets/upland-forms.png" style={{ width: '200%', height: 'auto', display: 'block', paddingTop: 40, paddingLeft: 80 }} />
                                  </div>
                                  <div style={{ height: 460, overflow: 'hidden', background: '#F1F3F3', borderRadius: 8 }}>
                                    <img src="./assets/upland-data-tables-copy.png" style={{ width: '200%', height: 'auto', display: 'block', paddingTop: 40, paddingLeft: 80 }} />
                                  </div>
                                  <div style={{ height: 460, overflow: 'hidden', background: '#F1F3F3', borderRadius: 8, gridColumn: '1 / -1' }}>
                                    <img src="./assets/upland-data-tables.png" style={{ width: '150%', height: 'auto', display: 'block', paddingTop: 40, paddingLeft: 80 }} />
                                  </div>
                                  <div style={{ height: 280, overflow: 'hidden', background: '#F1F3F3', borderRadius: 8 }}>
                                    <img src="./assets/upland-paginator.png" style={{ width: '200%', height: 'auto', display: 'block', paddingTop: 40, paddingLeft: 80 }} />
                                  </div>
                                  <div style={{ height: 280, overflow: 'hidden', background: '#F1F3F3', borderRadius: 8 }}>
                                    <img src="./assets/upland-stat-cards.png" style={{ width: '280%', height: 'auto', display: 'block', paddingTop: 40, paddingLeft: 80 }} />
                                  </div>
                                </div>
                                <p className={styles.p1} style={{ margin: '24px 0' }}>This effort proved useful because only a couple months later I found myself on a PSS product with dense financial data that needed similar table behavior. Even though multi-level tables weren't shipped for Cimpl, the exploration and work ensured I started from a strong basis for a completely new product with similar usecases.</p>
                                <div style={{ width: '100%', height: 460, background: '#F1F3F3', border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden' }}>
                                  <img src="./assets/pss-financial-review.png" style={{ width: '140%', height: 'auto', display: 'block' }} />
                                </div>
                            </div>
            </div>
        </div>
      </>
    ),
  },
  {
    title: "The Result",
    content: (
      <>
        <div className={styles.largetext}>
          By the end of this project, I contributed to key customer satisfaction and retention.
        </div>
        <div className={styles.sub1section} style={{ paddingBottom: 80 }}>
          <div className={styles.sub2section}>
            <h2 className={styles.sh2}><span style={{ color: '#22c55e', marginRight: 8 }}>↑</span>Time on task</h2>
            <p className={styles.p1}>Account managers located target accounts in an average of 40 seconds, down from 2 minutes 10 seconds before the redesign.</p>
          </div>
          <div className={styles.sub2section}>
            <h2 className={styles.sh2}><span style={{ color: '#22c55e', marginRight: 8 }}>↓</span>User-reported concerns</h2>
            <p className={styles.p1}>Dropped by 62% in the first month after launch, specifically around navigation and findability.</p>
          </div>
          <div className={styles.sub2section}>
            <h2 className={styles.sh2}><span style={{ color: '#22c55e', marginRight: 8 }}>↑</span>Account creation speed</h2>
            <p className={styles.p1}>Reduced from 14 steps to 8.</p>
          </div>
          <div className={styles.sub2section}>
            <h2 className={styles.sh2}>Design system contribution</h2>
            <p className={styles.p1}><span style={{ color: '#22c55e' }}>6</span> components crossed from Cimpl to the Upland design system, including the contextual sidenav, search with query highlighting, and the centered form layout.</p>
          </div>
          <div className={styles.sub2section}>
            <h2 className={styles.sh2}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <circle cx="9" cy="9" r="8" stroke="#22c55e" strokeWidth="1.5"/>
                <circle cx="6.5" cy="7.5" r="1" fill="#22c55e"/>
                <circle cx="11.5" cy="7.5" r="1" fill="#22c55e"/>
                <path d="M6 11c.8 1.2 2 1.8 3 1.8s2.2-.6 3-1.8" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              User feedback
            </h2>
            <p className={styles.p1}>In usability sessions, managers consistently described the new dashboard as focused and easier to read. The hierarchy finally matched how they thought about accounts.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    title: "The Bigger Picture",
    content: (
      <>
      <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <p className={styles.p1}>Every change in this redesign served one of two systems. The execution system, where managers create accounts, configure relationships, and complete workflows. The consumption system, where they read data, compare records, and make decisions.</p>
                                <p className={styles.p1}>The original dashboard treated both as the same flat surface. Separating them, and designing each with the right density, hierarchy, and controls, turned a collection of disconnected tools into an operational workspace.</p>
                                <p className={styles.p1}>But the impact didn&apos;t stop at Cimpl. Upland&apos;s product suite shares the same class of problems: dense dashboards, form-heavy workflows, and data-heavy interfaces built for technical users. The patterns established here fed directly into the Upland design system, and opened a two-way relationship with products like Upland Analytics. We could contribute to it and be informed by it, building toward a cohesive and reliable product brand rather than a suite of tools that happen to share a logo.</p>
                            </div>
        </div>
      
      </>
    )
  }
]

const DesignThinking: React.FC = () => {
  return (
    <div className={styles.page}>

      {/* Slide 1: Header */}
      <div className={styles.projectSlide}>
        <Header
          title="i redesigned a Dashboard for Account Managers"
          imageSrc="./assets/proj3.png"
          imageAlt="Description of image"
          details={[
            { label: "Company", value: "Upland Software" },
            { label: "Role", value: "Product Designer II" },
            { label: "Skills", value: "Workflows, Information Architecture, Data Table Design, User Validation" },
          ]}
        />
      </div>

      {/* Slide 2: Video */}
      <div className={styles.projectSlide}>
        <div className={styles.contentcontainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 48px' }}>
          <div style={{ width: '100%', maxWidth: 1400, borderRadius: 10, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            {/* Browser chrome */}
            <div style={{ background: '#2C2C2E', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
              </div>
              <div style={{ flex: 1, background: '#3A3A3C', borderRadius: 6, height: 24, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                <span style={{ fontSize: 12, color: '#A0A0A0', fontFamily: 'system-ui, sans-serif' }}>app.cimpl.com/accounts</span>
              </div>
            </div>
            {/* Video */}
            <video
              src="./assets/cimpl-demo.mov"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', display: 'block', maxHeight: '85vh', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Slide 2b: Bento showcase */}
      <div className={styles.projectSlide}>
        <div style={{ width: '100%', height: '100%', padding: 48, boxSizing: 'border-box' }}>
          <BentoShowcase />
        </div>
      </div>

      {/* Slide 3: Typed text */}
      <TypedSlide />

      {/* Slide 4: Split — text + diagram */}
      <div className={styles.projectSlide} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.contentcontainer}>
          <div className={styles.splitSlide}>
            <div className={styles.splitLeft}>
              <p className={styles.p1}>
                Talking to account managers, it was clear that critical information was hard to find, making the experience tedious and time-consuming.
              </p>
              <p className={styles.p1}>
                That wasn't enough. Asking why behind every answer, the root became clear: the structure was flat where the work was hierarchical. Critical data got buried or left the platform entirely.
              </p>
              <p className={styles.p1}>
                So, I dug deeper, and started working on the 5 problems I found with accounts:
              </p>
            </div>
            <div className={styles.splitRight}>
              <BranchDiagram />
            </div>
          </div>
        </div>
      </div>

      {/* Slide 4b: Result text */}
      <ResultSlide />

      {/* Slide 4: Accordion */}
      <div className={styles.projectSlideAccordion}>
        <div className={styles.contentcontainer}>
          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* Slide 5: Footer */}
      <div className={styles.projectSlide}>
        <Footer />
      </div>

    </div>
  )
}

export default DesignThinking
