import styles from './Projects.module.css'
import Header from '../../components/Header'
import HeaderImage from '/assets/designthinking.png';


const DesignThinking: React.FC = () => {
    return (
        <div className={styles.page}>
            
            <Header isDark={true} imageUrl={HeaderImage} pretitle="Project" subtitle="Applied" title="Design Thinking"/>
            <div className={styles.contentcontainer}>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>About</h1>
                    <p className={styles.p1}>At Upland Cimpl, a tool used for technology expense management, I helped users to better achieve cost transparency for their businesses. In a quarterly update to improve user satisfaction, I created a design process with the product team that allowed us to gather insights while designing and delivering solutions.</p>
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>The Problem</h1>
                    <p className={styles.p1}>Users use Accounts in Cimpl to manage, track, and dispute bills. These Accounts carry vital information used throughout Cimpl.</p>
                    <img src="/assets/cimple-1.png" className={`${styles.image} ${styles['image-dynamic']} `}></img>
                    <img src="/assets/cimple-2.png" className={`${styles.image} ${styles['image-large']}`}></img>

                    <div className={styles.sub1section} style={{alignItems: 'flex-start'}}>
                    <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>What I Heard</h2>
                            <p className={styles.p1}>
                                The UX of entering, managing, and finding data in Accounts asked for too much time and effort from users. 
                            </p>
                    </div>
                    <div className={styles.sub2section}>
                            <h2 className={styles.sh2}>What I Saw</h2>
                            <p className={styles.p1}>
                                Evaluating the UI, there was obvious room for improvements in organisation and hierarchy in all the related pages. However, since the problem arose from user frustration, I pushed to determine and prioritise the shortcomings of the current experience.
                            </p>
                    </div>
                </div>
               
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Design Process</h1>
                    <img src="/assets/cimple-3.png" className={`${styles.image} ${styles['image-large']}`}></img>
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Defining Friction</h1>
                    <p className={styles.p1}>After talking to a couple of these Account Managers about how they were using Accounts in Cimpl, I realised how frustrated they were. My use of the 5 Whys Method while asking questions helped me reached the root of these frustrations:</p>
                    <div className={styles.sub1section}>

                        <div className={styles.rowcontent} style={{alignItems: 'flex-start'}}>
                        <p className={styles.p1}>Related Accounts were poorly reflected in Cimpl. Root: Accounts had crucial parent child relations that were not easy to identify in Cimpl. </p>
                        <p className={styles.p1}> Important Information was hard to find. Root: Users needed to be able to smoothly scan and find crucial numbers and dates in between forms and tables.</p>
                        <p className={styles.p1}>Users lost time managing data outside of Cimpl. Root: Attributes of accounts that were not recorded in Cimpl were kept in Excel sheets. </p>
                       </div>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Creating a New Taxonomy</h2>
                                <p className={styles.p1}>We sat down with Account Managers to understand their need for a holistic account structure. </p>
                            </div> 
                            <img src="/assets/cimple-4.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Preventing Data Loss</h2>
                                <p className={styles.p1}>I worked with the product owner and dev team to look at new data requirements. Our goal was to make sure that Cimpl users don’t go looking elsewhere for information.</p>
                            </div> 
                            <img src="/assets/cimple-5.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Upadting the Sitemap</h2>
                                <p className={styles.p1}>The change in architecture brought new tabs and sections users could navigate to.</p>
                            </div> 
                            <img src="/assets/cimple-6.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                            <div className={styles.sub2section}>
                                    <h2 className={styles.sh2}>UI Evaluation</h2>
                                    <p className={styles.p1}>We evaluated and marked poorly designed components and misused patterns. This allowed us to lay out the design work for the project.</p>
                            </div> 
                            <img src="/assets/cimple-7.png" className={`${styles.image} ${styles['image-small']}`}></img>
                        </div>

                    </div>    
                </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Designing & Validating</h1>
                    <p className={styles.p1}>We explored designs for each of the tabs in Accounts. The agile nature of the process gave us time to focus on each Tab on it’s own. We generated concepts, iterated, and designed in high fidelity.</p>   
                    <img src="/assets/cimple-8.png" className={`${styles.image} ${styles['image-large']}`}></img>
                    <div className={styles.sub1section}>
                        <div className={styles.sub2section} style={{paddingTop:'24px'}}>
                            <h2 className={styles.sh2}>Applying Design Patterns</h2>
                            <p className={styles.p1}>We evaluated and marked poorly designed components and misused patterns. This allowed us to lay out the design work for the project.</p>   
                        </div>
                        <div className={styles.rowcontent}>
                                <div className={styles.sub2section}>
                                    <p className={styles.p1}>Providing Focus to users by creating space and direction.  </p>
                                </div> 
                                <img src="/assets/cimple-9.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                        </div> 
                        <div className={styles.rowcontent}>
                                <div className={styles.sub2section}>
                                    <p className={styles.p1}>Visual Hierarchy to show Account parent-child relations. We iterated on this to make adoption easier. </p>
                                </div> 
                                <img src="/assets/cimple-10.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                        </div> <div className={styles.rowcontent}style={{alignItems: 'flex-start'}}>
                                <div className={styles.sub2section}>
                                    <p className={styles.p1}>Applying Progressive Disclosure when creating accounts to improve task completion efficiency. </p>
                                </div> 
                                <img src="/assets/cimple-11.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                        </div> <div className={styles.rowcontent}>
                                <div className={styles.sub2section}>
                                    <p className={styles.p1}>Organising content by explicitly naming sections. This was trickier than we anticipated because we needed to talk to users to understand their mental model. </p>
                                </div> 
                                <img src="/assets/cimple-12.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                        </div>
                        <div className={styles.sub2section}>
                        <img src="/assets/cimple-13.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                        </div>

                    </div>
                    <div className={styles.sub1section}>
                        <div className={styles.sub2section} style={{paddingTop:'56px'}}>
                            <h2 className={styles.sh2}>Design Validation</h2>
                            <p className={styles.p1}>Without collaborating with end-users, it would have been an incomplete redesign effort. Internal Guerrilla testing and A/B testing sessions helped us decide between our concepts.</p>  
                            <img src="/assets/cimple-15.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>
                            <img src="/assets/cimple-16.png" className={`${styles.image} ${styles['image-dynamic']}`}></img>

                        </div>
                   </div>
                   </div>
                <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Delivering Solutions</h1>
                  <div className={styles.sub1section}>
                        <div className={styles.sub2section}>
                                <p className={styles.p1}>An all new Accounts Page, it’s sub sections/tabs, and a complete UI refresh for all existing components.</p>   
                                <img src="/assets/cimple-17.png" className={`${styles.image} ${styles['image-large']}`}></img>
                        </div>
                        <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Displaying Data Responsively</h2>
                                <p className={styles.p1}>Based off of built components from the Upland Design System, UI 2.0, I designed new components and layouts.</p>   
                                <img src="/assets/cimple-18.png" className={`${styles.image} ${styles['image-large']}`}></img>
                                
                        </div>
                        <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Improving Task Completion</h2>
                                <p className={styles.p1}>Using Progressive Disclosure, we made it easier to complete form-like tasks and to find everything right where it’s supposed to be.</p>   
                                <img src="/assets/cimple-19.png" className={`${styles.image} ${styles['image-large']}`}></img>
                            
                        </div>
                        <div className={styles.sub2section}style={{gap:'56px'}}>
                        <p className={styles.p1}>Specs of each redesigned page were also carefully created to minimise design to code friction. </p>
                                <img src="/assets/cimple-20.png" className={`${styles.image} ${styles['image-large']}`}></img>
                                <img src="/assets/cimple-21.png" className={`${styles.image} ${styles['image-large']}`}></img>
                        </div>
                  </div> 
                </div>
            </div>
        </div>
    );
  };
  
 export default DesignThinking; 