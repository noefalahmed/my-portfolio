// src/components/Card.tsx
import React from 'react';
import './Card.module.css'; // CSS for card styling
import styles from  './Card.module.css';

interface CardProps {
  title: string;
  imageUrl:string;
  isLarge:Boolean;
}

const Card: React.FC<CardProps> = ({imageUrl, title, isLarge }) => {
  return (
    <div className={`${styles.card} ${isLarge ? styles['card-large'] : styles['card-small']}`}>
        <img src={imageUrl} alt={title} className={styles['card-image']} />
        <h3 className={styles['card-title']}>{title}</h3>
    </div>
  );
};

export default Card;