import styles from './Projects.module.css'
import Header from '../../components/Header'
import Accordion from "../../components/Accordion"
import Footer from '../../components/Footer'
const accordionItems = [
    {
      title: "The Problem",
      content: 
      <>
        <div className={styles.subsection}>
            <p>Where competitors were delivering innovative digital experiences, ESR was a start-up that relied on dated community forums. Starting from scratch, creating a mobile app was only the tip of the iceberg. The team hoped to expand across web, in-store kiosks, and future digital touchpoints. 
               Without a cohesive design system, every new digital product would require rebuilt components, which would in turn waste design and engineering resources and risk visual inconsistencies.
      </p>
            <img data-zoom src="./assets/ds2.png" className={`${styles.image} ${styles['image-large']} `} />
        </div>
      
      </>
    },
    {
      title: "The Process",
      content: 
      <>
      <p>So, I pushed to  create a component library in Figma from the ground up, defining fundamentals like design principles, typography, color, scale, and and translating them into reusable components</p>
      <br></br><br></br>
      <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Founding Principles</h1>
                    <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Atomicity</h2>
                                <p className={styles.p1}>I built the component library as modular primitives and composed patterns. This structure made it faster to create new variants and scale the system efficiently.</p>
                              <img data-zoom src="./assets/ds3.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Salience</h2>
                                <p className={styles.p1}>I organised components based on user priorities. This ensured that the interface hierarchy matched user intent and expected interaction patterns.</p>
                                 <img data-zoom src="./assets/ds4.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Scalability</h2>
                                <p className={styles.p1}>I designed the component library around proven, cross-platform UI patterns and responsive constraints. This foundation supports expansion of ESR from mobile to desktop and beyond.</p>
                                <img data-zoom src="./assets/ds5.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                    </div>    
        </div><br></br><br></br>
        <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Defining the Visual Language</h1>
                    <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Brand Identity</h2>
                                <p className={styles.p1}>Researchers from Ghent University show that visual cues can meaningfully shape attention and motivation related to food choice. So at launch, ESR needed a lively, high-energy presence that stood out at a glance while keeping primary actions clear. I defined a bold visual identity, concise CTA copy and hierarchy, and intentional animations that reinforce state changes.</p>                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Color System</h2>
                                <p className={styles.p1}>Per research in the Journal of Sensory Studies, warm colors (i.e. red, orange, yellow) stimulate appetite. I built ESR&apos;s palette around warm primaries, supported by light/dark and neutral variants to ensure clear hierarchy and meet WCAG contrast requirements.</p>
                                 <img data-zoom src="./assets/ds6.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Typography</h2>
                                <p className={styles.p1}>I chose Inter for its legibility and simplicity, ideal for users quickly scanning restaurant options. This type scale emphasizes readability at small sizes and stays consistent across screen sizes.</p>
                                <img data-zoom src="./assets/ds7.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Iconography</h2>
                                <p className={styles.p1}>Inspired by Airbnb's design language system, I developed an icon set that matched ESR's bold visual tone. Per Google's Material Design Guide, I leveraged a 24×24 grid with a 20×20 live area to keep sizing, alignment, and stroke decisions consistent.</p>
                                <img data-zoom src="./assets/ds8.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Grid System</h2>
                                <p className={styles.p1}>Aligned with Google&apos;s Material Design layout guidance, I used an 8-pt (8dp) baseline grid for layout and spacing (with 4dp increments for finer-grain alignment), and kept gutters in consistent multiples of 8. This ensures that spacing and alignment are uniform across breakpoints and speeds up responsive layout work.</p>
                                <img data-zoom src="./assets/ds9.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                                <img data-zoom src="./assets/ds91.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                    </div>    
        </div><br></br><br></br>
        <div className={styles.subsection}>
                    <h1 className={styles.sh1}>Building the Components</h1>
                    <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Component Inventory</h2>
                                <p className={styles.p1}>I catalogued necessary UI elements across key flows. This inventory became the roadmap that surfaced repeated patterns and redundancies at the offset, so components could be consolidated before scaling variants.</p>
                                <img data-zoom src="./assets/ds10.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Construction Logic</h2>
                                <p className={styles.p1}>Starting with essential primitive tokens (colors, fonts, spacing, corner-radius), I built out semantic tokens (styles) that could help me build components, allowing for efficient assembling of layouts in the long run.</p>
                                 <img data-zoom src="./assets/ds11.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Documentation</h2>
                                <p className={styles.p1}>I documented each component directly in Figma with usage guidance, do&apos;s/don&apos;ts, and implementation notes. This made adoption self-serve and reduced back-and-forth on how components should be applied.</p>
                                <img data-zoom src="./assets/ds13.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                    </div>    
        </div><br></br><br></br>

      </>
    },
    {
      title: "The Result",
      content: <>
            <div className={styles.largetext}> I built and iterated on a design system over several weeks. Locking down primitives and composite components made screen design much faster, so I could focus on user flows and interaction details instead of rebuilding UI basics.

<br></br><br></br>This groundwork enabled rapid scale. We moved from no digital presence to a cohesive, production-ready mobile platform in less than a month, with a maintainable foundation the team could extend as the product evolved.</div>
<div className={styles.fullBleedWrapper}>
  <img data-zoom src="./assets/ds0.png" className={styles.fullBleedImage} />
</div>
   </>
    },
    {
      title: "The Big Picture",
      content:
      <>
      <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Building Once, Deploying Everywhere</h2>
                                <p className={styles.p1}>A design system isn't just about making things look good. It's about building a foundation that scales with ambition. ESR's roadmap extends well beyond this mobile app. The team envisions web platforms, in-store kiosks, loyalty integrations, and digital touchpoints we haven't imagined yet. Without a unified system, each new surface means rebuilding components from scratch, burning design and engineering hours while risking visual inconsistency. A solid design system prevents that waste. It ensures every future product ships faster, looks cohesive, and builds on solved problems instead of reinventing them.</p>
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Tokens Over Templates</h2>
                                <p className={styles.p1}>The system prioritizes flexibility without sacrificing consistency. Everything anchors to design tokens: colors, typography, spacing, elevation. These tokens create a single source of truth that adapts across contexts. A mobile button can feel native to iOS while sharing the same semantic tokens as its web counterpart. This approach means we're not just designing screens; we're encoding decisions that travel across platforms. When the brand evolves or accessibility standards shift, we update tokens once and changes propagate everywhere. That's the leverage a good system provides.</p>
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2}>Systems Should Grow, Not Bloat</h2>
                                <p className={styles.p1}>The real test isn't whether the system works today. It's whether it evolves gracefully as the product matures. I've structured this to grow incrementally: start with foundational primitives, layer in base components, then compose complex patterns as needs emerge. This phased approach prevents overbuilding while staying flexible for future complexity. As ESR scales, the design system should feel like a living toolkit, not a rigid constraint. The goal is simple: empower teams to move fast with confidence, with guardrails that maintain quality without slowing down innovation.</p>
                            </div> 
        </div>
                            
    </>
    },
  ]
const DesignSystems: React.FC = () => {
    return (
        <div className={styles.page}>

            {/* Slide 1: Header */}
            <div className={styles.projectSlide}>
                <Header
                    title="i created a design system for a Rewards app."
                    imageSrc="./assets/proj2.png"
                    imageAlt="Description of image"
                    details={[
                        { label: "Company", value: "Eat Sleep Repeat" },
                        { label: "Role", value: "UX Designer" },
                        { label: "Duration", value: "7 Months" },
                        { label: "Skills", value: "Design Systems, UI, Product Design" },
                    ]}/>
            </div>

            {/* Slide 2: Images */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.contentcontainer}>
                    <img data-zoom src="./assets/ds0.png" className={`${styles.image} ${styles['image-full']}`} />
                </div>
            </div>

            {/* Slide 3: Large text */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div className={styles.largetext}>Eat, Sleep, Repeat (ESR) connects food lovers with discounts and reviews for beloved and new restaurants.<br/><br/>Although ESR was a local favorite in Lahore&apos;s food scene, it lacked a digital presence. To launch its first mobile app, the team needed a scalable design system and cohesive brand identity that made earning rewards feel effortless.<br/><br/>In 2020, I built a design system that that transformed their simple Facebook community forum into a contemporary mobile experience.</div>
                </div>
            </div>

            {/* Slide 4: Accordion */}
            <div className={styles.projectSlideAccordion}>
                <div className={styles.contentcontainer}>
                    <Accordion items={accordionItems} />
                </div>
            </div>

            {/* Slide 5: Footer */}
            <div className={styles.projectSlide}>
                <Footer />
            </div>

        </div>
    );
  };
  
 export default DesignSystems; 