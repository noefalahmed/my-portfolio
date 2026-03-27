import type React from "react"
import styles from "./Projects.module.css"
import Header from "../../components/Header"

const Precisely: React.FC = () => {
  return (
    <div className={styles.page}>
      <Header
                title="i created a design system for a Rewards app."
                imageSrc="public/proj2.png"
                imageAlt="Description of image"
                details={[
                    { label: "Company", value: "Eat Sleep Repeat" },
                    { label: "Role", value: "UX Designer" },
                    { label: "Duration", value: "7 Months" },
                    { label: "Skills", value: "Design Systems, UI, Product Design" },
                ]}/>
      <div className={styles.contentcontainer}>
        <div className={styles.subsection}>
        <p
            className={styles.p1}
            style={{
              fontSize: "28px",
              fontWeight: 400,
              opacity: 1,
            }}
          >
            <strong>Precisely</strong> is a Figma plugin that can auto-generate grids, outlines, anchors, and handles
            for your shapes.
          </p>
        </div>

        <div className={styles.subsection}>
          <h2 className={styles.sh2}>ABOUT</h2>
          <div className={styles.rowcontent} style={{ alignItems: "flex-start" }}>
            <div className={styles.sub2section}>
              <p className={styles.p1}>
                The more complex your shapes are, the longer it takes for you to show your thought process and technique
                to build them. And we hate this for you. Also, we love Figma. So we found a way to make things easier
                for you right where you design everything else.
              </p>
              <img src="/assets/P3.png" className={`${styles.image} ${styles['image-large']}`} />
              <img src="/assets/P4.png" className={`${styles.image} ${styles['image-large']}`} /> 

            </div>
          </div>
        </div>


        <div className={styles.subsection}>
          <h2 className={styles.sh2}>RELEASE</h2>
          <div className={styles.rowcontent} style={{ alignItems: "flex-start" }}>
            <div className={styles.sub2section}>
              <p className={styles.p1}>Expected Launch Date: May 2025.</p>
              <p className={styles.p1}  style={{
              fontSize: "28px",
              fontWeight: 400,
              opacity: 1,
            }}>
                Current Phase:
                <a
             
                className={styles.p1}
                style={{
                  color: "#6B57F0",
                  marginLeft:"8px",
                  fontSize: "28px",
                  fontWeight: "400",
                  opacity: 1,
                }}
              >
                Finishing Development
              </a>
          
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Precisely

