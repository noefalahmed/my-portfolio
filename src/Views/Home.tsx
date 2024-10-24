
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
            <div className={styles.typewriter}>
            <h1 className={styles.h1}><span>Product Designer </span>
            <span>(SaaS/B2B/B2C)</span></h1>
            </div>
            <p className={styles.p1}>
            on a mission to create products and experiences that impact people's lives.</p>
        </div>
        <div className={styles.workSection}>
            <div className={styles.subsection}>
                <h2 className={styles.preheading}>Featured Work</h2>
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