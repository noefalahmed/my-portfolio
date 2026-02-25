"use client"

import React, { useState, useEffect, useRef } from "react"
import styles from "./Navbar.module.css"
import { Download } from "lucide-react";

const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const THRESHOLD = 4

    function onScroll() {
      const y = window.scrollY
      const delta = y - lastScrollY.current

      if (delta > THRESHOLD) {
        setHidden(true)
      } else if (delta < -THRESHOLD) {
        setHidden(false)
      }

      setScrolled(y > 10)
      lastScrollY.current = y
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`${styles.navbar} ${hidden ? styles.navbarHidden : ""} ${scrolled ? styles.navbarScrolled : ""}`}
    >
      <a href="/" className={styles.logo} aria-label="Home">
        <img src="/assets/Logo.svg" alt="Logo" width="24" height="24" />
      </a>
      <div className={styles.navLinks}>
        <a href="/public/resume.pdf" download className={styles.navLink}><span>Resume</span>  <Download size={16} strokeWidth={1.5} />
</a>
       {/*<a href="/about" className={styles.navLink}>About</a>*/} 
      </div>
    </nav>
  )
}
export default Navbar
