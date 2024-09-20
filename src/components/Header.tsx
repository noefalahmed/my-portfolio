// src/components/Header.tsx
import React from 'react';
import './Header.module.css'; // CSS for Header styling
import styles from  './Header.module.css';
import Button from './Button'
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


interface HeaderProps {

  imageUrl:string;
  pretitle:string;
  title:string;
  subtitle:string;
  isDark:boolean;
  style?: React.CSSProperties;  // Allow custom styles to be passed

}

const Header: React.FC<HeaderProps> = ({imageUrl, title, subtitle,style}) => {


    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1); // Navigate back in the history stack
    };

  return (
    <div className={styles.header}>
        <div className={styles.iconbutton}>
            <Button onlight={true} variant="icon-and-text" icon={<MdArrowBackIos />} label='Back' onClick={handleBack} ></Button>
        </div>
        <img src={imageUrl} className={styles.image} />
        <h2 className={styles.subtitle} style={style}>{subtitle} </h2>
        <h1 className={styles.title} style={style}>{title}</h1>
    </div>
  );
};

export default Header;