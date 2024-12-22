import React from "react";
import styles from "./Home.module.css";
import styles2 from "./Projects/Projects.module.css";
import Button from "../components/Button";
import buttonstyles from "./About.module.css";

const About: React.FC = () => {
  return (
    <div className={styles.contentContainer}>
      <div className={buttonstyles.heroSection}>
        <div className={styles.heroline}>
          <p className={styles.p2}>NOEFAL AHMED</p>
          <p className={styles.p2}>REMOTE-FIRST PRODUCT DESIGNER</p>
        </div>
        <h1 className={buttonstyles.h1}>
          <span >DESIGN</span>
          <span> +</span>
          <span > ENGINEERING</span>
        </h1>

      </div>

      <div className={buttonstyles.workSection}>
        <div className={buttonstyles.workItem}>
          <img src="/assets/work1.png" className={buttonstyles.icon}></img>
          <div className={styles2.sub2section}>
            <h2 className={styles2.sh2}>UX STRATEGIC PLANNING</h2>
            <p className={styles2.p1}>
              In depth analysis of your business, competitive standards,
              industry benchmarks, roadmap, and input parameters to develop a
              design-centric strategy that addresses your unique challenges.
            </p>
          </div>
        </div>
        <div className={buttonstyles.workItem}>
          <img src="/assets/work2.png" className={buttonstyles.icon}></img>
          <div className={styles2.sub2section}>
            <h2 className={styles2.sh2}>USER EXPERIENCE & INTERFACE DESIGN</h2>
            <p className={styles2.p1}>
              End-to-end delivery of workflows that are well-research, defined,
              iterated, prototyped, and measured to drive user retention and
              customer satisfaction.
            </p>
          </div>
        </div>
        <div className={buttonstyles.workItem}>
          <img src="/assets/work3.png" className={buttonstyles.icon}></img>
          <div className={styles2.sub2section}>
            <h2 className={styles2.sh2}>BRANDING</h2>
            <p className={styles2.p1}>
              From Logo to Packaging, Social media to Website, and Style Guides
              to Assets, I provide authenticity and identity that attracts,
              retains, and engages audiences.{" "}
            </p>
          </div>
        </div>
        <div className={buttonstyles.workItem}>
          <img src="/assets/work4.png" className={buttonstyles.icon}></img>
          <div className={styles2.sub2section}>
            <h2 className={styles2.sh2}>DESIGN TO CODE</h2>
            <p className={styles2.p1}>
              Component Libraries, Spec Sheets, Design Tokens, Grid Systems, and
              Responsiveness.
            </p>
          </div>
        </div>
      </div>


      <div className={buttonstyles.contactSection}>

        <p className={styles2.p1}>
        Making sense of things is what I do best, whether it’s designing user experiences,
          bringing them to life using code, or creating a product from the
          ground up. Today, as I seek Senior Design roles, I’m equipped
          with a greater understanding of design as a function of a business. 
          Feel free to reach out!</p>
        <a
            className={buttonstyles.navButton}
            href="https://calendly.com/noefalahmed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="text-only"
              label="Request Call"
              isActive={false}
              onlight={true}
            />
          </a>
       </div>
    </div>
  );
};

export default About;
