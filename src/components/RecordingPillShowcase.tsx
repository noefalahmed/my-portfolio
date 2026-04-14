import { useState, useEffect, useRef } from 'react'
import { Mic } from 'lucide-react'
import styles from './RecordingPillShowcase.module.css'

type AnimType = 'bars' | 'pulse' | 'orbit' | 'ripple' | 'spin'
type PillState = 'default' | 'recording' | 'processing'

const WORDS = [
  'I', 'know,', 'but', 'we', 'needed', 'your', 'branch',
  'merged', 'before', 'the', 'build', 'and', 'we', 'had',
  'to', 'work', 'around', 'it', 'last', 'minute.'
]

const ANIMS: { id: AnimType; label: string; color: string }[] = [
  { id: 'bars',   label: 'Bars',   color: '#4a7fbf' },
  { id: 'pulse',  label: 'Pulse',  color: '#9b59b6' },
  { id: 'orbit',  label: 'Orbit',  color: '#e07b39' },
  { id: 'ripple', label: 'Ripple', color: '#2d9e6b' },
  { id: 'spin',   label: 'Spin',   color: '#b31b1b' },
]

const WORD_MS    = 210
const DEFAULT_MS = 1800
const PROC_MS    = 2800
const FADE_MS    = 280

export default function RecordingPillShowcase() {
  const [selected, setSelected]   = useState<AnimType>('bars')
  const [pillState, setPillState] = useState<PillState>('default')
  const [visible, setVisible]     = useState(true)
  const [words, setWords]         = useState(0)
  const tids = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const push = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms)
      tids.current.push(id)
    }

    const fadeTo = (next: PillState, at: number) => {
      push(() => setVisible(false), at)
      push(() => {
        setPillState(next)
        setWords(0)
        setVisible(true)
      }, at + FADE_MS)
    }

    const loop = () => {
      tids.current.forEach(clearTimeout)
      tids.current = []
      setPillState('default')
      setWords(0)
      setVisible(true)

      // default → recording
      fadeTo('recording', DEFAULT_MS)

      // word reveals (start after recording fades in)
      const wordStart = DEFAULT_MS + FADE_MS
      WORDS.forEach((_, i) => push(() => setWords(i + 1), wordStart + i * WORD_MS))

      // recording → processing
      const t2 = wordStart + WORDS.length * WORD_MS + 500
      fadeTo('processing', t2)

      // processing → default
      const t3 = t2 + FADE_MS + PROC_MS
      fadeTo('default', t3)

      // restart loop
      push(loop, t3 + FADE_MS + 400)
    }

    loop()
    return () => tids.current.forEach(clearTimeout)
  }, [])

  const animColor = ANIMS.find(a => a.id === selected)!.color

  return (
    <div className={styles.root}>
      {/* Animation selector */}
      <div className={styles.grid}>
        {ANIMS.map(a => (
          <button
            key={a.id}
            className={`${styles.card} ${selected === a.id ? styles.cardOn : ''}`}
            style={{ '--c': a.color } as React.CSSProperties}
            onClick={() => setSelected(a.id)}
          >
            <div className={styles.preview}>
              <AnimComp type={a.id} color={a.color} />
            </div>
            <span className={styles.cardLabel} style={{ color: selected === a.id ? a.color : '#999' }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>

      {/* Recording pill */}
      <div
        className={styles.pill}
        style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
      >
        <div className={styles.iconArea}>
          {pillState === 'processing' ? (
            <AnimComp type={selected} color={animColor} inline />
          ) : (
            <Mic
              size={15}
              color={pillState === 'default' ? '#aaa' : '#ccc'}
              strokeWidth={1.8}
            />
          )}
        </div>

        <div className={styles.body}>
          {pillState === 'default' && (
            <span className={styles.placeholder}>Start Speaking..</span>
          )}
          {pillState === 'recording' && (
            <span className={styles.transcript}>
              {WORDS.slice(0, words).map((w, i) => (
                <span key={i} className={styles.word}>{w} </span>
              ))}
            </span>
          )}
          {pillState === 'processing' && (
            <span className={styles.processingText}>Just a Second..</span>
          )}
        </div>
      </div>

      <p className={styles.label}>Recording Pill</p>
    </div>
  )
}

/* ── Animation components ── */

function AnimComp({
  type, color, inline = false
}: {
  type: AnimType; color: string; inline?: boolean
}) {
  const sz = inline ? styles.animInline : styles.animLarge
  const c = { '--c': color } as React.CSSProperties

  switch (type) {
    case 'bars':
      return (
        <div className={`${styles.animBase} ${sz} ${styles.barsWrap}`} style={c}>
          {[0, 0.12, 0.24, 0.36, 0.48].map((delay, i) => (
            <div key={i} className={styles.bar} style={{ animationDelay: `${delay}s` }} />
          ))}
        </div>
      )
    case 'pulse':
      return <div className={`${styles.animBase} ${sz} ${styles.pulse}`} style={c} />
    case 'orbit':
      return (
        <div className={`${styles.animBase} ${sz} ${styles.orbitWrap}`} style={c}>
          <div className={styles.orbitCenter} />
          <div className={styles.orbitTrack}>
            <div className={styles.orbitDot} />
          </div>
        </div>
      )
    case 'ripple':
      return (
        <div className={`${styles.animBase} ${sz} ${styles.rippleWrap}`} style={c}>
          <div className={styles.ring} style={{ animationDelay: '0s' }} />
          <div className={styles.ring} style={{ animationDelay: '0.55s' }} />
          <div className={styles.ring} style={{ animationDelay: '1.1s' }} />
        </div>
      )
    case 'spin':
      return <div className={`${styles.animBase} ${sz} ${styles.spinner}`} style={c} />
  }
}
