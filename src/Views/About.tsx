import type React from "react"
import styles from "./About.module.css"

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.47 2H3.53C2.69 2 2 2.69 2 3.53v16.94C2 21.31 2.69 22 3.53 22h16.94c.84 0 1.53-.69 1.53-1.53V3.53C22 2.69 21.31 2 20.47 2zM8.09 18.74h-3v-9h3v9zM6.59 8.48c-.96 0-1.73-.77-1.73-1.73s.77-1.73 1.73-1.73 1.73.77 1.73 1.73-.77 1.73-1.73 1.73zm12.15 10.26h-3v-4.38c0-1.12-.02-2.57-1.57-2.57-1.57 0-1.81 1.22-1.81 2.48v4.47h-3v-9h2.88v1.32h.04c.4-.76 1.39-1.57 2.86-1.57 3.06 0 3.62 2.01 3.62 4.63v4.62z" />
  </svg>
)


const About: React.FC = () => {
  return (
    <div className={styles.contentContainer}>
      <div className={styles.aboutSection}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <p className={styles.description}>
            I’m a Senior Product Designer from Pakistan on a mission 🚀 to design experiences that impact people’s lives. I’ve studied computer science, researched on AI, and designed various web and mobile products. I’m currently building Precisely for Figma to enhance design workflows.
            </p>

            <div className={styles.links}>
              <a
                href="https://linkedin.com/in/yourusername"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
        
            </div>
          </div>

          <div className={styles.imageContainer}>
            <img src="../Display.jpg" alt="Noefal Ahmed" width={200} height={200} className={styles.profileImage} />
          </div>
        </div>

        <div className={styles.skillsSection}>
          <h2 className={styles.skillsTitle}>Core Skills</h2>
          <div className={styles.skills}>
            <div className={styles.skill}>Designing with AI</div>
            <div className={styles.skill}>Accessible Design</div>
            <div className={styles.skill}>UX Strategy</div>
            <div className={styles.skill}>Product Design</div>
            <div className={styles.skill}>Design Systems</div>
            <div className={styles.skill}>Prototyping</div>
            <div className={styles.skill}>User Research</div>
            <div className={styles.skill}>Front-end Development</div>
            <div className={styles.skill}>Branding</div>
            <div className={styles.skill}>Logo Design</div>
            <div className={styles.skill}>2D Animation</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

