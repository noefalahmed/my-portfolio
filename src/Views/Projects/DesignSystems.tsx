import styles from './Projects.module.css'
import Header from '../../components/Header'
import HeaderImage from '/assets/designsystems.png';

const DesignSystems: React.FC = () => {
    return (
        <div className={styles.page}>
            
            <Header isDark={true} imageUrl={HeaderImage} pretitle="Project" subtitle="How I Created a" title="Component Library"/>
            <div className={styles.contentcontainer}>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>About</h1>
                    <p className={styles.p1}>Eat, Sleep, Repeat, or ESR, provides food enthusiasts with discounts and reviews for restaurants, both beloved and new. In 2020, I collaborated with ESR and designed their debut mobile phone user experience. I designed a simple user journey that transformed their tedious manual discount availing process into a 1 minute interaction on the phone.</p>
                    <img src="./assets/ds1.png" className={`${styles.image} ${styles['image-dynamic']}`} ></img>

                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Why We Needed a Rulebook</h1>
                    <p className={styles.p1}>Business challenges such as inconsistent designs, new brand identity, and design to development friction led to the formation of a foundational design system.</p>
                    <img src="./assets/ds2.png" className={`${styles.image} ${styles['image-dynamic']}`} ></img>

                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Founding Principles</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Atomicity</h2>
                                <p className={styles.p1}>Each piece is part of a greater whole. Elements combine to form components that combine to form larger components. This was needed to ensure consistency in component structures, saving time to set up a working library.</p>
                            </div> 
                            <img src="./assets/ds3.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Salience</h2>
                                <p className={styles.p1}>Content and Components should prioritise information architecture, and visual hierarchy to capture expectations of ESR community members.</p>
                            </div> 
                            <img src="./assets/ds4.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Scalability</h2>
                                <p className={styles.p1}>The system should be considerate of multiple environments and patterns. Components should be meaningful but flexible enough to scale them when ESR becomes available on Tablet and Desktop.</p>
                            </div> 
                            <img src="./assets/ds5.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Style Guide</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Typography</h2>
                                <p className={styles.p1}>Legible and simple, Inter provides the best experience for an audience looking to find value in the shortest amount of time. </p>
                            </div> 
                            <img src="./assets/ds6.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Color System</h2>
                                <p className={styles.p1}>Colors that incite hunger encourage audiences. 95% of food branding incorporate the use of Red, Yellow, and Orange. Based on this, I created a color palette and added the necessary dark, light, and complementary colors.</p>
                            </div> 
                            <img src="./assets/ds7.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Grid System</h2>
                                <p className={styles.p1}>I set up a simple 8 point grid system with live areas and margins to ensure consistency of organisation across the different phone sizes.</p>
                            </div> 
                            <img src="./assets/ds8.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                    <h2 className={styles.sh2}>Iconography</h2>
                                    <p className={styles.p1}>Read more about how I created this icon set </p>

                            </div> 
                            <img src="./assets/ds9.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>

                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Component Library</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>Navigation</h2>
                            <img src="./assets/ds11.png" className={`${styles.image} ${styles['image-large']}`}></img>
                        </div>
                        <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>Content</h2>
                            <img src="./assets/ds12.png" className={`${styles.image} ${styles['image-large']}`}></img>
                        </div>
                        <div className={styles.cardarrangement}>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="./assets/ds13.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Text Fields</h2>
                                <img src="./assets/ds14.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Buttons</h2>
                                <img src="./assets/ds15.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Avatars</h2>
                                <img src="./assets/ds16.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Toasts</h2>
                                <img src="./assets/ds17.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Tool Tips</h2>
                                <img src="./assets/ds18.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Badges</h2>
                                <img src="./assets/ds19.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Progress Indicators</h2>
                                <img src="./assets/ds20.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            </div>
                        </div>  

                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Achievements</h1>
                    <div className={styles.sub2section}>
                        <img src="./assets/ds21.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                        <p className={styles.p1}>
                            <li>100+ Reusable Figma Components</li>
                            <li>30 Icons and brand illustrations</li>
                            <li>Reduced dev time by 30%</li>
                        </p>
                    </div>

                    
                </div>
            </div>
        </div>
    );
  };
  
 export default DesignSystems; 