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
                    <img src="/assets/arine1.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>

                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Visual Identity [2021]</h1>
                    <div className={styles.sub1section}>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <p className={styles.p1}>When we first huddled in the board room, it was essential to bring to life a brand consistent with its messaging. Our mind-map consisted of the following:</p>
                            </div> 
                            <img src="/assets/arine2.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <p className={styles.p1}>Our direction became patent when we scribbled some ideas that symbolised natural elements, circles, and unification.</p>
                            </div> 
                            <img src="/assets/arine3.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <p className={styles.p1}>In the end, we chose the symbol that offered the best visual and tonal depiction of Arine as a skin-care brand </p>
                        <div className={styles.sub2section}>
                            <img src="/assets/arine4.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                            <img src="/assets/arine5.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                        </div>

                    </div>    
                </div>
                <div className={styles.subsection}>
                    <div className={styles.sub2section}>
                            <h1 className={styles.sh2}>Colors</h1>
                                <div className={styles.rowcontent}>
                                    <img src="/assets/arine6.png" className={`${styles.image} ${styles['image-small']}`}></img>
                                    <img src="/assets/arine7.png" className={`${styles.image} ${styles['image-small']}`}></img>
                                </div>
                    </div>
                    <div className={styles.sub2section}>
                            <h1 className={styles.sh2}>Typography</h1>
                                <div className={styles.rowcontent}>
                                    <img src="/assets/arine8.png" className={`${styles.image} ${styles['image-small']}`}></img>
                                    <img src="/assets/arine9.png" className={`${styles.image} ${styles['image-small']}`}></img>
                                </div>
                    </div>
                    <img src="/assets/arine10.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                </div>

                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Collaboration with the Rising Sun Institute (2022)</h1>
                    <p className={styles.p1}>Arine Skincare was founded with the intention to empower the local community and to sustainably give back to the underprivileged. Collaborating with The Rising Sun Institute, a local NGO dedicated to empowering children with special needs and disabilities, we banded together to provide a learning activity to these kids. This helped us sell a new product and donate the funds to The Rising Sun.</p>
                    <div className={styles.sub1section}> 
                            <div className={styles.sub1section}>
                                <h1 className={styles.sh2}>Strategy</h1>
                                <img src="./assets/arine12.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                                <ol className={styles.p1}>
                                <li>Arine provides cloth for kids to stitch into tote bags.</li>
                                <li>Tote bags ready to be used are sent to Arine.</li>
                                <li>We print designs on them and sell to customer base.</li>
                                <li>Profit generated is donated to Rising Sun.</li>
                                <li>A portion of the profit is used to buy more cloth.</li>
                                </ol>
                            </div> 
                            <img src="/assets/arine13.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>  
                            <img src="/assets/arine14.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>                        
                            <img src="/assets/arine15.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>                        
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
 export default Arine; 