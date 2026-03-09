// src/components/Footer.tsx
import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.linksection}>
        <a className={styles.navButton} href="https://linkedin.com/in/noefalahmed" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className={styles.navButton} href="./assets/resume.pdf" download>Resume</a>
        <a className={styles.navButton} href="https://github.com/noefalahmed" target="_blank" rel="noopener noreferrer">Github</a>
      </div>
    </div>
  );
};

export default Footer;