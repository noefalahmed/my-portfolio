"use client"
import React, { useState, useEffect, useRef } from "react"
import styles from "./Home.module.css"
import { Volume2, ArrowUp, Check, Loader2, ArrowRight } from "lucide-react"
import { FaLinkedin } from "react-icons/fa"
import { motion } from "motion/react"

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function startTyping(
  text: string,
  setter: React.Dispatch<React.SetStateAction<string>>,
  doneSetter: React.Dispatch<React.SetStateAction<boolean>>,
  speed = 45
) {
  let i = 0
  const interval = setInterval(() => {
    i++
    setter(text.slice(0, i))
    if (i >= text.length) {
      clearInterval(interval)
      doneSetter(true)
    }
  }, speed)
  return interval
}

/* Wandering dots (commented out — uncomment to re-enable)
interface DotState {
  x: number
  y: number
  vx: number
  vy: number
  originX: number
  originY: number
}

function useWanderingDots(count: number) {
  const dotsRef = useRef<DotState[]>([])
  const rafRef = useRef<number>(0)
  const elementsRef = useRef<(HTMLDivElement | null)[]>([])
  

  const origins = useRef([
    { x: 35, y: 30 },
    { x: 18, y: 50 },
    { x: 88, y: 55 },
  ])

  const setDotRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    elementsRef.current[index] = el
  }, [])

  useEffect(() => {
    // Initialize dots with small random velocities
    dotsRef.current = origins.current.slice(0, count).map((o) => ({
      x: o.x,
      y: o.y,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      originX: o.x,
      originY: o.y,
    }))

    const WANDER_RADIUS = 4       // max % drift from origin
    const SPEED = 0.012            // base drift speed
    const DAMPING = 0.995          // slight slowdown
    const PULL_STRENGTH = 0.0004   // gentle pull back to origin

    let lastTime = performance.now()

    function animate(now: number) {
      const dt = Math.min(now - lastTime, 50) // cap delta to avoid jumps
      lastTime = now

      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i]

        // Random gentle nudge
        dot.vx += (Math.random() - 0.5) * SPEED * (dt / 16)
        dot.vy += (Math.random() - 0.5) * SPEED * (dt / 16)

        // Soft pull back toward origin when far away
        const dx = dot.originX - dot.x
        const dy = dot.originY - dot.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > WANDER_RADIUS * 0.5) {
          const pull = PULL_STRENGTH * (dt / 16)
          dot.vx += dx * pull
          dot.vy += dy * pull
        }

        // Damping
        dot.vx *= DAMPING
        dot.vy *= DAMPING

        // Clamp velocity
        const maxV = 0.05
        dot.vx = Math.max(-maxV, Math.min(maxV, dot.vx))
        dot.vy = Math.max(-maxV, Math.min(maxV, dot.vy))

        // Update position
        dot.x += dot.vx * (dt / 16)
        dot.y += dot.vy * (dt / 16)

        // Hard clamp to wander radius
        const cdx = dot.x - dot.originX
        const cdy = dot.y - dot.originY
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
        if (cdist > WANDER_RADIUS) {
          dot.x = dot.originX + (cdx / cdist) * WANDER_RADIUS
          dot.y = dot.originY + (cdy / cdist) * WANDER_RADIUS
        }

        // Apply to DOM directly for performance
        const el = elementsRef.current[i]
        if (el) {
          el.style.left = `${dot.x}%`
          el.style.top = `${dot.y}%`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [count])

  return { setDotRef }
}
*/

const Home: React.FC = () => {
  const [greeting, setGreeting] = useState("hi,")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(200)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [noteEmail, setNoteEmail] = useState("")
  const [noteStatus, setNoteStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [noteError, setNoteError] = useState("")
  const [noteActive, setNoteActive] = useState(false)
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const [shouldType, setShouldType] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [mobileProjectSlide, setMobileProjectSlide] = useState<number | null>(null);

  const [proj1Text, setProj1Text] = useState("")
  const [proj2Text, setProj2Text] = useState("")
  const [proj3Text, setProj3Text] = useState("")
  const [proj4Text, setProj4Text] = useState("")

  const [proj1Done, setProj1Done] = useState(false)
  const [proj2Done, setProj2Done] = useState(false)
  const [proj3Done, setProj3Done] = useState(false)
  const [proj4Done, setProj4Done] = useState(false)

  const [proj1ImgVisible, setProj1ImgVisible] = useState(false)
  const [proj2ImgVisible, setProj2ImgVisible] = useState(false)
  const [proj3ImgVisible, setProj3ImgVisible] = useState(false)
  const [proj4ImgVisible, setProj4ImgVisible] = useState(false)


  const proj1Ref = useRef<HTMLAnchorElement>(null)
  const proj2Ref = useRef<HTMLAnchorElement>(null)
  const proj3Ref = useRef<HTMLAnchorElement>(null)
  const proj4Ref = useRef<HTMLAnchorElement>(null)


  // Tic Tac Toe state
  type CellValue = null | "X" | "O"
  const [tttBoard, setTttBoard] = useState<CellValue[]>(Array(9).fill(null))
  const [tttActive, setTttActive] = useState(false)
  const [tttGameOver, setTttGameOver] = useState(false)
  const [tttResult, setTttResult] = useState<"win" | "lose" | "draw" | null>(null)

  const [artworkActive, setArtworkActive] = useState(false)
  const artworkCardRef = useRef<HTMLDivElement>(null)

  // Bento drag state
  type CardKey = 'artwork' | 'ttt' | 'note' | 'cornell' | 'pronunciation'
  const [dragStyle, setDragStyle] = useState<Record<CardKey, React.CSSProperties>>({
    artwork: {}, ttt: {}, note: {}, cornell: {}, pronunciation: {},
  })
  const wasDragged = useRef(false)

  function startDrag(key: CardKey, disabled = false) {
    return (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return
      e.preventDefault()
      const containerRect = bentoContainerRef.current!.getBoundingClientRect()
      const cardRect = e.currentTarget.getBoundingClientRect()
      const initLeft = cardRect.left - containerRect.left
      const initTop = cardRect.top - containerRect.top
      const sx = e.clientX, sy = e.clientY
      let moved = false

      function onMove(ev: MouseEvent) {
        const dx = ev.clientX - sx, dy = ev.clientY - sy
        if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) { moved = true; wasDragged.current = true }
        if (moved) {
          setDragStyle(p => ({
            ...p,
            [key]: { left: initLeft + dx, top: initTop + dy, right: 'auto', bottom: 'auto' },
          }))
        }
      }
      function onUp() {
        if (!moved) wasDragged.current = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }
  }

  function dp(key: CardKey): React.CSSProperties {
    return { ...dragStyle[key], cursor: 'grab' }
  }

  const typingRef = useRef<HTMLSpanElement>(null)
  const cornellWrapperRef = useRef<HTMLDivElement>(null)
  const cornellAngle = useRef(0)
  const cornellSpeed = useRef(0.024)       // deg/ms at normal speed (~15s/rotation)
  const cornellTargetSpeed = useRef(0.024)
  const noteCardRef = useRef<HTMLDivElement>(null)
  const tttCardRef = useRef<HTMLDivElement>(null)
  const bentoContainerRef = useRef<HTMLElement>(null)
  const bentoImageRef = useRef<HTMLImageElement>(null)
  // const { setDotRef } = useWanderingDots(3)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioDuration, setAudioDuration] = useState(2)

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const handlePlayPronunciation = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    const duration = audioRef.current.duration || 2
    audioRef.current.play()
    setIsPlaying(true)
    setAudioDuration(duration)
  }

  const handleSendNote = async () => {
    setNoteError("")

    if (!noteEmail || !isValidEmail(noteEmail)) {
      setNoteError("Valid email required")
      return
    }
    if (!noteText.trim()) {
      setNoteError("Write something first")
      return
    }

    setNoteStatus("sending")
    try {
      const res = await fetch("/api/send-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: noteEmail, message: noteText }),
      })
      const data = await res.json()
      if (!res.ok) {
        setNoteError(data.error || "Failed to send")
        setNoteStatus("error")
        return
      }
      setNoteStatus("sent")
      setTimeout(() => {
        setNoteText("")
        setNoteEmail("")
        setNoteStatus("idle")
        setNoteActive(false)
      }, 2000)
    } catch {
      setNoteError("Something went wrong")
      setNoteStatus("error")
    }
  }

  // --- Tic Tac Toe Logic ---
  const winLines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ]

  function checkWinner(board: CellValue[]): CellValue {
    for (const [a,b,c] of winLines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
    }
    return null
  }

  function minimax(board: CellValue[], isMax: boolean): number {
    const winner = checkWinner(board)
    if (winner === "O") return 10
    if (winner === "X") return -10
    if (board.every(c => c !== null)) return 0

    if (isMax) {
      let best = -Infinity
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "O"
          best = Math.max(best, minimax(board, false))
          board[i] = null
        }
      }
      return best
    } else {
      let best = Infinity
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = "X"
          best = Math.min(best, minimax(board, true))
          board[i] = null
        }
      }
      return best
    }
  }

  function getAiMove(board: CellValue[]): number {
    let bestScore = -Infinity
    let bestMove = -1
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O"
        const score = minimax(board, false)
        board[i] = null
        if (score > bestScore) { bestScore = score; bestMove = i }
      }
    }
    return bestMove
  }

  function handleTttClick(index: number) {
    if (tttBoard[index] || tttGameOver) return
    const newBoard = [...tttBoard]
    newBoard[index] = "X"

    const winner = checkWinner(newBoard)
    if (winner === "X") {
      setTttBoard(newBoard)
      setTttGameOver(true)
      setTttResult("win")
      return
    }
    if (newBoard.every(c => c !== null)) {
      setTttBoard(newBoard)
      setTttGameOver(true)
      setTttResult("draw")
      return
    }

    // AI move
    const aiIdx = getAiMove(newBoard)
    if (aiIdx !== -1) newBoard[aiIdx] = "O"

    const aiWinner = checkWinner(newBoard)
    if (aiWinner === "O") {
      setTttBoard(newBoard)
      setTttGameOver(true)
      setTttResult("lose")
      return
    }
    if (newBoard.every(c => c !== null)) {
      setTttBoard(newBoard)
      setTttGameOver(true)
      setTttResult("draw")
      return
    }

    setTttBoard(newBoard)
  }

  function resetTtt() {
    setTttBoard(Array(9).fill(null))
    setTttGameOver(false)
    setTttResult(null)
  }

  function closeTtt() {
    setTttActive(false)
    resetTtt()
  }


  //backto top
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    const container = document.querySelector('[data-scroll-container]') as HTMLElement
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }


  // Close tic tac toe when clicking outside
  useEffect(() => {
    if (!tttActive) return
    function handleClickOutside(e: MouseEvent) {
      if (tttCardRef.current && !tttCardRef.current.contains(e.target as Node)) {
        closeTtt()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [tttActive])

  ///artwork
  useEffect(() => {
    if (!artworkActive) return

    function handleClickOutside(e: MouseEvent) {
      if (artworkCardRef.current && !artworkCardRef.current.contains(e.target as Node)) {
        setArtworkActive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [artworkActive])

  // Collapse note card when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (noteCardRef.current && !noteCardRef.current.contains(e.target as Node)) {
        // Only collapse if not mid-send and fields are empty
        if (noteStatus !== "sending" && !noteEmail && !noteText.trim()) {
          setNoteActive(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [noteStatus, noteEmail, noteText])

  const greetings = ["hi,", "bonjour,", "salam,", "こんにちは,", "hola,", "ciao,", "namaste,"]

  // Typing animation effect - kept from original
  useEffect(() => {
    const currentGreeting = greetings[loopNum % greetings.length]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (greeting === currentGreeting) {
          setTimeout(() => setIsDeleting(true), 1500)
          return
        }
        setGreeting(currentGreeting.substring(0, greeting.length + 1))
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
  }, [greeting, isDeleting, loopNum])

  useEffect(() => {
    setIsPageLoaded(true)
  }, [])
  
  useEffect(() => {
    let lastTime = performance.now()
    let rafId: number
    function animate(now: number) {
      const dt = Math.min(now - lastTime, 50)
      lastTime = now
      cornellSpeed.current += (cornellTargetSpeed.current - cornellSpeed.current) * 0.06
      cornellAngle.current += cornellSpeed.current * dt
      if (cornellWrapperRef.current) {
        cornellWrapperRef.current.style.transform = `rotate(${cornellAngle.current}deg)`
      }
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio("/assets/noefal-pronounciation.mp3")
    audioRef.current.preload = "auto"
    audioRef.current.addEventListener("ended", () => setIsPlaying(false))
  }, [])

  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShouldType(true);
      }
    },
    { threshold: 0.6 } // plays when 60% visible
  );

  if (aboutRef.current) {
    observer.observe(aboutRef.current);
  }

  return () => {
    if (aboutRef.current) {
      observer.unobserve(aboutRef.current);
    }
  };
}, []);

useEffect(() => {
  if (!shouldType) return;

  const fullText = "- N :)";
  let index = 0;

  const interval = setInterval(() => {
    setTypedText(fullText.slice(0, index + 1));
    index++;

    if (index === fullText.length) {
      clearInterval(interval);
    }
  }, 120); // speed — adjust if you want sleeker

  return () => clearInterval(interval);
}, [shouldType]);


  // Mobile slide fade via IntersectionObserver
  useEffect(() => {
    if (window.innerWidth > 480) return
    const container = document.querySelector('[data-scroll-container]') as HTMLElement
    if (!container) return
    const slides = Array.from(container.querySelectorAll('[data-slide]')) as HTMLElement[]

    // Set all slides to invisible initially
    slides.forEach(slide => {
      slide.style.opacity = '0'
      slide.style.transition = 'opacity 0.5s ease'
    })
    // Show first slide immediately
    if (slides[0]) slides[0].style.opacity = '1'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ;(entry.target as HTMLElement).style.opacity = entry.isIntersecting ? '1' : '0'
          if (entry.isIntersecting) {
            const idx = slides.indexOf(entry.target as HTMLElement)
            // idx 0 = hero, idx 1-4 = project cards, idx 5 = about
            const el = entry.target as HTMLElement
            const isProjectSlide = idx >= 1 && !el.hasAttribute('data-about') && !el.hasAttribute('data-footer')
            setMobileProjectSlide(isProjectSlide ? idx - 1 : null)
            if ((entry.target as HTMLElement).hasAttribute('data-about')) {
              setShouldType(true)
            }
          }
        })
      },
      { root: container, threshold: 0.5 }
    )

    slides.forEach(slide => observer.observe(slide))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cards: { ref: React.RefObject<HTMLAnchorElement | null>, text: string, setter: React.Dispatch<React.SetStateAction<string>>, doneSetter: React.Dispatch<React.SetStateAction<boolean>>, imgSetter: React.Dispatch<React.SetStateAction<boolean>> }[] = [
      { ref: proj1Ref, text: "students.", setter: setProj1Text, doneSetter: setProj1Done, imgSetter: setProj1ImgVisible },
      { ref: proj2Ref, text: "Account Managers.", setter: setProj2Text, doneSetter: setProj2Done, imgSetter: setProj2ImgVisible },
      { ref: proj3Ref, text: "Rewards App.", setter: setProj3Text, doneSetter: setProj3Done, imgSetter: setProj3ImgVisible },
      { ref: proj4Ref, text: "management software.", setter: setProj4Text, doneSetter: setProj4Done, imgSetter: setProj4ImgVisible },
    ]
    const observers = cards.map(({ ref, text, setter, doneSetter, imgSetter }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            startTyping(text, setter, doneSetter)
            imgSetter(true)
          }
        },
        { threshold: 0.5 }
      )
      if (ref.current) observer.observe(ref.current)
      return observer
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <div className={styles.pageWrapper}>
      {/* Navigation
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4h6v16H4V4zm10 0h6v8h-6V4z" fill="#d8d8d8"/>
          </svg>
        </div>
        <div className={styles.navLinks}>
          <a href="/work" className={styles.navLink}>Work</a>
          <a href="/about" className={styles.navLink}>About</a>
        </div>
      </nav> */}

      {/* Main Bento Grid Container */}
      <div
        className={`${styles.contentContainer} ${isPageLoaded ? styles.pageLoaded : ""}`}
        data-scroll-container
      >
        {/* Mobile slide indicator */}
        {mobileProjectSlide !== null && (
          <div className={styles.mobileSlideIndicator}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`${styles.mobileSlidedot} ${i === mobileProjectSlide ? styles.mobileSlideDotActive : ""}`}
              />
            ))}
          </div>
        )}

        {/* Mobile-only hero slide — bypasses Framer Motion */}
        <div className={styles.mobileHeroSlide} data-slide>
          <img src="./assets/bg-grid.png" className={styles.mobileGridBg} />
          <div className={styles.mobileHeroContent}>
            <h1 className={styles.heroTitle}>
              <span ref={typingRef}>{greeting}</span>
              <span className={styles.cursor}></span>
            </h1>
            <h1 className={styles.heroTitle}>i'm noefal.</h1>
            <div className={styles.skillPills}>
              <span className={styles.skillPill}>
                <img src="/assets/a.svg" alt="" className={styles.skillIcon} />
                <p className={styles.tagline}>Human-AI Interaction</p>
              </span>
              <span className={styles.skillPill}>
                <img src="/assets/b.svg" alt="" className={styles.skillIcon} />
                <p className={styles.tagline}>Product Design</p>
              </span>
              <span className={styles.skillPill}>
                <img src="/assets/p.svg" alt="" className={styles.skillIcon} />
                <p className={styles.tagline}>Systems Thinking</p>
              </span>
            </div>
          </div>
          <div className={styles.mobileBtnSection}>
            <button className={styles.filledButton} onClick={() => window.open("https://www.calendly.com/noefalahmed", "_blank")}>
              Connect <ArrowRight size={14} color="#05090F" />
            </button>
            <button className={styles.outlinedButton} onClick={() => window.open("https://www.linkedin.com/in/noefalahmed", "_blank")}>
              LinkedIn <FaLinkedin size={14} color="#ffffff" />
            </button>
          </div>
        </div>

        <main
          className={styles.bentoContainer}
          onMouseMove={(e) => {
            const el = bentoContainerRef.current
            const img = bentoImageRef.current
            if (!el || !img) return
            const rect = el.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            const nx = (e.clientX - cx) / (rect.width / 2)
            const ny = (e.clientY - cy) / (rect.height / 2)
            img.style.transition = "transform 0.08s ease-out"
            img.style.transform = `translate(${nx * 15}px, ${ny * 12}px)`
          }}
          onMouseLeave={() => {
            const img = bentoImageRef.current
            if (!img) return
            img.style.transition = "transform 0.6s ease-out"
            img.style.transform = "translate(0px, 0px)"
          }}
          ref={bentoContainerRef}
        >
          <img src="./assets/bg-grid.png" className={styles.bentoImage} ref={bentoImageRef}/>
          {/* Decorative wandering dots */}
          {/* <div ref={setDotRef(0)} className={styles.decorativeDot} style={{ left: '35%', top: '30%' }} />
          <div ref={setDotRef(1)} className={styles.decorativeDot} style={{ left: '18%', top: '50%' }} />
          <div ref={setDotRef(2)} className={styles.decorativeDot} style={{ left: '88%', top: '55%' }} /> */}

          {/* My Artwork Card - Top Left */}
            {artworkActive && <div className={styles.artworkOverlay} />}

            <div
              ref={artworkCardRef}
              className={`${styles.bentoCard} ${styles.artworkCard} ${artworkActive ? styles.artworkCardActive : ""} ${styles.bentoAnimate1}`}
              onMouseDown={startDrag('artwork', artworkActive)}
              onClick={() => {
                if (wasDragged.current) { wasDragged.current = false; return }
                if (!artworkActive) setArtworkActive(true)
              }}
              style={dp('artwork')}
            >
              {!artworkActive && (
                <>
                  <div className={styles.artworkStack}>
                    <div className={`${styles.artworkTile} ${styles.artworkTile3}`}>
                      <img src="./assets/Birds.JPG" alt="Artwork 3" />
                    </div>
                    <div className={`${styles.artworkTile} ${styles.artworkTile2}`}>
                      <img src="./assets/SunDay.png" alt="Artwork 2" />
                    </div>
                    <div className={`${styles.artworkTile} ${styles.artworkTile1}`}>
                      <img src="./assets/nightshade.png" alt="Artwork 1" />
                    </div>
                  </div>
                  <span className={styles.cardLabel}>My Artwork</span>
                </>
              )}

              {artworkActive && (
                <div className={styles.artworkGallery}>
                  <img src="./assets/Birds.JPG" alt="Artwork 3" />
                  <img src="./assets/SunDay.png" alt="Artwork 2" />
                  <img src="./assets/nightshade.png" alt="Artwork 1" />
                </div>
              )}
            </div>


          {/* Tic Tac Toe Card - Top Right */}
          {tttActive && <div className={styles.tttOverlay} />}
          <div
            ref={tttCardRef}
            className={`${styles.bentoCard} ${styles.ticTacToeCard} ${tttActive ? styles.ticTacToeCardActive : ""} ${styles.bentoAnimate2}`}
            onMouseDown={startDrag('ttt', tttActive)}
            onClick={() => {
              if (wasDragged.current) { wasDragged.current = false; return }
              if (!tttActive) setTttActive(true)
            }}
            style={dp('ttt')}
          >
            {!tttActive && (
              <>
                <div className={styles.ticTacToeGrid}>
                  <div className={styles.ticTacToeCell}><div className={styles.redDot} /></div>
                  <div className={styles.ticTacToeCell} />
                  <div className={styles.ticTacToeCell} />
                  <div className={styles.ticTacToeCell} />
                  <div className={styles.ticTacToeCell} />
                  <div className={styles.ticTacToeCell} />
                  <div className={styles.ticTacToeCell} />
                  <div className={styles.ticTacToeCell} />
                  <div className={styles.ticTacToeCell} />
                </div>
                <span className={styles.cardLabel}>Play Tic Tac Toe</span>
              </>
            )}
            {tttActive && (
              <>
                <div className={styles.ticTacToeGrid}>
                  {tttBoard.map((cell, i) => (
                    <div
                      key={i}
                      className={`${styles.ticTacToeCell} ${!cell && !tttGameOver ? styles.ticTacToeCellPlayable : ""}`}
                      onClick={() => handleTttClick(i)}
                    >
                      {cell === "X" && <div className={styles.redDot} />}
                      {cell === "O" && <div className={styles.blueDot} />}
                    </div>
                  ))}
                </div>
                {!tttGameOver && (
                  <span className={styles.tttInstruction}>you go first. tap a cell.</span>
                )}
                {tttGameOver && (
                  <div className={styles.tttEndState}>
                    <span className={styles.tttResultText}>
                      {tttResult === "win" ? "you won!" : tttResult === "lose" ? "you lost." : "it's a draw."}
                    </span>
                    <button className={styles.tttRestartBtn} onClick={(e) => { e.stopPropagation(); resetTtt() }}>
                      play again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Center Hero Section */}
          <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <div className={`${styles.heroSection} ${styles.animateSection}`}>
            {/* Profile Photo */}
            {/* <div className={`${styles.profilePhoto} ${styles.animateItem} ${styles.animateDelay1}`}>
              <img src="public/Display.jpg" alt="Noefal" />
            </div> */}

            {/* Title with typing animation */}
            <h1 className={`${styles.heroTitle} ${styles.animateItem} ${styles.animateDelay2}`}>
              <span className={styles.typingText} ref={typingRef}>
                {greeting}
              </span>
              <span className={styles.cursor}></span>
            </h1>
            <h1 className={`${styles.heroTitle} ${styles.animateItem} ${styles.animateDelay3}`}>
              i'm noefal.
            </h1>

            {/* Skill Pills */}
            <div className={`${styles.skillPills} ${styles.animateItem} ${styles.animateDelay4}`}>
              <span className={styles.skillPill}>
                <img src="/assets/a.svg" alt="" className={styles.skillIcon} />
                <p className={styles.tagline} style={{ textAlign: 'left' }}>Human-AI Interaction</p>
              </span>
              <span className={styles.skillPill}>
                <img src="/assets/b.svg" alt="" className={styles.skillIcon} />
                <p className={styles.tagline} style={{ textAlign: 'left' }}>Product Design</p>
              </span>
              <span className={styles.skillPill}>
                <img src="/assets/p.svg" alt="" className={styles.skillIcon} />
                <p className={styles.tagline} style={{ textAlign: 'left' }}>Systems Thinking</p>
              </span>
            </div>


            <div className={styles.buttonsection}>
              <button className={styles.filledButton}
              onClick={() => window.open("https://www.calendly.com/noefalahmed", "_blank")}>
                Connect
                <ArrowRight size={14} color="#05090F" />
              </button>
              <button className={styles.outlinedButton}
              onClick={() => window.open("https://www.linkedin.com/in/noefalahmed", "_blank")}>
                LinkedIn
                <FaLinkedin size={14} color="#ffffff" />
              </button>
            </div>
          </div>
          </motion.div>

          {/* Write me a note Card - Bottom Left */}
          {noteActive && <div className={styles.noteOverlay} />}
          <div
            ref={noteCardRef}
            className={`${styles.noteCardWrapper} ${styles.bentoAnimate5}`}
            onMouseDown={startDrag('note', noteActive)}
            style={{ ...dp('note'), zIndex: noteActive ? 100 : undefined }}
          >
            <div
              className={`${styles.bentoCard} ${styles.noteCard} ${noteActive ? styles.noteCardActive : ""}`}
              onClick={() => { if (!wasDragged.current) setNoteActive(true) }}
            >
              <div className={styles.noteInner}>
                <div className={`${styles.noteEmailRow} ${noteActive ? styles.noteEmailRowVisible : ""}`}>
                  <input
                    type="email"
                    className={styles.noteEmailInput}
                    placeholder="FROM:"
                    value={noteEmail}
                    onChange={(e) => {
                      setNoteEmail(e.target.value)
                      if (noteError) setNoteError("")
                    }}
                    aria-label="Your email address"
                  />
                  <div className={styles.noteEmailDivider} />
                </div>
                <textarea
                  className={styles.noteTextarea}
                  placeholder="TYPE MESSAGE.."
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value)
                    if (noteError) setNoteError("")
                  }}
                  onFocus={() => setNoteActive(true)}
                  aria-label="Your message"
                />
                <button
                  className={`${styles.noteSendBtn} ${noteStatus === "sent" ? styles.noteSendBtnSent : ""}`}
                  onClick={handleSendNote}
                  disabled={noteStatus === "sending" || noteStatus === "sent"}
                  aria-label="Send note"
                >
                  {noteStatus === "sending" ? (
                    <Loader2 size={14} className={styles.spinIcon} />
                  ) : noteStatus === "sent" ? (
                    <Check size={14} />
                  ) : (
                    <ArrowUp size={14} />
                  )}
                </button>
              </div>
            </div>
            <span className={styles.cardLabel}>Write me a note</span>
            {noteError && <span className={styles.noteErrorText}>{noteError}</span>}
          </div>

          {/* Cornell Badge - Center */}
          {/* <div
            className={`${styles.bentoCard} ${styles.cornellBadge} ${styles.bentoAnimate4}`}
            onMouseDown={startDrag('cornell')}
            onMouseEnter={() => { cornellTargetSpeed.current = 0.36 }}
            onMouseLeave={() => { cornellTargetSpeed.current = 0.024 }}
            style={dp('cornell')}
          >
            <div className={styles.cornellTextWrapper} ref={cornellWrapperRef}>
              <div className={styles.cornellText}>
                {Text arranged in a circle}
                {"Cornell University Cornell University ".split("").map((char, i) => (
                  <span
                    key={i}
                    style={{
                      transform: `rotate(${i * 9.5}deg)`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div> */}

          {/* Urdu Name Pronunciation - Bottom Right */}
          {isPlaying && <div className={styles.pronunciationOverlay} />}
          <button
            onMouseDown={startDrag('pronunciation', isPlaying)}
            onClick={() => {
              if (wasDragged.current) { wasDragged.current = false; return }
              handlePlayPronunciation()
            }}
            className={`${styles.bentoCard} ${styles.pronunciationCard} ${isPlaying ? styles.pronunciationCardActive : ""} ${styles.bentoAnimate3}`}
            style={{ '--audio-duration': `${audioDuration}s`, ...dp('pronunciation') } as React.CSSProperties}>
            <div className={styles.volumeIconWrapper}>
              <Volume2 size={20} className={styles.volumeIcon} />
            </div>
            <span className={styles.arabicName}>نوفل</span>
          </button>
        </main>

        {/* Work Section */}
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Work</h2>
          <div className={styles.projectsGrid}>
            <a href="/speech-coach" ref={proj1Ref} className={styles.projectCard} data-slide>
              <div className={styles.projectImageWrapper}>
                <img src="./assets/proj0.png" alt="Speech Coach" className={`${styles.projectImage} ${proj1ImgVisible ? styles.projectImageVisible : ""}`} />
              </div>
              <div className={styles.projectBottom}>
                <p className={styles.projectCaption}>CORNELL UNIVERSITY</p>
                <span className={styles.projectTitle}>
                  {"i built a speech-enabled leadership coach for "}{proj1Text}
                  {proj1Text.length > 0 && (proj1Done ? <span className={styles.cursorFade} /> : <span className={styles.cursor} />)}
                </span>
              </div>
              <span className={styles.mobileReadBtn}>READ <ArrowRight size={14} color="#05090F" /></span>
            </a>
            <a href="/design-thinking" ref={proj2Ref} className={styles.projectCard} data-slide>
              <div className={styles.projectImageWrapper}>
                <img src="./assets/proj3.png" alt="design-thinking" className={`${styles.projectImage} ${proj2ImgVisible ? styles.projectImageVisible : ""}`} />
              </div>
              <div className={styles.projectBottom}>
                <p className={styles.projectCaption}>UPLAND SOFTWARE</p>
                <span className={styles.projectTitle}>
                  {"i redesigned a Dashboard for "}{proj2Text}
                  {proj2Text.length > 0 && (proj2Done ? <span className={styles.cursorFade} /> : <span className={styles.cursor} />)}
                </span>
              </div>
              <span className={styles.mobileReadBtn}>READ <ArrowRight size={14} color="#05090F" /></span>
            </a>
            <a href="/design-systems" ref={proj3Ref} className={styles.projectCard} data-slide>
              <div className={styles.projectImageWrapper}>
                <img src="./assets/proj2.png" alt="Data Analytics" className={`${styles.projectImage} ${proj3ImgVisible ? styles.projectImageVisible : ""}`} />
              </div>
              <div className={styles.projectBottom}>
                <p className={styles.projectCaption}>EAT SLEEP REPEAT</p>
                <span className={styles.projectTitle}>
                  {"i created a Design System for a "}{proj3Text}
                  {proj3Text.length > 0 && (proj3Done ? <span className={styles.cursorFade} /> : <span className={styles.cursor} />)}
                </span>
              </div>
              <span className={styles.mobileReadBtn}>READ <ArrowRight size={14} color="#05090F" /></span>
            </a>
            <a href="/accessibility" ref={proj4Ref} className={styles.projectCard} data-slide>
              <div className={styles.projectImageWrapper}>
                <img src="./assets/proj1.png" alt="Project Management" className={`${styles.projectImage} ${proj4ImgVisible ? styles.projectImageVisible : ""}`} />
              </div>
              <div className={styles.projectBottom}>
                <p className={styles.projectCaption}>UPLAND SOFTWARE</p>
                <span className={styles.projectTitle}>
                  {"i created an accessibility framework for a project "}{proj4Text}
                  {proj4Text.length > 0 && (proj4Done ? <span className={styles.cursorFade} /> : <span className={styles.cursor} />)}
                </span>
              </div>
              <span className={styles.mobileReadBtn}>READ <ArrowRight size={14} color="#05090F" /></span>
            </a>
          </div>
        </section>
        </motion.div>

        {/* Playground Section */}
        {/* <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Playground</h2>
          <p className={styles.sectionDescription}>
            Experiments and mini projects.
          </p>
          <div className={styles.playgroundGrid}>
            <a href="/playground-1" className={styles.playgroundCard}>
              <div className={styles.playgroundImageWrapper}>
                <img
                  src="/placeholder.svg?height=300&width=300&query=minimal white background"
                  alt="Experiment 1"
                  className={styles.playgroundImage}
                />
              </div>
            </a>
            <a href="/playground-2" className={styles.playgroundCard}>
              <div className={styles.playgroundImageWrapper}>
                <img
                  src="/placeholder.svg?height=300&width=300&query=minimal white background"
                  alt="Experiment 2"
                  className={styles.playgroundImage}
                />
              </div>
            </a>
            <a href="/playground-3" className={styles.playgroundCard}>
              <div className={styles.playgroundImageWrapper}>
                <img
                  src="/placeholder.svg?height=300&width=300&query=minimal white background"
                  alt="Experiment 3"
                  className={styles.playgroundImage}
                />
              </div>
            </a>
            <a href="/playground-4" className={styles.playgroundCard}>
              <div className={styles.playgroundImageWrapper}>
                <img
                  src="/placeholder.svg?height=300&width=300&query=minimal white background"
                  alt="Experiment 4"
                  className={styles.playgroundImage}
                />
              </div>
            </a>
          </div>
        </section>
        </motion.div> */}

        {/* Mobile-only about slide */}
        <div className={styles.mobileAboutSlide} data-slide data-about>
          <p className={styles.mobileAboutText}>
            Hi Reader,
            <br/><br/>
            I'm a Design Engineer from 🇵🇰 Pakistan on a mission 🚀 to design experiences that impact people's lives. I've studied computer science, researched on AI, and designed various web and mobile products.
            <br/><br/>
            I work methodically. There are scales, guides, and procedures I live by to produce outcomes of the highest standards. I make sure I'm constantly in practice as not just a design-thinker but also a design-doer.
            <br/><br/>
            I'm currently researching, and building voice / speech enabled systems that solve for pain points across Human-AI Interaction, Computer Mediated Communication, and Cognitive Performance at Cornell University.
            <br/><br/>
            <span className={styles.signature}>
              {typedText}
              {shouldType && <span className={styles.cursor}></span>}
            </span>
          </p>
        </div>

        {/* Mobile-only footer slide */}
        <div className={styles.mobileFooterSlide} data-slide data-footer>
          <a href="https://linkedin.com/in/noefalahmed" target="_blank" rel="noopener noreferrer" className={styles.mobileFooterLink}>LinkedIn</a>
          <a href="./assets/resume.pdf" download className={styles.mobileFooterLink}>Resume</a>
          <a href="https://github.com/noefalahmed" target="_blank" rel="noopener noreferrer" className={styles.mobileFooterLink}>Github</a>
          <button className={styles.mobileBackToTop} onClick={scrollToTop} aria-label="Back to top">↑</button>
        </div>

        {/* about me */}
        <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
        <section className={styles.section}>
         
          <div ref={aboutRef} className={styles.about}>
            <div className={styles.rect1}></div>
            <div className={styles.rect2}></div>
            <div className={styles.rect3}></div>
            <div className={styles.rect4}></div>
            <div className={styles.aboutheader}></div>
            <p className={styles.aboutdescription}>
              Hi Reader, 
                      <br></br><br></br>
                      I'm a Design Engineer from 🇵🇰 Pakistan on a mission 🚀 to design experiences that impact people's lives. I've studied computer science, researched on AI, and designed various web and mobile products. 
                      <br></br><br></br>
                      I work methodically. There are scales, guides, and procedures I live by to produce outcomes of the highest standards. I make sure I'm constantly in practice as not just a design-thinker but also a design-doer. 
                      <br></br><br></br>I'm currently building voice / speech enabled systems that solve for human-centered pain points. Oh, and I'm currently researching across Human-AI Interaction, Computer Mediated Communication, and Cognitive Performance at Cornell University. 
                      <br></br><br></br>
              <span className={styles.signature}>
                {typedText}
                {shouldType  &&
                  <span className={styles.cursor}></span>
                }
              </span>
            </p>
          </div>
          
          {visible && (
            <button
              onClick={scrollToTop}
              className={styles.backToTop}
              aria-label="Back to top"
            >
              ↑
            </button>
          )}
        </section>
        </motion.div>
     </div>
  </div>
  )
}
export default Home