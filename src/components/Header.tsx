"use client"

// src/components/Header.tsx
import type React from "react"
import { useState, useEffect } from "react"
import "./Header.module.css" // CSS for Header styling
import styles from "./Header.module.css"
// import Button from './Button'
// import { MdArrowBackIos } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  imageUrl: string
  pretitle?: string
  title: string
  subtitle?: string
  style?: React.CSSProperties // Allow custom styles to be passed
}

const Header: React.FC<HeaderProps> = ({ imageUrl, title, subtitle, style }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100) // Small delay to ensure smooth animation start

    return () => clearTimeout(timer)
  }, [])

  // const navigate = useNavigate();
  // const handleBack = () => {
  //     navigate(-1); // Navigate back in the history stack
  // };

  return (
    <div className={`${styles.header} ${isLoaded ? styles.loaded : ""}`}>
      {/* <div className={styles.iconbutton}>
            <Button onlight={true} variant="icon-and-text" icon={<MdArrowBackIos />} label='Back' onClick={handleBack} ></Button>
        </div> */}
      <img
        src={imageUrl || "/placeholder.svg"}
        className={`${styles.backgroundImage} ${isLoaded ? styles.imageAnimated : ""}`}
        alt="Header background"
      />
      {subtitle && (
        <h2 className={`${styles.subtitle} ${isLoaded ? styles.textAnimated : ""}`} style={style}>
          {subtitle}
        </h2>
      )}
      <h1 className={`${styles.title} ${isLoaded ? styles.textAnimated : ""}`} style={style}>
        {title}
      </h1>
    </div>
  )
}

export default Header
