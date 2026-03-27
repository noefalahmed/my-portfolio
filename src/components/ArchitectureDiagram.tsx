import { useEffect, useRef, useState } from 'react';
import styles from './ArchitectureDiagram.module.css';

const SVG_W = 214;
const SVG_H = 134;
const GAP = 77;
const LAYERS_COUNT = 5;
const CONTAINER_H = (LAYERS_COUNT - 1) * GAP + SVG_H; // 442

interface LayerDef {
    src: string;
    label: string;
    items: string[];
    side: 'left' | 'right';
    index: number; // 0 = bottom (Evaluation), 4 = top (UI)
}

const LAYERS: LayerDef[] = [
    {
        src: '/assets/layers/Evaluation.svg',
        label: 'Evaluation LLM',
        items: ['Language Model', 'Evaluation Criterion'],
        side: 'right',
        index: 0,
    },
    {
        src: '/assets/layers/SpeechToSpeech.svg',
        label: 'Speech to Speech',
        items: ['Conversational Loop', 'Gemini 2.5 Flash'],
        side: 'left',
        index: 1,
    },
    {
        src: '/assets/layers/Orchestration.svg',
        label: 'Orchestration',
        items: ['Orchestrator Agent', 'Scenario-based Agent', 'Evaluation Agent'],
        side: 'right',
        index: 2,
    },
    {
        src: '/assets/layers/Client.svg',
        label: 'Client',
        items: ['Transcript Management', 'API Calls', 'Realtime Audio'],
        side: 'left',
        index: 3,
    },
    {
        src: '/assets/layers/UI.svg',
        label: 'User Interface',
        items: ['Scenario Selection', 'Live Conversation', 'Feedback and Scores'],
        side: 'right',
        index: 4,
    },
];

export default function ArchitectureDiagram() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [linesVisible, setLinesVisible] = useState(false);
    const [labelsVisible, setLabelsVisible] = useState(false);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const t1 = setTimeout(() => setExpanded(true), 600);
                    const t2 = setTimeout(() => setLinesVisible(true), 1600);
                    const t3 = setTimeout(() => setLabelsVisible(true), 2100);
                    timersRef.current = [t1, t2, t3];
                } else {
                    timersRef.current.forEach(clearTimeout);
                    setLabelsVisible(false);
                    setLinesVisible(false);
                    setExpanded(false);
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            timersRef.current.forEach(clearTimeout);
        };
    }, []);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <div className={styles.container} style={{ height: CONTAINER_H }}>
                <div
                    className={`${styles.vline} ${linesVisible ? styles.vlineVisible : ''}`}
                    style={{ left: `calc(50% - ${SVG_W / 2}px)`, top: SVG_H / 2, height: (LAYERS_COUNT - 1) * GAP }}
                />
                <div
                    className={`${styles.vline} ${linesVisible ? styles.vlineVisible : ''}`}
                    style={{ left: `calc(50% + ${SVG_W / 2}px - 1px)`, top: SVG_H / 2, height: (LAYERS_COUNT - 1) * GAP }}
                />
                {LAYERS.map((layer) => {
                    // Collapsed: all layers stacked at center (where Orchestration sits when expanded)
                    // Expanded: layer[i] at translateY = (LAYERS_COUNT-1-i) * GAP
                    const collapsedY = Math.floor((LAYERS_COUNT - 1) / 2) * GAP;
                    const expandedY = (LAYERS_COUNT - 1 - layer.index) * GAP;
                    const translateY = expanded ? expandedY : collapsedY;

                    // Stagger: fan out from center — layers closest to center move first
                    const distFromCenter = Math.abs(layer.index - Math.floor((LAYERS_COUNT - 1) / 2));
                    const layerDelay = expanded ? distFromCenter * 80 : 0;

                    // Label order: UI (index=4) appears first (labelOrder=0), Evaluation last (labelOrder=4)
                    const labelOrder = LAYERS_COUNT - 1 - layer.index;
                    const labelDelay = labelsVisible ? labelOrder * 160 : 0;

                    const edgeOffset = `calc(50% + ${SVG_W / 2 + 16}px)`;

                    // SVG connector dimensions
                    const TITLE_H = 24;
                    const TICK_HALF = 6;
                    const IBEAM_H = 44;           // fixed short I-beam height
                    const H_LEN = 36;
                    const svgW = TICK_HALF * 2 + H_LEN;
                    const hy = IBEAM_H / 2;       // horizontal exits at I-beam center
                    const vx = TICK_HALF + 0.5;
                    const titleOffset = hy - TITLE_H / 2; // shift content so title centers on hy

                    return (
                        <div
                            key={layer.src}
                            className={styles.layer}
                            style={{
                                transform: `translateY(${translateY}px)`,
                                opacity: expanded || layer.index === LAYERS_COUNT - 1 ? 1 : 0,
                                transitionDelay: `${layerDelay}ms`,
                                zIndex: layer.index,
                            }}
                        >
                            <img
                                src={layer.src}
                                alt={layer.label}
                                width={214}
                                height={134}
                                className={styles.layerImg}
                            />
                            <div
                                className={`${styles.labelBox} ${labelsVisible ? styles.labelVisible : ''} ${layer.side === 'left' ? styles.labelLeft : styles.labelRight}`}
                                style={{
                                    [layer.side === 'right' ? 'left' : 'right']: edgeOffset,
                                    top: (SVG_H - IBEAM_H) / 2,
                                    transitionDelay: `${labelDelay}ms`,
                                }}
                            >
                                <svg
                                    width={svgW}
                                    height={IBEAM_H}
                                    className={styles.connectorSvg}
                                    style={layer.side === 'left' ? { transform: 'scaleX(-1)' } : undefined}
                                >
                                    {/* vertical line */}
                                    <line x1={vx} y1={0.5} x2={vx} y2={IBEAM_H - 0.5} stroke="#1a1a1a" strokeWidth="1" />
                                    {/* top tick */}
                                    <line x1={0.5} y1={0.5} x2={TICK_HALF * 2 - 0.5} y2={0.5} stroke="#1a1a1a" strokeWidth="1" />
                                    {/* bottom tick */}
                                    <line x1={0.5} y1={IBEAM_H - 0.5} x2={TICK_HALF * 2 - 0.5} y2={IBEAM_H - 0.5} stroke="#1a1a1a" strokeWidth="1" />
                                    {/* horizontal to label */}
                                    <line x1={vx} y1={hy} x2={svgW - 0.5} y2={hy} stroke="#1a1a1a" strokeWidth="1" />
                                </svg>
                                <div className={styles.labelContent} style={{ marginTop: titleOffset }}>
                                    <div className={styles.labelTitle}>{layer.label}</div>
                                    <ul className={styles.labelItems}>
                                        {layer.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
