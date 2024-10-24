// src/components/Navbar.tsx
import React, {useState} from 'react';
import styles from './Navbar.module.css'; // Importing the styles
import Button from './Button.tsx';
import { Link, useLocation } from 'react-router-dom'; 
// import { ReactComponent as Logo } from '/assets/Logo.svg';
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";


const Navbar: React.FC = () => {
  const location = useLocation();
  const [MenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!MenuOpen);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link to="/" className={styles.navButton}>
            <Button variant={location.pathname==='/' ? "text-only" :"icon-only"}
                label="Noefal Ahmed" 
                isActive={location.pathname === '/'} 
                icon={location.pathname === '/' ? null : <MdKeyboardArrowLeft />}
                />
        </Link>
      </div>
      <div className={styles.rightSection}>
        <Link to="about" className={styles.navButton}>
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
      {/* Menu button for smaller screens */}
      <div className={styles.menuButton}>
        <Button variant="icon-only" icon={<MdKeyboardArrowDown className={styles.icon}/>} onClick={toggleMenu} isActive={MenuOpen ? true: false}/>
      </div>

      {/* Dropdown menu that shows when menuOpen is true */}
      <div className={`${styles.dropdown} ${MenuOpen ? styles.show : ''}`}>
        <Link to="about" className={styles.navButton}>
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