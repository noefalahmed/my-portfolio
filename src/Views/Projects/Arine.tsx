import styles from './Projects.module.css'
import Header from '../../components/Header'
import HeaderImage from '/assets/arine.png';

const Arine: React.FC = () => {
    return (
        <div className={styles.page}>
            
            <Header isDark={true} imageUrl={HeaderImage} pretitle="Project" subtitle="Visual Design at" title="Arine"/>
            <div className={styles.contentcontainer}>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>About</h1>
                    <p className={styles.p1}>Launched in late 2020, Arine is a one-stop shop for organic skin care in Pakistan. Since then, Arine has emerged from a growing venture into a monumental business in the skincare industry in Pakistan. As one of its founding members, I was trusted to lead design-centric efforts including brand, visual, and web design. </p>
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Visual Identity [2021]</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <p className={styles.p1}>When we first huddled in the board room, it was essential to bring to life a brand consistent with its messaging. Our mind-map consisted of the following:</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <p className={styles.p1}>Our direction became patent when we scribbled some ideas that symbolised natural elements, circles, and unification.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <p className={styles.p1}>Content and Components should prioritise information architecture, and visual hierarchy to capture expectations of ESR community members.</p>

                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Founding Principles</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Atomicity</h2>
                                <p className={styles.p1}>Each piece is part of a greater whole. Elements combine to form components that combine to form larger components. This was needed to ensure consistency in component structures, saving time to set up a working library.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Salience</h2>
                                <p className={styles.p1}>Content and Components should prioritise information architecture, and visual hierarchy to capture expectations of ESR community members.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Scalability</h2>
                                <p className={styles.p1}>The system should be considerate of multiple environments and patterns. Components should be meaningful but flexible enough to scale them when ESR becomes available on Tablet and Desktop.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Style Guide</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Color System</h2>
                                <p className={styles.p1}>Each piece is part of a greater whole. Elements combine to form components that combine to form larger components. This was needed to ensure consistency in component structures, saving time to set up a working library.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Typography</h2>
                                <p className={styles.p1}>Content and Components should prioritise information architecture, and visual hierarchy to capture expectations of ESR community members.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Grid System</h2>
                                <p className={styles.p1}>The system should be considerate of multiple environments and patterns. Components should be meaningful but flexible enough to scale them when ESR becomes available on Tablet and Desktop.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                    <h2 className={styles.sh2}>Iconography</h2>
                                    <p className={styles.p1}>The system should be considerate of multiple environments and patterns. Components should be meaningful but flexible enough to scale them when ESR becomes available on Tablet and Desktop.</p>
                            </div> 
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>

                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Component Library</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>Navigation</h2>
                            <img src="" className={`${styles.image} ${styles['image-large']}`}></img>
                        </div>
                        <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>Content</h2>
                            <img src="" className={`${styles.image} ${styles['image-large']}`}></img>
                        </div>
                        <div className={styles.cardarrangement}>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                            <div className={styles.sub3section}>
                                <h2 className={styles.sh2}>Title Cards</h2>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                            </div>
                        </div>  

                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Achievements</h1>
                    <div className={styles.sub2section}>
                        <img src="" className={`${styles.image} ${styles['image-large']}`}></img>
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
  
 export default Arine; 