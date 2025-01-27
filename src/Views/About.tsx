import type React from "react"
import { Link } from "react-router-dom"
import styles from "./About.module.css"

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.47 2H3.53C2.69 2 2 2.69 2 3.53v16.94C2 21.31 2.69 22 3.53 22h16.94c.84 0 1.53-.69 1.53-1.53V3.53C22 2.69 21.31 2 20.47 2zM8.09 18.74h-3v-9h3v9zM6.59 8.48c-.96 0-1.73-.77-1.73-1.73s.77-1.73 1.73-1.73 1.73.77 1.73 1.73-.77 1.73-1.73 1.73zm12.15 10.26h-3v-4.38c0-1.12-.02-2.57-1.57-2.57-1.57 0-1.81 1.22-1.81 2.48v4.47h-3v-9h2.88v1.32h.04c.4-.76 1.39-1.57 2.86-1.57 3.06 0 3.62 2.01 3.62 4.63v4.62z" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const ResumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6zm2-6h8v2H8v-2zm0-3h8v2H8v-2zm0-3h4v2H8V8z" />
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

