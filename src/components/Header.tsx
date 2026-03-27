"use client"

import React, { useState, useEffect } from "react"
import styles from "./Header.module.css"

interface DetailItem {
  label: string
  value: string
}

interface HeaderProps {
  title: string
  imageSrc: string
  imageAlt: string
  details: DetailItem[]
}

const Header: React.FC<HeaderProps> = ({ title, imageSrc, imageAlt, details }) => {
  const [typedTitle, setTypedTitle] = useState("")

  const titleWords = title.trim().split(' ')
  const titlePrefix = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') + ' ' : ''
  const titleSuffix = titleWords.length > 1 ? titleWords[titleWords.length - 1] : title

  useEffect(() => {
    const speed = 45

    // Type only the last two words of the title
    let i = 0
    const titleInterval = setInterval(() => {
      i++
      setTypedTitle(titleSuffix.slice(0, i))
      if (i >= titleSuffix.length) clearInterval(titleInterval)
    }, speed)

    return () => {
      clearInterval(titleInterval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.headerContainer}>
      <div className={styles.imageWrapper}>
        <img src={imageSrc || "/proj2.png"} alt={imageAlt} className={styles.headerImage} />
      </div>
      <h1 className={styles.headerTitle}>
        {titlePrefix}<span className={styles.typedSuffix}>{typedTitle}</span><span style={{ opacity: 0 }}>{titleSuffix.slice(typedTitle.length)}</span>
      </h1>
      <div className={styles.detailsRow}>
        {details.map((detail, index) => (
          <div key={index} className={styles.detailPair}>
            <span className={styles.detailLabel}>{detail.label}</span>
            <span className={styles.detailValue}>{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Header
