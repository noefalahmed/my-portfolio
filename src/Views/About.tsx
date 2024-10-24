import React from 'react';
import styles from './Home.module.css';
import styles2 from './Projects/Projects.module.css'
import Button from '../components/Button';
import buttonstyles from './About.module.css'

const About: React.FC = () => {
  return (
    <div className={styles.contentContainer}>
    <div className={styles2.subsection}>
      <div className={styles2.sub2section}>
        <div className={styles.typewriter} style={{textAlign:'left'}}>
          <h1 className={styles.h1}>Noefal Ahmed</h1>
        </div>
        <h2 className={styles2.sh2}>Product Designer</h2>
        </div>
        <p className={styles2.p1}>
        I am a Mediator and Organiser at heart; I love the feeling that comes with making sense of things, whether it’s designing user experiences, bringing them to life using code, or creating a product from the ground up.         The intersection between Design and Engineering is where I found my footing and honed my skillset. Today, as I seek Senior Design roles, I’m equipped with a greater understanding of design as a function of a business.
        </p>
      </div>
      {/* Placeholder for future sections */}
      <div className={styles.workSection}>
        {/* Career progression diagram will go here */}
        {/* Calendar component will go here */}
        {/* Custom schedule component will go here */}
      </div>
      <a className={buttonstyles.navButton} href="https://calendly.com/noefalahmed" target="_blank" rel="noopener noreferrer">
            <Button variant="text-only" 
                label="Request Call" 
                isActive={false}
                onlight={true}/>
      </a>

      <div className={styles2.sub2section}>
      <h2 className={styles.preheading}>Career Progression</h2>
      <img src="/assets/cp1.png" className={`${styles2.image} ${styles2['image-dynamic']}`}></img>

      </div>

    </div>
  );
};

export default About;