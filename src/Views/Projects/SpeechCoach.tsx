import { useRef, useEffect } from 'react'
import styles from './Projects.module.css'
import Header from '../../components/Header'
import Accordion from '../../components/Accordion'
import ConversationSnippet from '../../components/ConversationSnippet'

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
                        <h2 className={styles.sh2}>When you get it wrong, everyone notices</h2>
                        <p className={styles.p1}>Leadership mistakes aren't like a failed unit test. They play out in front of people, damage relationships, and stick. For engineering students with little to no experience managing team dynamics, the first real attempt at a hard conversation is often also the most costly one.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>No room to get it wrong first</h2>
                        <p className={styles.p1}>Role-play exercises feel artificial. Case studies are passive. And there was no existing tool built for this specific gap — a space where students could have the uncomfortable conversation, stumble through it, and actually learn from it before the stakes were real.</p>
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
                <h1 className={styles.sh1}>Designing the conversation</h1>
                <img src="./assets/sc-service-blueprint.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <img src="./assets/sc-flow.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1}>The simulation had to feel real enough to be uncomfortable. That meant the AI couldn't just be a generic chatbot with a scenario label slapped on — it needed to behave like an actual peer who wasn't pulling their weight, or an authority figure you didn't want to disappoint. The role shifts based on what the student picks.</p>
                <p className={styles.p1}>Three things made this harder than expected.</p>
                <div className={styles.sub1section}>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Latency</h2>
                        <p className={styles.p1}>Voice conversations fall apart the moment there's an awkward pause that isn't human — it breaks the illusion immediately. This was partly a model constraint, and it took the whole team to work through iteratively over time.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Specificity</h2>
                        <p className={styles.p1}>Early on, a single roleplay agent was handling everything — and it showed. Context pollution in the prompts meant the AI would drift, lose the thread of the scenario, or respond in ways that felt off. We separated the agents, gave each one scenario-specific prompts with distinct things to track, and moved from GPT Realtime 4.0 to ElevenLabs. The conversations got noticeably sharper — and latency improved with it.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>Calibration</h2>
                        <p className={styles.p1}>The difficulty selector — supportive, standard, challenging — needed to produce conversations that actually felt different from each other. Not just in word choice, but in how much the AI pushed back, how quickly it conceded, how much pressure it put on the student to hold their ground.</p>
                    </div>
                </div>
            </div>
            <br /><br />
            <div className={styles.subsection}>
                <h1 className={styles.sh1}>Designing the feedback experience</h1>
                <img src="./assets/sc-sbi.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1}>Cornell came to the project with a starting point — the SBI framework (Situation, Behavior, Impact), a widely recognized model for delivering effective feedback. It gave us a structural foundation: ground the feedback in a specific situation, describe the observable behavior, articulate the impact it had. Clear, proven, and a reasonable place to begin.</p>
                <img src="./assets/sc-sbi2.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <img src="./assets/sc-feedback.png" className={`${styles.image} ${styles['image-dynamic']}`} />
                <p className={styles.p1}>After the conversation ends, the feedback moves through a deliberate arc — emotional first, then analytical, then actionable.</p>
                <p className={styles.p1}>It opens with voice. The same AI that just played your teammate or professor shifts register and debriefs you — a summary of what happened, the general feel of the conversation, a comment or two. It's deliberately unstructured. After the GPT to ElevenLabs move, each agent got its own voice — so the debrief no longer sounded like the person you were just arguing with. User testing showed that students needed a clear affordance to know where they were in the experience — a distinct voice was the simplest signal that the conversation was over and the reflection had begun.</p>
                <p className={styles.p1}>Then comes the full breakdown. A scored overview across subcategories — empathy, directness, conciseness, communication — with strengths and weaknesses pulled directly from the transcript. And at the bottom, the most actionable part: your own words, flagged and rewritten. Not a generic suggestion — a direct lift from what you said, reworked into what you could have said instead.</p>
                <IpadVideoPlayer src="./assets/sc-feedback-demo.mp4" />
                <p className={styles.p1}>The hardest design decision wasn't the layout. It was figuring out how to make feedback actually land — and that was a shared problem. The lead researcher was focused on what the feedback said and whether it was hitting the right notes. I was focused on how it was experienced — what the student saw, heard, and read, and whether any of it actually stuck. Together we kept coming back to the same questions: how do we make this memorable, actionable, quantifiable? That's what led us to Hattie & Timperley's work on closing the performance gap and SDT's argument that competence-focused feedback drives intrinsic motivation. We rebuilt the output around those principles — a prominent overall score, subscores across dimensions, strengths and weaknesses from the transcript, and a direct rephrase of what the student said.</p>
            </div>
            <br /><br />
            <div className={styles.subsection}>
                <h1 className={styles.sh1}>Building to think</h1>
                <p className={styles.p1}>The prototyping paradigm has shifted. The old model — designer designs, hands off, developer builds, team tests — is too slow when you're making decisions about something as unpredictable as voice AI. On this project, I could go from idea to deployed test using Claude Code, generating variants and running usability and A/B tests at a speed that would've been impossible a few years ago. Prototyping wasn't a phase. It was how we thought.</p>
                <div className={styles.sub1section}>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>The setup flow</h2>
                        <p className={styles.p1}>Anthropic's guidance on multi-agent systems flagged that a dedicated setup agent — one that walked the student through selecting a scenario via conversation — might be more overhead than it was worth. I had a hunch the same outcome could be achieved through a well-designed UI. So I built it: a simple onboarding flow, page by page. Pick a scenario from a set of rich cards. Pick a difficulty. Then a confirmation screen with everything you selected, who the AI is going to be, and how to start, structure, and end the conversation. The result was conclusive enough that we descoped the setup agent entirely and went straight to roleplay.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>The live interaction layer</h2>
                        <p className={styles.p1}>The mic animating while the student speaks, the processing state, the AI's voice coming back while its words appear on screen — all of it needed to be felt, not specced. Building it quickly let us confirm where latency was and wasn't a problem in a way no wireframe could.</p>
                    </div>
                    <div className={styles.sub2section}>
                        <h2 className={styles.sh2}>The proof of concept</h2>
                        <p className={styles.p1}>Before any of this was a real product, the biggest question wasn't whether the pieces worked — it was whether the whole thing could be good enough to sit inside a real curriculum. That's a different bar. It needed to be robust enough to deploy, and the conversation needed to actually make you feel something. The only way to know was to build the entire experience end to end and go through it. Not in chunks, not in a demo — fully. That meant generating variants, testing interaction patterns, and validating whether what we'd built crossed the line from functional to something students would actually take seriously.</p>
                    </div>
                </div>
            </div>
            <br /><br />
            <div className={styles.subsection}>
                <h1 className={styles.sh1}>Smoothing the experience</h1>
                <p className={styles.p1}>A voice conversation in a browser is an unfamiliar thing. There's no phone to hold, no face to read. If the interface doesn't clearly signal what's happening at every moment — who's speaking, whether it's processing, whether it heard you — the student falls out of the conversation trying to figure out where they are in the system.</p>
                <p className={styles.p1}>Motion handled that. When the student speaks, the interface responds. When the system processes, that's visible too. When the AI's response comes back, the transcript builds naturally from the bottom up — the way a real exchange feels, not a wall of text appearing at once. None of it is decorative. It's all orientation.</p>
                <p className={styles.p1}>Voice design was a different kind of problem. We used ElevenLabs to test personas across agents and scenarios — not just looking for a pleasant voice, but for emotional range. The AI needed to sound like a real person in a tense moment: a little defensive, a little hurt, direct when pushed, reflective when the student said something that landed. A slight mirroring quality — picking up the emotional register of what was just said. That took iteration. A voice that sounds natural in isolation often sounds flat when it has to carry ennui or frustration convincingly.</p>
                <p className={styles.p1}>UI feel was the last layer — clarity and affordance at every step. Each page needed to be obvious enough that the student wasn't thinking about the interface at all.</p>
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
            <img src="./assets/sc-progress.png" className={`${styles.image} ${styles['image-dynamic']}`} />
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
            <ConversationSnippet />
            <div className={styles.contentcontainer}>
                <div className={styles.largetext}>
                    Engineering students are trained to solve hard problems — but nobody teaches them how to tell a teammate their work isn't good enough.<br /><br />Cornell's Duffield College of Engineering needed a way to build that muscle before students hit the real world. So I designed and built a speech-enabled AI coach: one that lets students practice the uncomfortable conversations, delivers feedback on how they handled it, and gets more valuable the more they use it.
                </div>
                <Accordion items={accordionItems} />
            </div>
        </div>
    );
};

export default SpeechCoach;
