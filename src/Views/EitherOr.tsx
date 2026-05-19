import React, { useState, useEffect } from 'react'
import styles from './EitherOr.module.css'

const TOTAL_SLIDES = 2

const EitherOr: React.FC = () => {
  const initialSlide = parseInt(new URLSearchParams(window.location.search).get('s') ?? '0') || 0
  const [slide, setSlide] = useState(initialSlide)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1))
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSlide(s => Math.max(s - 1, 0))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className={styles.slideshow}>

      {/* Slide 1 — Title */}
      <div className={`${styles.slide} ${slide === 0 ? styles.active : styles.hidden}`}>
        <img src="/assets/a.svg" className={`${styles.cornerIcon} ${styles.topLeft}`} alt="" />
        <img src="/assets/b.svg" className={`${styles.cornerIcon} ${styles.topRight}`} alt="" />
        <img src="/assets/e.svg" className={`${styles.cornerIcon} ${styles.bottomLeft}`} alt="" />
        <img src="/assets/p.svg" className={`${styles.cornerIcon} ${styles.bottomRight}`} alt="" />
        <div className={styles.titleSlide}>
          <h1 className={styles.titleName}>Noefal Ahmed</h1>
          <p className={styles.titleSub}>Case Study Slides</p>
        </div>
        <span className={styles.navHint}>USE ARROW KEYS TO NAVIGATE</span>
      </div>

      {/* Slide 2 — Either/Or cards */}
      <div className={`${styles.slide} ${slide === 1 ? styles.active : styles.hidden}`}>
        <div className={styles.page}>
          <div className={styles.grid}>
            <a href="/rewardsapp" className={styles.card}>
              <p className={styles.caption}>EAT SLEEP REPEAT</p>
              <div className={styles.imageWrapper}>
                <img src="/assets/proj2.png" alt="Rewards App" className={styles.image} />
              </div>
              <span className={styles.title}>i designed the user experience for a Rewards App.</span>
            </a>
            <a href="/voiceux" className={styles.card}>
              <p className={styles.caption}>CORNELL UNIVERSITY</p>
              <div className={styles.imageWrapper}>
                <img src="/assets/proj0.png" alt="Voice UX" className={styles.image} />
              </div>
              <span className={styles.title}>i built a speech-enabled leadership coach for students.</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}

export default EitherOr
