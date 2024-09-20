import styles from './Projects.module.css'
import Header from '../../components/Header'
import HeaderImage from '/assets/guide.png';

const Guide: React.FC = () => {
    return (
        <div className={styles.page}>
            
            <Header isDark={false} imageUrl={HeaderImage} pretitle="Project" subtitle="A Guide to Designing Complex" title="Data Tables" style={{color:'#000000'}}/>
            <div className={styles.contentcontainer}>
                <div className={styles.subsection}>
                        <h1 className={styles.sh1}>About</h1>
                        <p className={styles.p1}>Crafting complex, data-rich tables taught me the importance of deeply understanding user needs to truly meet their evolving preferences. Here are 3 User Needs and accompanying solutions I learned though turning complex data tables into dynamic, engaging user experiences. </p>
                    </div>

                <div className={styles.subsection}>
                    <h2 className={styles.sh2}>The Anatomy</h2>

                    <div className={styles.cardarrangement}>
                            <div className={styles.sub3section}>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                                <p className={styles.p1}>The initial rules of the icon library were not rigid as we intended for the product to grow and take a shape of its own. Based off Material Design, a 24x24 pixel grid with a live area of 20x20 pixel was used to create icons</p>
                            </div>
                            <div className={styles.sub3section}>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                                <p className={styles.p1}>Each icon consisted of only a 2 px stroke and occasionally small elements that are proportional to the  icon base shape. The corners are bubbly and rounded by 2 px with minor exceptions to larger shapes.</p>
                            </div>
                            <div className={styles.sub3section}>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                                <p className={styles.p1}>Flat geometrical shapes were best suited for the look and feel intended for the product. Loose shapes or literal representations were avoided.</p>
                            </div>
                            <div className={styles.sub3section}>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                                <p className={styles.p1}>Shapes should be optically balanced even when alignment on the grid is not perfect.</p>
                            </div>
                    </div>
                </div>


                <div className={styles.subsection}>
                    <h2 className={styles.sh2}>States</h2>

                    <div className={styles.cardarrangement}>
                            <div className={styles.sub3section}>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                                <p className={styles.p1}>While designing active states, the strokes and the remaining area inside should be filled. The inner elements of the icon should be inverted as white strokes.</p>
                            </div>
                            <div className={styles.sub3section}>
                                <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                                <p className={styles.p1}>In some cases, active states can use embellishments to exaggerate the effect on the user. </p>
                            </div>
                    </div>
                </div>

                <div className={styles.subsection} style={{gap:'30px'}}>
                    <h2 className={styles.sh2}>Usage</h2>
                    <img src="" className={`${styles.image} ${styles['image-large']}`}></img>
                    <img src="" className={`${styles.image} ${styles['image-large']}`}></img>
                    <div className={styles.rowcontent}>
                        <div className={styles.sub3section}>
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <div className={styles.sub3section}>
                            <img src="" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
  };
  
 export default Guide; 