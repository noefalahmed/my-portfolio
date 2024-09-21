import styles from './Projects.module.css'
import Header from '../../components/Header'
import HeaderImage from '/assets/iconpackpng.png';

const IconPack: React.FC = () => {
    return (
        <div className={styles.page}>
            
            <Header style={{color:'var(--DarkSurface)'}} isDark={false} imageUrl={HeaderImage} pretitle="Project" subtitle="Designing an" title="Icon Set"/>
            <div className={styles.contentcontainer}>


                <div className={styles.rowcontent} style={{alignItems: 'flex-start'}}>
                    <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>What's In It</h2>
                            <p className={styles.p1}>
                                    <li>25+ icons </li>
                                    <li>Types: System Icons, Brand Icons</li>
                                    <li>States: Active, Inactive</li>
                            </p>
                    </div>
                    <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>Why I Created a Set</h2>
                            <p className={styles.p1}>
                                    <li>Audit was conducted to verify need for custom icons</li>
                                    <li>Unique look and feel of the product to position brand in market</li>
                                    <li>Saving time designing in the long run.</li>
                            </p>
                    </div>
                </div>


            <div className={styles.rowcontent}>
                <div className={styles.sub2section}>
                    <h2 className={styles.sh2}>The Audit</h2>
                    <p className={styles.p1}>After initial sketching/wireframing of the application, an audit was carried out involving the developers of the application. Actions on the application were assigned icons. The goal was to enhance the experience of the product by using appealing and meaningful metaphors.</p>
                </div>
                <img src="./assets/iconpack1.png" className={`${styles.image} ${styles['image-small']}`}></img>
            </div>


            <div className={styles.rowcontent}>
                <div className={styles.sub2section}>
                    <h2 className={styles.sh2}>The Moodboard</h2>
                    <p className={styles.p1}>I decided to keep the icon style simple and minimal to allow more scan-ability and less cognitive load. This was perfectly reflected in the icons over at Airbnb’s Design language system and Lineicons on Instagram.</p>
                </div>
                <img src="./assets/iconpack2.png" className={`${styles.image} ${styles['image-small']}`}></img>
            </div>


            <div className={styles.subsection}>
                <h2 className={styles.sh2}>The Anatomy</h2>

                <div className={styles.cardarrangement}>
                        <div className={styles.sub3section}>
                            <img src="./assets/iconpack3.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            <p className={styles.p1}>The initial rules of the icon library were not rigid as we intended for the product to grow and take a shape of its own. Based off Material Design, a 24x24 pixel grid with a live area of 20x20 pixel was used to create icons</p>
                        </div>
                        <div className={styles.sub3section}>
                            <img src="./assets/iconpack4.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            <p className={styles.p1}>Each icon consisted of only a 2 px stroke and occasionally small elements that are proportional to the  icon base shape. The corners are bubbly and rounded by 2 px with minor exceptions to larger shapes.</p>
                        </div>
                        <div className={styles.sub3section}>
                            <img src="./assets/iconpack5.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            <p className={styles.p1}>Flat geometrical shapes were best suited for the look and feel intended for the product. Loose shapes or literal representations were avoided.</p>
                        </div>
                        <div className={styles.sub3section}>
                            <img src="./assets/iconpack6.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            <p className={styles.p1}>Shapes should be optically balanced even when alignment on the grid is not perfect.</p>
                        </div>
                </div>
            </div>


            <div className={styles.subsection}>
                <h2 className={styles.sh2}>States</h2>

                <div className={styles.cardarrangement}>
                        <div className={styles.sub3section}>
                            <img src="./assets/iconpack7.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            <p className={styles.p1}>While designing active states, the strokes and the remaining area inside should be filled. The inner elements of the icon should be inverted as white strokes.</p>
                        </div>
                        <div className={styles.sub3section}>
                            <img src="./assets/iconpack8.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            <p className={styles.p1}>In some cases, active states can use embellishments to exaggerate the effect on the user. </p>
                        </div>
                </div>
            </div>

            <div className={styles.subsection} style={{gap:'30px'}}>
                <h2 className={styles.sh2}>Usage</h2>
                <img src="./assets/iconpack9.png" className={`${styles.image} ${styles['image-large']}`}></img>
                <img src="./assets/iconpack10.png" className={`${styles.image} ${styles['image-large']}`}></img>
                <div className={styles.rowcontent}>
                        <img src="./assets/iconpack11.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        <img src="./assets/iconpack12.png" className={`${styles.image} ${styles['image-small']}`}></img>
                </div>

            </div>


            </div>
        </div>
    );
  };
  
 export default IconPack; 