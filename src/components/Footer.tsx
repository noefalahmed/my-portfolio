// src/components/Footer.tsx
import React from 'react';
import styles from './Footer.module.css'; // Importing the styles
// import { Link } from 'react-router-dom';
import Button from './Button.tsx';

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.avatar}>
      </div>
      <div className={styles.linksection}>
        <Button label="LinkedIn" variant="text-only" isActive={false}/>
        <Button label="Github" variant="text-only" isActive={false}/>
        <Button label="Resume" variant="text-only" isActive={false}/>
      </div>
    </div>
  );
};

export default Footer;