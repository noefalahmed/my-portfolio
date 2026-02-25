"use client"

import React from "react"
import styles from "./Header.module.css"
import HeaderAnimation from "./HeaderAnimation"

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
  return (
    <div className={styles.headerContainer}>
      <div className={styles.imageWrapper}>
        <img src={imageSrc || "/proj2.png"} alt={imageAlt} className={styles.headerImage} />
      </div>
      <h1 className={styles.headerTitle}>{title}</h1>
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
