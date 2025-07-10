"use client"

import React, { useState, useEffect, useRef } from "react"
import styles from "./Home.module.css"
import Card from "../components/Card"
import { Link } from "react-router-dom"
import { Grid, List, Maximize2, Send, ArrowRight } from "lucide-react"
import Button from "../components/Button"

// import "../styles/logo-animation.css"
// import "../styles/logo-animation-2.css"
// import "../styles/logo-animation-3.css"
// import "../styles/logo-animation-4.css"

const Home: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"large" | "tiles" | "list">("tiles")
  const [greeting, setGreeting] = useState("Hi.")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(200)
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  // Refs for animation elements
  const typingRef = useRef<HTMLSpanElement>(null)

  const greetings = ["Hi.", "Bonjour.", "Salam.", "こんにちは.", "Hola.", "Ciao.", "Namaste."]

  // Typing animation effect
  useEffect(() => {
    const currentGreeting = greetings[loopNum % greetings.length]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (greeting === currentGreeting) {
          // Wait a bit before starting to delete
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
        setTypingSpeed(100) // Delete faster than typing
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [greeting, isDeleting, loopNum])

  // Page load animation effect
  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission logic here
    console.log("Email submitted:", { email, subject, message })
    // Reset the form
    setEmail("")
    setSubject("")
    setMessage("")
    // Show success message or feedback
    alert("Thank you! I'll get back to you soon.")
  }

  const projects = [
    { title: "Precisely", imageUrl: "assets/precisely.png", link: "Precisely" },
    { title: "Applied Design Thinking", imageUrl: "assets/designthinking1.png", link: "design-thinking" },
    { title: "Design Leadership at Arine", imageUrl: "assets/arine.png", link: "arine" },
    { title: "How I Created a Component Library", imageUrl: "assets/designsystems.png", link: "design-systems" },
    { title: "Designing Icons", imageUrl: "assets/iconpackpng.png", link: "icon-pack" },
  ]

  // Comment out the LogoAnimation components
  // const LogoAnimation = () => (
  //   <div className="logo-container">
  //     <div className="logo-rect rect1"></div>
  //     <div className="logo-rect rect2"></div>
  //     <div className="logo-rect rect3"></div>
  //     <div className="logo-rect rect4"></div>
  //   </div>
  // )

  // const LogoAnimation2 = () => (
  //   <div className="logo-animation-2-container">
  //     <div className="logo-animation-2-triangle-back"></div>
  //     <div className="logo-animation-2-triangle-mid"></div>
  //     <div className="logo-animation-2-triangle"></div>
  //   </div>
  // )

  // const LogoAnimation3 = () => (
  //   <div className="logo-animation-3-container">
  //     <div className="logo-animation-3-circle">
  //       <div className="logo-animation-3-eye-shape">
  //         <div className="logo-animation-3-eyeball"></div>
  //       </div>
  //     </div>
  //   </div>
  // )

  // const LogoAnimation4 = () => (
  //   <div className="logo-animation-4-container">
  //     <div className="logo-animation-4-line"></div>
  //     <div className="logo-animation-4-line"></div>
  //     <div className="logo-animation-4-line"></div>
  //   </div>
  // )

  return (
    <div className={`${styles.contentContainer} ${isPageLoaded ? styles.pageLoaded : ""}`}>
      <div className={`${styles.heroSection} ${styles.animateSection}`}>
        <h1 className={`${styles.h2} ${styles.animateItem} ${styles.animateDelay1}`}>
          <span className={styles.typingText} ref={typingRef}>
            {greeting}
          </span>
          <span className={styles.cursor}>|</span>
        </h1>
        <h1 className={`${styles.h2} ${styles.animateItem} ${styles.animateDelay2}`}>I'm</h1>
        <h1 className={`${styles.h2} ${styles.animateItem} ${styles.animateDelay3}`}>Noefal.</h1>
        <div className={`${styles.heroline} ${styles.animateItem} ${styles.animateDelay4}`}>
          <Link
            to="/"
            className={styles.heroLink}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}
          >
            <img src="/assets/a.svg" alt="Design for AI" width={24} height={24} className={styles.heroIcon} />
            Design for AI
          </Link>
          <Link
            to="/"
            className={styles.heroLink}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}
          >
            <img src="/assets/p.svg" alt="Product/UX" width={24} height={24} className={styles.heroIcon} />
            Product/UX
          </Link>
          <Link
            to="/"
            className={styles.heroLink}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}
          >
            <img src="/assets/e.svg" alt="UX Engineering" width={24} height={24} className={styles.heroIcon} />
            UX Engineering
          </Link>
          <Link
            to="/"
            className={styles.heroLink}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}
          >
            <img src="/assets/b.svg" alt="Branding" width={24} height={24} className={styles.heroIcon} />
            Branding
          </Link>
        </div>
        <p className={`${styles.p1} ${styles.animateItem} ${styles.animateDelay5}`}>
          {/* <span>
            Master of Information Science @
            <a href="https://www.cornell.edu" target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>
              Cornell
            </a>
            ,
          </span> */}
          <span> Human-Centered Designer & Engineer, </span>
          <span>
            Building<span> </span>
            <Link to="/Precisely" className={styles.inlineLink}>
              Precisely
            </Link>
            .
          </span>
        </p>
        <div className={`${styles.buttonsection} ${styles.animateItem} ${styles.animateDelay6}`}>
          <a
            className={styles.socialbutton}
            href="https://calendly.com/noefalahmed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="icon-and-text"
              label="Connect"
              isActive={false}
              style={{ backgroundColor: "#f4ead9", color: "#000", fontWeight: "400" }}
              icon=<ArrowRight/>
            />
          </a>
          <a
            className={styles.socialbutton}
            href="https://linkedin.com/in/noefalahmed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="text-only"
              label="LinkedIn"
              isActive={false}
              style={{ color: "#f4ead9", borderWidth: "1px", borderColor: "#fff", borderStyle: "Solid" }}
            />
          </a>
        </div>
      </div>
      <div className={`${styles.workSection} ${styles.animateSection} ${styles.animateDelay7}`}>
        <div className={styles.subsection}>
          <div className={`${styles.featuredWorkHeader} ${styles.animateItem}`}>
            <p className={styles.p2}>PROJECTS</p>
            <div className={styles.viewModeButtons}>
              <button
                onClick={() => setViewMode("large")}
                className={viewMode === "large" ? styles.activeViewMode : ""}
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={() => setViewMode("tiles")}
                className={viewMode === "tiles" ? styles.activeViewMode : ""}
              >
                <Grid size={20} />
              </button>
              <button onClick={() => setViewMode("list")} className={viewMode === "list" ? styles.activeViewMode : ""}>
                <List size={20} />
              </button>
            </div>
          </div>
          <div className={`${styles.cardarrangement} ${styles[viewMode]} ${styles.animateItem}`}>
            {projects.map((project, index) => (
              <Link
                key={index}
                to={project.link}
                className={`${styles.cardLink} ${styles.animateItem} ${styles[`animateDelay${index + 1}`]}`}
                onClick={scrollToTop}
              >
                <Card title={project.title} imageUrl={project.imageUrl} viewMode={viewMode} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.contactSection} ${styles.animateSection} ${styles.animateDelay8}`}>
        <h2 className={`${styles.contactTitle} ${styles.animateItem}`}>Let's Connect</h2>
        <p className={`${styles.contactDescription} ${styles.animateItem}`}>
          Have a project in mind or just want to chat? Drop me a line.
        </p>
        <form className={`${styles.contactForm} ${styles.animateItem}`} onSubmit={handleEmailSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.formLabel}>
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your project or inquiry..."
              className={styles.formTextarea}
              rows={5}
              required
            />
          </div>

          <Button
              variant="icon-and-text"
              label="Send Message"
              isActive={false}
              style={{ backgroundColor: "#f4ead9", color: "#000", fontWeight: "400" }}
              icon=<Send/>
            />
        </form>
      </div>
    </div>
  )
}

export default Home
