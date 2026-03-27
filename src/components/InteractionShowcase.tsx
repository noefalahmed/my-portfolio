"use client"

import { useEffect, useRef, useState } from 'react'
import { Mic, ArrowRight } from 'lucide-react'
import styles from './InteractionShowcase.module.css'

type Step =
  | 'idle'
  | 'me1-speaking'  | 'me1-zoom-out' | 'me1-bubble'
  | 'drew1-typing'  | 'drew1-bubble'
  | 'me2-speaking'  | 'me2-bubble'
  | 'drew2-typing'  | 'drew2-bubble'
  | 'me3-speaking'  | 'me3-bubble'
  | 'drew3-typing'  | 'drew3-bubble'

const STEP_ORDER: Step[] = [
  'idle',
  'me1-speaking',  'me1-zoom-out', 'me1-bubble',
  'drew1-typing',  'drew1-bubble',
  'me2-speaking',  'me2-bubble',
  'drew2-typing',  'drew2-bubble',
  'me3-speaking',  'me3-bubble',
  'drew3-typing',  'drew3-bubble',
]
const atLeast = (current: Step, target: Step) =>
  STEP_ORDER.indexOf(current) >= STEP_ORDER.indexOf(target)

const WAVEFORM_BARS = Array.from({ length: 400 }, (_, i) => i)

export default function InteractionShowcase() {
  const [step, setStep]               = useState<Step>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const runLoop = () => {
      setStep('idle')
      const ts: ReturnType<typeof setTimeout>[] = [
        setTimeout(() => setStep('me1-speaking'),   600),
        setTimeout(() => setStep('me1-zoom-out'),  2500),
        setTimeout(() => setStep('me1-bubble'),    3100),
        setTimeout(() => setStep('drew1-typing'),  3800),
        setTimeout(() => setStep('drew1-bubble'),  5400),
        setTimeout(() => setStep('me2-speaking'),  6200),
        setTimeout(() => setStep('me2-bubble'),    8000),
        setTimeout(() => setStep('drew2-typing'),  8800),
        setTimeout(() => setStep('drew2-bubble'),  10800),
        setTimeout(() => setStep('me3-speaking'),  11600),
        setTimeout(() => setStep('me3-bubble'),    14200),
        setTimeout(() => setStep('drew3-typing'),  15000),
        setTimeout(() => setStep('drew3-bubble'),  16600),
        setTimeout(runLoop,                        19800),
      ]
      timeoutsRef.current = ts
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && timeoutsRef.current.length === 0) {
          runLoop()
        } else if (!entry.isIntersecting) {
          timeoutsRef.current.forEach(clearTimeout)
          timeoutsRef.current = []
          setStep('idle')
        }
      },
      { threshold: 0.4 }
    )
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => {
      observer.disconnect()
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    const isSpeaking = step.endsWith('-speaking')
    if (!isSpeaking) { setRecordingTime(0); return }
    const interval = setInterval(() => setRecordingTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [step])


  const formatTime = (s: number) => `00:${String(s).padStart(2, '0')}`
  const isRecording = step.endsWith('-speaking')
  const isTyping    = step.endsWith('-typing')
  const isZoomed    = step === 'me1-speaking' || step === 'me1-zoom-out'

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={`${styles.inner} ${isZoomed ? styles.innerZoomed : ''}`}>
        <div className={`${styles.chatArea} ${isZoomed ? styles.chatAreaZoomed : ''}`}>

          {/* Me bubble 1 */}
          {atLeast(step, 'me1-bubble') && (
            <div className={`${styles.row} ${styles.rowMe} ${styles.animateSlideRight}`}>
              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${styles.labelMe}`}>Me</span>
                <div className={`${styles.bubble} ${styles.bubbleMe}`}>
                  Hey Drew, I wanted to talk about the project. The workload hasn't been split evenly and it held up the whole team.
                </div>
              </div>
              <img src="/assets/sc-avatar-me.png" alt="Me" className={styles.avatar} />
            </div>
          )}

          {/* Drew bubble 1 */}
          {atLeast(step, 'drew1-bubble') && (
            <div className={`${styles.row} ${styles.rowDrew} ${styles.rowGap} ${styles.animateSlideLeft}`}>
              <img src="/assets/sc-avatar-drew.png" alt="Drew" className={styles.avatar} />
              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${styles.labelDrew}`}>Drew</span>
                <div className={`${styles.bubble} ${styles.bubbleDrew}`}>
                  Hi. I mean, I've been swamped. Everyone has stuff going on — it's not like I disappeared on purpose.
                </div>
              </div>
            </div>
          )}

          {/* Me bubble 2 */}
          {atLeast(step, 'me2-bubble') && (
            <div className={`${styles.row} ${styles.rowMe} ${styles.rowGap} ${styles.animateSlideRight}`}>
              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${styles.labelMe}`}>Me</span>
                <div className={`${styles.bubble} ${styles.bubbleMe}`}>
                  I know, but we needed your branch merged before the build and we had to work around it last minute.
                </div>
              </div>
              <img src="/assets/sc-avatar-me.png" alt="Me" className={styles.avatar} />
            </div>
          )}

          {/* Drew bubbles 2a + 2b */}
          {atLeast(step, 'drew2-bubble') && (
            <div className={`${styles.row} ${styles.rowDrew} ${styles.rowGap} ${styles.animateSlideLeft}`}>
              <img src="/assets/sc-avatar-drew.png" alt="Drew" className={styles.avatar} />
              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${styles.labelDrew}`}>Drew</span>
                <div className={`${styles.bubble} ${styles.bubbleDrew}`}>
                  I told you I was behind. I don't really know what you want me to say — it happened, it's done.
                </div>
                <div className={`${styles.bubble} ${styles.bubbleDrew}`} style={{ marginTop: 4 }}>
                  And honestly, it feels like you're making this a bigger deal than it is.
                </div>
              </div>
            </div>
          )}

          {/* Me bubble 3 */}
          {atLeast(step, 'me3-bubble') && (
            <div className={`${styles.row} ${styles.rowMe} ${styles.rowGap} ${styles.animateSlideRight}`}>
              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${styles.labelMe}`}>Me</span>
                <div className={`${styles.bubble} ${styles.bubbleMe}`}>
                  I just think we need to be more intentional about deadlines going forward.
                </div>
              </div>
              <img src="/assets/sc-avatar-me.png" alt="Me" className={styles.avatar} />
            </div>
          )}

          {/* Drew bubble 3 */}
          {atLeast(step, 'drew3-bubble') && (
            <div className={`${styles.row} ${styles.rowDrew} ${styles.rowGap} ${styles.animateSlideLeft}`}>
              <img src="/assets/sc-avatar-drew.png" alt="Drew" className={styles.avatar} />
              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${styles.labelDrew}`}>Drew</span>
                <div className={`${styles.bubble} ${styles.bubbleDrew}`}>
                  Okay. That's fair. I'll give more heads up if I'm falling behind next time.
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className={`${styles.row} ${styles.rowDrew} ${styles.rowGap}`}>
              <img src="/assets/sc-avatar-drew.png" alt="Drew" className={styles.avatar} />
              <div className={styles.bubbleGroup}>
                <span className={`${styles.label} ${styles.labelDrew}`}>Drew</span>
                <div className={`${styles.bubble} ${styles.bubbleDrew} ${styles.typingBubble}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Input bar */}
        <div className={styles.inputBar}>
          {isRecording ? (
            <div className={styles.recordingBar}>
              <div className={styles.waveform}>
                {WAVEFORM_BARS.map((_, i) => (
                  <div key={i} className={styles.waveBar} style={{ '--i': i } as React.CSSProperties} />
                ))}
              </div>
              <span className={styles.recordingTimer}>{formatTime(recordingTime)}</span>
              <div className={`${styles.micBtn} ${styles.micBtnActive}`}>
                <Mic size={18} color="#fff" />
              </div>
            </div>
          ) : (
            <div className={styles.normalBar}>
              <div className={styles.inputPlaceholder}>Type your response..</div>
              <div className={styles.sendBtn}>
                <ArrowRight size={18} color="#888" />
              </div>
              <div className={`${styles.micBtn} ${step === 'idle' ? styles.micBtnPulsing : ''}`}>
                <Mic size={18} color="#fff" />
              </div>
            </div>
          )}
        </div>

      </div>
      <p className={styles.disclaimer}>Drew is an AI Agent</p>
    </div>
  )
}
