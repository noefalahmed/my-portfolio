import React from "react"
import styles from "./Home.module.css"
import Card from "../components/Card"
import { Link } from "react-router-dom"
import { Grid, List, Maximize2 } from "lucide-react"
import "../styles/logo-animation.css"
import "../styles/logo-animation-2.css"
import "../styles/logo-animation-3.css"
import "../styles/logo-animation-4.css"





const Home: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"large" | "tiles" | "list">("large")

  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  const projects = [
    { title: "Applied Design Thinking", imageUrl: "assets/designthinking.png", link: "design-thinking" },
    { title: "Design Leadership at Arine", imageUrl: "assets/arine.png", link: "arine" },
    { title: "How I Created a Component Library", imageUrl: "assets/designsystems.png", link: "design-systems" },
    { title: "Designing Icons", imageUrl: "assets/iconpackpng.png", link: "icon-pack" },
  ]



  const LogoAnimation = () => (
    <div className="logo-container">
      <div className="logo-rect rect1"></div>
      <div className="logo-rect rect2"></div>
      <div className="logo-rect rect3"></div>
      <div className="logo-rect rect4"></div>
    </div>
  )

  const LogoAnimation2 = () => (
    <div className="logo-animation-2-container">
      <div className="logo-animation-2-triangle-back"></div>
      <div className="logo-animation-2-triangle-mid"></div>
      <div className="logo-animation-2-triangle"></div>
    </div>
  )

  const LogoAnimation3 = () => (
    <div className="logo-animation-3-container">
      <div className="logo-animation-3-circle">
        <div className="logo-animation-3-eye-shape">
          <div className="logo-animation-3-eyeball"></div>
        </div>
      </div>
    </div>
  )

  const LogoAnimation4 = () => (
    <div className="logo-animation-4-container">
      <div className="logo-animation-4-line"></div>
      <div className="logo-animation-4-line"></div>
      <div className="logo-animation-4-line"></div>
    </div>
  )



  return (
    <div className={styles.contentContainer}>
      <div className={styles.heroSection}>
        <p className={styles.p2}>SENIOR PRODUCT DESIGNER BASED IN LAHORE</p>
        <h1 className={styles.h2}>NOEFAL AHMED</h1>
        <div className={styles.heroline}>
        
          <Link to="/" className={styles.heroLink} style={{display:"flex",flexDirection:"row", alignItems:"center",gap:"8px"}}>
          <LogoAnimation2/>
            UX STRATEGY
          </Link>
          <Link to="/" className={styles.heroLink} style={{display:"flex",flexDirection:"row", alignItems:"center",gap:"8px"}}>
          <LogoAnimation/>
            PRODUCT DESIGN
          </Link>
          <Link to="/" className={styles.heroLink} style={{display:"flex",flexDirection:"row", alignItems:"center",gap:"8px"}}>
          <LogoAnimation3/>
            BRANDING
          </Link>
          <Link to="/" className={styles.heroLink} style={{display:"flex",flexDirection:"row", alignItems:"center",gap:"8px"}}>
          <LogoAnimation4/>

            DESIGN TO CODE
          </Link>
        </div>
      </div>
      <div className={styles.workSection}>
        <div className={styles.subsection}>
          <div className={styles.featuredWorkHeader}>
            <p className={styles.p2}>FEATURED WORK</p>
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
          <div className={`${styles.cardarrangement} ${styles[viewMode]}`}>
            {projects.map((project, index) => (
              <Link key={index} to={project.link} className={styles.cardLink} onClick={scrollToTop}>
                <Card title={project.title} imageUrl={project.imageUrl} viewMode={viewMode} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

