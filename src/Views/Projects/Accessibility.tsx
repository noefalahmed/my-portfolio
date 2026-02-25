import styles from './Projects.module.css'
import Header from '../../components/Header'
import Accordion from "../../components/Accordion"

const accordionItems = [
  {
    title: "The Problem",
    content:
      <>
        <div className={styles.subsection}>
          <p>
            For Upland PowerSteering, accessibility had become a procurement blocker. Because many of their customers’ products and services are subject to Section 255 accessibility requirements (to the extent it’s “readily achievable”), an external accessibility review flagging widespread failures created an immediate compliance risk. 
          </p>
          <div className={styles.sub2section}>
              <h2 className={styles.sh2}>1 in 4</h2>
              <p className={styles.p1}>
                More than 1 in 4 U.S. adults (28.7%) have a disability.</p>
            </div>
            <div className={styles.sub2section}>
              <h2 className={styles.sh2}>100x</h2>
              <p className={styles.p1}>
                Defect-cost research shows fixing issues in production can be up to 100× more expensive than addressing them earlier in design/development.</p>
            </div>
        </div>
      </>
  },
  {
    title: "The Process",
    content:
      <>
        <p>
          I used WCAG 2.1 Level AA as the conformance target because it’s the most widely accepted baseline for digital accessibility in enterprise procurement.</p>
          <br></br>
        <div className={styles.sub2section}>
              <h2 className={styles.sh2}>Identify Core Workflows</h2>
              <p className={styles.p1}>
                I focused on tables because they’re where users spend most of their time and where key actions happen (reviewing records, comparing values, and updating statuses). </p>
        </div>
        <div className={styles.sub2section}>
              <h2 className={styles.sh2}>Audit the current experience</h2>
              <p className={styles.p1}>
                I audited the tables using keyboard and screen reader workflows. Key focus areas included: whether users could move predictably, always see focus, understand headers/relationships, use the UI at high zoom, and notice updates without losing their place. </p>
        </div>
        <div className={styles.sub2section}>
              <h2 className={styles.sh2}>Documented for Adoption</h2>
              <p className={styles.p1}>
                I added usage and accessibility notes directly in Figma to keep builds consistent and prevent regressions.</p>
        </div>

      </>
  },
  {
    title: "The Result",
    content:
      <>
      <div className={styles.subsection}>
           <div className={styles.sub2section}>
            <h2 className={styles.sh2}>Pain Point #1</h2>
              <p className={styles.p1}>
               In high-density tables, we face the trade-off of seeing more data on-screen while keeping rows readable and easy to interact with.</p>
            </div>
           <div className={styles.sub2section}>
             <h2 className={styles.sh2}>User Need</h2>
              <p className={styles.p1}>
                We need to view more data at once, without compromising readability.</p>
             <img src="./assets/acc1.png" className={`${styles.image} ${styles['image-dynamic']}`} />
            </div>
            <div className={styles.sub2section}>
               <h2 className={styles.sh2}>Proposed Solution</h2>
              <p className={styles.p1}>
                I designed a density toggle that scales from comfortable to compact, adjusting row height, spacing, and truncation, but maintaining navigation, controls, and focus.</p>
              <img src="./assets/acc2.png" className={`${styles.image} ${styles['image-dynamic']}`} />
          </div>
          <div className={styles.sub2section}>
               <h2 className={styles.sh2}>Inclusive Design Considerations</h2>
              <p className={styles.p1}>
                I designed a density toggle that scales from comfortable to compact, adjusting row height, spacing, and truncation, but maintaining navigation, controls, and focus.</p>
          </div>
      </div>
      <br></br><br></br><br></br>

      <div className={styles.subsection}>
           <div className={styles.sub2section}>
            <h2 className={styles.sh2}>Pain Point #2</h2>
              <p className={styles.p1}>
               We often compare multiple tables at the same time, but this can become visually dense, making the data difficult to parse and navigate.</p>
                            <img src="./assets/acc3.png" className={`${styles.image} ${styles['image-dynamic']}`} />

            </div>
           <div className={styles.sub2section}>
             <h2 className={styles.sh2}>User Need</h2>
              <p className={styles.p1}>
                We need the primary table to be prominent, while still being able to reference supporting data without losing context when moving between them.</p>            </div>
            <div className={styles.sub2section}>
               <h2 className={styles.sh2}>Proposed Solution</h2>
              <p className={styles.p1}>
                I leveraged a master-detail layout where the primary table stays dominant and supporting tables move into a side panel (or side-by-side view).</p>
              <img src="./assets/acc4.png" className={`${styles.image} ${styles['image-dynamic']}`} />
          </div>
      </div>
            <br></br><br></br><br></br>

      <div className={styles.subsection}>
           <div className={styles.sub2section}>
            <h2 className={styles.sh2}>Pain Point #3</h2>
              <p className={styles.p1}>
               When tables have parent-child rows, we sometimes lose track of what level we are on and which rows belong together.</p>
            </div>
                         <img src="./assets/acc4.5.png" className={`${styles.image} ${styles['image-dynamic']}`} />

           <div className={styles.sub2section}>
             <h2 className={styles.sh2}>User Need</h2>
              <p className={styles.p1}>
               We need the hierarchy of multi-level tables to be scannable at a glance, so users can ‘drill down’ without losing orientation.</p>
            </div>
            <div className={styles.sub2section}>
               <h2 className={styles.sh2}>Proposed Solution</h2>
              <p className={styles.p1}>
                I designed expandable rows with clear hierarchy cues, namely indentation to show parent-child relationships and highlighted indicators to distinguish expanded sections. </p>
              <img src="./assets/acc5.png" className={`${styles.image} ${styles['image-dynamic']}`} />
              <img src="./assets/acc6.png" className={`${styles.image} ${styles['image-dynamic']}`} />
          </div>
      </div>
      </>
  },
  {
    title: "The Big Picture",
    content:
      <>
        <div className={styles.sub1section}>

          <div className={styles.sub2section}>
            <h2 className={styles.sh2}>Accessibility as Strategy</h2>
            <p className={styles.p1}>
              Accessibility isn't a constraint — it’s a multiplier. Designing for edge cases improves clarity for everyone. Better contrast improves outdoor readability. Larger tap targets reduce friction. Clear hierarchy reduces cognitive load.
            </p>
          </div>

          <div className={styles.sub2section}>
            <h2 className={styles.sh2}>Future-Proofing the System</h2>
            <p className={styles.p1}>
              By encoding accessibility at the token and component level, the system can evolve alongside new standards and platforms without rebuilding interfaces from scratch.
            </p>
          </div>

          <div className={styles.sub2section}>
            <h2 className={styles.sh2}>Inclusive by Default</h2>
            <p className={styles.p1}>
              The goal wasn’t perfection — it was intention. By treating accessibility as foundational rather than optional, ESR’s digital presence became more resilient, inclusive, and ready to scale.
            </p>
              <img src="./assets/acc1.png" className={`${styles.image} ${styles['image-dynamic']}`} />

          </div>

        </div>
      </>
  },
]

const Accessibility: React.FC = () => {
  return (
    <div className={styles.page}>
      <Header
        title="i created an accessibility framework for a project management software"
        imageSrc="./assets/proj1.png"
        imageAlt="Description of image"
        details={[
          { label: "Company", value: "Upland Software" },
          { label: "Role", value: "Product Designer" },
          { label: "Duration", value: "2 Months" },
          { label: "Skills", value: "Accessibility, WCAG, Inclusive Design" },
        ]}
      />
      <div className={styles.contentcontainer}>
        <img src="./assets/acc0.png" className={`${styles.image} ${styles['image-full']}`} />
        <div className={styles.largetext}>
          Tables are the primary workspace on Upland’s PowerSteering platform. This is where project managers track the status of the projects they work on. When that workspace isn’t accessible, the product becomes harder to use and harder to buy. 
          <br></br><br></br>I led a tables-first effort aligned to WCAG 2.1 Level AA to redesign the highest-impact table patterns. 
        </div>
        <Accordion items={accordionItems} />
      </div>
    </div>
  );
};

export default Accessibility;