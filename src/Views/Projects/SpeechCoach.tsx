import { useRef, useEffect } from 'react'
import styles from './Projects.module.css'
import Header from '../../components/Header'
import Accordion from '../../components/Accordion'
import ConversationSnippet from '../../components/ConversationSnippet'
import ArchitectureDiagram from '../../components/ArchitectureDiagram'
import AsteriskDiagram from '../../components/AsteriskDiagram'
import Footer from '../../components/Footer'

const IpadVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {})
                } else {
                    video.pause()
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    return (
        <div className={styles.ipadShowcase}>
            <div className={styles.ipadFrame}>
                <video
                    ref={videoRef}
                    className={styles.ipadVideo}
                    src={src}
                    muted
                    loop
                    playsInline
                />
            </div>
        </div>
    )
}

const accordionItems = [
    {
        title: "The Problem",
        content:
        <>
            <div className={styles.subsection}>
                <div className={styles.sub1section}>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>The problem with learning leadership on the job</h2>
                        <p className={styles.p1}>Engineering programs are built around technical mastery. But the skills that define a great engineer in practice — giving hard feedback, navigating conflict, holding a team accountable — don't show up in any curriculum. Students graduate knowing how to build things, but not how to lead the people building them alongside them.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>The first real attempt is usually the most costly one</h2>
                        <p className={styles.p1}>Leadership mistakes play out in front of people, damage relationships, and stick. For engineering students with little to no experience managing team dynamics, there's no safe place to get it wrong first. No rehearsal, no do-over.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>A chatbot won't cut it</h2>
                        <p className={styles.p1}>The obvious answer is a practice tool. But a generic chatbot doesn't create an experience worth taking seriously. It isn't memorable, it doesn't feel real, and nothing about it makes you want to apply what you learned anywhere else. We wanted to change that.</p>
                    </div>
                </div>
            </div>
        </>
    },
    {
        title: "The Process",
        content:
        <>
            <div className={styles.subsection}>
                <ArchitectureDiagram />
                <p className={styles.p1}>Before designing anything, we needed to agree on what we were actually building. As a tiger team of 3, including a PM/researcher, an AI engineer, and myself leading design, we mapped out an MVP system architecture early. This revealed overlapping areas of the system that needed to be truly designed, such as the agents, the conversation, feedback, Human-AI interactions, and finally the UI.</p>
            </div>
            <br /><br />
            <div className={styles.subsection}>
                <h1 className={styles.sh1}>Designing the Roleplayers</h1>
                <AsteriskDiagram />
                <p className={styles.p1}>A convincing roleplayer is a whole person, not just a prompt with a name on it. Every week we refined what that meant, layering in what each character needed to feel distinct and believable.<br /><br />The most important layer was the hidden truth, a backstory the student never sees but always feels. A teammate missing deadlines is quietly dealing with family stress they never mentioned. A professor who seems dismissive assumes their team always knows what they want. The hidden truth is what gives the character their behaviour and what gives the conversation its tension. It also scales with difficulty. In a supportive scenario the character takes ownership sooner and meets the student part of the way. In a challenging one the hidden truth stays buried. The student has to earn it.</p>
                <img data-zoom src="./assets/sc-scenarios.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1}>The scenarios split into two categories: peer-to-peer and peer-to-authority. Giving hard feedback to a teammate is a different skill from pushing back on a professor who doesn't think your concern is valid. Each scenario is distinct enough to stand on its own, and difficult enough that it doesn't feel like a warmup.</p>
                <h1 className={styles.sh1}>Designing the conversation</h1>
                <img data-zoom src="./assets/sc-service-blueprint.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1} style={{ marginBottom: '0px' }}>Underneath every scenario, the structure was the same: a hero's arc. The opening, the tension, the effort to hold ground, the climax, the resolution. That gave us a skeleton for all conversations to lay on top of.<br /><br />I wanted students to feel what they were up against. So I made sure user and AI behavior was in contention with each other at all times until breakthrough was reached. The tricky part was that a peer who wasn't pulling their weight sounds different from a professor who doesn't think your concern is valid. Every character needed to carry the nuances of their scenario and difficulty level while still serving the same arc. Some key flaws I noticed during testing sessions were:</p>
                <div className={styles.sub1section} style={{ gap: '20px', marginTop: '16px' }}>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Latency</h2>
                        <p className={styles.p1}>We saw that the conversations were falling apart due to awkward pauses between the student and AI. This was partly a model constraint (GPT Realtime) and it took us a while to realize that.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Context Pollution</h2>
                        <p className={styles.p1}>Since I designed for a single roleplay agent to handle every scenario, the conversations were not as tailored as we had liked. Context pollution in the prompts meant the AI would drift, lose the thread of the scenario, or respond in ways that felt off.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Intangible Difficulty</h2>
                        <p className={styles.p1}>The differences between supportive, standard, and challenging weren't tangible enough. The AI needed to break at just the right moment for a given level, which it was mixing up.</p>
                    </div>
                </div>
                <img data-zoom src="./assets/sc-sysarch2.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1}>So, we switched from GPT-4o Realtime to ElevenLabs — our first strategic shift. At first, this was exploratory, but the problems we had encountered actually decreased, so we chose to roll with it. Latency improved, the agents felt distinct and autonomous, and difficulty was felt more concretely in the interactions.</p>
            </div>
            <br /><br />
            <div className={styles.subsection}>
                <h1 className={styles.sh1}>Designing the feedback</h1>
                <img data-zoom src="./assets/sc-sbi.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1}>Cornell came to the project with the SBI framework (Situation, Behavior, Impact), a widely recognized model for delivering effective feedback. It was a simple guide for students to structure their delivery. So, I wanted to highlight its presence in the system, especially when they delivered feedback effectively through SBI.</p>
                <img data-zoom src="./assets/sc-sbi2.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1} style={{ marginBottom: '12px' }}>After the conversation ends, the feedback moves through a deliberate arc — emotional first, then analytical, then actionable.</p>
                <p className={styles.p1} style={{ marginBottom: '12px' }}>We focused on making sense of the recorded transcript in ways that would inspire the user to read it and explore what just happened. The same AI that just played your teammate or professor shifts register and debriefs you, giving a summary of what happened and the general feel of the conversation. It is deliberately unstructured. After the GPT to ElevenLabs move, each agent got its own voice, so the debrief no longer sounded like the person you were just arguing with. User testing showed that students needed a clear affordance to know where they were in the experience. A distinct voice was the simplest signal that the conversation was over and the reflection had begun. Then comes the full breakdown:</p>
                <p className={styles.p1} style={{ marginBottom: '32px' }}>1. Summary — An overall score and general comments that describe it.<br />2. Scores — A full breakdown of subcategories related to the SBI structure.<br />3. Strengths — Moments where your feedback delivery was great.<br />4. Weaknesses — Moments that fell short of the SBI structure.<br />5. Considerations — Alternatives to replace in your next delivery.</p>
                <IpadVideoPlayer src="./assets/sc-feedback-demo.mp4" />
                <p className={styles.p1}>The hardest design decision wasn't the layout. It was figuring out how to make feedback actually land — and that was a shared problem. The lead researcher was focused on what the feedback said and whether it was hitting the right notes. I was focused on how it was experienced — what the student saw, heard, and read, and whether any of it actually stuck. Together we kept coming back to the same questions: how do we make this memorable, actionable, quantifiable?</p>
            </div>
            <br /><br />
            <div className={styles.subsection}>
                <h1 className={styles.sh1}>Building the experience</h1>
                <div className={styles.sub1section}>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Rapid Prototyping</h2>
                        <p className={styles.p1}>A lot of the prototyping was focused on conversational UI components specifically. I built and dropped in components quickly to test whether students understood the affordances, responded the way we expected, and felt oriented within the experience.</p>
                        <img data-zoom src="./assets/sc-rapid-prototyping.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                        <p className={styles.p1}>Anthropic's guidance on multi-agent systems flagged that a dedicated setup agent — one that walked the student through selecting a scenario via conversation — might be more overhead than it was worth. I had a hunch the same outcome could be achieved through a well-designed UI. So I built it: a simple onboarding flow, page by page. Pick a scenario from a set of rich cards. Pick a difficulty. Then a confirmation screen with everything you selected, who the AI is going to be, and how to start, structure, and end the conversation. The result was conclusive enough that we descoped the setup agent entirely and went straight to roleplay.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Microinteractions</h2>
                        <video
                    src="./assets/sc-anims.mov"
                    className={`${styles.image} ${styles['image-dynamic']}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                        <video
                    src="./assets/microanim.mov"
                    className={`${styles.image} ${styles['image-dynamic']}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
                        <p className={styles.p1}>The mic animating while the student speaks, the processing state, the AI's voice coming back while its words appear on screen; all of it needed to be felt, not specced. So, I built a system with a list of all the animations we could plug and play. Building it and using this system quickly let us confirm where latency was and wasn't a problem in a way no wireframe could.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Automating the Process</h2>
                        <p className={styles.p1}>Before any of this was a real product, the biggest question wasn't whether the pieces worked — it was whether the whole thing could be good enough to sit inside a real curriculum. That's a different bar. It needed to be robust enough to deploy, and the conversation needed to actually make you feel something. The only way to know was to build the entire experience end to end and go through it. Not in chunks, not in a demo — fully. That meant generating variants, testing interaction patterns, and validating whether what we'd built crossed the line from functional to something students would actually take seriously.</p>
                    </div>
                </div>
<img data-zoom src="./assets/sc-elevenlabs-voice-design.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1}>Voice design was a different kind of problem. We used ElevenLabs to test personas around scenarios and agents, using their <a href="https://elevenlabs.io/docs/eleven-creative/voices/voice-design#prompting-guide" target="_blank" rel="noreferrer">prompting guide</a> — not just looking for a pleasant voice, but for emotional range. The AI needed to sound like a real person in a tense moment: a little defensive, a little hurt, direct when pushed, reflective when the student said something that landed. A slight mirroring quality — picking up the emotional register of what was just said. That took iteration. A voice that sounds natural in isolation often sounds flat when it has to carry ennui or frustration convincingly.</p>
            </div>
        </>
    },
    {
        title: "The Result",
        content:
        <>
            <div className={styles.largetext}>
                The product is still in active development. But the early signal is clear.<br /><br />
                Perceived product value came in at +79% — measured across usefulness, relevance, and trust. For a tool asking engineering students to do something as unfamiliar as practicing a hard conversation with an AI, that number is meaningful. It means students saw the point. They found it relevant to their actual lives, believed it could help, and trusted it enough to engage with it seriously.<br /><br />
                Everything else is in motion.
            </div>
            <img data-zoom src="./assets/sc-progress.png" className={`${styles.image} ${styles['image-dynamic']}`} />
        </>
    },
    {
        title: "The Big Picture",
        content:
        <>
            <div className={styles.sub1section}>
                <div className={styles.sub2section}>
                    <h2 className={styles.sh2}>Leadership is a measurable skill</h2>
                    <p className={styles.p1}>Cornell's long-term vision is to make this a graduation requirement. That's not a small statement. It means treating leadership — giving hard feedback, navigating conflict, holding a team accountable — as something that can be practiced, scored, and improved over time. Not a soft skill you either have or you don't. Building this made me believe that vision is achievable. The scoring system, the subcategories, the progress dashboard — all of it points toward a future where leadership development is as structured as any other part of an engineering education.</p>
                </div>
                <div className={styles.sub2section}>
                    <h2 className={styles.sh2}>The practice loop compounds</h2>
                    <p className={styles.p1}>A single session is useful. But the real value is in the accumulation. I built an early version of a progress dashboard — not deployed, not tested yet, because it's only meaningful with months of sessions behind it. The intention is that a student can look back and see themselves getting better. That's a different kind of tool than anything currently in an engineering curriculum.</p>
                </div>
                <div className={styles.sub2section}>
                    <h2 className={styles.sh2}>Where this goes next</h2>
                    <p className={styles.p1}>There's an open question this project keeps circling: what happens when Sophie — the AI teammate you just had a difficult conversation with — isn't a voice on a screen but a face on a Zoom call? Any advantage a voice agent gives you will translate to video agents. The tools for practicing the hardest human skills are only going to get more human.</p>
                </div>
            </div>
        </>
    },
]

const SpeechCoach: React.FC = () => {
    return (
        <div className={styles.page}>

            {/* Slide 1: Header */}
            <div className={styles.projectSlide}>
                <Header
                    title="i built a speech-enabled leadership coach for students."
                    imageSrc="./assets/proj0.png"
                    imageAlt="Speech-enabled leadership coach"
                    details={[
                        { label: "Company", value: "Cornell University" },
                        { label: "Role", value: "Lead Product Designer" },
                        { label: "Duration", value: "Ongoing" },
                        { label: "Skills", value: "Voice UX, Conversation Design, Rapid Prototyping" },
                    ]}
                />
            </div>

            {/* Slide 2: Images */}
            <div className={styles.projectSlideScroll}>
                <div className={styles.conversationRow}>
                    <img
                        data-zoom
                        src="./assets/sc-conversation-ui.png"
                        alt="Speech coach conversation UI"
                        className={styles.conversationSideImage}
                    />
                    <div className={styles.conversationSnippetRow}>
                        <ConversationSnippet />
                        <img
                            data-zoom
                            src="./assets/sc-progress-dashboard.png"
                            alt="Progress dashboard"
                            className={styles.conversationPlaceholder}
                        />
                    </div>
                </div>
            </div>

            {/* Slide 3: Large text */}
            <div className={styles.projectSlide}>
                <div className={styles.contentcontainer}>
                    <div className={styles.largetext}>
                        Engineering students are trained to solve hard problems, but nobody teaches them how to tell a teammate their work isn't good enough.<br /><br />Cornell's Duffield College of Engineering, home to over 3,000 undergraduates, needed a way to build that muscle before students hit the real world. So I designed and built a speech-enabled AI coach that lets students practice the uncomfortable conversations, delivers feedback on how they handled it, and gets more valuable the more they use it.
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
    );
};

export default SpeechCoach;
