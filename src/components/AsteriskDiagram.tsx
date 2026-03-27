import { useEffect, useRef, useState } from 'react';
import styles from './AsteriskDiagram.module.css';

const CONTAINER_H = 620;
const ORBIT_R = 206;

const TITLE_H = 24;
const TICK_HALF = 6;
const IBEAM_H = 44;
const H_LEN = 36;
const CONN_W = TICK_HALF * 2 + H_LEN;
const HY = IBEAM_H / 2;
const VX = TICK_HALF + 0.5;
const TITLE_OFFSET = HY - TITLE_H / 2;

const LABEL_TOPS = [110, 288, 466];
const CENTER_Y = CONTAINER_H / 2; // 310

// Angle from label attachment point to orbit center (in degrees)
function connectorAngle(labelTop: number): number {
    const dy = CENTER_Y - (labelTop + HY);
    return (Math.atan2(dy, ORBIT_R) * 180) / Math.PI;
}

interface LabelDef { title: string; items: string[]; }

const LEFT_LABELS: LabelDef[] = [
    { title: 'Character',  items: ['Fixed Traits', 'Hidden Truth', 'Emotional Baseline'] },
    { title: 'Logistics',  items: ['Greetings/Ending Notes', 'Language'] },
    { title: 'Difficulty', items: ['Resistance Threshold', 'Openness', 'Emotional Reaction', 'Accountability'] },
];

const RIGHT_LABELS: LabelDef[] = [
    { title: 'Transfer Rules', items: ['Triggers', 'Transfer Messages'] },
    { title: 'Guardrails',     items: ['No Character Breaks', 'Never Coach The User', 'Conversation Termination Conditions'] },
    { title: 'Voice',          items: ['Gender', 'Tone', 'Pitch', 'Speed', 'Style'] },
];

function ConnectorSvg({ flip, ibeamAngle }: { flip: boolean; ibeamAngle: number }) {
    return (
        <svg
            width={CONN_W}
            height={IBEAM_H}
            overflow="visible"
            className={styles.connectorSvg}
            style={flip ? { transform: 'scaleX(-1)' } : undefined}
        >
            <g transform={`rotate(${ibeamAngle}, ${VX}, ${HY})`}>
                <line x1={VX}  y1={0.5}            x2={VX}                  y2={IBEAM_H - 0.5} stroke="#1a1a1a" strokeWidth="1" />
                <line x1={0.5} y1={0.5}            x2={TICK_HALF * 2 + 0.5} y2={0.5}           stroke="#1a1a1a" strokeWidth="1" />
                <line x1={0.5} y1={IBEAM_H - 0.5} x2={TICK_HALF * 2 + 0.5} y2={IBEAM_H - 0.5} stroke="#1a1a1a" strokeWidth="1" />
            </g>
            <line x1={VX}  y1={HY} x2={CONN_W - 0.5} y2={HY} stroke="#1a1a1a" strokeWidth="1" />
        </svg>
    );
}

export default function AsteriskDiagram() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [labelsVisible, setLabelsVisible] = useState(false);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const t1 = setTimeout(() => setInView(true), 600);
                    const t2 = setTimeout(() => setLabelsVisible(true), 2100);
                    timersRef.current = [t1, t2];
                } else {
                    timersRef.current.forEach(clearTimeout);
                    setLabelsVisible(false);
                    setInView(false);
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

    const allLabels = [
        ...LEFT_LABELS.map((l, i)  => ({ ...l, side: 'left'  as const, i })),
        ...RIGHT_LABELS.map((l, i) => ({ ...l, side: 'right' as const, i })),
    ];

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <div className={styles.container} style={{ height: CONTAINER_H }}>

                {/* Orbit rings */}
                <div className={`${styles.orbitWrap} ${inView ? styles.orbitVisible : ''}`}>
                    <svg width="400" height="400">
                        {/* Large outer circle */}
                        <ellipse cx="200" cy="200" rx="178" ry="178"
                            fill="none" stroke="#BBBBBB" strokeWidth="1"
                            strokeDasharray="3 9" className={styles.ring1} />
                        {/* Flat equatorial ellipse (X-axis) */}
                        <ellipse cx="200" cy="200" rx="178" ry="48"
                            fill="none" stroke="#BBBBBB" strokeWidth="1"
                            strokeDasharray="3 9" className={styles.ring2} />
                        {/* Mildly skewed vertical oval */}
                        <ellipse cx="200" cy="200" rx="135" ry="178"
                            fill="none" stroke="#BBBBBB" strokeWidth="1"
                            strokeDasharray="3 9" className={styles.ring3} />
                        {/* More skewed vertical oval */}
                        <ellipse cx="200" cy="200" rx="90" ry="178"
                            fill="none" stroke="#BBBBBB" strokeWidth="1"
                            strokeDasharray="3 9" className={styles.ring4} />
                    </svg>
                </div>

                {/* Asterisk */}
                <img
                    src="/assets/layers/Asterisk.svg"
                    alt="Agent structure"
                    width={181}
                    height={186}
                    className={styles.asterisk}
                />

                {/* Labels */}
                {allLabels.map((label) => {
                    const isLeft = label.side === 'left';
                    const angle = connectorAngle(LABEL_TOPS[label.i]);
                    const stagger = label.i * 2 + (isLeft ? 0 : 1);

                    return (
                        <div
                            key={label.title}
                            className={`${styles.labelBox} ${labelsVisible ? styles.labelVisible : ''} ${isLeft ? styles.labelLeft : styles.labelRight}`}
                            style={{
                                [isLeft ? 'right' : 'left']: `calc(50% + ${ORBIT_R}px)`,
                                top: LABEL_TOPS[label.i],
                                transitionDelay: labelsVisible ? `${stagger * 120}ms` : '0ms',
                            }}
                        >
                            <ConnectorSvg flip={isLeft} ibeamAngle={-angle} />
                            <div className={styles.labelContent} style={{ marginTop: TITLE_OFFSET }}>
                                <div className={styles.labelTitle}>{label.title}</div>
                                <ul className={styles.labelItems}>
                                    {label.items.map(item => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
