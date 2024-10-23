// src/components/Footer.tsx
import React from 'react';
import styles from './Footer.module.css'; // Importing the styles
// import { Link } from 'react-router-dom';
import Button from './Button.tsx';

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.linksection}>
        <a className={styles.navButton} href="https://linkedin.com/in/noefalahmed" target="_blank" rel="noopener noreferrer">
            <Button variant="text-only" 
                label="LinkedIn" 
                isActive={false}/>
          </a>
          <a className={styles.navButton} href="https://calendly.com/noefalahmed" target="_blank" rel="noopener noreferrer">
            <Button variant="text-only" 
                label="Resume" 
                isActive={false}/>
          </a>
          <a className={styles.navButton} href="https://github.com/noefalahmed" target="_blank" rel="noopener noreferrer">
            <Button variant="text-only" 
                label="Github" 
                isActive={false}/>
          </a>
      </div>
    </div>
  );
};

export default Footer;