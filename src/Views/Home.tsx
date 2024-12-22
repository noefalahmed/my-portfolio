
// src/pages/Home.tsx
import React from 'react';
import styles from './Home.module.css';
import Card from '../components/Card';
import {Link} from 'react-router-dom';
import styles2 from '../components/Card.module.css'



const Home: React.FC = () => {

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };
      
  return(
    <div className={styles.contentContainer}>
        <div className={styles.heroSection}>
            <p className={styles.p2} style={{textAlign: 'left'}}>BASED IN LAHORE / REMOTE-FIRST</p>
            <h1 className={styles.h2} >NOEFAL AHMED</h1>
           <div className={styles.heroline}>
           <p className={styles.p2}>PRODUCT DESIGN</p>
           <p className={styles.p2}>UX STRATEGY</p>
           <p className={styles.p2}>BRANDING</p>
           <p className={styles.p2}>DESIGN TO CODE</p>
           </div>

        </div>
        <div className={styles.workSection}>
            <div className={styles.subsection}>
                <p className={styles.p2}>FEATURED WORK</p>
                    <Link to="design-thinking" className={styles2.card} onClick={scrollToTop}>
                        <Card
                            title="Applied Design Thinking"
                            imageUrl="assets/designthinking.png"
                            isLarge={true}
                        />
                    </Link>
                    <Link to="arine" className={styles2.card} onClick={scrollToTop}>
                        <Card
                            title="Design Leadership at Arine"
                            imageUrl="assets/arine.png"
                            isLarge={true}
                        />
                    </Link>
                      <Link to="design-systems" className={styles2.card} onClick={scrollToTop}>

                        <Card
                            title="How I Created a Component Library"
                            imageUrl="assets/designsystems.png"
                            isLarge={true}
                        />
                    </Link>
                    <Link to="icon-pack" className={styles2.card} onClick={scrollToTop}>

                        <Card
                            title="Designing Icons"
                            imageUrl="assets/iconpackpng.png"
                            isLarge={true}
                        />
                    </Link>
                  
            </div>
            {/* <div className={styles.subsection}>
                <h2 className={styles.preheading}>Projects</h2>
                <div className={styles.cardarrangement}>
                    <Link to="design-thinking" className={styles2.card} onClick={scrollToTop}>
                        <Card
                            title="Applied Design Thinking"
                            imageUrl="assets/designthinking.png"
                            isLarge={false}
                        />
                    </Link>
                    <Link to="arine" className={styles2.card} onClick={scrollToTop}>
                        <Card
                            title="Usability & Accessibility Study"
                            imageUrl="assets/arine.png"
                            isLarge={false}
                        />
                    </Link>
                    <Link to="icon-pack" className={styles2.card} onClick={scrollToTop}>

                        <Card
                            title="Visual Design at Arine"
                            imageUrl="assets/iconpackpng.png"
                            isLarge={false}
                        />
                    </Link>
                    <Link to="design-systems" className={styles2.card} onClick={scrollToTop}>

                        <Card
                            title="How I Created a Design System"
                            imageUrl="assets/designsystems.png"
                            isLarge={false}
                        />
                    </Link>
                </div>
            </div> */}
        </div>

  </div>
  );
};

export default Home;