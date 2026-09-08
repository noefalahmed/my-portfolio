import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import dash from './CimplAccountsDashboard.module.css'
import s from './CimplLibrary.module.css'
import { TopBar, SideNav, CostsChart, COSTS_CHART_DATA } from './CimplAccountsDashboard'

/* ── helpers ── */
const MI = ({ name, style }: { name: string; style?: React.CSSProperties }) => (
  <span className="material-icons-outlined" style={{ fontSize: 24, lineHeight: 1, ...style }}>{name}</span>
)

/* ── types ── */
type Callout    = { n: number; x: string; y: string; label: string; desc: string }
type SpecRow    = { property: string; value: string }
type SpecMeasure = { label: string; direction: 'h' | 'v'; from: number; to: number }

type CompEntry = {
  id: string; category: string; name: string; desc: string
  render: () => React.ReactNode
  stageClass?: string
  calloutSide?: 'left' | 'bottom'
  callouts: Callout[]
  specMeasures: SpecMeasure[]
  specRows: SpecRow[]
}

const ANATOMY_PURPLE = '#7B4FBB'
const DOT_R  = 11
const MARGIN = 44   // space outside component for the dots

/* ════════════════════════════════════════════════
   ANATOMY VIEW
   - left side:   dot in left margin, horizontal line → component left edge at callout y%
   - bottom side: dot in bottom margin, vertical line ↑ component bottom edge at callout x%
════════════════════════════════════════════════ */
const AnatomyView: React.FC<{ comp: CompEntry }> = ({ comp }) => {
  const compRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = compRef.current; if (!el) return
    const obs = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }))
    obs.observe(el)
    return () => obs.disconnect()
  }, [comp.id])

  const side    = comp.calloutSide ?? 'left'
  const hasDots = comp.callouts.length > 0

  const leftSvgH = dims.h

  const DOT_CX = DOT_R + 2   // dot center x within left-margin SVG

  return (
    <div style={{
      position: 'relative', width: '100%', boxSizing: 'border-box',
      paddingLeft:   side === 'left'   && hasDots ? MARGIN : 0,
      paddingBottom: side === 'bottom' && hasDots ? MARGIN : 0,
    }}>
      <div ref={compRef}>{comp.render()}</div>

      {/* ── left: dots at exact callout Y, horizontal line to component ── */}
      {dims.w > 0 && hasDots && side === 'left' && (
        <svg style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 10 }}
          width={MARGIN} height={leftSvgH}>
          {comp.callouts.map(c => {
            const cy = (parseFloat(c.y) / 100) * dims.h
            return (
              <g key={c.n}>
                <line x1={DOT_CX + DOT_R} y1={cy} x2={MARGIN} y2={cy}
                  stroke={ANATOMY_PURPLE} strokeWidth="1" opacity="0.5" />
                <circle cx={DOT_CX} cy={cy} r={DOT_R} fill={ANATOMY_PURPLE} />
                <text x={DOT_CX} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight="700"
                  fill="white" fontFamily="'Open Sans', sans-serif">{c.n}</text>
              </g>
            )
          })}
        </svg>
      )}

      {/* ── bottom: dots at exact callout X, vertical line to component ── */}
      {dims.w > 0 && hasDots && side === 'bottom' && (
        <svg style={{ position: 'absolute', top: dims.h, left: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 10 }}
          width={dims.w} height={MARGIN}>
          {comp.callouts.map(c => {
            const cx = (parseFloat(c.x) / 100) * dims.w
            const cy = MARGIN - DOT_R - 2
            return (
              <g key={c.n}>
                <line x1={cx} y1={0} x2={cx} y2={cy - DOT_R}
                  stroke={ANATOMY_PURPLE} strokeWidth="1" opacity="0.5" />
                <circle cx={cx} cy={cy} r={DOT_R} fill={ANATOMY_PURPLE} />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight="700"
                  fill="white" fontFamily="'Open Sans', sans-serif">{c.n}</text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════
   SPECS VIEW — brackets below (h) and right (v)
════════════════════════════════════════════════ */
const SpecsView: React.FC<{ comp: CompEntry }> = ({ comp }) => {
  const compRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = compRef.current; if (!el) return
    const obs = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }))
    obs.observe(el)
    return () => obs.disconnect()
  }, [comp.id])

  const hMeasures = comp.specMeasures.filter(m => m.direction === 'h')
  const vMeasures = comp.specMeasures.filter(m => m.direction === 'v')

  const H_GAP = 16
  const H_STEP = 36   // vertical space per stacked h-bracket
  const V_GAP = 16
  const V_STEP = 52   // horizontal space per stacked v-bracket

  const pbottom = hMeasures.length > 0 ? H_GAP + hMeasures.length * H_STEP + 8 : 0
  const pright  = vMeasures.length > 0 ? V_GAP + vMeasures.length * V_STEP + 8 : 0
  const isFull  = comp.stageClass === 'full'

  const labelW = (label: string) => Math.max(36, label.length * 7 + 14)

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: pbottom, paddingRight: pright, boxSizing: 'border-box' }}>
      <div ref={compRef} style={{ width: isFull ? '100%' : undefined }}>
        {comp.render()}
      </div>
      {dims.w > 0 && comp.specMeasures.length > 0 && (
        <svg
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}
          width={dims.w} height={dims.h}
        >
          {hMeasures.map((m, i) => {
            const x1 = (m.from / 100) * dims.w
            const x2 = (m.to  / 100) * dims.w
            const y  = dims.h + H_GAP + i * H_STEP + 10
            const mx = (x1 + x2) / 2
            const lw = labelW(m.label)
            return (
              <g key={i}>
                <line x1={x1} y1={y} x2={x2} y2={y} stroke="#2574DB" strokeWidth="1.5" />
                <line x1={x1} y1={y - 6} x2={x1} y2={y + 6} stroke="#2574DB" strokeWidth="1.5" />
                <line x1={x2} y1={y - 6} x2={x2} y2={y + 6} stroke="#2574DB" strokeWidth="1.5" />
                <rect x={mx - lw / 2} y={y - 9} width={lw} height={18} rx={3} fill="#2574DB" />
                <text x={mx} y={y + 4} textAnchor="middle" fontSize={10} fontWeight="700" fill="white"
                  fontFamily="'Open Sans', sans-serif">{m.label}</text>
              </g>
            )
          })}
          {vMeasures.map((m, i) => {
            const y1 = (m.from / 100) * dims.h
            const y2 = (m.to  / 100) * dims.h
            const x  = dims.w + V_GAP + i * V_STEP + 10
            const my = (y1 + y2) / 2
            const lw = labelW(m.label)
            return (
              <g key={i}>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke="#2574DB" strokeWidth="1.5" />
                <line x1={x - 6} y1={y1} x2={x + 6} y2={y1} stroke="#2574DB" strokeWidth="1.5" />
                <line x1={x - 6} y1={y2} x2={x + 6} y2={y2} stroke="#2574DB" strokeWidth="1.5" />
                <rect x={x - lw / 2} y={my - 9} width={lw} height={18} rx={3} fill="#2574DB" />
                <text x={x} y={my + 4} textAnchor="middle" fontSize={10} fontWeight="700" fill="white"
                  fontFamily="'Open Sans', sans-serif">{m.label}</text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}

/* ── mini chart for bar chart component ── */
const MINI_DATA = [
  { month: 'Jan', s: 65, c: 82 },
  { month: 'Feb', s: 50, c: 55 },
  { month: 'Mar', s: 80, c: 70 },
  { month: 'Apr', s: 100, c: 88 },
]
const LibChart: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(400)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new ResizeObserver(e => setW(e[0].contentRect.width))
    obs.observe(el); return () => obs.disconnect()
  }, [])
  const CL = 40, CR = 8, CT = 8, CB = 28, H = 180, CH = H - CT - CB
  const cw = w - CL - CR, gW = cw / MINI_DATA.length
  const BAR = Math.max(10, Math.min(24, gW * 0.28)), GAP = 4
  const gy = (v: number) => CT + CH - (v / 100) * CH
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={H} style={{ display: 'block' }}>
        {[0, 50, 100].map(v => <line key={v} x1={CL} x2={CL + cw} y1={gy(v)} y2={gy(v)} stroke="#E0E0E0" strokeWidth="1" />)}
        {MINI_DATA.map((d, i) => {
          const cx = CL + (i + 0.5) * gW
          return (
            <g key={i}>
              <rect x={cx - BAR - GAP / 2} y={gy(d.s)} width={BAR} height={CH - (gy(d.s) - CT)} rx={1} fill="#00C8E0" />
              <rect x={cx + GAP / 2}       y={gy(d.c)} width={BAR} height={CH - (gy(d.c) - CT)} rx={1} fill="#162040" />
              <text x={cx} y={H - 6} textAnchor="middle" fontSize={11} fill="#6B7786" fontFamily="'Open Sans', sans-serif">{d.month}</text>
            </g>
          )
        })}
        {[0, 50, 100].map(v => <text key={v} x={CL - 4} y={gy(v) + 4} textAnchor="end" fontSize={11} fill="#6B7786" fontFamily="'Open Sans', sans-serif">{v}</text>)}
      </svg>
    </div>
  )
}

/* ── chart variant constants ── */
const CV_H = 280, CV_CL = 48, CV_CR = 20, CV_CT = 15, CV_CB = 65
const CV_CH = CV_H - CV_CT - CV_CB
const CV_GRID = [0, 25, 50, 75, 100]
const cvGy = (v: number) => CV_CT + CV_CH - (v / 100) * CV_CH

const StackedChart: React.FC<{ data: typeof COSTS_CHART_DATA }> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(800)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new ResizeObserver(e => setW(e[0].contentRect.width))
    obs.observe(el); return () => obs.disconnect()
  }, [])
  const cw = w - CV_CL - CV_CR
  const gW = cw / data.length
  const barW = Math.min(48, gW * 0.55)
  const maxVal = 200
  const gy2 = (v: number) => CV_CT + CV_CH - (v / maxVal) * CV_CH
  const gridVals = [0, 50, 100, 150, 200]
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={CV_H} style={{ display: 'block', overflow: 'visible' }}>
        {gridVals.map(v => <line key={v} x1={CV_CL} x2={CV_CL + cw} y1={gy2(v)} y2={gy2(v)} stroke="#E0E0E0" strokeWidth="1" />)}
        {gridVals.map(v => <text key={v} x={CV_CL - 8} y={gy2(v) + 5} textAnchor="end" fontSize={14} fontWeight={600} fill="#6B7786">{v}</text>)}
        {data.map((d, i) => {
          const cx = CV_CL + (i + 0.5) * gW
          const costsH = (d.costs / maxVal) * CV_CH
          const servicesH = (d.services / maxVal) * CV_CH
          const costsY = gy2(d.costs)
          return (
            <g key={i}>
              <rect x={cx - barW / 2} y={costsY} width={barW} height={costsH} fill="#162040" />
              <rect x={cx - barW / 2} y={costsY - servicesH} width={barW} height={servicesH} fill="#00C8E0" />
              <text x={cx} y={CV_CT + CV_CH + 30} textAnchor="middle" fontSize={14} fontWeight={600} fill="#6B7786" fontFamily="'Open Sans', sans-serif">{d.month.slice(0, 3)}</text>
            </g>
          )
        })}
        <line x1={CV_CL} x2={CV_CL} y1={CV_CT} y2={CV_CT + CV_CH} stroke="#E0E0E0" strokeWidth="1" />
        <line x1={CV_CL} x2={CV_CL + cw} y1={gy2(0)} y2={gy2(0)} stroke="#E0E0E0" strokeWidth="1" />
      </svg>
    </div>
  )
}

const LineChart: React.FC<{ data: typeof COSTS_CHART_DATA }> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(800)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new ResizeObserver(e => setW(e[0].contentRect.width))
    obs.observe(el); return () => obs.disconnect()
  }, [])
  const cw = w - CV_CL - CV_CR
  const n = data.length
  const gx = (i: number) => CV_CL + (i / (n - 1)) * cw
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={CV_H} style={{ display: 'block', overflow: 'visible' }}>
        {CV_GRID.map(v => <line key={v} x1={CV_CL} x2={CV_CL + cw} y1={cvGy(v)} y2={cvGy(v)} stroke="#E0E0E0" strokeWidth="1" />)}
        {CV_GRID.map(v => <text key={v} x={CV_CL - 8} y={cvGy(v) + 5} textAnchor="end" fontSize={14} fontWeight={600} fill="#6B7786">{v}</text>)}
        {(['services', 'costs'] as const).map((key, ki) => {
          const color = ki === 0 ? '#00C8E0' : '#162040'
          return (
            <g key={key}>
              {data.map((d, i) => i === 0 ? null : (
                <line key={i} x1={gx(i - 1)} y1={cvGy(data[i-1][key])} x2={gx(i)} y2={cvGy(d[key])} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              ))}
              {data.map((d, i) => <circle key={i} cx={gx(i)} cy={cvGy(d[key])} r={4} fill={color} />)}
            </g>
          )
        })}
        {data.map((d, i) => (
          <text key={i} x={gx(i)} y={CV_CT + CV_CH + 30} textAnchor="middle" fontSize={14} fontWeight={600} fill="#6B7786" fontFamily="'Open Sans', sans-serif">{d.month.slice(0, 3)}</text>
        ))}
        <line x1={CV_CL} x2={CV_CL} y1={CV_CT} y2={CV_CT + CV_CH} stroke="#E0E0E0" strokeWidth="1" />
        <line x1={CV_CL} x2={CV_CL + cw} y1={cvGy(0)} y2={cvGy(0)} stroke="#E0E0E0" strokeWidth="1" />
      </svg>
    </div>
  )
}

const ComboChart: React.FC<{ data: typeof COSTS_CHART_DATA }> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(800)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new ResizeObserver(e => setW(e[0].contentRect.width))
    obs.observe(el); return () => obs.disconnect()
  }, [])
  const cw = w - CV_CL - CV_CR
  const n = data.length
  const gW = cw / n
  const barW = Math.min(40, gW * 0.5)
  const gx = (i: number) => CV_CL + (i + 0.5) * gW
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={CV_H} style={{ display: 'block', overflow: 'visible' }}>
        {CV_GRID.map(v => <line key={v} x1={CV_CL} x2={CV_CL + cw} y1={cvGy(v)} y2={cvGy(v)} stroke="#E0E0E0" strokeWidth="1" />)}
        {CV_GRID.map(v => <text key={v} x={CV_CL - 8} y={cvGy(v) + 5} textAnchor="end" fontSize={14} fontWeight={600} fill="#6B7786">{v}</text>)}
        {data.map((d, i) => (
          <g key={i}>
            <rect x={gx(i) - barW / 2} y={cvGy(d.costs)} width={barW} height={(d.costs / 100) * CV_CH} fill="#162040" rx={2} />
            <text x={gx(i)} y={CV_CT + CV_CH + 30} textAnchor="middle" fontSize={14} fontWeight={600} fill="#6B7786" fontFamily="'Open Sans', sans-serif">{d.month.slice(0, 3)}</text>
          </g>
        ))}
        {data.map((d, i) => i === 0 ? null : (
          <line key={i} x1={gx(i-1)} y1={cvGy(data[i-1].services)} x2={gx(i)} y2={cvGy(d.services)} stroke="#00C8E0" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {data.map((d, i) => <circle key={i} cx={gx(i)} cy={cvGy(d.services)} r={4} fill="#00C8E0" />)}
        <line x1={CV_CL} x2={CV_CL} y1={CV_CT} y2={CV_CT + CV_CH} stroke="#E0E0E0" strokeWidth="1" />
        <line x1={CV_CL} x2={CV_CL + cw} y1={cvGy(0)} y2={cvGy(0)} stroke="#E0E0E0" strokeWidth="1" />
      </svg>
    </div>
  )
}

const GapChart: React.FC<{ data: typeof COSTS_CHART_DATA }> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(800)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new ResizeObserver(e => setW(e[0].contentRect.width))
    obs.observe(el); return () => obs.disconnect()
  }, [])
  const cw = w - CV_CL - CV_CR
  const n = data.length
  const gW = cw / n
  const gx = (i: number) => CV_CL + (i + 0.5) * gW
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={CV_H} style={{ display: 'block', overflow: 'visible' }}>
        {CV_GRID.map(v => <line key={v} x1={CV_CL} x2={CV_CL + cw} y1={cvGy(v)} y2={cvGy(v)} stroke="#E0E0E0" strokeWidth="1" />)}
        {CV_GRID.map(v => <text key={v} x={CV_CL - 8} y={cvGy(v) + 5} textAnchor="end" fontSize={14} fontWeight={600} fill="#6B7786">{v}</text>)}
        {data.map((d, i) => {
          const gapTop = cvGy(Math.max(d.costs, d.services))
          const gapBot = cvGy(Math.min(d.costs, d.services))
          const slotX = CV_CL + i * gW
          return <rect key={i} x={slotX} y={gapTop} width={gW} height={gapBot - gapTop} fill={d.costs > d.services ? 'rgba(234,88,60,0.12)' : 'rgba(0,200,224,0.12)'} />
        })}
        {(['services', 'costs'] as const).map((key, ki) => {
          const color = ki === 0 ? '#00C8E0' : '#162040'
          return (
            <g key={key}>
              {data.map((d, i) => i === 0 ? null : (
                <line key={i} x1={gx(i-1)} y1={cvGy(data[i-1][key])} x2={gx(i)} y2={cvGy(d[key])} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
              ))}
              {data.map((d, i) => <circle key={i} cx={gx(i)} cy={cvGy(d[key])} r={4} fill={color} />)}
            </g>
          )
        })}
        {data.map((d, i) => (
          <text key={i} x={gx(i)} y={CV_CT + CV_CH + 30} textAnchor="middle" fontSize={14} fontWeight={600} fill="#6B7786" fontFamily="'Open Sans', sans-serif">{d.month.slice(0, 3)}</text>
        ))}
        <line x1={CV_CL} x2={CV_CL} y1={CV_CT} y2={CV_CT + CV_CH} stroke="#E0E0E0" strokeWidth="1" />
        <line x1={CV_CL} x2={CV_CL + cw} y1={cvGy(0)} y2={cvGy(0)} stroke="#E0E0E0" strokeWidth="1" />
      </svg>
    </div>
  )
}

/* ════════════════════════════════════════════════
   COMPONENT REGISTRY
════════════════════════════════════════════════ */
const REGISTRY: CompEntry[] = [

  /* ── TOP BAR ── */
  {
    id: 'topbar', category: 'Shell & Layout', name: 'Top Bar',
    desc: 'Primary application header. Provides navigation trigger, current page context, and user utilities.',
    stageClass: 'full', calloutSide: 'bottom',
    render: () => (
      <div style={{ width: '100%', height: 56, background: '#2574DB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MI name="menu" style={{ color: 'white' }} />
          <span style={{ color: 'white', fontSize: 20, fontWeight: 600, paddingLeft: 8 }}>Configuration</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MI name="notifications" style={{ color: 'white' }} />
          <MI name="account_circle" style={{ color: 'white' }} />
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '3%',  y: '50%', label: 'Hamburger Menu',     desc: 'Icon button that opens/closes the side navigation panel' },
      { n: 2, x: '25%', y: '50%', label: 'Page Title',         desc: '20px semibold white — displays the current module name' },
      { n: 3, x: '88%', y: '50%', label: 'Notifications Icon', desc: 'Alert indicator for system notifications' },
      { n: 4, x: '95%', y: '50%', label: 'User Avatar',        desc: 'Triggers account menu or profile view' },
    ],
    specMeasures: [
      { label: '56px',     direction: 'v', from: 0, to: 100 },
      { label: 'Flexible', direction: 'h', from: 0, to: 100 },
    ],
    specRows: [
      { property: 'Height',      value: '56px' },
      { property: 'Width',       value: '100% (flexible)' },
      { property: 'Background',  value: '#2574DB' },
      { property: 'Padding (H)', value: '16px' },
      { property: 'Title size',  value: '20px' },
      { property: 'Title weight',value: '600' },
    ],
  },

  /* ── SIDE NAV ── */
  {
    id: 'sidenav', category: 'Shell & Layout', name: 'Side Nav',
    desc: 'Icon-only vertical navigation rail. Active item is indicated with a left-border accent and tinted background.',
    render: () => (
      <nav style={{ width: 56, background: 'white', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
        {[
          { icon: 'shopping_cart', active: false },
          { icon: 'storefront',    active: false },
          { icon: 'insert_chart',  active: false },
          { icon: 'assignment',    active: false },
          { icon: 'settings',      active: true  },
        ].map(({ icon, active }) => (
          <div key={icon} style={{
            width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: active ? '#1565C0' : '#6B7786',
            background: active ? '#E8F0FE' : 'transparent',
            boxShadow: active ? 'inset 4px 0 0 #1565C0' : 'none',
          }}><MI name={icon} /></div>
        ))}
      </nav>
    ),
    callouts: [
      { n: 1, x: '50%', y: '10%', label: 'Nav Icon (Default)', desc: 'Material icon, 24px, color #6B7786' },
      { n: 2, x: '50%', y: '90%', label: 'Nav Icon (Active)',  desc: 'Left 4px border #1565C0, background #E8F0FE, icon color #1565C0' },
    ],
    specMeasures: [
      { label: '56px', direction: 'v', from: 0,  to: 20  },
      { label: '56px', direction: 'h', from: 0,  to: 100 },
    ],
    specRows: [
      { property: 'Width',         value: '56px' },
      { property: 'Item height',   value: '56px' },
      { property: 'Icon size',     value: '24px' },
      { property: 'Active bg',     value: '#E8F0FE' },
      { property: 'Active accent', value: 'inset 4px left #1565C0' },
      { property: 'Default icon',  value: '#6B7786' },
    ],
  },

  /* ── TAB BAR ── */
  {
    id: 'tabbar', category: 'Navigation', name: 'Tab Bar',
    desc: 'Horizontal tab strip for navigating between content sections within a page. Active tab is underlined with the primary color.',
    stageClass: 'full', calloutSide: 'bottom',
    render: () => (
      <div style={{ width: '100%', background: 'white', borderBottom: '1px solid #BFC6CE', display: 'flex', alignItems: 'flex-end', height: 56, paddingLeft: 16 }}>
        {['Overview', 'Related Accounts', 'Costs', 'Services', 'Allocations', 'Activity'].map((tab, i) => (
          <div key={tab} style={{
            height: 48, padding: '0 16px', display: 'flex', alignItems: 'center',
            fontSize: 14, fontWeight: 500, letterSpacing: '1.25px', textTransform: 'uppercase',
            color: i === 2 ? '#2574DB' : '#6B7786',
            borderBottom: i === 2 ? '4px solid #2574DB' : '4px solid transparent',
            cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box',
          }}>{tab}</div>
        ))}
      </div>
    ),
    callouts: [
      { n: 1, x: '8%',  y: '40%', label: 'Inactive Tab',  desc: '14px, weight 500, 1.25px letter-spacing, uppercase, color #6B7786' },
      { n: 2, x: '38%', y: '40%', label: 'Active Tab',    desc: 'Same type styles, color #2574DB, 4px bottom border #2574DB' },
      { n: 3, x: '50%', y: '95%', label: 'Bottom Border', desc: '1px solid #BFC6CE — separates tabs from tab content' },
    ],
    specMeasures: [
      { label: '56px',     direction: 'v', from: 0,  to: 100 },
      { label: '48px',     direction: 'v', from: 14, to: 100 },
      { label: 'Flexible', direction: 'h', from: 0,  to: 100 },
    ],
    specRows: [
      { property: 'Bar height',       value: '56px' },
      { property: 'Tab hit height',   value: '48px' },
      { property: 'Active indicator', value: '4px solid #2574DB' },
      { property: 'Tab padding (H)',  value: '16px' },
      { property: 'Font size',        value: '14px' },
      { property: 'Letter spacing',   value: '1.25px' },
      { property: 'Inactive color',   value: '#6B7786' },
      { property: 'Active color',     value: '#2574DB' },
    ],
  },

  /* ── PRIMARY BUTTON ── */
  {
    id: 'btn-primary', category: 'Buttons', name: 'Button — Primary',
    desc: 'Filled primary action button. Used for the most important action in a surface.',
    render: () => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className={`${dash.button} ${dash.buttonDefault}`}><MI name="add" style={{ fontSize: 18 }} />Add Item</button>
        <button className={`${dash.button} ${dash.buttonOutlined}`}><MI name="arrow_drop_down" style={{ color: '#2574DB', fontSize: 20 }} />Actions</button>
        <button className={`${dash.button} ${dash.buttonText}`}><MI name="file_upload" style={{ fontSize: 18 }} />Export</button>
        <button className={`${dash.button} ${dash.buttonTextPrimary}`}>Apply</button>
      </div>
    ),
    callouts: [
      { n: 1, x: '10%', y: '50%', label: 'Primary (Filled)', desc: 'Background #2574DB, white text, used for primary CTA' },
      { n: 2, x: '35%', y: '50%', label: 'Outlined',         desc: 'Border 1.5px #2574DB, white bg, used for secondary actions' },
      { n: 3, x: '60%', y: '50%', label: 'Text (Gray)',      desc: 'No background, color #6B7786. Used for neutral actions like Export, Cancel' },
      { n: 4, x: '83%', y: '50%', label: 'Text Primary',     desc: 'No background, color #2574DB. Used inside dialogs for Cancel / Apply' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Height',             value: '36px' },
      { property: 'Border radius',      value: '4px' },
      { property: 'Font size',          value: '14px' },
      { property: 'Font weight',        value: '500' },
      { property: 'Letter spacing',     value: '1.25px' },
      { property: 'Primary bg',         value: '#2574DB' },
      { property: 'Primary hover bg',   value: '#1a65cb' },
      { property: 'Outlined border',    value: '1.5px solid #2574DB' },
      { property: 'Text (gray) color',  value: '#6B7786' },
      { property: 'Text primary color', value: '#2574DB' },
      { property: 'Padding (H)',        value: '8–18px (by variant)' },
    ],
  },

  /* ── ICON BUTTON ── */
  {
    id: 'btn-icon', category: 'Buttons', name: 'Button — Icon',
    desc: 'Ghost icon-only buttons used for row-level actions (edit, delete) and sub-section controls (add).',
    render: () => (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button className={dash.rowIconBtn}><MI name="edit"   style={{ fontSize: 18 }} /></button>
        <button className={dash.rowIconBtn}><MI name="delete" style={{ fontSize: 18 }} /></button>
        <button className={dash.addBtn}><MI name="add" style={{ fontSize: 20 }} /></button>
      </div>
    ),
    callouts: [
      { n: 1, x: '17%', y: '50%', label: 'Row Icon — Edit',   desc: '32×32px ghost button, icon color #6B7786, hover surface tint' },
      { n: 2, x: '50%', y: '50%', label: 'Row Icon — Delete', desc: 'Same as edit. Destructive action — triggers confirm dialog' },
      { n: 3, x: '83%', y: '50%', label: 'Add Button',        desc: '28×28px, color #2574DB, hover background #EEF4FC' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Row icon size',   value: '32×32px' },
      { property: 'Add button size', value: '28×28px' },
      { property: 'Icon size',       value: '18–20px' },
      { property: 'Border radius',   value: '4px' },
      { property: 'Color (default)', value: '#6B7786' },
      { property: 'Add color',       value: '#2574DB' },
      { property: 'Add hover bg',    value: '#EEF4FC' },
    ],
  },

  /* ── TEXT INPUT ── */
  {
    id: 'input-text', category: 'Form Controls', name: 'Text Input',
    desc: 'Floating-label text field. The label sits inside the border, floats to the top-left in active/filled state.',
    render: () => (
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className={dash.floatGroup} style={{ width: 220, marginTop: 12 }}>
          <label className={dash.floatLabel}>Account No*</label>
          <input className={dash.inputField} defaultValue="100000315555" style={{ maxWidth: 'none', width: 220 }} />
        </div>
        <div className={dash.floatGroup} style={{ width: 220, marginTop: 12 }}>
          <label className={dash.floatLabel}>Empty field</label>
          <input className={dash.inputField} placeholder="" style={{ maxWidth: 'none', width: 220 }} />
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '15%', y: '5%',  label: 'Floating Label', desc: '12px, color #6B7786. Floats to top-left when field has value or is focused' },
      { n: 2, x: '25%', y: '60%', label: 'Input Field',    desc: 'Height 40px, border 1px solid #6B7786, border-radius 4px, padding 0 16px' },
      { n: 3, x: '25%', y: '90%', label: 'Focus State',    desc: 'Border changes to 2px solid #2574DB on focus' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Height',         value: '40px' },
      { property: 'Border',         value: '1px solid #6B7786' },
      { property: 'Border (focus)', value: '2px solid #2574DB' },
      { property: 'Border radius',  value: '4px' },
      { property: 'Padding (H)',    value: '16px' },
      { property: 'Font size',      value: '14px' },
      { property: 'Label size',     value: '12px' },
      { property: 'Label color',    value: '#6B7786' },
      { property: 'Label bg',       value: 'white (masks border)' },
    ],
  },

  /* ── SELECT ── */
  {
    id: 'input-select', category: 'Form Controls', name: 'Select / Dropdown',
    desc: 'Floating-label select field with custom arrow. Matches text input visual style exactly.',
    render: () => (
      <div className={dash.floatGroup} style={{ width: 260, marginTop: 12 }}>
        <label className={dash.floatLabel}>Account Level*</label>
        <div className={dash.selectWrapper} style={{ maxWidth: 'none', width: 260 }}>
          <select className={dash.selectField} style={{ maxWidth: 'none', width: 260 }} defaultValue="Subaccount">
            <option>Subaccount</option><option>Hierarchy</option><option>Standalone</option>
          </select>
          <span className={`${dash.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '20%', y: '5%',  label: 'Floating Label', desc: '12px, color #6B7786, positioned at top-left border' },
      { n: 2, x: '45%', y: '55%', label: 'Native Select',  desc: 'Appearance reset via CSS, inherits input field border/padding/size' },
      { n: 3, x: '92%', y: '55%', label: 'Arrow Icon',     desc: 'Material icon arrow_drop_down, 24px, color #6B7786, pointer-events: none' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Height',        value: '40px' },
      { property: 'Border',        value: '1px solid #6B7786' },
      { property: 'Border radius', value: '4px' },
      { property: 'Padding (L)',   value: '16px' },
      { property: 'Padding (R)',   value: '40px (for arrow)' },
      { property: 'Arrow icon',    value: '24px, #6B7786' },
      { property: 'Font size',     value: '14px' },
    ],
  },

  /* ── CHECKBOX ── */
  {
    id: 'checkbox', category: 'Form Controls', name: 'Checkbox',
    desc: 'Custom-styled checkbox with blue checked state. Used for locks, show/hide filters, and row selection.',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, cursor: 'pointer' }}>
          <input type="checkbox" className={dash.checkbox} defaultChecked={false} readOnly />
          Unchecked
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, cursor: 'pointer' }}>
          <input type="checkbox" className={dash.checkbox} defaultChecked={true} readOnly />
          Checked
        </label>
      </div>
    ),
    callouts: [
      { n: 1, x: '8%',  y: '25%', label: 'Unchecked State', desc: '18×18px, border 2px solid rgba(0,0,0,0.54), border-radius 2px' },
      { n: 2, x: '8%',  y: '75%', label: 'Checked State',   desc: 'Background #1565C0, border-color #1565C0, white checkmark via ::after' },
      { n: 3, x: '55%', y: '50%', label: 'Label Text',      desc: '14px, color #252B31' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Size',            value: '18×18px' },
      { property: 'Border',          value: '2px solid rgba(0,0,0,0.54)' },
      { property: 'Border radius',   value: '2px' },
      { property: 'Checked bg',      value: '#1565C0' },
      { property: 'Checkmark color', value: 'white' },
      { property: 'Gap to label',    value: '12px' },
      { property: 'Label font size', value: '14px' },
    ],
  },

  /* ── TOGGLE ── */
  {
    id: 'toggle', category: 'Form Controls', name: 'Toggle',
    desc: 'Material 2 pill toggle. Used for Show Subaccounts in Services and Costs tabs.',
    render: () => {
      const [on, setOn] = React.useState(true)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <label className={dash.toggleWrapper} onClick={() => {}}>
            <div className={dash.toggle}><div className={dash.toggleThumb} /></div>
            Off
          </label>
          <label className={dash.toggleWrapper} onClick={() => setOn(v => !v)}>
            <div className={`${dash.toggle} ${on ? dash.toggleOn : ''}`}><div className={dash.toggleThumb} /></div>
            {on ? 'On' : 'Off'} (interactive)
          </label>
        </div>
      )
    },
    callouts: [
      { n: 1, x: '8%',  y: '25%', label: 'Track (Off)', desc: '36×20px pill, background #9E9E9E, border-radius 10px' },
      { n: 2, x: '8%',  y: '75%', label: 'Track (On)',  desc: 'Background #2574DB' },
      { n: 3, x: '22%', y: '75%', label: 'Thumb',       desc: '16×16px circle, background white, box-shadow, transitions translateX(16px)' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Track size',   value: '36×20px' },
      { property: 'Track radius', value: '10px' },
      { property: 'Off color',    value: '#9E9E9E' },
      { property: 'On color',     value: '#2574DB' },
      { property: 'Thumb size',   value: '16×16px' },
      { property: 'Thumb inset',  value: '2px' },
      { property: 'Thumb travel', value: 'translateX(16px)' },
      { property: 'Transition',   value: '0.2s ease' },
    ],
  },

  /* ── STATUS CHIPS ── */
  {
    id: 'chips', category: 'Indicators', name: 'Status Chip',
    desc: 'Color-coded status badge. Used in tables and cards to indicate account or service state.',
    render: () => (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className={`${dash.chip} ${dash.chipOpen}`}>Open</span>
        <span className={`${dash.chip} ${dash.chipClosed}`}>Closed</span>
        <span className={`${dash.chip} ${dash.chipDeactivated}`}>Deactivated</span>
        <span className={`${dash.chip} ${dash.chipFlagged}`}>Flagged</span>
        <span className={`${dash.chip} ${dash.chipActive}`}>Active</span>
        <span style={{ display:'inline-block', padding:'2px 6px', borderRadius:2, border:'1px solid #6B7786', fontSize:11, fontWeight:600, letterSpacing:1, color:'#6B7786', textTransform:'uppercase' }}>History</span>
      </div>
    ),
    callouts: [
      { n: 1, x: '6%',  y: '50%', label: 'Open',        desc: '#003A86 (success-secondary)' },
      { n: 2, x: '22%', y: '50%', label: 'Closed',      desc: '#00ACC1 (teal)' },
      { n: 3, x: '43%', y: '50%', label: 'Deactivated', desc: '#9E9E9E (gray)' },
      { n: 4, x: '61%', y: '50%', label: 'Flagged',     desc: '#D32F2F (red)' },
      { n: 5, x: '76%', y: '50%', label: 'Active',      desc: '#607D8B (blue-gray)' },
      { n: 6, x: '92%', y: '50%', label: 'History Tag', desc: 'Outlined variant — 1px border, no fill. Used in Activity feed.' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Padding',        value: '3px 8px' },
      { property: 'Border radius',  value: '2px' },
      { property: 'Font size',      value: '12px' },
      { property: 'Font weight',    value: '600' },
      { property: 'Letter spacing', value: '1.2px' },
      { property: 'Text transform', value: 'uppercase' },
      { property: 'Text color',     value: 'white (filled) / #6B7786 (History)' },
    ],
  },

  /* ── STAT CARD ── */
  {
    id: 'statcard', category: 'Data Display', name: 'Stat Card',
    desc: 'Summary metric card shown in the main dashboard. Left border color encodes the status type.',
    render: () => (
      <div style={{ display: 'flex', gap: 16 }}>
        <div className={`${dash.statCard} ${dash.statCardOpened}`} style={{ minWidth: 180 }}>
          <div className={dash.statCardLabel}>Open</div>
          <div className={dash.statCardValue}>7</div>
          <div className={dash.statCardSub}>accounts</div>
        </div>
        <div className={`${dash.statCard} ${dash.statCardClosed}`} style={{ minWidth: 180 }}>
          <div className={dash.statCardLabel}>Closed</div>
          <div className={dash.statCardValue}>4</div>
          <div className={dash.statCardSub}>accounts</div>
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '2%',  y: '50%', label: 'Status Accent',  desc: '8px left border — color encodes status: #003A86 Open, #00ACC1 Closed' },
      { n: 2, x: '30%', y: '20%', label: 'Category Label', desc: '20px, 600 weight, 1.25px letter-spacing, uppercase, color #607D8B' },
      { n: 3, x: '30%', y: '55%', label: 'Metric Value',   desc: '36px, 600 weight, color #263238' },
      { n: 4, x: '30%', y: '80%', label: 'Sub Label',      desc: '14px, color #90A4AE' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Left border',   value: '8px solid (status color)' },
      { property: 'Border radius', value: '4px' },
      { property: 'Padding',       value: '8px 24px 8px 16px' },
      { property: 'Min width',     value: '240px' },
      { property: 'Label size',    value: '20px / 600 / uppercase' },
      { property: 'Value size',    value: '36px / 600' },
      { property: 'Sub size',      value: '14px' },
      { property: 'Open color',    value: '#003A86' },
      { property: 'Closed color',  value: '#00ACC1' },
    ],
  },

  /* ── DATA TABLE ── */
  {
    id: 'table', category: 'Data Display', name: 'Data Table',
    desc: 'Full-width data table with sortable column headers, row hover, status chips, and per-row action buttons.',
    stageClass: 'full',
    render: () => (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table className={dash.table}>
          <thead>
            <tr>
              {['Account No.', 'Provider', 'Account Name', 'Status', 'Open Date'].map(col => (
                <th key={col}><span className={dash.thInner}>{col}<MI name="unfold_more" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {[
              { no: '810044515191', provider: 'Zayo Canada', name: '810044515191 - All Services', status: 'OPEN',        date: '2021-02-20' },
              { no: '810000314432', provider: 'Zayo Canada', name: '810000314432 - All Services', status: 'DEACTIVATED', date: '2021-02-20' },
              { no: '810000539272', provider: 'Zayo Canada', name: '810000539272 - Canada West',  status: 'CLOSED',      date: '2021-02-20' },
            ].map((row, i) => (
              <tr key={i}>
                <td><span className={dash.accountLink}>{row.no}</span></td>
                <td>{row.provider}</td>
                <td>{row.name}</td>
                <td><span className={`${dash.chip} ${row.status === 'OPEN' ? dash.chipOpen : row.status === 'DEACTIVATED' ? dash.chipDeactivated : dash.chipClosed}`}>{row.status}</span></td>
                <td>{row.date}</td>
                <td><div className={dash.rowActions}><button className={dash.rowIconBtn}><MI name="edit" style={{ fontSize: 18 }} /></button><button className={dash.rowIconBtn}><MI name="delete" style={{ fontSize: 18 }} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    callouts: [
      { n: 1, x: '50%', y: '15%', label: 'Column Header', desc: '56px height, 14px semibold, color #252B31, background white. Includes sort icon.' },
      { n: 2, x: '5%',  y: '40%', label: 'Account Link',  desc: '14px, color #2574DB, underlined. Navigates to account detail.' },
      { n: 3, x: '64%', y: '40%', label: 'Status Chip',   desc: 'Color-coded status badge embedded in table cell.' },
      { n: 4, x: '95%', y: '40%', label: 'Row Actions',   desc: 'Edit + Delete icon buttons (32px) shown per row, right-aligned.' },
      { n: 5, x: '50%', y: '40%', label: 'Row',           desc: '56px height, 14px text, border-bottom 1px #BFC6CE. Hover: background #F9FBFF.' },
    ],
    specMeasures: [
      { label: '56px', direction: 'v', from: 0,  to: 25 },
      { label: '56px', direction: 'v', from: 25, to: 50 },
    ],
    specRows: [
      { property: 'Header height',    value: '56px' },
      { property: 'Row height',       value: '56px' },
      { property: 'Cell padding (H)', value: '16px' },
      { property: 'Font size',        value: '14px' },
      { property: 'Header weight',    value: '600' },
      { property: 'Row border',       value: '1px solid #BFC6CE' },
      { property: 'Row hover bg',     value: '#F9FBFF' },
      { property: 'Selected bg',      value: '#E2EEFD' },
      { property: 'Selected accent',  value: 'inset 4px left #1565C0' },
    ],
  },

  /* ── GROUPED HEADER TABLE ── */
  {
    id: 'table-grouped', category: 'Data Display', name: 'Grouped Header Table',
    desc: 'Two-level column header table. Group headers span multiple columns with vertical dividers. Used in the Allocations tab.',
    stageClass: 'full',
    render: () => (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table className={dash.table}>
          <thead>
            <tr style={{ borderBottom: '1px solid #BFC6CE' }}>
              <th style={{ height: 56, padding: '0 16px', width: 48 }} />
              <th style={{ height: 56, padding: '0 16px', fontWeight: 400, fontSize: 14, color: '#6B7786', textAlign: 'left', borderRight: '1px solid #BFC6CE' }}>Code</th>
              <th colSpan={2} style={{ height: 56, padding: '0 16px', fontWeight: 400, fontSize: 14, color: '#6B7786', textAlign: 'left', borderRight: '1px solid #BFC6CE' }}>Account</th>
              <th colSpan={2} style={{ height: 56, padding: '0 16px', fontWeight: 400, fontSize: 14, color: '#6B7786', textAlign: 'left' }}>Budget</th>
            </tr>
            <tr style={{ borderBottom: '2px solid #BFC6CE' }}>
              <th style={{ height: 56, padding: '0 16px' }} />
              <th style={{ height: 56, padding: '0 16px' }}><span className={dash.thInner}>Project Code <MI name="unfold_more" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={{ height: 56, padding: '0 16px', borderLeft: '1px solid #BFC6CE' }}><span className={dash.thInner}>Account No. <MI name="unfold_more" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={{ height: 56, padding: '0 16px' }}><span className={dash.thInner}>Sub Account <MI name="unfold_more" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={{ height: 56, padding: '0 16px', borderLeft: '1px solid #BFC6CE' }}><span className={dash.thInner}>Budget Code <MI name="unfold_more" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={{ height: 56, padding: '0 16px' }}><span className={dash.thInner}>Budget Tier <MI name="unfold_more" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
            </tr>
          </thead>
          <tbody>
            {[
              { code: 'PRJ1001', a: '127537465', sa: '127537465', bc: '127537465', bt: '127537465' },
              { code: 'PRJ1002', a: '984312700', sa: '984312700', bc: '984312700', bt: '984312700' },
            ].map((row, i) => (
              <tr key={i}>
                <td><button className={dash.rowIconBtn}><MI name="edit" style={{ fontSize: 18 }} /></button></td>
                <td>{row.code}</td><td>{row.a}</td><td>{row.sa}</td><td>{row.bc}</td><td>{row.bt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    callouts: [
      { n: 1, x: '35%', y: '13%', label: 'Group Header Row',      desc: '56px height, 14px regular (400 weight), color #6B7786. Spans multiple columns via colspan.' },
      { n: 2, x: '35%', y: '38%', label: 'Sub-column Header Row', desc: '56px height, 14px semibold. Bottom border is 2px solid #BFC6CE (thicker separator).' },
      { n: 3, x: '52%', y: '25%', label: 'Group Divider',         desc: '1px solid #BFC6CE — vertical border-right on group header cells.' },
      { n: 4, x: '52%', y: '38%', label: 'Sub Divider',           desc: '1px solid #BFC6CE — border-left on first sub-column of each group.' },
    ],
    specMeasures: [
      { label: '56px', direction: 'v', from: 0,  to: 25 },
      { label: '56px', direction: 'v', from: 25, to: 50 },
    ],
    specRows: [
      { property: 'Group row height',    value: '56px' },
      { property: 'Sub-col row height',  value: '56px' },
      { property: 'Group font weight',   value: '400' },
      { property: 'Sub-col font weight', value: '600' },
      { property: 'Sub-col border',      value: '2px solid #BFC6CE' },
      { property: 'Vertical divider',    value: '1px solid #BFC6CE' },
      { property: 'Group color',         value: '#6B7786' },
    ],
  },

  /* ── ACTIVITY CARD ── */
  {
    id: 'activity', category: 'Data Display', name: 'Activity Card',
    desc: 'Chronological feed card for notes and history entries. History items have a tag and no edit/delete actions.',
    render: () => (
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ paddingBottom: 20, borderBottom: '1px solid #BFC6CE', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#6B7786' }}>Noefal Ahmed &nbsp;&nbsp; 08/11/2020 12:31 am</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className={dash.rowIconBtn}><MI name="delete" style={{ fontSize: 18 }} /></button>
              <button className={dash.rowIconBtn}><MI name="edit"   style={{ fontSize: 18 }} /></button>
            </div>
          </div>
          {[['Subject','First Note'],['Type','Follow-up'],['Due Date','08/30/2020'],['Status','None']].map(([l,v]) => (
            <div key={l} style={{ display:'flex', gap:4, fontSize:14, marginBottom:6 }}>
              <span style={{ color:'#6B7786', fontWeight:600 }}>{l}:</span>
              <span style={{ color:'#252B31', fontWeight:600 }}>{v}</span>
            </div>
          ))}
          <div style={{ display:'flex', gap:4, fontSize:14 }}>
            <span style={{ color:'#6B7786', fontWeight:600, flexShrink:0 }}>Notes:</span>
            <span style={{ color:'#252B31', lineHeight:1.5 }}>Capitalize on low hanging fruit to identify a ballpark value added activity.</span>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#6B7786' }}>Noefal Ahmed &nbsp;&nbsp; 08/11/2020 12:31 am</span>
            <span style={{ display:'inline-block', padding:'2px 6px', borderRadius:2, border:'1px solid #6B7786', fontSize:11, fontWeight:600, letterSpacing:1, color:'#6B7786', textTransform:'uppercase' }}>History</span>
          </div>
          {[['Subject','Status Change'],['Type','System'],['Status','Resolved']].map(([l,v]) => (
            <div key={l} style={{ display:'flex', gap:4, fontSize:14, marginBottom:6 }}>
              <span style={{ color:'#6B7786', fontWeight:600 }}>{l}:</span>
              <span style={{ color:'#252B31', fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '35%', y: '5%',  label: 'Author / Timestamp', desc: '14px, 600 weight, color #6B7786' },
      { n: 2, x: '92%', y: '5%',  label: 'Row Actions',        desc: 'Delete + Edit icon buttons — only shown on Note entries, not History' },
      { n: 3, x: '10%', y: '17%', label: 'Field Label',        desc: '14px, 600 weight, color #6B7786 (e.g. "Subject:")' },
      { n: 4, x: '30%', y: '17%', label: 'Field Value',        desc: '14px, 600 weight, color #252B31' },
      { n: 5, x: '20%', y: '56%', label: 'History Tag',        desc: 'Outlined chip — 11px, 1px border #6B7786, color #6B7786, uppercase' },
      { n: 6, x: '50%', y: '48%', label: 'Card Divider',       desc: '1px solid #BFC6CE — separates each activity card in the feed' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Card padding',       value: '20px 24px' },
      { property: 'Divider',            value: '1px solid #BFC6CE' },
      { property: 'Header font size',   value: '14px / 600' },
      { property: 'Label color',        value: '#6B7786' },
      { property: 'Value color',        value: '#252B31' },
      { property: 'History tag border', value: '1px solid #6B7786' },
      { property: 'History tag size',   value: '11px / 600' },
      { property: 'Field gap',          value: '4px label → value' },
    ],
  },

  /* ── BAR CHART ── */
  {
    id: 'chart', category: 'Data Display', name: 'Bar Chart',
    desc: 'Dual-axis SVG bar chart comparing two metrics over time. Uses ResizeObserver for true-pixel dimensions — no viewBox scaling.',
    render: () => (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#252B31' }}>Total Cost Vs Services</span>
          <div style={{ display: 'flex', gap: 16 }}>
            {[['#00C8E0','Services'],['#162040','Costs']].map(([color, label]) => (
              <span key={label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
                <span style={{ width:14, height:14, borderRadius:2, background:color, display:'inline-block' }} />{label}
              </span>
            ))}
          </div>
        </div>
        <LibChart />
      </div>
    ),
    callouts: [
      { n: 1, x: '5%',  y: '45%', label: 'Y-Axis Labels',   desc: 'Scale labels, 11px, color #6B7786.' },
      { n: 2, x: '30%', y: '40%', label: 'Service Bar',     desc: 'Color #00C8E0 (cyan). Left bar in each group.' },
      { n: 3, x: '38%', y: '55%', label: 'Cost Bar',        desc: 'Color #162040 (navy). Right bar in each group.' },
      { n: 4, x: '50%', y: '85%', label: 'X-Axis Label',    desc: 'Date label, 11px, color #6B7786.' },
      { n: 5, x: '50%', y: '30%', label: 'Grid Line',       desc: '1px #E0E0E0 — horizontal at 0, 50, 100.' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'SVG approach',       value: 'ResizeObserver — exact pixel width, no viewBox' },
      { property: 'SVG height',         value: '280px' },
      { property: 'Left margin (CL)',   value: '95px' },
      { property: 'Right margin (CR)',  value: '20px' },
      { property: 'Top margin (CT)',    value: '15px' },
      { property: 'Bottom margin (CB)', value: '55px' },
      { property: 'Bar width',          value: '40px' },
      { property: 'Bar gap',            value: '10px' },
      { property: 'Service color',      value: '#00C8E0' },
      { property: 'Cost color',         value: '#162040' },
      { property: 'Grid color',         value: '#E0E0E0' },
      { property: 'Label size',         value: '14px / 600' },
    ],
  },

  /* ── ACCORDION ── */
  {
    id: 'accordion', category: 'Containers', name: 'Accordion Card',
    desc: 'Collapsible section card used in the Overview tab. Chevron rotates 90° when expanded. Max-height transition reveals content.',
    render: () => {
      const [open, setOpen] = React.useState(true)
      return (
        <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.10)' }}>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', cursor: 'pointer', borderBottom: open ? '1px solid #E0E0E0' : 'none' }} onClick={() => setOpen(v => !v)}>
            <span style={{ display: 'inline-flex', color: '#6B7786', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.25s' }}>
              <MI name="chevron_right" style={{ fontSize: 20 }} />
            </span>
            <span style={{ fontSize: 20, fontWeight: 400, color: '#252B31' }}>Summary</span>
          </div>
          {open && (
            <div style={{ padding: '20px 24px', fontSize: 14, color: '#6B7786', lineHeight: 1.6 }}>
              Accordion body content is revealed here when expanded. Click the header to collapse.
            </div>
          )}
        </div>
      )
    },
    callouts: [
      { n: 1, x: '8%',  y: '30%', label: 'Chevron Icon',  desc: '20px chevron_right. Rotates 90° on open via CSS transform. Transition: 0.25s ease.' },
      { n: 2, x: '50%', y: '30%', label: 'Section Title', desc: '20px, 400 weight, color #252B31' },
      { n: 3, x: '50%', y: '70%', label: 'Body Content',  desc: 'Revealed via max-height: 0 → 3000px transition. Inner div handles padding.' },
      { n: 4, x: '50%', y: '50%', label: 'Separator',     desc: '1px solid #E0E0E0 — shown between header and body when open' },
    ],
    specMeasures: [
      { label: '56px', direction: 'v', from: 0, to: 45 },
    ],
    specRows: [
      { property: 'Header height',    value: '56px' },
      { property: 'Header padding',   value: '0 16px' },
      { property: 'Title size',       value: '20px / 400' },
      { property: 'Chevron size',     value: '20px' },
      { property: 'Header gap',       value: '16px' },
      { property: 'Body padding',     value: '20px 24px' },
      { property: 'Open transition',  value: 'max-height 0.3s ease' },
      { property: 'Chevron rotation', value: '90deg (open)' },
    ],
  },

  /* ── SUB-SECTION ROW ── */
  {
    id: 'subsection', category: 'Containers', name: 'Sub-section Row',
    desc: 'A titled section with primary/secondary text content and edit/delete actions. Used inside accordion panels for Provider, Cost Center, Remittance Address.',
    render: () => (
      <div style={{ width: '100%', maxWidth: 480, background: 'white', borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', fontSize: 16, fontWeight: 600, color: '#6B7786', borderBottom: '1px solid #E0E0E0' }}>
          Provider *
          <button className={dash.addBtn}><MI name="add" style={{ fontSize: 20 }} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 24px 20px' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#252B31', marginBottom: 4 }}>ATT</div>
            <div style={{ fontSize: 14, color: '#6B7786' }}>No contact selected.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={dash.rowIconBtn}><MI name="delete" style={{ fontSize: 20 }} /></button>
            <button className={dash.rowIconBtn}><MI name="edit"   style={{ fontSize: 20 }} /></button>
          </div>
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '30%', y: '18%', label: 'Section Title',  desc: '16px, 600 weight, color #6B7786' },
      { n: 2, x: '92%', y: '18%', label: 'Add Button',     desc: '28×28px icon button, color #2574DB. Shown when content is deleted.' },
      { n: 3, x: '30%', y: '58%', label: 'Primary Text',   desc: '14px, 600 weight, color #252B31' },
      { n: 4, x: '30%', y: '77%', label: 'Secondary Text', desc: '14px, 400 weight, color #6B7786' },
      { n: 5, x: '88%', y: '65%', label: 'Row Actions',    desc: 'Delete + Edit icon buttons, 32×32px' },
    ],
    specMeasures: [],
    specRows: [
      { property: 'Title padding',   value: '16px 24px' },
      { property: 'Title size',      value: '16px / 600' },
      { property: 'Content padding', value: '12px 24px 20px' },
      { property: 'Primary size',    value: '14px / 600' },
      { property: 'Secondary size',  value: '14px / 400' },
      { property: 'Title border',    value: '1px solid #E0E0E0' },
    ],
  },

  /* ── ACTIONS BAR ── */
  {
    id: 'actionsbar', category: 'Containers', name: 'Actions Bar',
    desc: '56px horizontal bar with border-bottom. Appears above tables and tab content. Multiple variants depending on context.',
    stageClass: 'full', calloutSide: 'bottom',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', height:56, padding:'0 16px', borderBottom:'1px solid #BFC6CE', boxSizing:'border-box', background:'white' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:14, fontWeight:500, color:'#424242' }}>3 selected</span>
            <div style={{ width:1, height:20, background:'#E0E0E0' }} />
            <button className={`${dash.button} ${dash.buttonText}`}><MI name="delete" style={{ fontSize:18 }} />Delete</button>
          </div>
          <button className={`${dash.button} ${dash.buttonDefault}`}><MI name="add" style={{ fontSize:18 }} />Add Item</button>
        </div>
        <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', height:56, padding:'0 24px', borderBottom:'1px solid #BFC6CE', boxSizing:'border-box', background:'white' }}>
          <div />
          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:'#252B31' }}>
            <div style={{ width:36, height:20, borderRadius:10, background:'#9E9E9E', position:'relative' }}>
              <div style={{ position:'absolute', top:2, left:2, width:16, height:16, borderRadius:'50%', background:'white', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
            </div>
            Show subaccounts
          </div>
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '14%', y: '25%', label: 'Selection Count', desc: '14px, 500 weight — shows number of selected rows' },
      { n: 2, x: '30%', y: '25%', label: 'Bulk Actions',    desc: 'Text buttons (gray) for operations on selected rows' },
      { n: 3, x: '88%', y: '25%', label: 'Primary Action',  desc: 'Primary button — main creation action, right-aligned' },
      { n: 4, x: '20%', y: '25%', label: 'Divider',         desc: '1px solid #E0E0E0 vertical — separates count from actions' },
      { n: 5, x: '78%', y: '75%', label: 'Toggle',          desc: 'Right-aligned toggle — used for show/hide subaccounts' },
    ],
    specMeasures: [
      { label: '56px', direction: 'v', from: 0,  to: 50  },
      { label: '56px', direction: 'v', from: 50, to: 100 },
    ],
    specRows: [
      { property: 'Height',        value: '56px' },
      { property: 'Padding (H)',   value: '16px (table) / 24px (toggle)' },
      { property: 'Border-bottom', value: '1px solid #BFC6CE' },
      { property: 'Background',    value: 'white' },
      { property: 'Divider',       value: '1px solid #E0E0E0 (vertical, 20px)' },
    ],
  },

  /* ── EDIT DIALOG ── */
  {
    id: 'dialog-edit', category: 'Overlays', name: 'Edit Dialog',
    desc: 'Top-positioned modal dialog for editing field values. Appears below the top bar on a semi-transparent scrim.',
    render: () => (
      <div style={{ width: 380, background: 'white', borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#252B31', padding: '24px 24px 0' }}>Edit Provider</div>
        <div style={{ padding: '32px 24px 8px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[{ label: 'Provider', value: 'ATT' }, { label: 'Contact', value: 'No contact selected.' }].map(f => (
            <div key={f.label} className={dash.floatGroup}>
              <label className={dash.floatLabel}>{f.label}</label>
              <input className={dash.inputField} defaultValue={f.value} style={{ maxWidth: 'none', width: '100%' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, padding: 16 }}>
          <button className={`${dash.button} ${dash.buttonTextPrimary}`}>Cancel</button>
          <button className={`${dash.button} ${dash.buttonTextPrimary}`}>Apply</button>
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '50%', y: '9%',  label: 'Dialog Title',         desc: '20px, 600 weight, color #252B31, padding 24px 24px 0' },
      { n: 2, x: '50%', y: '45%', label: 'Form Fields',          desc: 'Floating label inputs, full-width within dialog. Gap: 20px.' },
      { n: 3, x: '78%', y: '90%', label: 'Text Primary Buttons', desc: 'Blue ghost buttons — Cancel and Apply. No border, color #2574DB.' },
      { n: 4, x: '50%', y: '0%',  label: 'Scrim',                desc: 'rgba(0,0,0,0.4) fixed overlay. Click outside to close.' },
    ],
    specMeasures: [
      { label: '380px', direction: 'h', from: 0, to: 100 },
    ],
    specRows: [
      { property: 'Width',           value: '380px' },
      { property: 'Border radius',   value: '4px' },
      { property: 'Box shadow',      value: '0 8px 24px rgba(0,0,0,0.2)' },
      { property: 'Position',        value: 'align-self: flex-start, margin-top: 56px' },
      { property: 'Title padding',   value: '24px 24px 0' },
      { property: 'Body padding',    value: '40px 24px 8px' },
      { property: 'Body field gap',  value: '20px' },
      { property: 'Actions padding', value: '16px' },
      { property: 'Scrim',           value: 'rgba(0,0,0,0.4) fixed inset 0' },
    ],
  },

  /* ── CONFIRM DIALOG ── */
  {
    id: 'dialog-confirm', category: 'Overlays', name: 'Confirm Dialog',
    desc: 'Destructive action confirmation. Same shell as Edit Dialog — top-positioned, blue text buttons, scrim overlay.',
    render: () => (
      <div style={{ width: 380, background: 'white', borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#252B31', padding: '24px 24px 0' }}>Remove item</div>
        <div style={{ padding: '32px 24px 8px' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#6B7786', lineHeight: 1.6 }}>Are you sure you want to remove this item? This action cannot be undone.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, padding: 16 }}>
          <button className={`${dash.button} ${dash.buttonTextPrimary}`}>Cancel</button>
          <button className={`${dash.button} ${dash.buttonTextPrimary}`}>Delete</button>
        </div>
      </div>
    ),
    callouts: [
      { n: 1, x: '50%', y: '9%',  label: 'Dialog Title',    desc: '20px, 600 weight — names the destructive action' },
      { n: 2, x: '50%', y: '50%', label: 'Warning Message', desc: '14px, color #6B7786 — describes the consequence of the action' },
      { n: 3, x: '78%', y: '90%', label: 'Action Buttons',  desc: 'Cancel (dismisses) and Delete (confirms). Both are Text Primary buttons.' },
    ],
    specMeasures: [
      { label: '380px', direction: 'h', from: 0, to: 100 },
    ],
    specRows: [
      { property: 'Width',           value: '380px' },
      { property: 'Title size',      value: '20px / 600' },
      { property: 'Body font size',  value: '14px' },
      { property: 'Body color',      value: '#6B7786' },
      { property: 'Button style',    value: 'Text Primary (#2574DB, no bg)' },
      { property: 'Actions padding', value: '16px' },
    ],
  },
]

/* ════════════════════════════════════════════════
   FOUNDATIONS
════════════════════════════════════════════════ */
type FoundationEntry = { id: string; name: string; render: () => React.ReactNode }

/* ── shared sub-components for foundation pages ── */
const Swatch: React.FC<{ hex: string; name: string; desc: string; light?: boolean }> = ({ hex, name, desc, light }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
    <div style={{ width: 36, height: 36, background: hex, border: light ? '1px solid #E0E0E0' : 'none', flexShrink: 0 }} />
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#252B31', marginBottom: 2 }}>{name}</div>
      <div style={{ fontFamily: "'SF Mono','Fira Code',monospace", fontSize: 11, color: '#2574DB', marginBottom: 2 }}>{hex}</div>
      <div style={{ fontSize: 11, color: '#9E9E9E', lineHeight: 1.4 }}>{desc}</div>
    </div>
  </div>
)

const GRAY_SCALE: [string, string][] = [
  ['0',  '#FFFFFF'], ['05', '#F2F3F4'], ['10', '#E4E7EA'], ['20', '#C8CDD3'],
  ['30', '#ACB3BC'], ['40', '#9099A4'], ['50', '#74808D'], ['55', '#636E7A'],
  ['60', '#535D67'], ['70', '#3C4550'], ['80', '#252B31'], ['90', '#151A1F'],
  ['95', '#0B0D10'], ['100', '#000000'],
]
const BLUE_SCALE: [string, string][] = [
  ['0',  '#FFFFFF'], ['05', '#EEF4FC'], ['10', '#D6E6FA'], ['20', '#ADCDF5'],
  ['30', '#84B4F0'], ['40', '#5B9BEB'], ['50', '#2574DB'], ['55', '#2574DB'],
  ['60', '#1B65C8'], ['70', '#1556B0'], ['80', '#0F4798'], ['90', '#093880'],
  ['95', '#051F4A'], ['100', '#000000'],
]

const ColorScale: React.FC<{ label: string; hex: string; name: string; scale: [string, string][] }> = ({ hex, name, scale }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 160, flexShrink: 0 }}>
      <div style={{ width: 32, height: 32, background: hex, border: hex === '#FFFFFF' ? '1px solid #E0E0E0' : 'none', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 12, color: '#252B31', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 12, color: '#252B31', marginBottom: 2 }}>{hex}</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 4 }}>
      {scale.map(([stop, color]) => (
        <div key={stop} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 40, height: 40, background: color, border: (stop === '0' || stop === '05') ? '1px solid #E0E0E0' : 'none' }} />
          <div style={{ fontSize: 12, color: '#252B31', textAlign: 'center' }}>{stop}</div>
        </div>
      ))}
    </div>
  </div>
)

const SwatchGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: 40 }}>
    <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Open Sans', sans-serif", color: '#252B31', marginBottom: 16 }}>{label}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px 20px' }}>{children}</div>
  </div>
)


const TableHeader: React.FC<{ cols: string[] }> = ({ cols }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, 1fr)`, borderBottom: '2px solid #E0E0E0', padding: '10px 20px', background: '#FAFAFA' }}>
    {cols.map((c, i) => (
      <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#9E9E9E' }}>{c}</span>
    ))}
  </div>
)

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 48 }}>
    <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Open Sans', sans-serif", color: '#252B31', marginBottom: 16 }}>{title}</div>
    {children}
  </div>
)

const FOUNDATIONS: FoundationEntry[] = [

  /* ── COLORS ── */
  {
    id: 'f:colors', name: 'Color Palette',
    render: () => (
      <div style={{ padding: '32px 40px' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Open Sans', sans-serif", color: '#252B31', marginBottom: 16 }}>Primary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ColorScale label="Neutral" hex="#252B31" name="Dark Grey" scale={GRAY_SCALE} />
            <ColorScale label="Primary" hex="#2574DB" name="Bright Blue" scale={BLUE_SCALE} />
          </div>
        </div>

        <SwatchGroup label="Brand">
          <Swatch hex="#2574DB" name="Primary"        desc="Buttons, links, active indicators, focus rings" />
          <Swatch hex="#1a65cb" name="Primary Hover"  desc="Hover state for primary-filled buttons" />
          <Swatch hex="#EEF4FC" name="Primary Tint"   desc="Hover bg for outlined and ghost buttons" light />
          <Swatch hex="#1565C0" name="Primary Dark"   desc="Active nav item accent, checked checkbox" />
        </SwatchGroup>

        <SwatchGroup label="Text">
          <Swatch hex="#252B31" name="Text Primary"   desc="Body text, headings, field values" />
          <Swatch hex="#6B7786" name="Text Secondary" desc="Labels, icons, helper text, meta" />
          <Swatch hex="#424242" name="Text Medium"    desc="Table cells, selection count" />
          <Swatch hex="#212121" name="Text Dark"      desc="Page-level title headings" />
          <Swatch hex="#9E9E9E" name="Text Muted"     desc="Placeholders, char limits, sidebar category labels" />
        </SwatchGroup>

        <SwatchGroup label="Surfaces & Backgrounds">
          <Swatch hex="#FFFFFF" name="White"          desc="Cards, inputs, dialogs, table headers" light />
          <Swatch hex="#FAFAFA" name="Page BG"        desc="Main page/shell background" light />
          <Swatch hex="#F1F3F3" name="Surface"        desc="Tab content area, overview container" light />
          <Swatch hex="#F5F5F5" name="Hover Surface"  desc="Nav item hover, accordion header hover" light />
          <Swatch hex="#E8F0FE" name="Active Nav BG"  desc="Active side nav item background" light />
          <Swatch hex="#F9FBFF" name="Row Hover"      desc="Table row hover state" light />
          <Swatch hex="#E2EEFD" name="Row Selected"   desc="Table row selected state" light />
        </SwatchGroup>

        <SwatchGroup label="Borders & Dividers">
          <Swatch hex="#E0E0E0" name="Border Light"  desc="Card borders, accordion separators, modal dividers" light />
          <Swatch hex="#BFC6CE" name="Border Strong" desc="Tab bar underline, table row borders, strong dividers" light />
        </SwatchGroup>

        <SwatchGroup label="Status">
          <Swatch hex="#003A86" name="Open"          desc="Open account status chip & stat card accent" />
          <Swatch hex="#00ACC1" name="Closed"        desc="Closed account status chip & stat card accent" />
          <Swatch hex="#9E9E9E" name="Deactivated"   desc="Deactivated / inactive chip" />
          <Swatch hex="#D32F2F" name="Flagged"       desc="Flagged / error chip" />
          <Swatch hex="#607D8B" name="Active"        desc="Active service chip; also stat card label color" />
        </SwatchGroup>

        <SwatchGroup label="Data Visualization">
          <Swatch hex="#00C8E0" name="Services (Teal)" desc="Service count bars in dual bar chart" />
          <Swatch hex="#162040" name="Costs (Navy)"    desc="Cost percentage bars in dual bar chart" />
        </SwatchGroup>

        <SwatchGroup label="Stat Card">
          <Swatch hex="#607D8B" name="Stat Label" desc="Category label text (uppercase)" />
          <Swatch hex="#263238" name="Stat Value" desc="Large metric number" />
          <Swatch hex="#90A4AE" name="Stat Sub"   desc="Sub-label below the metric" />
        </SwatchGroup>
      </div>
    ),
  },

  /* ── TYPOGRAPHY ── */
  {
    id: 'f:typography', name: 'Typography',
    render: () => (
      <div style={{ padding: '32px 40px' }}>

        <Section title="Typeface">
          <div style={{ background: 'white', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: '24px 32px' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#252B31', letterSpacing: '-0.5px', marginBottom: 8 }}>Open Sans</div>
            <div style={{ fontSize: 14, color: '#6B7786', marginBottom: 20 }}>Primary typeface — all UI text. System fallback stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif</div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[400, 500, 600, 700].map(w => (
                <div key={w}>
                  <div style={{ fontSize: 22, fontWeight: w, color: '#252B31', marginBottom: 2 }}>Aa</div>
                  <div style={{ fontSize: 11, color: '#9E9E9E' }}>{w}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Type Scale">
          <div style={{ background: 'white', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <TableHeader cols={['Sample', 'Size', 'Weight', 'Letter Spacing', 'Transform', 'Usage']} />
            {[
              { sample: 'Configuration', size: '20px', weight: '600', ls: '0.005em', tt: '—',         use: 'Top bar page title (white)' },
              { sample: 'Summary',        size: '20px', weight: '400', ls: '—',       tt: '—',         use: 'Accordion title, filter bar heading' },
              { sample: 'Provider *',     size: '16px', weight: '600', ls: '—',       tt: '—',         use: 'Sub-section title (e.g. Provider, Cost Center)' },
              { sample: 'Total Cost Vs Services', size: '20px', weight: '600', ls: '—', tt: '—',      use: 'Chart / panel heading' },
              { sample: 'Account Name',   size: '14px', weight: '600', ls: '—',       tt: '—',         use: 'Table headers, field labels, card meta' },
              { sample: 'Subaccount',     size: '14px', weight: '400', ls: '—',       tt: '—',         use: 'Table cells, body text, input values' },
              { sample: 'OVERVIEW',       size: '14px', weight: '500', ls: '1.25px',  tt: 'uppercase', use: 'Tab labels, button text' },
              { sample: 'Account No.',    size: '12px', weight: '400', ls: '—',       tt: '—',         use: 'Floating input label, char limits, meta text' },
              { sample: 'OPEN',           size: '12px', weight: '600', ls: '1.2px',   tt: 'uppercase', use: 'Status chips, history tag' },
              { sample: 'OPEN',           size: '20px', weight: '600', ls: '1.25px',  tt: 'uppercase', use: 'Stat card category label' },
              { sample: '7',              size: '36px', weight: '600', ls: '—',       tt: '—',         use: 'Stat card metric value' },
              { sample: 'accounts',       size: '14px', weight: '400', ls: '—',       tt: '—',         use: 'Stat card sub-label' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 72px 72px 100px 90px 1fr', borderBottom: '1px solid #F0F0F0', padding: '10px 20px', alignItems: 'center' }}>
                <span style={{ fontSize: Number(r.size.replace('px','')), fontWeight: Number(r.weight), letterSpacing: r.ls === '—' ? undefined : r.ls, textTransform: r.tt === '—' ? undefined : r.tt as any, color: '#252B31' }}>{r.sample}</span>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#2574DB' }}>{r.size}</span>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#2574DB' }}>{r.weight}</span>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#6B7786' }}>{r.ls}</span>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#6B7786' }}>{r.tt}</span>
                <span style={{ fontSize: 12, color: '#9E9E9E' }}>{r.use}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>
    ),
  },

  /* ── SPACING ── */
  {
    id: 'f:spacing', name: 'Spacing & Grid',
    render: () => (
      <div style={{ padding: '32px 40px' }}>

        <Section title="Spacing Scale — 8px Base Grid">
          <div style={{ background: 'white', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <TableHeader cols={['Token', 'Value', 'Visual', 'Common Uses']} />
            {[
              { name: '—',   px: 2,  use: 'Border width (active), chip badge radius' },
              { name: '—',   px: 4,  use: 'Chip padding (V), icon-label gap, sort icon gap' },
              { name: 'xs',  px: 8,  use: 'Button icon-label gap, avatar radius' },
              { name: 'sm',  px: 12, use: 'Nav icon gap, activity filter gap, card field row gap' },
              { name: 'md',  px: 16, use: 'Base unit — cell padding (H), tab padding (H), section margins' },
              { name: '—',   px: 20, use: 'Activity card padding (V), dialog body field gap' },
              { name: 'lg',  px: 24, use: 'Page/panel padding, dialog title padding, accordion body padding' },
              { name: '—',   px: 32, use: 'Date row gap, form field group gap' },
              { name: 'xl',  px: 40, use: 'Stage padding, dialog body top padding' },
              { name: '3xl', px: 56, use: 'Component height unit — top bar, tabs, table rows, action bars' },
            ].map((r) => (
              <div key={r.px} style={{ display: 'grid', gridTemplateColumns: '80px 80px 1fr 2fr', borderBottom: '1px solid #F0F0F0', padding: '10px 20px', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#9E9E9E' }}>{r.name}</span>
                <span style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, color: '#2574DB' }}>{r.px}px</span>
                <div style={{ height: 8, width: r.px * 2, background: '#2574DB', borderRadius: 2, opacity: 0.75, maxWidth: '100%' }} />
                <span style={{ fontSize: 12, color: '#9E9E9E' }}>{r.use}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Layout Grid">
          <div style={{ background: 'white', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: 24 }}>
            {/* Visual grid diagram */}
            <div style={{ marginBottom: 24, border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
              {/* Shell */}
              <div style={{ background: '#2574DB', height: 20, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>Top Bar — 100%</span>
              </div>
              <div style={{ display: 'flex', height: 80 }}>
                <div style={{ width: 32, background: '#E8F0FE', borderRight: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 9, color: '#1565C0', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>56px</span>
                </div>
                <div style={{ flex: 1, background: '#F1F3F3', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 180, height: 52, background: 'white', border: '1px dashed #BFC6CE', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, color: '#9E9E9E' }}>max-width: 752px</span>
                  </div>
                  <div style={{ position: 'absolute', left: 0, top: '50%', height: 1, width: 16, background: '#BFC6CE', transform: 'translateY(-50%)' }} />
                  <span style={{ position: 'absolute', left: 0, top: '28%', fontSize: 9, color: '#6B7786' }}>16px</span>
                  <div style={{ position: 'absolute', right: 0, top: '50%', height: 1, width: 24, background: '#BFC6CE', transform: 'translateY(-50%)' }} />
                  <span style={{ position: 'absolute', right: 0, top: '28%', fontSize: 9, color: '#6B7786' }}>24px</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['Max content width', '752px — Overview container, Activity feed'],
                ['Page left margin', '16px — from side nav to content panels'],
                ['Page right margin', '24px — from content panels to viewport edge'],
                ['Panel margin', '24px — between panels, between panel and edge'],
                ['Panel card gutter', '16px — between adjacent cards/sections'],
                ['Base unit', '8px pixel grid — all spacing is a multiple of 4 or 8'],
                ['2-col form grid', 'repeat(2, 1fr) gap 16px — inside dialog/modal forms'],
                ['Shadow offset', '1px (level 1) / 8px (level 2) — vertical offset only'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#252B31' }}>{k}</span>
                  <span style={{ fontSize: 12, color: '#6B7786' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

      </div>
    ),
  },

  /* ── RADIUS & ELEVATION ── */
  {
    id: 'f:radius', name: 'Radius & Elevation',
    render: () => (
      <div style={{ padding: '32px 40px' }}>

        <Section title="Border Radius Scale">
          <div style={{ background: 'white', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: 28, display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {[
              { r: 2,    label: '2px',  use: 'Status chips, checkboxes, page nav buttons, legend swatches' },
              { r: 4,    label: '4px',  use: 'Buttons, inputs, selects, cards, dialogs, icon buttons, avatars, accordion cards' },
              { r: 10,   label: '10px', use: 'Toggle track (pill)' },
              { r: '50%',label: '50%',  use: 'Toggle thumb, circular avatars' },
            ].map(({ r, label, use }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 100 }}>
                <div style={{
                  width: 64, height: 64, background: '#EEF4FC',
                  border: '2px solid #2574DB',
                  borderRadius: typeof r === 'number' ? r : r,
                }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#252B31', fontFamily: 'monospace', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 11, color: '#9E9E9E', maxWidth: 120, lineHeight: 1.4, textAlign: 'center' }}>{use}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Elevation (Box Shadow)">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              {
                level: '0',
                label: 'Flat',
                shadow: 'none',
                use: 'Table rows, tab bar background, inline surfaces. No depth.',
                demo: { background: '#FAFAFA', border: '1px solid #E0E0E0' },
              },
              {
                level: '1',
                label: 'Card',
                shadow: '0 1px 2px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.10)',
                use: 'Accordion cards, filter panels, table panels, chart panels, stat cards.',
                demo: { boxShadow: '0 1px 2px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.10)' },
              },
              {
                level: '2',
                label: 'Dialog',
                shadow: '0 8px 24px rgba(0,0,0,0.2)',
                use: 'Modal dialogs, confirmation dialogs. Floats above scrim.',
                demo: { boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
              },
            ].map(({ level, label, shadow, use, demo }) => (
              <div key={level} style={{ flex: 1, minWidth: 200, background: 'white', border: '1px solid #F0F0F0', borderRadius: 6, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#252B31' }}>Level {level}</span>
                  <span style={{ fontSize: 16, color: '#9E9E9E' }}>{label}</span>
                </div>
                <div style={{ height: 80, background: 'white', borderRadius: 4, ...demo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, color: '#BFC6CE' }}>surface</span>
                </div>
                <div style={{ fontFamily: "'SF Mono','Fira Code',monospace", fontSize: 11, color: '#2574DB', wordBreak: 'break-all', lineHeight: 1.6 }}>{shadow}</div>
                <div style={{ fontSize: 12, color: '#6B7786', lineHeight: 1.5 }}>{use}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Component Heights — 56px Grid">
          <div style={{ background: 'white', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <TableHeader cols={['Height', 'Component']} />
            {[
              ['56px', 'Top bar, Tab bar, Title bar, Table header, Table row, Actions bar, Dialog title bar'],
              ['48px', 'Tab hit area (within 56px bar, offset 8px from top)'],
              ['40px', 'Text inputs, Select fields, Search inputs, Date inputs'],
              ['36px', 'Primary, Outlined, and Text buttons'],
              ['34px', 'User avatar in top bar'],
              ['32px', 'Row action icon buttons (edit, delete)'],
              ['28px', 'Add icon button (+)'],
              ['20px', 'Toggle track'],
              ['18px', 'Checkbox'],
              ['16px', 'Toggle thumb'],
            ].map(([h, c]) => (
              <div key={h} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', borderBottom: '1px solid #F0F0F0', padding: '10px 20px', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 700, color: '#2574DB' }}>{h}</span>
                <span style={{ fontSize: 16, color: '#6B7786' }}>{c}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>
    ),
  },
]

/* ── group by category ── */
const CATEGORIES = Array.from(new Set(REGISTRY.map(c => c.category)))

/* ════════════════════════════════════════════════
   EXPLORATIONS
════════════════════════════════════════════════ */
type ExplorationEntry = { id: string; name: string; render: () => React.ReactNode }

const EXPLORATIONS: ExplorationEntry[] = [
  {
    id: 'x:tablerow',
    name: 'Table Row Explorations',
    render: () => (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', overflowX: 'auto' }}>

          {/* Columns section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 600, color: '#252B31' }}>Columns</div>
            {/* Column cell samples */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
              {[
                { label: 'Compact',            width: 160, height: 40, fontSize: 12, padding: '0 8px',  fontWeight: 400, color: '#252B31', extra: {} },
                { label: 'Regular',            width: 160, height: 56, fontSize: 14, padding: '0 16px', fontWeight: 400, color: '#252B31', extra: {} },
                { label: 'Links',              width: 160, height: 56, fontSize: 14, padding: '0 16px', fontWeight: 400, color: '#2574DB', extra: { textDecoration: 'underline', cursor: 'pointer' } },
                { label: 'Bolded',             width: 160, height: 56, fontSize: 14, padding: '0 16px', fontWeight: 600, color: '#252B31', extra: {} },
                { label: 'Larger Column Width',width: 220, height: 56, fontSize: 14, padding: '0 48px', fontWeight: 400, color: '#252B31', extra: {} },
                { label: 'Larger Row Height',  width: 160, height: 72, fontSize: 16, padding: '0 16px', fontWeight: 400, color: '#252B31', extra: {} },
              ].map(({ label, width, height, fontSize, padding, fontWeight, color, extra }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>{label}</div>
                  <div style={{
                    width, height, display: 'flex', alignItems: 'center', background: 'white',
                    border: '1px solid #E0E0E0',
                    padding, fontSize, fontWeight, color,
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', boxSizing: 'border-box', ...extra,
                  }}>
                    Communications
                  </div>
                  <div style={{
                    width, height, display: 'flex', alignItems: 'center', background: 'white',
                    border: '1px solid #E0E0E0',
                    padding, fontSize, fontWeight, color,
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', boxSizing: 'border-box', ...extra,
                  }}>
                    105488
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 600, color: '#252B31', marginTop: 40 }}>Table Rows</div>

          {(() => {
            const CB = 56, W = 160, WL = 220
            const td = (content: React.ReactNode, colW: number, p: string, extra: React.CSSProperties = {}) => (
              <td style={{ width: colW, maxWidth: colW, minWidth: colW, padding: p, overflow: 'hidden', whiteSpace: 'nowrap' as const, textOverflow: 'ellipsis', boxSizing: 'border-box' as const, ...extra }}>{content}</td>
            )
            const row = (colW: number, height: number, p: string, _fontSize: number, _fw: number, isLinks = false) => (
              <tr style={{ borderBottom: '1px solid #E0E0E0', height }}>
                <td style={{ width: CB, maxWidth: CB, minWidth: CB, padding: p, boxSizing: 'border-box' as const }}><input type="checkbox" className={dash.checkbox} /></td>
                {td('Communications',              colW, p)}
                {td('105488',                      colW, p, isLinks ? { color: '#2574DB', textDecoration: 'underline', cursor: 'pointer' } : {})}
                {td('810044515191',                colW, p, isLinks ? { color: '#2574DB', textDecoration: 'underline', cursor: 'pointer' } : {})}
                {td('Zayo Canada',                 colW, p)}
                {td('810044515191 – All Services', colW, p)}
                {td(<span className={`${dash.chip} ${dash.chipOpen}`}>Open</span>, colW, p)}
                {td('Default',    colW, p)}
                {td('Hierarchy',  colW, p)}
                {td('2021-02-20', colW, p)}
                {td('Electronic', colW, p)}
                {td('CAD',        colW, p)}
              </tr>
            )
            const TABLE: React.CSSProperties = { tableLayout: 'fixed', borderCollapse: 'collapse', color: '#252B31', background: 'white', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }
            const tw = 1496
            const wrap = (label: string, table: React.ReactNode, badge?: React.ReactNode) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: tw, overflow: 'hidden' }}>{table}</div>
                  {badge}
                </div>
              </div>
            )
            return (
              <>
                {wrap('',
                  <table className={dash.table} style={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
                    <tbody>
                      <tr>
                        <td><input type="checkbox" className={dash.checkbox} /></td>
                        <td>Communications</td>
                        <td><span>105488</span></td>
                        <td><span>810044515191</span></td>
                        <td><span>Zayo Canada</span></td>
                        <td>810044515191 – All Services</td>
                        <td><span>Open</span></td>
                        <td>Default</td>
                        <td>Hierarchy</td>
                        <td>2021-02-20</td>
                        <td>Electronic</td>
                        <td>CAD</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {wrap('',
                  <table className={dash.table} style={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
                    <tbody>
                      <tr>
                        <td><input type="checkbox" className={dash.checkbox} /></td>
                        <td>Communications</td>
                        <td><span className={dash.accountLink}>105488</span></td>
                        <td><span className={dash.accountLink}>810044515191</span></td>
                        <td><span style={{ fontWeight: 600 }}>Zayo Canada</span></td>
                        <td>810044515191 – All Services</td>
                        <td><span className={`${dash.chip} ${dash.chipOpen}`}>Open</span></td>
                        <td>Default</td>
                        <td>Hierarchy</td>
                        <td>2021-02-20</td>
                        <td>Electronic</td>
                        <td>CAD</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {wrap('Compact',             <table style={{ ...TABLE, fontSize: 12 }}><tbody>{row(W,  40, '0 8px',  12, 400)}</tbody></table>)}
                {wrap('Regular',             <table style={{ ...TABLE, fontSize: 14 }}><tbody>{row(W,  56, '0 16px', 14, 400)}</tbody></table>)}
                {wrap('Links',               <table style={{ ...TABLE, fontSize: 14 }}><tbody>{row(W,  56, '0 16px', 14, 400, true)}</tbody></table>, <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ color: 'white', fontSize: 16, lineHeight: 1 }}>✓</span></div>)}
                {wrap('Bolded',              <table style={{ ...TABLE, fontSize: 14, fontWeight: 600 }}><tbody>{row(W,  56, '0 16px', 14, 600)}</tbody></table>)}
                {wrap('Larger Column Width', <table style={{ ...TABLE, fontSize: 14 }}><tbody>{row(WL, 56, '0 16px', 14, 400)}</tbody></table>)}
                {wrap('Larger Row Height',   <table style={{ ...TABLE, fontSize: 16 }}><tbody>{row(W,  72, '0 16px', 16, 400)}</tbody></table>)}
              </>
            )
          })()}

          {/* ── Specs ── */}
          <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 600, color: '#252B31', marginTop: 40 }}>Specs</div>

          {(() => {
            const G = 'rgba(134, 239, 172, 0.5)'
            const W = 160, CB = 56, PAD = 16
            const cell = (content: React.ReactNode, w: number | undefined = W, extra: React.CSSProperties = {}) => (
              <td style={{ ...(w !== undefined ? { width: w, maxWidth: w, minWidth: w } : {}), padding: 0, overflow: 'hidden', height: '1px', boxSizing: 'border-box' as const, borderRight: '1px solid #1a7a3a' }}>
                <div style={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>
                  <div style={{ width: PAD, minWidth: PAD, background: G }} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', overflow: 'hidden', ...extra }}>
                    <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block', width: '100%' }}>{content}</span>
                  </div>
                  <div style={{ width: PAD, minWidth: PAD, background: G }} />
                </div>
              </td>
            )
            const row = (colW: number) => (
              <tr style={{ borderBottom: '1px solid #E0E0E0', height: 56 }}>
                {cell(<input type="checkbox" className={dash.checkbox} />, CB)}
                {cell('Communications',              colW)}
                {cell('105488',                      colW)}
                {cell('810044515191',                colW)}
                {cell('Zayo Canada',                 colW)}
                {cell('810044515191 – All Services', colW)}
                {cell(<span className={`${dash.chip} ${dash.chipOpen}`}>Open</span>, colW)}
                {cell('Default',    colW)}
                {cell('Hierarchy',  colW)}
                {cell('2021-02-20', colW)}
                {cell('Electronic', colW)}
                {cell('CAD',        colW)}
              </tr>
            )
            const CLIP = 1496
            const TABLE_S: React.CSSProperties = { tableLayout: 'fixed', borderCollapse: 'collapse', fontSize: 14, color: '#252B31', background: 'white', border: '1px solid #E0E0E0', borderRadius: 4, overflow: 'hidden' }
            return (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>Regular</div>
                  <div style={{ position: 'relative', paddingBottom: 180 }}>
                    <div style={{ width: CLIP, overflow: 'hidden' }}>
                      <table style={TABLE_S}><tbody>{row(W)}</tbody></table>
                    </div>
                    {/* ── Annotations ── */}
                    {(() => {
                      const PURPLE = '#7B4FBB'
                      const chip = (n: string) => (
                        <svg width={22} height={22} style={{ display: 'block' }}>
                          <circle cx={11} cy={11} r={11} fill={PURPLE} />
                          <text x={11} y={15} textAnchor="middle" fontSize={10} fontWeight="700" fill="white" fontFamily="'Open Sans', sans-serif">{n}</text>
                        </svg>
                      )
                      const bar = (left: number, width: number, top: number, n: string) => (
                        <div style={{ position: 'absolute', left, top }}>
                          <div style={{ position: 'relative', width, height: 1, background: PURPLE }}>
                            <div style={{ position: 'absolute', left: 0,  top: -4, width: 1, height: 9, background: PURPLE }} />
                            <div style={{ position: 'absolute', right: 0, top: -4, width: 1, height: 9, background: PURPLE }} />
                          </div>
                          <div style={{ marginTop: 6 }}>{chip(n)}</div>
                        </div>
                      )
                      return (
                        <>
                          {bar(CB,  W,   56 + 8,  '1')}
                          {bar(CB,  PAD, 56 + 48, '2')}
                          <div style={{ position: 'absolute', left: 0, top: 56 + 96, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div><span style={{ color: PURPLE, fontWeight: 700 }}>1.</span> Column Width = 160px</div>
                            <div><span style={{ color: PURPLE, fontWeight: 700 }}>2.</span> Padding = 16px</div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>Larger Column Width</div>
                  <div style={{ position: 'relative', paddingBottom: 180 }}>
                    <div style={{ width: CLIP, overflow: 'hidden' }}>
                      <table style={TABLE_S}><tbody>{row(220)}</tbody></table>
                    </div>
                    {(() => {
                      const PURPLE = '#7B4FBB'
                      const chip = (n: string) => (
                        <svg width={22} height={22} style={{ display: 'block' }}>
                          <circle cx={11} cy={11} r={11} fill={PURPLE} />
                          <text x={11} y={15} textAnchor="middle" fontSize={10} fontWeight="700" fill="white" fontFamily="'Open Sans', sans-serif">{n}</text>
                        </svg>
                      )
                      const bar = (left: number, width: number, top: number, n: string) => (
                        <div style={{ position: 'absolute', left, top }}>
                          <div style={{ position: 'relative', width, height: 1, background: PURPLE }}>
                            <div style={{ position: 'absolute', left: 0,  top: -4, width: 1, height: 9, background: PURPLE }} />
                            <div style={{ position: 'absolute', right: 0, top: -4, width: 1, height: 9, background: PURPLE }} />
                          </div>
                          <div style={{ marginTop: 6 }}>{chip(n)}</div>
                        </div>
                      )
                      return (
                        <>
                          {bar(CB,  220, 56 + 8,  '1')}
                          {bar(CB,  PAD, 56 + 48, '2')}
                          <div style={{ position: 'absolute', left: 0, top: 56 + 96, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div><span style={{ color: PURPLE, fontWeight: 700 }}>1.</span> Column Width = 220px</div>
                            <div><span style={{ color: PURPLE, fontWeight: 700 }}>2.</span> Padding = 16px</div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </>
            )
          })()}

        </div>
      </div>
    ),
  },
  {
    id: 'x:tags',
    name: 'Tags Explorations',
    render: () => {
      return (
        <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 64, maxWidth: 900 }}>

            {/* ── Tags ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 24, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>Tags</div>
              <p style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31', lineHeight: 1.7, margin: 0 }}>
                Tags are read-only. They can be used to show neutral informational and/or statuses. These tags are not clickable. For a similar, but clickable element see Material Design Chips. Each product can decide how to use these tags. For status tags, all 6 colors may be used. Our recommendation is that colored tags be used to display actionable and/or important statuses. An actionable status is a status means the user viewing the tag needs to take an action. These may fall under the category of positive info (i.e. New), negative info (i.e. Error, Recall Requested, Declined), intermediary steps in a larger flow (i.e. Pending), or important information that may not necessarily be actionable (i.e. Sent, Pending Proposal). The neutral grey colors should be used for less important information that is not actionable for the user viewing.
              </p>
              <div style={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: 8, padding: '24px 32px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {[
                  { name: 'Positive',    bg: '#003A86', dark: false },
                  { name: 'Negative',    bg: '#E91E63', dark: false },
                  { name: 'In Progress', bg: '#F59E0B', dark: true  },
                  { name: 'Info',        bg: '#5FCAE7', dark: true  },
                  { name: 'Neutral 1',   bg: '#607D8B', dark: false },
                  { name: 'Neutral 2',   bg: '#BFC6CE', dark: true  },
                ].map(({ name, bg, dark }) => (
                  <span key={name} style={{
                    display: 'inline-block', background: bg, color: dark ? '#252B31' : 'white',
                    fontSize: 12, fontWeight: 600, letterSpacing: '1.2px',
                    textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2,
                  }}>{name}</span>
                ))}
              </div>
              <div style={{ background: 'white', border: '1px solid #E0E0E0', borderRadius: 8, padding: '24px 32px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {[
                  { cls: dash.chipOpen,        name: 'Open',        bg: undefined,   dark: false },
                  { cls: dash.chipClosed,      name: 'Closed',      bg: '#5FCAE7',   dark: true  },
                  { cls: dash.chipFlagged,     name: 'Flagged',     bg: '#E91E63',   dark: false },
                  { cls: dash.chipDeactivated, name: 'Deactivated', bg: '#BFC6CE',   dark: true  },
                  { cls: dash.chipActive,      name: 'Active',      bg: undefined,   dark: false },
                ].map(({ cls, name, bg, dark }) => (
                  <span key={name} className={`${dash.chip} ${cls}`} style={{ color: dark ? '#252B31' : 'white', ...(bg ? { background: bg } : {}) }}>{name}</span>
                ))}
              </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 24, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>Stat Cards</div>
              <p style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31', lineHeight: 1.7, margin: 0 }}>
                When possible stat cards should resize to fit the screen width, within a minimum card size of 160px and a maximum card size of 400px. If not all cards fit on the screen at minimum size, a horizontal scroll should be used. Stat cards should include a label and a number. If they are associated with a status, there should be a vertical bar on the left side of the card. In some modules these cards may be interactive; i.e., when they are used as a quick filter for a data table. If a card is interactive, it should follow the pattern for the following states. If a card is not interactive, the default state should be used. The disabled state should use tooltips to let user know why the element is disabled.
              </p>
              {(() => {
                const CARDS = [
                  { lbl: 'Opened',      cls: dash.statCardOpened,      val: 250, color: '#2574DB', activeBg: '#EEF3FA' },
                  { lbl: 'Flagged',     cls: dash.statCardFlagged,     val: 38,  color: '#E91E63', activeBg: '#FDE8F0' },
                  { lbl: 'Closed',      cls: dash.statCardClosed,      val: 15,  color: '#5FCAE7', activeBg: '#EAF8FC' },
                  { lbl: 'Deactivated', cls: dash.statCardDeactivated, val: 74,  color: '#BFC6CE', activeBg: '#F3F4F5' },
                ]
                const getStates = (color: string, activeBg: string): { label: string; style: React.CSSProperties; ripple?: boolean; rippleColor?: string; tooltip?: boolean; disabled?: boolean }[] => [
                  { label: 'Default',            style: {} },
                  { label: 'Hover',              style: { boxShadow: '0 4px 12px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12)' } },
                  { label: 'Pressed',            style: { boxShadow: `0 0 0 2px ${color}, 0 1px 4px rgba(0,0,0,0.15)` }, ripple: true, rippleColor: color },
                  { label: 'Active',             style: { background: activeBg, boxShadow: `0 0 0 2px ${color}, 0 1px 4px rgba(0,0,0,0.15)` } },
                  { label: 'Active and Focused', style: { background: activeBg, boxShadow: `0 0 0 2px ${color}, 0 1px 4px rgba(0,0,0,0.15)` }, tooltip: true },
                  { label: 'Disabled',           style: {}, disabled: true, tooltip: true },
                ]
                const stateLabel = (txt: string) => (
                  <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31', marginTop: 8 }}>{txt}</div>
                )
                const tooltipEl = (txt: string) => (
                  <div style={{ position: 'absolute', bottom: -8, left: 12, zIndex: 10, background: 'rgba(0, 22, 51, 0.82)', color: 'white', fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, borderRadius: 4, height: 24, display: 'flex', alignItems: 'center', padding: '0 10px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{txt}</div>
                )
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
                    {CARDS.map(({ lbl, cls, val, color, activeBg }) => (
                      <div key={lbl} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>{lbl}</div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
                          {getStates(color, activeBg).map(({ label, style, ripple, rippleColor, tooltip, disabled }) => (
                            <div key={label} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <div style={{ position: 'relative' }}>
                                <div className={`${dash.statCard} ${cls}`} style={{ width: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, borderLeftColor: color, ...style }}>
                                  <div className={dash.statCardLabel}>{lbl}</div>
                                  <div className={dash.statCardSub}>Last three months</div>
                                  <div className={dash.statCardValue}>{disabled ? '0' : val}</div>
                                  {ripple && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200, borderRadius: '50%', background: `${rippleColor}33`, pointerEvents: 'none' }} />}
                                </div>
                                {tooltip && tooltipEl(`No ${lbl.toLowerCase()} accounts.`)}
                              </div>
                              {stateLabel(label)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* ── Explorations ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginLeft: -120, marginRight: -120, width: '170%' }}>
              <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 600, color: '#252B31', paddingLeft: 120 }}>Explorations</div>

              {/* ── Rectangular ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 120, boxSizing: 'border-box' }}>
                <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Stats</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))', gap: '32px 32px', alignItems: 'start' }}>
                  {/* 1 — label-sub top, number bottom-right */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>1</div>
                    <div className={`${dash.statCard} ${dash.statCardOpened}`} style={{ width: '100%', minWidth: 'unset', boxSizing: 'border-box', borderLeft: 'none' }}>
                      <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#252B31', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div>
                      <div className={dash.statCardSub}>Time Period</div>
                      <div className={dash.statCardValue} style={{ textAlign: 'right', marginTop: 8 }}>24</div>
                    </div>
                  </div>
                  {/* 3 — label leading, left border */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>3</div>
                    <div className={`${dash.statCard} ${dash.statCardOpened}`} style={{ width: '100%', minWidth: 'unset', boxSizing: 'border-box' }}>
                      <div className={dash.statCardLabel}>Status</div>
                      <div className={dash.statCardSub}>Time Period</div>
                      <div className={dash.statCardValue}>24</div>
                    </div>
                  </div>
                  {/* 4 — number leading, open tag */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>4</div>
                    <div className={`${dash.statCard} ${dash.statCardOpened}`} style={{ width: '100%', minWidth: 'unset', boxSizing: 'border-box', borderLeft: 'none', border: 'none' }}>
                      <div className={dash.statCardValue}>24</div>
                      <div style={{ textAlign: 'right', marginBottom: 6 }}><span className={`${dash.chip} ${dash.chipOpen}`}>Open</span></div>
                      <div className={dash.statCardSub} style={{ textAlign: 'right' }}>Time Period</div>
                    </div>
                  </div>
                  {/* 5 — icon + number */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>5</div>
                    <div className={`${dash.statCard} ${dash.statCardOpened}`} style={{ width: '100%', minWidth: 'unset', boxSizing: 'border-box', borderLeft: 'none', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MI name="bar_chart" style={{ fontSize: 28, color: '#2574DB' }} />
                        <div className={dash.statCardValue}>24</div>
                      </div>
                      <div className={dash.statCardLabel} style={{ textAlign: 'right' }}>Status</div>
                      <div className={dash.statCardSub} style={{ textAlign: 'right' }}>Time Period</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 1 — stat cards in dashboard */}
              <div style={{ marginLeft: 120, width: 'calc(100% - 120px)', height: 288, border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden' }}>
                <TopBar />
                <div style={{ display: 'flex' }}>
                  <SideNav settingsActive={true} onSettingsClick={() => {}} onTuneClick={() => {}} onAssignmentClick={() => {}} onInsertChartClick={() => {}} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={dash.titleBar}>
                      <h1 className={dash.titleBarHeading}>Accounts</h1>
                      <button className={`${dash.button} ${dash.buttonDefault}`}>New Account</button>
                    </div>
                    <div style={{ height: 160, overflow: 'hidden', padding: 16, boxSizing: 'border-box' }}>
                      <div className={dash.statCards}>
                        {([
                          { label: 'Opened',      cls: dash.statCardOpened,      value: 250 },
                          { label: 'Flagged',     cls: dash.statCardFlagged,     value: 38  },
                          { label: 'Closed',      cls: dash.statCardClosed,      value: 15  },
                          { label: 'Deactivated', cls: dash.statCardDeactivated, value: 74  },
                        ] as const).map(({ label, cls, value }) => (
                          <div key={label} className={`${dash.statCard} ${cls}`}>
                            <div className={dash.statCardLabel}>{label}</div>
                            <div className={dash.statCardSub}>Last three months</div>
                            <div className={dash.statCardValue}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Chips ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 120, boxSizing: 'border-box', marginTop: 48 }}>
                <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Chips</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))', gap: '32px 32px', alignItems: 'start' }}>
                  {/* Chip 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>1</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 6, height: 32, borderRadius: 16, background: '#E8EAED', fontFamily: "'Open Sans', sans-serif", cursor: 'pointer' }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#252B31' }}>Opened</span>
                      <span className="material-icons" style={{ fontSize: 20, color: '#546E7A', marginLeft: 2, lineHeight: 1 }}>cancel</span>
                    </div>
                  </div>
                  {/* Chip 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>2</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 6, height: 32, borderRadius: 16, background: '#E8EAED', fontFamily: "'Open Sans', sans-serif", cursor: 'pointer' }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#252B31' }}>Closed: 15</span>
                      <span className="material-icons" style={{ fontSize: 20, color: '#546E7A', marginLeft: 2, lineHeight: 1 }}>cancel</span>
                    </div>
                  </div>
                  {/* Chip 3 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>3</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 8, height: 32, borderRadius: 16, background: '#E8EAED', fontFamily: "'Open Sans', sans-serif", cursor: 'pointer' }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#252B31' }}>Flagged</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 9, background: '#2574DB', fontSize: 10, fontWeight: 700, color: 'white', paddingLeft: 4, paddingRight: 4 }}>24</span>
                    </div>
                  </div>
                  {/* Chip 4 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>4</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 6, height: 32, borderRadius: 16, background: '#2574DB', fontFamily: "'Open Sans', sans-serif", cursor: 'pointer' }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>Opened</span>
                      <span className="material-icons" style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', marginLeft: 2, lineHeight: 1 }}>cancel</span>
                    </div>
                  </div>
                  {/* Chip 5 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>5</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, paddingLeft: 8, paddingRight: 6, height: 32, borderRadius: 16, background: '#E8EAED', fontFamily: "'Open Sans', sans-serif", cursor: 'pointer' }}>
                      <MI name="check" style={{ fontSize: 14, color: '#2574DB' }} />
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#252B31' }}>Flagged: 38</span>
                      <span className="material-icons" style={{ fontSize: 20, color: '#546E7A', marginLeft: 2, lineHeight: 1 }}>cancel</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2 — chips in dashboard */}
              <div style={{ marginLeft: 120, width: 'calc(100% - 120px)', height: 288, border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden' }}>
                <TopBar />
                <div style={{ display: 'flex' }}>
                  <SideNav settingsActive={true} onSettingsClick={() => {}} onTuneClick={() => {}} onAssignmentClick={() => {}} onInsertChartClick={() => {}} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={dash.titleBar}>
                      <h1 className={dash.titleBarHeading}>Accounts</h1>
                      <button className={`${dash.button} ${dash.buttonDefault}`}>New Account</button>
                    </div>
                    <div style={{ height: 160, overflow: 'hidden', padding: 16, boxSizing: 'border-box' }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {([
                          { label: 'Opened',      count: 250 },
                          { label: 'Flagged',     count: 38  },
                          { label: 'Closed',      count: 15  },
                          { label: 'Deactivated', count: 74  },
                        ] as const).map(({ label, count }) => (
                          <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 6, height: 32, borderRadius: 16, background: '#E8EAED', fontFamily: "'Open Sans', sans-serif", cursor: 'pointer' }}>
                            <span style={{ fontSize: 16, fontWeight: 600, color: '#252B31' }}>{label}: {count}</span>
                            <span className="material-icons" style={{ fontSize: 20, color: '#546E7A', marginLeft: 2, lineHeight: 1 }}>cancel</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Dropdown ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 120, boxSizing: 'border-box', marginTop: 48 }}>
                <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Dropdown</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(200px, 1fr))', gap: '32px 32px', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 14, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#252B31' }}>1</div>
                    <div className={dash.floatGroup} style={{ marginTop: 0 }}>
                      <label className={dash.floatLabel}>Status</label>
                      <div className={dash.selectWrapper} style={{ width: '100%', maxWidth: 'none' }}>
                        <select className={dash.selectField} style={{ width: '100%', maxWidth: 'none' }} defaultValue="Opened">
                          <option>Opened</option>
                          <option>Flagged</option>
                          <option>Closed</option>
                          <option>Deactivated</option>
                        </select>
                        <span className={`${dash.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3 — dropdowns in dashboard */}
              <div style={{ marginLeft: 120, width: 'calc(100% - 120px)', height: 288, border: '1px solid var(--color-quaternary)', borderRadius: 8, overflow: 'hidden' }}>
                <TopBar />
                <div style={{ display: 'flex' }}>
                  <SideNav settingsActive={true} onSettingsClick={() => {}} onTuneClick={() => {}} onAssignmentClick={() => {}} onInsertChartClick={() => {}} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={dash.titleBar}>
                      <h1 className={dash.titleBarHeading}>Accounts</h1>
                      <button className={`${dash.button} ${dash.buttonDefault}`}>New Account</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', height: 56, background: 'white', borderBottom: '1px solid var(--color-quaternary)' }}>
                      <div className={dash.floatGroup} style={{ marginTop: 0 }}>
                        <label className={dash.floatLabel}>Status</label>
                        <div className={dash.selectWrapper} style={{ width: 180, maxWidth: 'none' }}>
                          <select className={dash.selectField} style={{ width: 180, maxWidth: 'none' }} defaultValue="Opened">
                            <option>Opened</option>
                            <option>Flagged</option>
                            <option>Closed</option>
                            <option>Deactivated</option>
                          </select>
                          <span className={`${dash.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
                        </div>
                      </div>
                      <div className={dash.floatGroup} style={{ marginTop: 0 }}>
                        <label className={dash.floatLabel}>Range</label>
                        <div className={dash.selectWrapper} style={{ width: 180, maxWidth: 'none' }}>
                          <select className={dash.selectField} style={{ width: 180, maxWidth: 'none' }} defaultValue="Last 3 months">
                            <option>Last 3 months</option>
                            <option>Last 6 months</option>
                            <option>Last year</option>
                          </select>
                          <span className={`${dash.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 160, overflow: 'hidden' }} />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )
    },
  },
  {
    id: 'x:charts',
    name: 'Charts Exploration',
    render: () => (
      <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* ── Costs Tab Chart ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Costs Tab</div>
            <div style={{ background: 'white', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'flex-end' }}>
                {[['#00C8E0', 'Services'], ['#162040', 'Costs']].map(([color, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color }} />
                    {label}
                  </span>
                ))}
              </div>
              <CostsChart showSub={false} />
            </div>
          </div>

          {/* ── Variant 1: Stacked ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Variant 1 — Stacked</div>
            <div style={{ background: 'white', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'flex-end' }}>
                {[['#00C8E0', 'Services'], ['#162040', 'Costs']].map(([color, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color }} />
                    {label}
                  </span>
                ))}
              </div>
              <StackedChart data={COSTS_CHART_DATA} />
            </div>
          </div>

          {/* ── Variant 2: Line ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Variant 2 — Line</div>
            <div style={{ background: 'white', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'flex-end' }}>
                {[['#00C8E0', 'Services'], ['#162040', 'Costs']].map(([color, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color }} />
                    {label}
                  </span>
                ))}
              </div>
              <LineChart data={COSTS_CHART_DATA} />
            </div>
          </div>

          {/* ── Variant 3: Combo ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Variant 3 — Combo</div>
            <div style={{ background: 'white', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'flex-end' }}>
                {([['#162040', false, 'Costs'], ['#00C8E0', true, 'Services']] as const).map(([color, _isLine, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color }} />
                    {label}
                  </span>
                ))}
              </div>
              <ComboChart data={COSTS_CHART_DATA} />
            </div>
          </div>

          {/* ── Variant 4: Gap ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 400, color: '#6B7786' }}>Variant 4 — Gap</div>
            <div style={{ background: 'white', borderRadius: 4, padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'flex-end' }}>
                {[['#00C8E0', 'Services'], ['#162040', 'Costs']].map(([color, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31' }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color }} />
                    {label}
                  </span>
                ))}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: "'Open Sans', sans-serif", color: '#252B31' }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'rgba(234,88,60,0.4)' }} />
                  Gap
                </span>
              </div>
              <GapChart data={COSTS_CHART_DATA} />
            </div>
          </div>

        </div>
      </div>
    ),
  },
]

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
const CimplLibrary: React.FC = () => {
  const [activeId,  setActiveId]  = React.useState(REGISTRY[0].id)
  const [activeTab, setActiveTab] = React.useState<'anatomy' | 'specs'>('anatomy')

  const foundation  = FOUNDATIONS.find(f => f.id === activeId)
  const exploration = EXPLORATIONS.find(e => e.id === activeId)
  const comp = (foundation || exploration) ? null : REGISTRY.find(c => c.id === activeId)!

  return (
    <div className={s.page}>

      {/* ── Top Bar ── */}
      <div className={s.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <MI name="menu" style={{ color: 'white' }} />
          <span className={s.brand}>Cimpl</span>
          <span className={s.brandDivider} />
          <span className={s.topBarTitle}>Component Library</span>
        </div>
        <Link to="/upland" className={s.backLink}>
          <MI name="arrow_back" style={{ fontSize: 18, color: 'white' }} />
          Back to Dashboard
        </Link>
      </div>

      <div className={s.body}>

        {/* ── Sidebar ── */}
        <aside className={s.sidebar}>
          {/* Foundations */}
          <div>
            <div className={s.sidebarCategory}>Foundations</div>
            {FOUNDATIONS.map(f => (
              <button
                key={f.id}
                className={`${s.sidebarItem} ${activeId === f.id ? s.sidebarItemActive : ''}`}
                onClick={() => setActiveId(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>
          {/* Explorations */}
          <div>
            <div className={s.sidebarCategory}>Explorations</div>
            {EXPLORATIONS.map(e => (
              <button
                key={e.id}
                className={`${s.sidebarItem} ${activeId === e.id ? s.sidebarItemActive : ''}`}
                onClick={() => setActiveId(e.id)}
              >
                {e.name}
              </button>
            ))}
          </div>
          {/* Components */}
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <div className={s.sidebarCategory}>{cat}</div>
              {REGISTRY.filter(c => c.category === cat).map(c => (
                <button
                  key={c.id}
                  className={`${s.sidebarItem} ${activeId === c.id ? s.sidebarItemActive : ''}`}
                  onClick={() => { setActiveId(c.id); setActiveTab('anatomy') }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* ── Main ── */}
        <main className={s.main}>

          {foundation ? (
            /* ── Foundation page ── */
            <>
              <div className={s.compHeader}>
                <h1 className={s.compName}>{foundation.name}</h1>
                <p className={s.compDesc} style={{ marginBottom: 0 }} />
                <div className={s.viewTabs} />
              </div>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                {foundation.render()}
              </div>
            </>
          ) : exploration ? (
            /* ── Exploration page ── */
            <>
              <div className={s.compHeader}>
                <h1 className={s.compName}>{exploration.name}</h1>
                <p className={s.compDesc} style={{ marginBottom: 0 }} />
                <div className={s.viewTabs} />
              </div>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {exploration.render()}
              </div>
            </>
          ) : comp && (
            /* ── Component page ── */
            <>
              <div className={s.compHeader}>
                <h1 className={s.compName}>{comp.name}</h1>
                <p className={s.compDesc}>{comp.desc}</p>
                <div className={s.viewTabs}>
                  {(['anatomy', 'specs'] as const).map(tab => (
                    <button
                      key={tab}
                      className={`${s.viewTab} ${activeTab === tab ? s.viewTabActive : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.compContent}>

                {activeTab === 'anatomy' && (
                  <>
                    <div className={s.stageWrap}>
                      <div className={s.stageLabel}>Anatomy</div>
                      <div className={`${s.stage} ${comp.stageClass === 'full' ? s.stageFull : ''}`}
                        style={{ overflow: 'visible' }}>
                        <AnatomyView comp={comp} />
                      </div>
                    </div>

                    {comp.callouts.length > 0 && (
                      <div className={s.stageWrap}>
                        <div className={s.stageLabel}>Legend</div>
                        <div className={s.anatomyLegend}>
                          {comp.callouts.map(c => (
                            <div key={c.n} className={s.legendRow}>
                              <div className={s.legendNum}>{c.n}</div>
                              <div>
                                <div className={s.legendLabel}>{c.label}</div>
                                <div className={s.legendDesc}>{c.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'specs' && (
                  <>
                    <div className={s.stageWrap}>
                      <div className={s.stageLabel}>Measurements</div>
                      <div className={`${s.stage} ${comp.stageClass === 'full' ? s.stageFull : ''}`}
                        style={{ overflow: 'visible' }}>
                        <SpecsView comp={comp} />
                      </div>
                    </div>

                    <div className={s.stageWrap}>
                      <div className={s.stageLabel}>Specifications</div>
                      <div style={{ padding: 24 }}>
                        <div className={s.specsTable}>
                          {comp.specRows.map(r => (
                            <div key={r.property} className={s.specsTableRow}>
                              <div className={s.specsTableKey}>{r.property}</div>
                              <div className={s.specsTableVal}>{r.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </>
          )}

        </main>
      </div>
    </div>
  )
}

export default CimplLibrary
