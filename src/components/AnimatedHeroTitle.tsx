import React, { useState, useEffect } from 'react'
import styles from './AnimatedHeroTitle.module.css'

const GREETINGS = ["hi,", "bonjour,", "salam,", "こんにちは,", "hola,", "ciao,", "namaste,"]

const AnimatedHeroTitle: React.FC = () => {
  const [greeting, setGreeting] = useState("hi,")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(200)

  useEffect(() => {
    const current = GREETINGS[loopNum % GREETINGS.length]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (greeting === current) {
          setTimeout(() => setIsDeleting(true), 1500)
          return
        }
        setGreeting(current.substring(0, greeting.length + 1))
        setTypingSpeed(200)
      } else {
        if (greeting === "") {
          setIsDeleting(false)
          setLoopNum(loopNum + 1)
          setTypingSpeed(200)
          return
        }
        setGreeting(greeting.substring(0, greeting.length - 1))
        setTypingSpeed(100)
      }
    }, typingSpeed)
    return () => clearTimeout(timeout)
  }, [greeting, isDeleting, loopNum, typingSpeed])

  return (
    <div className={styles.titleGroup}>
      <h1 className={styles.heroTitle}>
        <span className={styles.typingText}>{greeting}</span>
        <span className={styles.cursor} />
      </h1>
      <h1 className={styles.heroTitle}>i'm noefal.</h1>
    </div>
  )
}

export default AnimatedHeroTitle
