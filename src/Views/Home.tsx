"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import styles from "./Home.module.css"
import { Volume2, ArrowUp, Check, Loader2 } from "lucide-react"

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

  // Tic Tac Toe state
  type CellValue = null | "X" | "O"
  const [tttBoard, setTttBoard] = useState<CellValue[]>(Array(9).fill(null))
  const [tttActive, setTttActive] = useState(false)
  const [tttGameOver, setTttGameOver] = useState(false)
  const [tttResult, setTttResult] = useState<"win" | "lose" | "draw" | null>(null)

  const [artworkActive, setArtworkActive] = useState(false)
  const artworkCardRef = useRef<HTMLDivElement>(null)

  const typingRef = useRef<HTMLSpanElement>(null)
  const noteCardRef = useRef<HTMLDivElement>(null)
  const tttCardRef = useRef<HTMLDivElement>(null)
  const { setDotRef } = useWanderingDots(3)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const handlePlayPronunciation = () => {
      if (!audioRef.current) return
      audioRef.current.currentTime = 0
      audioRef.current.play()
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
      const res = await fetch("http://localhost:3001/send-note", {
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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
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
    audioRef.current = new Audio("/noefal-pronounciation.mp3")
    audioRef.current.preload = "auto"
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
      <div className={`${styles.contentContainer} ${isPageLoaded ? styles.pageLoaded : ""}`}>
        <main className={styles.bentoContainer}>
          <img src="public/assets/bg-grid.png" className={styles.bentoImage}/>
          {/* Decorative wandering dots */}
          <div ref={setDotRef(0)} className={styles.decorativeDot} style={{ left: '35%', top: '30%' }} />
          <div ref={setDotRef(1)} className={styles.decorativeDot} style={{ left: '18%', top: '50%' }} />
          <div ref={setDotRef(2)} className={styles.decorativeDot} style={{ left: '88%', top: '55%' }} />

          {/* My Artwork Card - Top Left */}
            {artworkActive && <div className={styles.artworkOverlay} />}

            <div
              ref={artworkCardRef}
              className={`
                ${styles.bentoCard} 
                ${styles.artworkCard} 
                ${artworkActive ? styles.artworkCardActive : ""} 
                ${styles.animateItem} 
                ${styles.animateDelay1}
              `}
              onClick={() => {
                if (!artworkActive) setArtworkActive(true)
              }}
            >
              {!artworkActive && (
                <>
                  <div className={styles.artworkStack}>
                    <div className={`${styles.artworkTile} ${styles.artworkTile3}`}>
                      <img src="/public/assets/Birds.JPG" alt="Artwork 3" />
                    </div>
                    <div className={`${styles.artworkTile} ${styles.artworkTile2}`}>
                      <img src="/public/assets/SunDay.png" alt="Artwork 2" />
                    </div>
                    <div className={`${styles.artworkTile} ${styles.artworkTile1}`}>
                      <img src="/public/assets/nightshade.png" alt="Artwork 1" />
                    </div>
                  </div>
                  <span className={styles.cardLabel}>My Artwork</span>
                </>
              )}

              {artworkActive && (
                <div className={styles.artworkGallery}>
                  <img src="/public/assets/Birds.JPG" alt="Artwork 3" />
                  <img src="/public/assets/SunDay.png" alt="Artwork 2" />
                  <img src="/public/assets/nightshade.png" alt="Artwork 1" />
                </div>
              )}
            </div>


          {/* Tic Tac Toe Card - Top Right */}
          {tttActive && <div className={styles.tttOverlay} />}
          <div
            ref={tttCardRef}
            className={`${styles.bentoCard} ${styles.ticTacToeCard} ${tttActive ? styles.ticTacToeCardActive : ""} ${styles.animateItem} ${styles.animateDelay2}`}
            onClick={() => { if (!tttActive) setTttActive(true) }}
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
                <span className={styles.skillIcon} style={{ color: '#ff5e5e' }}>✦</span>
                <p className={`${styles.tagline} ${styles.animateItem} ${styles.animateDelay5}`}>
                Human-AI Interaction
                </p>
              </span>
              <span className={styles.skillPill}>
                <span className={styles.skillIcon} style={{ color: '#178fff' }}>◉</span>
                <p className={`${styles.tagline} ${styles.animateItem} ${styles.animateDelay5}`}>
                Product Design
                </p>
              </span>
              <span className={styles.skillPill}>
                <span className={styles.skillIcon} style={{ color: '#8f6aff' }}>⊞</span>
                <p className={`${styles.tagline} ${styles.animateItem} ${styles.animateDelay5}`}>
                Systems Thinking
                </p>
              </span>
            </div>

            {/* Tagline */}
            <p className={`${styles.tagline} ${styles.animateItem} ${styles.animateDelay5}`}>
              I’m an architect of scales, grids, systems, and smooth interactions.
            </p>
            <div className={styles.buttonsection}>
              <button className={styles.outlinedButton}
              onClick={() => window.open("https://www.linkedin.com/in/noefalahmed", "_blank")}>
              LinkedIn
            </button>
            <button className={styles.filledButton}
            onClick={() => window.open("https://www.calendly.com/noefalahmed", "_blank")}>
              Connect
            </button>
            </div>
          </div>

          {/* Write me a note Card - Bottom Left */}
          <div
            ref={noteCardRef}
            className={`${styles.bentoCard} ${styles.noteCard} ${styles.animateItem} ${styles.animateDelay6}`}
          >
            <span className={styles.noteCardTitle}>Write me a note</span>
            <div className={styles.noteInputArea}>
              <div className={`${styles.noteEmailRow} ${noteActive ? styles.noteEmailRowVisible : ""}`}>
                <input
                  type="email"
                  className={styles.noteEmailInput}
                  placeholder="your email"
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
                placeholder=""
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
            {noteError && <span className={styles.noteErrorText}>{noteError}</span>}
          </div>

          {/* Cornell Badge - Center */}
          <div className={`${styles.bentoCard} ${styles.cornellBadge} ${styles.animateItem} ${styles.animateDelay7}`}>
            <div className={styles.cornellTextWrapper}>
              <div className={styles.cornellText}>
                {/* Text arranged in a circle */}
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
          </div>

          {/* Urdu Name Pronunciation - Bottom Right */}
          <button
            onClick={handlePlayPronunciation}
            className={`${styles.bentoCard} ${styles.pronunciationCard} ${styles.animateItem} ${styles.animateDelay8}`}>
            <div className={styles.volumeIconWrapper}>
              <Volume2 size={20} className={styles.volumeIcon} />
            </div>
            <span className={styles.arabicName}>نوفل</span>
          </button>
        </main>

        {/* Work Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Work</h2>
          <p className={styles.sectionDescription}>
            Projects that I've worked on across different companies.
          </p>
          <div className={styles.projectsGrid}>
            <a href="/design-systems" className={`${styles.projectCard} ${styles.projectCardDisabled}`}>
              <div className={styles.projectImageWrapper}>
                <p className={styles.projectCaption}>CORNELL UNIVERSITY, SCHOOL OF ENGINEERING</p>
                <img 
                  src="/public/assets/proj0.png" 
                  alt="design-systems" 
                  className={styles.projectImage}
                />
              </div>
              <span className={styles.projectTitle}>...work in progress...</span>
            </a>
            <a href="/design-thinking" className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <p className={styles.projectCaption}>UPLAND SOFTWARE</p>
                <img 
                  src="/public/assets/proj3.png" 
                  alt="design-thinking" 
                  className={styles.projectImage}
                />
              </div>
              <span className={styles.projectTitle}>i redesigned a Dashboard for Account Managers.</span>
            </a>
            <a href="/design-systems" className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <p className={styles.projectCaption}>EAT SLEEP REPEAT</p>
                <img 
                  src="/public/assets/proj2.png" 
                  alt="Data Analytics" 
                  className={styles.projectImage}
                />
              </div>
              <span className={styles.projectTitle}>i created a Design System for a Rewards App.</span>
            </a>
            <a href="/accessibility" className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <p className={styles.projectCaption}>UPLAND SOFTWARE</p>
                <img 
                  src="/public/assets/proj1.png" 
                  alt="Project Management" 
                  className={styles.projectImage}
                />
              </div>
              <span className={styles.projectTitle}>i created an accessibility framework for a project management software.</span>
            </a>
          </div>
        </section>

        {/* Playground Section */}
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
        {/* about me */}
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
     </div>
  </div>
  )
}
export default Home