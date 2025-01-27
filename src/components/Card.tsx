import type React from "react"
import styles from "./Card.module.css"

interface CardProps {
  title: string
  imageUrl: string
  viewMode: "large" | "tiles" | "list"
}

const Card: React.FC<CardProps> = ({ imageUrl, title, viewMode }) => {
  return (
    <div className={`${styles.card} ${styles[`card-${viewMode}`]}`}>
      <div className={styles["card-image-container"]}>
        <img src={imageUrl || "/placeholder.svg"} alt={title} className={styles["card-image"]} />
      </div>
      <h3 className={styles["card-title"]}>{title}</h3>
    </div>
  )
}

export default Card

