import styles from './Projects.module.css'
import Header from '../../components/Header'
import Accordion from "../../components/Accordion"
import Footer from '../../components/Footer'

const accordionItems = [
  {
    title: "The Problem",
    content: (
        <div className={styles.subsection}>
            <p>
             Account Managers use Cimpl&apos;s Accounts Dashboard every single day. The data they handle here connects through every part of the platform...
            </p>
            <img data-zoom src="./assets/cimple-1.png" className={`${styles.image} ${styles['image-dynamic']} `} />
            <p>...but users were struggling.
                <br></br><br></br>
                In speaking to Account Managers, I understood that managing data was slow and frustrating. In evaluating their interface, I saw disorganized layouts and unclear hierarchy. But to get to the root of the problem, I knew I needed to trace daily workflows.
                <br></br><br></br>
                Using the 5 Whys Method, I guided 3 Account Managers in reflecting on their own pain points to surface the true source of their friction. Here&apos;s what I found:
                <br></br><br></br>
                The existing architecture didn&apos;t reflect the relationships between accounts that mattered the most to users. Critical information was buried and disconnected, forcing overly-complicated mitigation and workarounds: spreadsheets, notes... anything except digging through Cimpl.
            </p>
        </div>
    ),
  },
  {
    title: "The Process",
    content: (
      <>
        <div className={styles.subsection}>
            <p>I collaborated with the product team to structure our design process into focused, iterative sprints: aligning design, research, and development around weekly deliverable and measurable feedback loops. </p>
            <img data-zoom src="./assets/cimple-2.png" className={`${styles.image} ${styles['image-dynamic']} `} />
          <h1 className={styles.sh1}  style={{color: '#D78CF3'}} >Redefining the Architecture</h1>
          <p>I rebuilt the experience that the UI was mapped on. To do this, I needed to understand how account managers thought about and did their work, then collaborate with cross-functional stakeholders to match the users&apos; priorities.</p>
          <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#D78CF3'}}>Creating the Taxonomy</h2>
                                <p className={styles.p1}>Conducting interviews with Account Managers, we found that the existing account relationships were flat and needed parent-child relations to match users&apos; mental model.</p>
                              <img data-zoom src="./assets/cimple-3.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#D78CF3'}}>Adding Missing Data Points</h2>
                                <p className={styles.p1}>With insights from the product owner and software development, I identified the key information that lived outside of Cimpl. By centralizing it,  we would simplify workflows and give account managers everything they needed in one place.</p>
                                 <img data-zoom src="./assets/cimple-4.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#D78CF3'}}>Updating the Sitemap</h2>
                                <p className={styles.p1}>Redefining the parent-child structure and adding new data meant that I needed to rethink the entire architecture. We designed a new framework to reflect how the system actually worked by building out more intuitive tabs and sections.</p>
                                <img data-zoom src="./assets/cimple-5.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
            </div> 
            <h1 className={styles.sh1} style={{color: '#73A0F9'}}>Design</h1>
            <p>In weekly sprints, our design and product teams focused on one section of the UI at a time. We redesigned, tested, and checked feasibility before moving on, keeping an effective and focused project pace.
            <br></br><br></br>
             We evaluated and marked poorly designed components and misused UI patterns. By applying laws of UX, we redesigned the interface to be intuitive and engaging, ensuring that users could engage with data rather than struggling to find it.   
            </p>
            <img data-zoom src="./assets/cimple-6.png" className={`${styles.image} ${styles['image-dynamic']} `} />
            <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#73A0F9'}}>How do we improve information clarity?</h2>
                                <p className={styles.p1}>We implemented a consistent grid system and established visual rhythm to improve legibility and make information easier to scan at a glance.</p>
                              <img data-zoom src="./assets/cimple-7.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#73A0F9'}}>How do we show account relationships?</h2>
                                <p className={styles.p1}>We designed multi-level tables that let users see relationships clearly and drill down into details without losing context.</p>
                                 <img data-zoom src="./assets/cimple-8.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#73A0F9'}}>How do we communicate progress?</h2>
                                <p className={styles.p1}>We added a step-by-step progress indicator that guided users through account creation, showing exactly where they were and what came next.</p>
                                <img data-zoom src="./assets/cimple-9.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#73A0F9'}}>How do we make content findable?</h2>
                                <p className={styles.p1}>We matched section names to users' mental models, making it faster to find what they needed and complete tasks without guesswork.</p>
                                <img data-zoom src="./assets/cimple-10.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#73A0F9'}}>How do we give users control?</h2>
                                <p className={styles.p1}>We introduced smart filters and progressive disclosure, allowing users to reveal relevant information while hiding the rest.</p>
                                <img data-zoom src="./assets/cimple-11.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
            </div> 
            <h1 className={styles.sh1} style={{color: '#73A0F9'}}>Validation</h1>
            <p>We ran internal guerrilla tests and A/B tests with account managers to choose between competing concepts. We corroborated design decisions based on users&apos; simple majority.
            </p>
            <div className={styles.sub1section}>
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#73A0F9'}}>A/B Testing</h2>
                              <img data-zoom src="./assets/cimple-12.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div> 
                            <div className={styles.sub2section}>
                                <h2 className={styles.sh2} style={{color: '#73A0F9'}}>Usability Testing Sessions</h2>
                                 <img data-zoom src="./assets/cimple-13.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                            </div>
                         
            </div> 
        </div>
      </>
    ),
  },
  {
    title: "The Result",
    content: (
      <>
        <div className={styles.largetext}>
          We packaged designs with detailed specs, component states, and implementation notes. This clarity eliminated guesswork and helped developers build faster with fewer revisions.
          <br></br><br></br>
          Our agile design process allowed for each section of Accounts to perform faster, yield better outcomes, and report lesser concerns from users. 
        </div>
        <br></br><br></br>
        <img data-zoom src="./assets/cimple-14.png" className={`${styles.image} ${styles['image-dynamic']}`} />
        <br></br><br></br>
        <img data-zoom src="./assets/cimple-15.png" className={`${styles.image} ${styles['image-dynamic']}`} />
        <br></br><br></br>
        <img data-zoom src="./assets/cimple-16.png" className={`${styles.image} ${styles['image-dynamic']}`} />




      </>
    ),
  },
  {
    title: "The Bigger Picture",
    content: (
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
    )
  }
]

const DesignThinking: React.FC = () => {
  return (
    <div className={styles.page}>

      {/* Slide 1: Header */}
      <div className={styles.projectSlide}>
        <Header
          title="i redesigned a Dashboard for Account Managers"
          imageSrc="./assets/proj3.png"
          imageAlt="Description of image"
          details={[
            { label: "Company", value: "Upland Software" },
            { label: "Role", value: "Product Designer II" },
            { label: "Duration", value: "3 Months" },
            { label: "Skills", value: "User Research, Information Architecture, Product Design" },
          ]}
        />
      </div>

      {/* Slide 2: Images */}
      <div className={styles.projectSlideScroll}>
        <div className={styles.contentcontainer}>
          <img src="./assets/cimple-17.png" className={`${styles.image} ${styles['image-full']}`} />
        </div>
      </div>

      {/* Slide 3: Large text */}
      <div className={styles.projectSlide}>
        <div className={styles.contentcontainer}>
          <div className={styles.largetext}>
            When critical information is hard to find, it&apos;s often a symptom of poor interface design, or worse, fundamentally disorganised architecture. Here, it was both.
            <br/><br/>
            Over the course of 2 months, I restructured Upland Software&apos;s Accounts Dashboard by rebuilding key workflows related to forms, settings, records and filters.
          </div>
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
  )
}

export default DesignThinking
