// src/components/Navbar.tsx
import React, {useState} from 'react';
import styles from './Navbar.module.css'; // Importing the styles
import Button from './Button.tsx';
import { Link, useLocation } from 'react-router-dom'; 
// import { ReactComponent as Logo } from '/assets/Logo.svg';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.navButton}>
            <Button variant="icon-and-text" 
                label="Noefal Ahmed" 
                isActive={location.pathname === '/'} 
                
            />
        </Link>
      </div>
      <div className={styles.rightSection}>
 

        <Link to="" className={styles.navButton}>
            <Button variant="text-only" 
                label="About" 
                isActive={location.pathname === '/about'} 
            />
        </Link>


          <a className={styles.navButton} href="https://calendly.com/noefalahmed" target="_blank" rel="noopener noreferrer">
            <Button variant="text-only" 
                label="Request Call" 
                isActive={false}/>
            </a>

      </div>
    </div>
  );
};
export default Navbar;