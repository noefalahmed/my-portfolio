//src/components/Button.tsx
import React from 'react';
import './Button.module.css'; // CSS for card styling
import styles from  './Button.module.css';
import { useState,useEffect } from 'react';
// import { useLocation } from 'react-router-dom'; 



interface ButtonProps {
  label?: string;
  variant: 'text-only' | 'icon-only' | 'icon-and-text'; // Define button types
  icon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;  // Allow custom styles to be passed
  isActive?: boolean;  // Add isActive prop
  onlight?:boolean;
}

const Button: React.FC<ButtonProps> = ({ label, variant, icon, onClick, style, isActive = false, onlight}) => {
  // const location = useLocation(); // Optionally use this to track route changes if needed
  const [active, setActive] = useState(isActive);  // Use active instead of isActive to avoid conflicts

  const handleClick = () => {
    setActive(true);
    if (onClick) {
      onClick();
    }
    else{
      setActive(isActive);
    }
  };
  
  // Optional: Reset active state on route change
  useEffect(() => {
    setActive(isActive);  // Reset active state when isActive prop changes
  }, [isActive]);


    return (
        <button 
        className={`${styles.button} ${styles[variant]} ${active ? styles.active : ''} ${onlight ? styles.onlight : ''}`} 
        onClick={handleClick}
        style={style}
      >
        {/* Render content based on variant */}
        {icon && <span className={styles.icon}>{icon}</span>}
        {variant !== 'icon-only' && label && <span className={styles.text}>{label}</span>}
      </button>
    );
};
  
  export default Button;