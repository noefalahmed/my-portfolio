"use client"

import React, { useRef, useState, useEffect } from 'react'
import styles from './RewardsExperiments.module.css'

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Updated from screenshot — remaining [?] still need confirmation
const C = {
  bg:           '#FFFFFF',
  primary:      '#D63B3B',       // confirmed warm red
  primaryLight: '#FDEAEA',
  text:         '#1a0f0f',       // confirmed from Figma
  textSec:      '#4a4a68',       // confirmed from Figma
  textTer:      '#ABABAB',
  border:       '#ebebeb',       // confirmed from Figma
  inputBg:      '#eef0f4',       // confirmed from Figma
  star:         '#4B5FD6',       // confirmed blue/indigo
  shadow:       '0 2px 10px rgba(0,0,0,0.07)',
  headerBg:     '#fafafa',       // confirmed from Figma
}

// ─── Primitives ───────────────────────────────────────────────────────────────

const Phone: React.FC<{ children: React.ReactNode; scrollable?: boolean }> = ({ children, scrollable }) => (
  <div style={{
    width: 390,
    height: 844,
    background: C.bg,
    borderRadius: 0,
    overflow: scrollable ? 'auto' : 'hidden',
    boxShadow: 'none',
    fontFamily: 'Inter, sans-serif',
    position: 'relative',
    flexShrink: 0,
  }}>
    {children}
  </div>
)

const StarRow: React.FC<{ rating: number; size?: number }> = ({ rating, size = 11 }) => (
  <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 12 12">
        <path
          d="M6 1l1.24 2.52L10 3.99 7.82 6.1l.52 3.04L6 7.75 3.66 9.14l.52-3.04L2 3.99l2.76-.47L6 1z"
          fill={i <= Math.round(rating) ? C.star : '#E5E5E5'}
        />
      </svg>
    ))}
  </div>
)

const TabNav: React.FC<{ tabs: string[]; active: number }> = ({ tabs, active }) => (
  <div style={{ borderBottom: `1px solid ${C.border}` }}>
    <div style={{ display: 'flex', paddingLeft: 16, height: 54 }}>
      {tabs.map((tab, i) => (
        <div key={tab} style={{
          paddingRight: 28,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          borderBottom: i === active ? `2px solid ${C.primary}` : '2px solid transparent',
          marginBottom: -1,
          color: i === active ? C.primary : C.textSec,
          fontSize: 15,
          fontWeight: i === active ? 600 : 400,
          cursor: 'pointer',
        }}>
          {tab}
        </div>
      ))}
    </div>
  </div>
)

const BackBtn = () => (
  <div style={{ width: 40, height: 40, borderRadius: 20, background: C.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

const SearchBar: React.FC<{ placeholder?: string; variant?: 'filled' | 'outline' }> = ({ placeholder = 'Search for restaurants or food', variant = 'filled' }) => (
  <div style={{
    display: 'flex', alignItems: 'center',
    background: variant === 'filled' ? C.inputBg : C.bg,
    border: variant === 'outline' ? `1.5px solid ${C.border}` : 'none',
    borderRadius: 8, height: 48, paddingLeft: 12, gap: 8,
    width: '100%', boxSizing: 'border-box',
    boxShadow: variant === 'outline' ? C.shadow : 'none',
  }}>
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx={11} cy={11} r={7} stroke={C.textSec} strokeWidth={2} />
      <line x1={16.5} y1={16.5} x2={21} y2={21} stroke={C.textSec} strokeWidth={2} strokeLinecap="round" />
    </svg>
    <span style={{ color: C.textTer, fontSize: 15 }}>{placeholder}</span>
  </div>
)

const BottomNav: React.FC<{ active?: number }> = ({ active = 0 }) => {
  const ACTIVE_COLOR = '#FF4E4E'
  const items = [
    {
      label: 'Offers',
      activeIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M11.4437 2.37244C11.7803 2.14707 12.2197 2.14707 12.5563 2.37244L14.1929 3.46808C14.3628 3.58183 14.5635 3.64076 14.7679 3.63693L16.7371 3.60001C17.1421 3.59242 17.5117 3.82995 17.6731 4.20155L18.4575 6.00805C18.5389 6.19561 18.6759 6.35369 18.85 6.461L20.5264 7.49453C20.8713 7.70712 21.0538 8.10677 20.9886 8.50661L20.6719 10.4504C20.639 10.6522 20.6687 10.8593 20.7572 11.0437L21.6087 12.8195C21.7839 13.1848 21.7214 13.6197 21.4504 13.9208L20.133 15.3848C19.9962 15.5368 19.9093 15.727 19.884 15.93L19.6403 17.8843C19.5902 18.2863 19.3025 18.6183 18.9117 18.7251L17.012 19.2445C16.8147 19.2984 16.6388 19.4115 16.5078 19.5685L15.2462 21.0808C14.9867 21.3919 14.5651 21.5157 14.1786 21.3943L12.2997 20.8041C12.1046 20.7429 11.8954 20.7429 11.7003 20.8041L9.82138 21.3943C9.43489 21.5157 9.01333 21.3919 8.75382 21.0808L7.49223 19.5685C7.36124 19.4115 7.18527 19.2984 6.98803 19.2445L5.08828 18.7251C4.69751 18.6183 4.40979 18.2863 4.35967 17.8843L4.11597 15.93C4.09067 15.727 4.00378 15.5368 3.867 15.3848L2.54961 13.9208C2.27862 13.6197 2.21609 13.1848 2.39126 12.8195L3.24284 11.0437C3.33125 10.8593 3.36102 10.6522 3.32813 10.4504L3.01136 8.50661C2.9462 8.10677 3.12871 7.70712 3.47356 7.49452L5.15004 6.461C5.3241 6.35369 5.46108 6.19561 5.54253 6.00805L6.32695 4.20155C6.4883 3.82995 6.85791 3.59242 7.26295 3.60001L9.23206 3.63693C9.4365 3.64076 9.63721 3.58183 9.80712 3.46808L11.4437 2.37244Z" fill="#FF4E4E" stroke="#FF4E4E" strokeWidth="2"/>
          <circle cx="9.12695" cy="9.12701" r="1" transform="rotate(45 9.12695 9.12701)" fill="white" stroke="white" strokeWidth="0.222222"/>
          <circle cx="14.6826" cy="14.6827" r="1" transform="rotate(45 14.6826 14.6827)" fill="white" stroke="white" strokeWidth="0.222222"/>
          <path d="M14.8569 9.2002L9.20008 14.857" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      inactiveIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M11.4437 2.37244C11.7803 2.14707 12.2197 2.14707 12.5563 2.37244L14.1929 3.46808C14.3628 3.58183 14.5635 3.64076 14.7679 3.63693L16.7371 3.60001C17.1421 3.59242 17.5117 3.82995 17.6731 4.20155L18.4575 6.00805C18.5389 6.19561 18.6759 6.35369 18.85 6.461L20.5264 7.49453C20.8713 7.70712 21.0538 8.10677 20.9886 8.50661L20.6719 10.4504C20.639 10.6522 20.6687 10.8593 20.7572 11.0437L21.6087 12.8195C21.7839 13.1848 21.7214 13.6197 21.4504 13.9208L20.133 15.3848C19.9962 15.5368 19.9093 15.727 19.884 15.93L19.6403 17.8843C19.5902 18.2863 19.3025 18.6183 18.9117 18.7251L17.012 19.2445C16.8147 19.2984 16.6388 19.4115 16.5078 19.5685L15.2462 21.0808C14.9867 21.3919 14.5651 21.5157 14.1786 21.3943L12.2997 20.8041C12.1046 20.7429 11.8954 20.7429 11.7003 20.8041L9.82138 21.3943C9.43489 21.5157 9.01333 21.3919 8.75382 21.0808L7.49223 19.5685C7.36124 19.4115 7.18527 19.2984 6.98803 19.2445L5.08828 18.7251C4.69751 18.6183 4.40979 18.2863 4.35967 17.8843L4.11597 15.93C4.09067 15.727 4.00378 15.5368 3.867 15.3848L2.54961 13.9208C2.27862 13.6197 2.21609 13.1848 2.39126 12.8195L3.24284 11.0437C3.33125 10.8593 3.36102 10.6522 3.32813 10.4504L3.01136 8.50661C2.9462 8.10677 3.12871 7.70712 3.47356 7.49453L5.15004 6.461C5.3241 6.35369 5.46108 6.19561 5.54253 6.00805L6.32695 4.20155C6.4883 3.82995 6.85791 3.59242 7.26295 3.60001L9.23206 3.63693C9.4365 3.64076 9.63721 3.58183 9.80712 3.46808L11.4437 2.37244Z" stroke="#4A4A68" strokeWidth="2"/>
          <circle cx="9.12695" cy="9.12701" r="1.11111" transform="rotate(45 9.12695 9.12701)" fill="#4A4A68"/>
          <circle cx="14.6826" cy="14.6827" r="1.11111" transform="rotate(45 14.6826 14.6827)" fill="#4A4A68"/>
          <path d="M14.8569 9.2002L9.20008 14.857" stroke="#4A4A68" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Popular',
      activeIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M14.2948 2.8947C14.3366 2.7853 14.2823 2.66037 14.1694 2.62917C13.8556 2.54244 13.525 2.49609 13.1836 2.49609C11.1445 2.49609 9.49147 4.14911 9.49147 6.18821C9.49147 7.26057 9.94864 8.22615 10.6787 8.90068C10.7231 8.94169 10.7489 8.99979 10.7437 9.05999C10.6769 9.83316 10.1861 10.5409 9.416 10.8474C8.32912 11.2799 7.09739 10.7495 6.66487 9.66259C6.52783 9.31824 5.93761 9.07321 5.73261 9.38196C4.53413 11.187 4.21143 13.5307 5.07322 15.6963C6.4692 19.2042 10.4446 20.9162 13.9525 19.5203C17.4604 18.1243 19.1724 14.1489 17.7765 10.641C17.4531 9.82851 16.9914 9.11236 16.4292 8.50886C16.4141 8.49267 16.3963 8.47923 16.3768 8.46877C14.9621 7.71035 14 6.2176 14 4.50012C14 3.93455 14.1043 3.39334 14.2948 2.8947Z" fill="#FF4E4E"/>
          <path d="M9.416 10.8474L9.04625 9.91827V9.91827L9.416 10.8474ZM6.66487 9.66259L5.73573 10.0323V10.0323L6.66487 9.66259ZM5.73261 9.38196L6.5657 9.9351V9.9351L5.73261 9.38196ZM5.07322 15.6963L4.14409 16.066L5.07322 15.6963ZM13.9525 19.5203L14.3222 20.4494V20.4494L13.9525 19.5203ZM17.7765 10.641L18.7056 10.2713V10.2713L17.7765 10.641ZM10.6787 8.90068L10.0001 9.63517L10.6787 8.90068ZM10.7437 9.05999L9.74737 8.97398L10.7437 9.05999ZM16.4292 8.50886L17.1609 7.82722L16.4292 8.50886ZM16.3768 8.46877L16.8493 7.58743L16.3768 8.46877ZM14.1694 2.62917L14.4358 1.66531L14.1694 2.62917ZM14.2948 2.8947L13.3606 2.53786L14.2948 2.8947ZM14.4358 1.66531C14.036 1.55482 13.6159 1.49609 13.1836 1.49609V3.49609C13.4341 3.49609 13.6751 3.53005 13.903 3.59303L14.4358 1.66531ZM13.1836 1.49609C10.5922 1.49609 8.49147 3.59683 8.49147 6.18821H10.4915C10.4915 4.7014 11.6968 3.49609 13.1836 3.49609V1.49609ZM8.49147 6.18821C8.49147 7.551 9.07374 8.77929 10.0001 9.63517L11.3573 8.16618C10.8235 7.673 10.4915 6.97014 10.4915 6.18821H8.49147ZM9.74737 8.97398C9.7119 9.38484 9.45143 9.75702 9.04625 9.91827L9.78575 11.7765C10.9209 11.3248 11.6419 10.2815 11.74 9.146L9.74737 8.97398ZM9.04625 9.91827C8.47251 10.1466 7.82232 9.86657 7.594 9.29284L5.73573 10.0323C6.37247 11.6324 8.18572 12.4133 9.78575 11.7765L9.04625 9.91827ZM7.594 9.29284C7.39008 8.78041 6.93594 8.46517 6.55058 8.33212C6.19705 8.21006 5.3823 8.10171 4.89952 8.82882L6.5657 9.9351C6.4442 10.1181 6.2617 10.2071 6.11746 10.2322C5.99482 10.2536 5.91678 10.2291 5.89787 10.2226C5.87351 10.2142 5.85689 10.2042 5.84011 10.1899C5.82615 10.178 5.77512 10.1313 5.73573 10.0323L7.594 9.29284ZM4.89952 8.82882C3.52738 10.8954 3.15591 13.5829 4.14409 16.066L6.00236 15.3265C5.26695 13.4786 5.54089 11.4786 6.5657 9.9351L4.89952 8.82882ZM4.14409 16.066C5.74428 20.0871 10.3012 22.0496 14.3222 20.4494L13.5827 18.5911C10.588 19.7829 7.19413 18.3213 6.00236 15.3265L4.14409 16.066ZM14.3222 20.4494C18.3433 18.8492 20.3058 14.2923 18.7056 10.2713L16.8473 11.0108C18.0391 14.0055 16.5775 17.3994 13.5827 18.5911L14.3222 20.4494ZM18.7056 10.2713C18.3356 9.34161 17.8063 8.52007 17.1609 7.82722L15.6975 9.1905C16.1765 9.70466 16.5706 10.3154 16.8473 11.0108L18.7056 10.2713ZM16.8493 7.58743C15.7464 6.99618 15 5.83456 15 4.50012H13C13 6.60063 14.1778 8.42451 15.9043 9.35011L16.8493 7.58743ZM15 4.50012C15 4.05841 15.0813 3.63803 15.2289 3.25155L13.3606 2.53786C13.1273 3.14865 13 3.81069 13 4.50012H15ZM10.0001 9.63517C9.84648 9.49324 9.72277 9.25896 9.74737 8.97398L11.74 9.146C11.775 8.74061 11.5997 8.39014 11.3573 8.16618L10.0001 9.63517ZM17.1609 7.82722C17.0666 7.72604 16.9598 7.64668 16.8493 7.58743L15.9043 9.35011C15.8328 9.31177 15.7616 9.2593 15.6975 9.1905L17.1609 7.82722ZM13.903 3.59303C13.3779 3.44791 13.2185 2.90988 13.3606 2.53786L15.2289 3.25155C15.4546 2.66071 15.1867 1.87283 14.4358 1.66531L13.903 3.59303Z" fill="#FF4E4E"/>
          <path d="M14.4937 9.49531C15.1552 9.9898 15.6839 10.6404 16.0326 11.3891C16.3812 12.1377 16.539 12.9611 16.4918 13.7856" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      inactiveIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path d="M9.41598 10.8474L9.04624 9.91822V9.91822L9.41598 10.8474ZM6.66486 9.66253L5.73572 10.0323V10.0323L6.66486 9.66253ZM5.7326 9.3819L4.89952 8.82876L4.89952 8.82876L5.7326 9.3819ZM5.07319 15.6962L4.14406 16.066L4.14406 16.066L5.07319 15.6962ZM13.9524 19.5202L14.3222 20.4494V20.4494L13.9524 19.5202ZM17.7764 10.641L16.8473 11.0107V11.0107L17.7764 10.641ZM10.6787 8.90063L10.0001 9.63511L10.6787 8.90063ZM10.7437 9.05994L11.74 9.14595L10.7437 9.05994ZM16.4292 8.50882L15.6975 9.19046L16.4292 8.50882ZM16.3768 8.46873L16.8493 7.5874L16.3768 8.46873ZM14.1695 2.62917L13.9031 3.59303L14.1695 2.62917ZM14.2948 2.8947L13.3607 2.53786L14.2948 2.8947ZM14.4359 1.66531C14.0361 1.55482 13.6159 1.49609 13.1836 1.49609V3.49609C13.4342 3.49609 13.6752 3.53005 13.9031 3.59303L14.4359 1.66531ZM13.1836 1.49609C10.5923 1.49609 8.49152 3.59683 8.49152 6.18821H10.4915C10.4915 4.7014 11.6968 3.49609 13.1836 3.49609V1.49609ZM8.49152 6.18821C8.49152 7.55097 9.07377 8.77923 10.0001 9.63511L11.3573 8.16615C10.8236 7.67297 10.4915 6.97012 10.4915 6.18821H8.49152ZM9.74736 8.97393C9.7119 9.38479 9.45143 9.75697 9.04624 9.91822L9.78573 11.7765C10.9209 11.3248 11.6419 10.2814 11.74 9.14595L9.74736 8.97393ZM9.04624 9.91822C8.4725 10.1465 7.82231 9.86652 7.59399 9.29278L5.73572 10.0323C6.37245 11.6323 8.1857 12.4132 9.78573 11.7765L9.04624 9.91822ZM7.59399 9.29278C7.39007 8.78036 6.93594 8.46511 6.55058 8.33206C6.19704 8.21 5.38229 8.10165 4.89952 8.82876L6.56569 9.93505C6.44419 10.118 6.26169 10.207 6.11745 10.2322C5.99481 10.2536 5.91677 10.2291 5.89786 10.2226C5.8735 10.2141 5.85688 10.2042 5.84009 10.1898C5.82614 10.1779 5.77511 10.1313 5.73572 10.0323L7.59399 9.29278ZM4.89952 8.82876C3.52737 10.8953 3.15589 13.5828 4.14406 16.066L6.00232 15.3265C5.26692 13.4785 5.54087 11.4785 6.56569 9.93504L4.89952 8.82876ZM4.14406 16.066C5.74423 20.087 10.3011 22.0495 14.3222 20.4494L13.5827 18.5911C10.5879 19.7829 7.19408 18.3212 6.00232 15.3265L4.14406 16.066ZM14.3222 20.4494C18.3432 18.8492 20.3057 14.2923 18.7056 10.2712L16.8473 11.0107C18.0391 14.0055 16.5775 17.3993 13.5827 18.5911L14.3222 20.4494ZM18.7056 10.2712C18.3356 9.34158 17.8063 8.52004 17.1608 7.82717L15.6975 9.19046C16.1765 9.70462 16.5706 10.3154 16.8473 11.0107L18.7056 10.2712ZM16.8493 7.5874C15.7464 6.99614 15 5.83453 15 4.50012H13C13 6.60059 14.1778 8.42445 15.9043 9.35006L16.8493 7.5874ZM15 4.50012C15 4.05841 15.0814 3.63803 15.229 3.25155L13.3607 2.53786C13.1273 3.14865 13 3.81069 13 4.50012H15ZM10.0001 9.63511C9.84646 9.49317 9.72276 9.2589 9.74736 8.97393L11.74 9.14595C11.7749 8.74057 11.5997 8.3901 11.3573 8.16615L10.0001 9.63511ZM17.1608 7.82717C17.0666 7.726 16.9598 7.64665 16.8493 7.5874L15.9043 9.35006C15.8328 9.31172 15.7616 9.25925 15.6975 9.19046L17.1608 7.82717ZM13.9031 3.59303C13.378 3.44791 13.2185 2.90988 13.3607 2.53786L15.229 3.25155C15.4547 2.66071 15.1867 1.87283 14.4359 1.66531L13.9031 3.59303Z" fill="#4A4A68"/>
        </svg>
      ),
    },
    {
      label: 'Notifications',
      activeIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="2" r="1" fill="#FF4E4E"/>
          <path d="M10 20C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22C12.5304 22 13.0391 21.7893 13.4142 21.4142C13.7893 21.0391 14 20.5304 14 20L12 20H10Z" fill="#FF4E4E"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M17 10.4167V10.4167V13.9253C17 14.1104 17.0514 14.2918 17.1483 14.4494L17.8517 15.5923C17.9486 15.7499 18 15.9313 18 16.1164V17C18 17.5523 17.5523 18 17 18H7C6.44772 18 6 17.5523 6 17V16.1164C6 15.9313 6.05135 15.7499 6.14834 15.5923L6.85166 14.4494C6.94865 14.2918 7 14.1104 7 13.9253V10.4167V10.4167C7 7.42512 9.23858 5 12 5C14.7614 5 17 7.42512 17 10.4167Z" fill="#FF4E4E"/>
          <path d="M6.85166 14.4494L6 13.9253L6.85166 14.4494ZM6.14834 15.5923L7 16.1164L6.14834 15.5923ZM17.8517 15.5923L17 16.1164L17.8517 15.5923ZM17.1483 14.4494L18 13.9253L17.1483 14.4494ZM18 10.4167V10.4167H16V10.4167H18ZM18 13.9253V10.4167H16V13.9253H18ZM16.2967 14.9735L17 16.1164L18.7033 15.0682L18 13.9253L16.2967 14.9735ZM17 16.1164V17H19V16.1164H17ZM17 17H7V19H17V17ZM7 17V16.1164H5V17H7ZM7 16.1164L7.70332 14.9735L6 13.9253L5.29668 15.0682L7 16.1164ZM6 10.4167V13.9253H8V10.4167H6ZM6 10.4167V10.4167H8V10.4167H6ZM12 4C8.61243 4 6 6.94971 6 10.4167H8C8 7.90054 9.86472 6 12 6V4ZM18 10.4167C18 6.94971 15.3876 4 12 4V6C14.1353 6 16 7.90054 16 10.4167H18ZM7.70332 14.9735C7.8973 14.6583 8 14.2954 8 13.9253H6L6 13.9253L7.70332 14.9735ZM7 16.1164V16.1164L5.29668 15.0682C5.1027 15.3834 5 15.7463 5 16.1164H7ZM7 17H7H5C5 18.1046 5.89543 19 7 19V17ZM17 17V17V19C18.1046 19 19 18.1046 19 17H17ZM17 16.1164V16.1164H19C19 15.7463 18.8973 15.3834 18.7033 15.0682L17 16.1164ZM16 13.9253C16 14.2954 16.1027 14.6583 16.2967 14.9735L18 13.9253V13.9253H16Z" fill="#FF4E4E"/>
          <path d="M11.2565 6.57987C11.7057 6.48224 12.1696 6.47403 12.622 6.5557C13.0743 6.63738 13.5061 6.80735 13.8927 7.0559C14.2793 7.30445 14.6132 7.62672 14.8753 8.0043C15.1374 8.38189 15.3225 8.8074 15.4201 9.25654" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      inactiveIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="2" r="1" fill="#4A4A68"/>
          <path d="M10 20C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22C12.5304 22 13.0391 21.7893 13.4142 21.4142C13.7893 21.0391 14 20.5304 14 20L12 20H10Z" fill="#4A4A68"/>
          <path d="M6.85166 14.4494L6 13.9253L6.85166 14.4494ZM6.14834 15.5923L7 16.1164L6.14834 15.5923ZM17.8517 15.5923L17 16.1164L17.8517 15.5923ZM17.1483 14.4494L18 13.9253L17.1483 14.4494ZM18 10.4167V10.4167H16V10.4167H18ZM18 13.9253V10.4167H16V13.9253H18ZM16.2967 14.9735L17 16.1164L18.7033 15.0682L18 13.9253L16.2967 14.9735ZM17 16.1164V17H19V16.1164H17ZM17 17H7V19H17V17ZM7 17V16.1164H5V17H7ZM7 16.1164L7.70332 14.9735L6 13.9253L5.29668 15.0682L7 16.1164ZM6 10.4167V13.9253H8V10.4167H6ZM6 10.4167V10.4167H8V10.4167H6ZM12 4C8.61243 4 6 6.94971 6 10.4167H8C8 7.90054 9.86472 6 12 6V4ZM18 10.4167C18 6.94971 15.3876 4 12 4V6C14.1353 6 16 7.90054 16 10.4167H18ZM7.70332 14.9735C7.8973 14.6583 8 14.2954 8 13.9253H6L6 13.9253L7.70332 14.9735ZM7 16.1164L5.29668 15.0682C5.1027 15.3834 5 15.7463 5 16.1164H7ZM7 17H7H5C5 18.1046 5.89543 19 7 19V17ZM17 17V19C18.1046 19 19 18.1046 19 17H17ZM17 16.1164H19C19 15.7463 18.8973 15.3834 18.7033 15.0682L17 16.1164ZM16 13.9253C16 14.2954 16.1027 14.6583 16.2967 14.9735L18 13.9253H16Z" fill="#4A4A68"/>
        </svg>
      ),
    },
    {
      label: 'Account',
      activeIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="4" fill="#FF4E4E" stroke="#FF4E4E" strokeWidth="2"/>
          <path d="M15.5 15.5H8.5C5.73858 15.5 3.5 17.7386 3.5 20.5C3.5 21.0523 3.94772 21.5 4.5 21.5H19.5C20.0523 21.5 20.5 21.0523 20.5 20.5C20.5 17.7386 18.2614 15.5 15.5 15.5Z" fill="#FF4E4E" stroke="#FF4E4E" strokeWidth="2"/>
          <circle cx="12" cy="7" r="1" fill="white"/>
        </svg>
      ),
      inactiveIcon: (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="#4A4A68" strokeWidth="2"/>
          <path d="M3.5 21.5V20.5C3.5 17.7386 5.73858 15.5 8.5 15.5H15.5C18.2614 15.5 20.5 17.7386 20.5 20.5V21.5" stroke="#4A4A68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.headerBg, borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px 6px', justifyContent: 'space-between' }}>
        {items.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: i === active ? ACTIVE_COLOR : C.textSec, opacity: i === active ? 1 : 0.8 }}>
            {i === active ? item.activeIcon : item.inactiveIcon}
            <span style={{ fontSize: 11.662, fontWeight: 500, lineHeight: '149.523%', letterSpacing: 0.466, color: i === active ? '#1A0F0F' : '#4A4A68', textAlign: 'center', fontFamily: 'Inter' }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 20, background: C.headerBg }} />
    </div>
  )
}

const ReviewHeader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 60, borderBottom: `1px solid ${C.border}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <path d="M15 18l-6-6 6-6" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontSize: 16, fontWeight: 500, color: C.text }}>Review</span>
    </div>
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke={C.text} strokeWidth={2} strokeLinecap="round"/>
    </svg>
  </div>
)

const BottomActions: React.FC<{ nextLabel?: string }> = ({ nextLabel = 'Next' }) => (
  <div style={{ position: 'absolute', bottom: 32, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 15, color: C.textSec, cursor: 'pointer' }}>Skip Review</span>
    <div style={{ height: 44, paddingLeft: 20, paddingRight: 16, background: C.text, borderRadius: 22, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
      <span style={{ fontSize: 15, color: '#FFF', fontWeight: 600 }}>{nextLabel}</span>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="#FFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
)

// ─── Screens ──────────────────────────────────────────────────────────────────

// 1. Home Page (3915:25158)
const HomePageScreen = () => (
  <Phone>
    {/* Scrollable content — stops at bottom nav */}
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>

    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 16px 8px', background: C.headerBg }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>Eat Sleep Repeat</span>
      {/* Outline pin icon */}
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={C.text} strokeWidth={1.8} fill="none"/>
        <circle cx={12} cy={9} r={2.5} stroke={C.text} strokeWidth={1.8} fill="none"/>
      </svg>
    </div>

    {/* Search bar */}
    <div style={{ padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: C.inputBg, borderRadius: 12, height: 48, paddingLeft: 16, gap: 10 }}>
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx={11} cy={11} r={7} stroke={C.textSec} strokeWidth={2}/>
          <line x1={16.5} y1={16.5} x2={21} y2={21} stroke={C.textSec} strokeWidth={2} strokeLinecap="round"/>
        </svg>
        <span style={{ color: C.textSec, fontSize: 13 }}>Search for restaurants or food</span>
      </div>
    </div>

    {/* Filter chips */}
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px', alignItems: 'center', overflowX: 'auto' }}>
      {['Italian', 'Mexican', 'Asian', 'American'].map(cat => (
        <div key={cat} style={{
          height: 34, paddingLeft: 16, paddingRight: 16,
          display: 'flex', alignItems: 'center',
          borderRadius: 12,
          background: C.inputBg,
          color: C.text, fontSize: 13,
          whiteSpace: 'nowrap', flexShrink: 0,
          cursor: 'pointer',
        }}>
          {cat}
        </div>
      ))}
    </div>

    {/* Featured heading */}
    <div style={{ padding: '20px 16px 12px' }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Featured</span>
    </div>

    {/* Featured cards — horizontal scroll */}
    <div style={{ display: 'flex', gap: 12, padding: '0 16px 16px', overflowX: 'auto' }}>
      {[
        { label: 'Local Favorites', img: '/esr/food-0.png' },
        { label: 'New Arrivals',    img: '/esr/food-1.png' },
        { label: 'Best Deals',      img: '/esr/food-2.png' },
      ].map(f => (
        <div key={f.label} style={{ flexShrink: 0, width: 240, cursor: 'pointer' }}>
          <img
            src={f.img}
            alt={f.label}
            style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block', borderRadius: 12 }}
          />
          <div style={{ paddingTop: 16, fontSize: 16, fontWeight: 500, color: C.text }}>{f.label}</div>
        </div>
      ))}
    </div>

    {/* Popular Near You heading */}
    <div style={{ padding: '20px 16px 12px' }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Popular Near You</span>
    </div>

    {/* Popular Near You grid */}
    <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 24, columnGap: 12, padding: '0 16px 16px' }}>
      {[
        { name: 'The Burger Joint', meta: 'Burgers · 4.5 · 25% off', img: '/esr/food-3.png' },
        { name: 'Pizza Palace',     meta: 'Pizza · 4.6 · 40% off',   img: '/esr/food-4.png' },
        { name: 'Sushi Spot',       meta: 'Sushi · 4.7 · 25% off',   img: '/esr/food-5.png' },
        { name: 'Taco Town',        meta: 'Tacos · 4.4 · 10% off',   img: '/esr/food-0.png' },
      ].map(r => (
        <div key={r.name} style={{ width: 'calc(50% - 6px)', cursor: 'pointer' }}>
          <img
            src={r.img}
            alt={r.name}
            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', borderRadius: 12 }}
          />
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{r.name}</div>
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>{r.meta}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Recently Visited heading */}
    <div style={{ padding: '20px 16px 12px' }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Recently Visited</span>
    </div>

    {/* Recently Visited list */}
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px 40px' }}>
      {[
        { name: 'The Burger Joint', meta: 'Burgers · Visited 2 days ago',  img: '/esr/food-3.png' },
        { name: 'Sushi Spot',       meta: 'Sushi · Visited 4 days ago',    img: '/esr/food-5.png' },
        { name: 'Pizza Palace',     meta: 'Pizza · Visited last week',      img: '/esr/food-4.png' },
      ].map((r, i, arr) => (
        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, paddingBottom: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
          <img src={r.img} alt={r.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{r.name}</div>
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>{r.meta}</div>
          </div>
        </div>
      ))}
    </div>

    </div>{/* end scrollable */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.7))', backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)', pointerEvents: 'none' }} />
    <BottomNav active={0} />
  </Phone>
)

// 1b. Home Page — Banner Variant
const HomePageVariantScreen = () => (
  <Phone>
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>

    {/* Full-width square banner */}
    <div style={{ width: '100%', aspectRatio: '1', background: '#D9D9D9', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexShrink: 0 }} />

    {/* Search bar */}
    <div style={{ padding: '20px 16px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: C.inputBg, borderRadius: 12, height: 48, paddingLeft: 16, gap: 10 }}>
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx={11} cy={11} r={7} stroke={C.textSec} strokeWidth={2}/>
          <line x1={16.5} y1={16.5} x2={21} y2={21} stroke={C.textSec} strokeWidth={2} strokeLinecap="round"/>
        </svg>
        <span style={{ color: C.textSec, fontSize: 13 }}>Search for restaurants or food</span>
      </div>
    </div>

    {/* Filter chips */}
    <div style={{ display: 'flex', gap: 12, padding: '12px 16px', alignItems: 'center', overflowX: 'auto' }}>
      {['Italian', 'Mexican', 'Asian', 'American'].map(cat => (
        <div key={cat} style={{ height: 34, paddingLeft: 16, paddingRight: 16, display: 'flex', alignItems: 'center', borderRadius: 12, background: C.inputBg, color: C.text, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>
          {cat}
        </div>
      ))}
    </div>

    {/* Featured heading */}
    <div style={{ padding: '20px 16px 12px' }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Featured</span>
    </div>

    {/* Featured cards — horizontal scroll */}
    <div style={{ display: 'flex', gap: 12, padding: '0 16px 16px', overflowX: 'auto' }}>
      {[
        { label: 'Local Favorites', img: '/esr/food-0.png' },
        { label: 'New Arrivals',    img: '/esr/food-1.png' },
        { label: 'Best Deals',      img: '/esr/food-2.png' },
      ].map(f => (
        <div key={f.label} style={{ flexShrink: 0, width: 240, cursor: 'pointer' }}>
          <img src={f.img} alt={f.label} style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block', borderRadius: 12 }} />
          <div style={{ paddingTop: 16, fontSize: 16, fontWeight: 500, color: C.text }}>{f.label}</div>
        </div>
      ))}
    </div>

    {/* Popular Near You heading */}
    <div style={{ padding: '20px 16px 12px' }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Popular Near You</span>
    </div>

    {/* Popular Near You grid */}
    <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: 24, columnGap: 12, padding: '0 16px 16px' }}>
      {[
        { name: 'The Burger Joint', meta: 'Burgers · 4.5 · 25% off', img: '/esr/food-3.png' },
        { name: 'Pizza Palace',     meta: 'Pizza · 4.6 · 40% off',   img: '/esr/food-4.png' },
        { name: 'Sushi Spot',       meta: 'Sushi · 4.7 · 25% off',   img: '/esr/food-5.png' },
        { name: 'Taco Town',        meta: 'Tacos · 4.4 · 10% off',   img: '/esr/food-0.png' },
      ].map(r => (
        <div key={r.name} style={{ width: 'calc(50% - 6px)', cursor: 'pointer' }}>
          <img src={r.img} alt={r.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', borderRadius: 12 }} />
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{r.name}</div>
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>{r.meta}</div>
          </div>
        </div>
      ))}
    </div>

    {/* Recently Visited heading */}
    <div style={{ padding: '20px 16px 12px' }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Recently Visited</span>
    </div>

    {/* Recently Visited list */}
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px 40px' }}>
      {[
        { name: 'The Burger Joint', meta: 'Burgers · Visited 2 days ago', img: '/esr/food-3.png' },
        { name: 'Sushi Spot',       meta: 'Sushi · Visited 4 days ago',   img: '/esr/food-5.png' },
        { name: 'Pizza Palace',     meta: 'Pizza · Visited last week',     img: '/esr/food-4.png' },
      ].map((r, i, arr) => (
        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, paddingBottom: 12, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
          <img src={r.img} alt={r.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{r.name}</div>
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>{r.meta}</div>
          </div>
        </div>
      ))}
    </div>

    </div>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.7))', backdropFilter: 'blur(1px)', WebkitBackdropFilter: 'blur(1px)', pointerEvents: 'none' }} />
    <BottomNav active={0} />
  </Phone>
)

// 2. Search (4040:30463) — map + suggestions
const SearchScreen = () => (
  <Phone>
    {/* Search bar */}
    <div style={{ padding: '12px 16px', background: C.bg, position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, height: 48, paddingLeft: 12, paddingRight: 12, gap: 8, boxShadow: C.shadow }}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx={11} cy={11} r={7} stroke={C.textSec} strokeWidth={2} />
          <line x1={16.5} y1={16.5} x2={21} y2={21} stroke={C.textSec} strokeWidth={2} strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, fontSize: 15, color: C.text }}>|</span>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M18 6L6 18M6 6l12 12" stroke={C.textSec} strokeWidth={2} strokeLinecap="round"/>
        </svg>
      </div>
    </div>
    {/* Suggestions */}
    <div style={{ background: C.bg, position: 'relative', zIndex: 9 }}>
      {['Pasta La Vista', 'BRIM', 'Vanilla', 'Sweet Cream', 'Jaybees'].map(name => (
        <div key={name} style={{ padding: '14px 16px', fontSize: 16, color: C.text, borderBottom: `1px solid ${C.border}` }}>
          {name}
        </div>
      ))}
    </div>
    {/* Map mock */}
    <div style={{ position: 'absolute', top: 360, left: 0, right: 0, bottom: 72, background: '#E4E0D8', overflow: 'hidden' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {[18, 32, 48, 64, 78].map(pct => (
          <line key={`h${pct}`} x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`} stroke="#D0CCBF" strokeWidth={pct === 32 || pct === 64 ? 10 : 3}/>
        ))}
        {[12, 26, 42, 58, 74, 88].map(pct => (
          <line key={`v${pct}`} x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%" stroke="#D0CCBF" strokeWidth={pct === 26 || pct === 58 ? 10 : 3}/>
        ))}
        {/* Buildings */}
        {[[20,20,40,30],[65,10,30,20],[15,55,25,35],[70,50,35,25],[40,70,20,20]].map(([x,y,w,h], i) => (
          <rect key={i} x={`${x}%`} y={`${y}%`} width={`${w}%`} height={`${h}%`} fill="#D8D4C8" rx={2}/>
        ))}
        {/* Pin */}
        <circle cx="50%" cy="48%" r="12" fill={C.primary}/>
        <circle cx="50%" cy="48%" r="24" fill={C.primary} opacity="0.15"/>
      </svg>
    </div>
    {/* Confirm button */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, background: C.bg }}>
      <div style={{ height: 52, background: C.primary, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#FFF', fontSize: 17, fontWeight: 600 }}>Confirm</span>
      </div>
    </div>
  </Phone>
)

// ─── Celebration Screen ───────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#6159BE', '#d83d3d', '#FFD700', '#4CAF50', '#FF69B4', '#00BCD4']
const CONFETTI_COUNT = 40

const CelebrationScreen = ({ onClose }: { onClose: () => void }) => {
  const [showText, setShowText] = useState(false)
  const [confetti] = useState(() =>
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 7,
      delay: Math.random() * 0.4,
      duration: 1.0 + Math.random() * 0.8,
      rotate: Math.random() * 360,
      shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'rect' : 'thin',
      tx: (Math.random() - 0.5) * 340,   // horizontal spread
      ty: -(300 + Math.random() * 400),   // upward height
    }))
  )

  useEffect(() => {
    const t = setTimeout(() => setShowText(true), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0 0 32px' }}>
      {/* Confetti */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {confetti.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: p.shape === 'thin' ? p.size / 2 : p.size,
            height: p.shape === 'circle' ? p.size : p.size * 1.6,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
            background: p.color,
            animation: `confettiExplode ${p.duration}s cubic-bezier(0.2,0.8,0.4,1) ${p.delay}s both`,
            ['--tx' as any]: `${p.tx}px`,
            ['--ty' as any]: `${p.ty}px`,
            transformOrigin: 'center',
          }} />
        ))}
      </div>

      {/* Central image — absolutely centered */}
      <img src="/esr/availed.svg" alt="Discount Availed" style={{ width: 300, height: 300, objectFit: 'contain', marginBottom: 80, animation: 'celebPop 0.6s cubic-bezier(0.34,1.4,0.64,1) both' }} />

      {/* Text + button — pinned to bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 32px', opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.5s ease, transform 0.5s ease', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, color: C.textSec, margin: '0 0 8px' }}>Discount Redeemed!</p>
        <p style={{ fontSize: 15, color: C.textSec, opacity: 0.6, margin: '0 0 32px', lineHeight: 1.6 }}>Your discount has been applied. Enjoy your meal at Thai Joy!</p>
        <div onClick={onClose} style={{ background: C.primary, borderRadius: 37, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: '100%' }}>
          <span style={{ color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 18 }}>Done</span>
        </div>
      </div>

      <style>{`
        @keyframes confettiExplode {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(540deg); opacity: 0; }
        }
        @keyframes celebPop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ─── Redeem Flow ──────────────────────────────────────────────────────────────
const REDEEM_STEPS = ['Tag', 'Rate', 'Write', 'Redeem']
const SUGGESTED_TAGS = ['Pad Thai', 'Tom Yum', 'Spring Rolls', 'Green Curry', 'Mango Sticky Rice', 'Fried Rice', 'Satay', 'Massaman']

const RedeemFlow = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [redeeming, setRedeeming] = useState(false)

  // Step 0
  const [tagSearch, setTagSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Step 1
  const [ratings, setRatings] = useState([0, 0, 0, 0])
  const [pressedStar, setPressedStar] = useState<[number, number] | null>(null)

  // Step 2
  const [review, setReview] = useState('')

  // Step 3
  const [digits, setDigits] = useState(['', '', '', ''])
  const digitRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const filteredTags = SUGGESTED_TAGS.filter(t =>
    t.toLowerCase().includes(tagSearch.toLowerCase()) && !selectedTags.includes(t)
  )

  const goNext = () => {
    if (step < REDEEM_STEPS.length - 1) setStep(s => s + 1)
    else setDone(true)
  }
  const goBack = () => {
    if (step > 0) setStep(s => s - 1)
    else onClose()
  }

  // Progress line fills: between dot i and i+1, fill if step > i
  const lineFill = (i: number) => step > i ? 1 : step === i ? 0 : 0

  if (done) return <CelebrationScreen onClose={onClose} />

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
      {/* Status bar spacer */}
      <div style={{ height: 24, flexShrink: 0 }} />

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 0 0', flexShrink: 0 }}>
        <div onClick={goBack} style={{ background: '#fff', padding: 13, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke={C.textSec} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ flex: 1, textAlign: 'left', fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 600, color: C.textSec, letterSpacing: 0.16 }}>Thai Joy</span>
      </div>

      {/* Stepper */}
      <div style={{ padding: '18px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {REDEEM_STEPS.map((label, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
              {/* Dot + line row */}
              <div style={{ display: 'flex', alignItems: 'center', height: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: step >= i ? C.primary : '#e0e0e0', flexShrink: 0, transition: 'background 0.3s' }} />
                <div style={{ flex: 1, height: 4, background: '#e0e0e0', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: C.primary, transform: `scaleX(${step > i ? 1 : 0})`, transformOrigin: 'left', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
              </div>
              {/* Label */}
              <span style={{ fontSize: 15.4, fontFamily: 'Inter, sans-serif', fontWeight: 400, color: C.textSec, opacity: step >= i ? 1 : 0.6, transition: 'opacity 0.3s', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>

        {/* Step 0: Tag */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 600, color: C.textSec, margin: 0 }}>What did you have?</p>
            <div style={{ height: 2, background: '#F6F6F6', marginLeft: -16, marginRight: -16, width: 'calc(100% + 32px)' }} />
            <div style={{ background: '#f6f6f6', borderRadius: 10.9, height: 48, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
              <img src="/esr/icons/search.svg" alt="search" width={24} height={24} style={{ opacity: 0.7 }} />
              <input
                value={tagSearch}
                onChange={e => setTagSearch(e.target.value)}
                placeholder="Search dishes..."
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: C.text, flex: 1, fontFamily: 'inherit' }}
              />
            </div>
            {selectedTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedTags.map(tag => (
                  <div key={tag} onClick={() => toggleTag(tag)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.primary, borderRadius: 13.2, padding: '7px 12px', cursor: 'pointer' }}>
                    <span style={{ fontSize: 13.2, color: '#fff', fontWeight: 500 }}>{tag}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1 }}>×</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filteredTags.map(tag => (
                <div key={tag} onClick={() => toggleTag(tag)} style={{ background: '#f6f6f6', borderRadius: 13.2, padding: '7px 14px', cursor: 'pointer', height: 35.3, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 13.2, color: C.textSec }}>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Rate */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 600, color: C.textSec, margin: 0 }}>Rate your Food</p>
            <div style={{ height: 2, background: '#F6F6F6', marginLeft: -16, marginRight: -16, width: 'calc(100% + 32px)', marginTop: 16, marginBottom: 16 }} />
            {['Taste', 'Service', 'Value for money', 'Ambiance'].map((cat, ci) => (
              <React.Fragment key={cat}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, paddingBottom: 24 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 400, color: C.textSec, letterSpacing: 0.16 }}>{cat}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[1,2,3,4,5].map(star => (
                      <div
                        key={star}
                        onClick={() => setRatings(prev => { const n = [...prev]; n[ci] = star; return n; })}
                        onPointerDown={() => setPressedStar([ci, star])}
                        onPointerUp={() => setPressedStar(null)}
                        onPointerLeave={() => setPressedStar(null)}
                        style={{ width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {(() => {
                          const active = ratings[ci] >= star
                          const hovered = pressedStar && pressedStar[0] === ci && pressedStar[1] >= star
                          if (active) return (
                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                              <path d="M11.7523 3.36262C11.8714 3.18825 12.1286 3.18825 12.2477 3.36262L15.1083 7.55008C15.1474 7.60731 15.2051 7.64924 15.2716 7.66874L20.1381 9.09531C20.3407 9.15471 20.4202 9.39933 20.2912 9.5665L17.1926 13.5811C17.1503 13.6359 17.1282 13.7038 17.1303 13.7731L17.2773 18.8422C17.2835 19.0533 17.0754 19.2044 16.8765 19.1334L12.1009 17.4271C12.0357 17.4037 11.9643 17.4037 11.8991 17.4271L7.12348 19.1334C6.92462 19.2044 6.71654 19.0533 6.72267 18.8422L6.86975 13.7731C6.87176 13.7038 6.84971 13.6359 6.80736 13.5811L3.70882 9.5665C3.57979 9.39933 3.65927 9.15471 3.86191 9.09531L8.72839 7.66874C8.7949 7.64924 8.85261 7.60731 8.89171 7.55008L11.7523 3.36262Z" fill="#6159BE" stroke="#6159BE" strokeWidth={2} />
                            </svg>
                          )
                          if (hovered) return (
                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                              <path d="M11.7382 3.46747C11.8528 3.2629 12.1472 3.2629 12.2618 3.46747L14.7785 7.96205C14.8214 8.03863 14.8956 8.0926 14.9817 8.10972L20.034 9.11436C20.264 9.16008 20.355 9.44009 20.1958 9.61225L16.6989 13.3947C16.6393 13.4591 16.611 13.5465 16.6213 13.6336L17.2271 18.7491C17.2546 18.9819 17.0164 19.155 16.8035 19.0568L12.1256 16.8999C12.0459 16.8632 11.9541 16.8632 11.8744 16.8999L7.19647 19.0568C6.98355 19.155 6.74537 18.9819 6.77294 18.7491L7.37872 13.6336C7.38904 13.5465 7.36067 13.4591 7.30108 13.3947L3.80419 9.61225C3.64503 9.44009 3.73601 9.16008 3.96597 9.11436L9.01828 8.10972C9.10437 8.0926 9.17864 8.03863 9.22152 7.96205L11.7382 3.46747Z" fill="rgba(97,89,190,0.2)" stroke="#6159BE" strokeWidth={2} />
                            </svg>
                          )
                          return (
                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                              <path d="M11.7382 3.46747C11.8528 3.2629 12.1472 3.2629 12.2618 3.46747L14.7785 7.96205C14.8214 8.03863 14.8956 8.0926 14.9817 8.10972L20.034 9.11436C20.264 9.16008 20.355 9.44009 20.1958 9.61225L16.6989 13.3947C16.6393 13.4591 16.611 13.5465 16.6213 13.6336L17.2271 18.7491C17.2546 18.9819 17.0164 19.155 16.8035 19.0568L12.1256 16.8999C12.0459 16.8632 11.9541 16.8632 11.8744 16.8999L7.19647 19.0568C6.98355 19.155 6.74537 18.9819 6.77294 18.7491L7.37872 13.6336C7.38904 13.5465 7.36067 13.4591 7.30108 13.3947L3.80419 9.61225C3.64503 9.44009 3.73601 9.16008 3.96597 9.11436L9.01828 8.10972C9.10437 8.0926 9.17864 8.03863 9.22152 7.96205L11.7382 3.46747Z" fill="none" stroke="#4A4A68" strokeWidth={2} />
                            </svg>
                          )
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
                {ci < 3 && <div style={{ height: 2, background: '#F6F6F6', width: '100%' }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Step 2: Write */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 600, color: C.textSec, margin: 0 }}>Write a Review</p>
            <div style={{ height: 2, background: '#F6F6F6', marginLeft: -16, marginRight: -16, width: 'calc(100% + 32px)' }} />
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={6}
              style={{ background: '#f6f6f6', border: 'none', borderRadius: 10.9, padding: '14px', fontSize: 15, color: C.text, fontFamily: 'inherit', resize: 'none', outline: 'none', lineHeight: 1.6 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f6f6f6', borderRadius: 10.9, padding: '12px 14px', cursor: 'pointer' }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.textSec} strokeWidth={1.8} strokeLinecap="round">
                <rect x={3} y={3} width={18} height={18} rx={3} />
                <circle cx={8.5} cy={8.5} r={1.5} />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{ fontSize: 14, color: C.textSec, opacity: 0.7 }}>Attach a photo</span>
            </div>
          </div>
        )}

        {/* Step 3: Redeem */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 600, color: C.textSec, margin: 0 }}>Enter Discount Code</p>
            <div style={{ height: 2, background: '#F6F6F6', marginLeft: -16, marginRight: -16, width: 'calc(100% + 32px)' }} />
            <p style={{ fontSize: 14, color: C.textSec, opacity: 0.6, margin: 0, lineHeight: 1.5 }}>Enter the 4-digit code you received from the restaurant.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={digitRefs[i]}
                  value={d}
                  maxLength={1}
                  inputMode="numeric"
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(-1)
                    const next = [...digits]; next[i] = val; setDigits(next)
                    if (val && i < 3) digitRefs[i + 1].current?.focus()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !digits[i] && i > 0) digitRefs[i - 1].current?.focus()
                  }}
                  style={{ flex: 1, height: 88, background: '#f6f6f6', border: `2px solid ${d ? '#6159BE' : 'transparent'}`, borderRadius: 12, textAlign: 'center', fontSize: 24, fontWeight: 700, color: C.textSec, fontFamily: 'inherit', outline: 'none', minWidth: 0 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      {step === REDEEM_STEPS.length - 1 ? (
        <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
          <div
            onClick={() => {
              if (redeeming) return
              setRedeeming(true)
              setTimeout(() => { setRedeeming(false); setDone(true) }, 1800)
            }}
            style={{ background: C.primary, borderRadius: 37, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: redeeming ? 'default' : 'pointer' }}
          >
            {redeeming ? (
              <div style={{ width: 24, height: 24, borderRadius: 12, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spinLoader 0.75s linear infinite' }} />
            ) : (
              <span style={{ color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 18 }}>Redeem Discount</span>
            )}
          </div>
          <style>{`@keyframes spinLoader { to { transform: rotate(360deg); } }`}</style>
          <div onClick={goBack} style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 18, color: C.textSec }}>Skip</span>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px 16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div onClick={goBack} style={{ background: '#fff', borderRadius: 10, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', cursor: 'pointer' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 20, fontWeight: 600, color: C.textSec, whiteSpace: 'nowrap' }}>Skip</span>
          </div>
          <div onClick={goNext} style={{ background: C.primary, borderRadius: 37, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 28px', cursor: 'pointer', gap: 4 }}>
            <span style={{ color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 20, whiteSpace: 'nowrap' }}>Next</span>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

// 3. Restaurant · Offers (4040:30409)
const HERO_IMG   = 'https://www.figma.com/api/mcp/asset/6a0405b0-4213-4705-8aa0-ae84706399fc'
const LOGO_IMG   = 'https://www.figma.com/api/mcp/asset/f2ec51e8-0132-4aa1-9d1e-4fcb8665cdb3'
const LUNCH_IMG  = 'https://www.figma.com/api/mcp/asset/81f26659-26fc-41cf-94db-3f6a0ab749c6'
const DINNER_IMG = 'https://www.figma.com/api/mcp/asset/46d54988-8fbd-4689-902b-6af6409862cb'

const OFFERS = [
  { discount: '10% off',        title: 'Lunch Special',  desc: 'Enjoy 10% off on all lunch items between 12 PM and 3 PM.', img: LUNCH_IMG  },
  { discount: 'Free Appetizer', title: 'Dinner Special', desc: 'Get a free appetizer with any dinner entree purchase.',     img: DINNER_IMG },
]

const RestaurantOffersScreen = () => {
  const [offerOpen, setOfferOpen] = useState(false)

  return (
    <Phone scrollable>
      {/* Redeem flow */}
      {offerOpen && <RedeemFlow onClose={() => setOfferOpen(false)} />}

      {/* Top nav */}
      <div style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ background: C.bg, padding: 13, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke={C.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: C.textSec, letterSpacing: 0.16 }}>Offers</span>
        </div>
      </div>

      {/* Hero + logo */}
      <div style={{ position: 'relative', width: '100%', height: 240, flexShrink: 0 }}>
        <img src={HERO_IMG} alt="Thai Joy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <img src={LOGO_IMG} alt="Logo" style={{ position: 'absolute', left: 147, bottom: -48, width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${C.bg}` }} />
      </div>

      {/* Restaurant info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 56, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}>
        <p style={{ fontFamily: 'Poppins, Inter, sans-serif', fontSize: 24, fontWeight: 600, color: '#1a0f0f', textAlign: 'center', lineHeight: '31px', margin: 0 }}>Thai Joy</p>
        <div style={{ paddingTop: 4, paddingBottom: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 400, color: '#1c0d0d', textAlign: 'center', lineHeight: '23.2px', margin: 0 }}>4.5 · 1200+ ratings · Fine Dining</p>
          <p style={{ fontSize: 16, fontWeight: 400, color: '#1c0d0d', textAlign: 'center', lineHeight: '23.2px', margin: 0 }}>123 Main St, Anytown</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ paddingBottom: 16 }}>
        <div style={{ borderBottom: '1.1px solid #cac4d0', display: 'flex', gap: 32, paddingLeft: 16 }}>
          <div style={{ borderBottom: '3.3px solid #d83d3d', paddingTop: 17.6, paddingBottom: 17.6, marginBottom: -1.1 }}>
            <span style={{ fontSize: 15.4, fontWeight: 700, color: '#1c0d0d' }}>Offers</span>
          </div>
          <div style={{ paddingTop: 17.6, paddingBottom: 14.3 }}>
            <span style={{ fontSize: 15.4, fontWeight: 700, color: '#000', opacity: 0.5 }}>Reviews</span>
          </div>
          <div style={{ paddingTop: 17.6, paddingBottom: 14.3 }}>
            <span style={{ fontSize: 15.4, fontWeight: 700, color: '#000', opacity: 0.5 }}>Menu</span>
          </div>
        </div>
      </div>

      {/* Offer cards */}
      {OFFERS.map(o => (
        <div key={o.title} style={{ padding: 16, cursor: 'pointer' }} onClick={() => setOfferOpen(true)}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 16 }}>
              <span style={{ fontSize: 15.4, fontWeight: 400, color: C.textSec, lineHeight: '23.15px' }}>{o.discount}</span>
              <span style={{ fontSize: 17.6, fontWeight: 700, color: C.text, lineHeight: '22px' }}>{o.title}</span>
              <span style={{ fontSize: 15.4, fontWeight: 400, color: C.textSec, lineHeight: '23.15px' }}>{o.desc}</span>
            </div>
            <div style={{ width: 100, height: 100, borderRadius: 13, overflow: 'hidden', flexShrink: 0 }}>
              <img src={o.img} alt={o.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      ))}
    </Phone>
  )
}

// 4. Restaurant · Reviews (3915:24816)
const RestaurantReviewsScreen = () => (
  <Phone scrollable>
    <div style={{ padding: 16, height: 72, display: 'flex', alignItems: 'center' }}>
      <BackBtn />
    </div>
    {/* Hero */}
    <div style={{ height: 218, position: 'relative' }}>
      <img src="https://picsum.photos/seed/indianfood/390/218" alt="Tandoor Fusion" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)', width: 72, height: 72, background: C.bg, borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: C.shadow, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <img src="https://picsum.photos/seed/tandoorlogo/72/72" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
    {/* Info */}
    <div style={{ padding: '48px 16px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>Tandoor Fusion</div>
      <div style={{ fontSize: 13, color: C.textSec, marginTop: 6, lineHeight: 1.6 }}>4.5 · 1200+ ratings · Fine Dining · 123 Main St, Anytown</div>
    </div>
    <TabNav tabs={['Offers', 'Reviews', 'Menu']} active={1} />
    {/* Average Ratings */}
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>Average Ratings</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[['Taste', 4.0], ['Ambiance', 4.0], ['Service', 4.0], ['Value', 4.0]].map(([cat, val]) => (
          <div key={cat as string} style={{ width: 'calc(50% - 4px)', padding: 12, boxSizing: 'border-box', border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: C.textSec }}>{cat as string}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '4px 0' }}>{(val as number).toFixed(1)}</div>
            <StarRow rating={val as number} size={8} />
          </div>
        ))}
      </div>
    </div>
    {/* Popular Reviews */}
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 }}>Popular Reviews</div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
        {[
          { name: 'Ethan',  time: '2 m',  text: 'Great ambiance and delicious food. The wine selection was impressive.', rating: 4.0 },
          { name: 'Sophia', time: '15 m', text: 'The food was amazing and the service was top-notch. I highly recommend the lunch...', rating: 5.0 },
        ].map(r => (
          <div key={r.name} style={{ width: 187, flexShrink: 0, background: C.bg, borderRadius: 10, boxShadow: C.shadow, border: `1px solid ${C.border}`, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{r.name}</span>
              <span style={{ fontSize: 11, color: C.textTer }}>{r.time}</span>
            </div>
            <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.55, marginBottom: 8 }}>{r.text}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.rating.toFixed(1)}</span>
              <StarRow rating={r.rating} size={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Phone>
)

// 5. Full Review (3936:25747)
const FullReviewScreen = () => (
  <Phone scrollable>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16, height: 72, borderBottom: `1px solid ${C.border}` }}>
      <BackBtn />
      <div style={{ width: 28, height: 28, background: C.inputBg, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
        <img src="https://picsum.photos/seed/tandoorlogo/28/28" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Tandoori Fusion</span>
    </div>
    <div style={{ padding: 16 }}>
      {/* Reviewer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: C.text }}>Mohammad Irtaza</span>
        <span style={{ fontSize: 12, color: C.textTer }}>2 mins ago</span>
      </div>
      <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 16 }}>
        Nice experience with the eclectic variety of food
      </div>
      {/* Photo */}
      <img src="https://picsum.photos/seed/reviewfood/390/300" alt="Review" style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 16 }} />
      {/* Rating collapsible */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Rating (4.2)</span>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <path d="M18 15l-6-6-6 6" stroke={C.textSec} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {[['Service', 4], ['Ambiance', 4], ['Taste', 4], ['Value for Money', 4]].map(([cat, val]) => (
          <div key={cat as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: C.textSec }}>{cat as string}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{val as number}</span>
              <StarRow rating={val as number} size={11} />
            </div>
          </div>
        ))}
      </div>
      {/* Tags */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>Tags</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Burgers', 'Cold Drinks'].map(tag => (
            <div key={tag} style={{ height: 30, paddingLeft: 12, paddingRight: 12, borderRadius: 6, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', fontSize: 13, color: C.textSec }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
      {/* Helpful */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 14, color: C.text }}>Was this Review Helpful?</span>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h12.17a2 2 0 0 0 1.97-1.67l1.4-9A2 2 0 0 0 17.57 9H14V4a2 2 0 0 0-2-2H11L7 9" stroke={C.textSec} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Title */}
      <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 14, color: C.textSec, marginBottom: 8 }}>Title</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 8 }}>0.0</div>
        <StarRow rating={0} size={20} />
      </div>
    </div>
  </Phone>
)

// 6. Score Card component (4040:30598)
const ScoreCardScreen = () => (
  <div style={{ width: 390, fontFamily: 'Inter, sans-serif' }}>
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, boxShadow: C.shadow, display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1 }}>4.5</div>
        <div style={{ marginTop: 6 }}><StarRow rating={4.5} size={13} /></div>
        <div style={{ fontSize: 11, color: C.textTer, marginTop: 6 }}>1200+ ratings</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[['Taste', 4.0], ['Ambiance', 4.0], ['Service', 4.0], ['Value', 4.0]].map(([cat, val]) => (
          <div key={cat as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: C.textSec, width: 54, flexShrink: 0 }}>{cat as string}</span>
            <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
              <div style={{ width: `${((val as number) / 5) * 100}%`, height: '100%', background: C.primary, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: C.text, width: 20, textAlign: 'right' }}>{(val as number).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// 7. Login / Sign Up (4040:30297)
const LoginSignupScreen = () => (
  <Phone>
    {/* Red top */}
    <div style={{ background: C.primary, height: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Illustration area */}
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 220, height: 220, borderRadius: 110, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 80 }}>🍔</span>
        </div>
        {/* Decorative stars */}
        {[[30, 60], [310, 80], [20, 180], [330, 200]].map(([x, y], i) => (
          <svg key={i} width={20} height={20} viewBox="0 0 12 12" style={{ position: 'absolute', left: x, top: y, opacity: 0.7 }}>
            <path d="M6 1l1.24 2.52L10 3.99 7.82 6.1l.52 3.04L6 7.75 3.66 9.14l.52-3.04L2 3.99l2.76-.47L6 1z" fill="#4B5FD6"/>
          </svg>
        ))}
      </div>
      {/* Text + dots */}
      <div style={{ textAlign: 'center', padding: '0 24px 32px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#FFF', marginBottom: 8 }}>Eat, Sleep, Repeat</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>Bumper Activities, Discounts, Reviews and more.</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          <div style={{ width: 20, height: 6, borderRadius: 3, background: '#FFF' }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.35)' }} />
          <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.35)' }} />
        </div>
      </div>
    </div>
    {/* White bottom */}
    <div style={{ padding: '28px 24px' }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 6 }}>Eat, Sleep, Repeat</div>
      <div style={{ fontSize: 15, color: C.textSec, marginBottom: 24 }}>Sign up or Log in to continue</div>
      <div style={{ height: 52, background: C.primary, borderRadius: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, cursor: 'pointer' }}>
        <span style={{ color: '#FFF', fontSize: 16, fontWeight: 600 }}>Sign up</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: 14, color: C.textSec }}>
        Already have an account? <span style={{ color: C.primary, fontWeight: 600, cursor: 'pointer' }}>Log In</span>
      </div>
    </div>
  </Phone>
)

// 8. Activity · Enter (4040:30750) — "What did you have?"
const ActivityEnterScreen = () => (
  <Phone>
    <ReviewHeader />
    <div style={{ padding: '20px 16px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 20 }}>What did you have?</div>
      <SearchBar />
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, color: C.textSec, marginBottom: 10 }}>Your tags</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Discount', 'Spicy Burger', 'Seafood'].map(tag => (
            <div key={tag} style={{ height: 32, paddingLeft: 12, paddingRight: 8, borderRadius: 6, border: `1px solid ${C.primary}`, display: 'flex', alignItems: 'center', gap: 6, color: C.primary, fontSize: 13 }}>
              {tag}
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
    <BottomActions />
  </Phone>
)

// 9. Activity · Rate (4040:30616) — "Rate your food"
const ActivityRatingScreen = () => (
  <Phone>
    <ReviewHeader />
    <div style={{ padding: '20px 16px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 20 }}>Rate your food</div>
      {['Taste', 'Service', 'Value for money', 'Ambiance'].map(cat => (
        <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 16, color: C.text }}>{cat}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <svg key={s} width={24} height={24} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= 3 ? C.star : '#E5E5E5'}/>
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
    <BottomActions nextLabel="Next" />
  </Phone>
)

// 10. Enter Full Name (standalone component)
const EnterFullNameScreen = () => (
  <div style={{ width: 390, fontFamily: 'Inter, sans-serif', background: C.bg, border: `1px solid ${C.border}` }}>
    <div style={{ padding: '24px 16px 20px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 16 }}>Enter your Full Name</div>
      <div style={{ fontSize: 12, color: C.textSec, marginBottom: 10 }}>Name</div>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 8, borderBottom: `2px solid ${C.text}` }}>
        <span style={{ flex: 1, fontSize: 15, color: C.textTer }}>Full name</span>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke={C.textSec} strokeWidth={2.5} strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div style={{ marginTop: 6, fontSize: 12, color: C.primary }}>Please Enter your Full Name</div>
    </div>
  </div>
)

// 11. Enter Coupon Code (standalone component)
const EnterCouponCodeScreen = () => (
  <div style={{ width: 390, fontFamily: 'Inter, sans-serif', background: C.bg, border: `1px solid ${C.border}`, padding: '24px 16px', boxSizing: 'border-box' }}>
    <div style={{ fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 20 }}>Enter Coupon Code</div>
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ width: 64, height: 64, border: `1.5px solid ${C.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: C.text, background: C.bg }}>
          X
        </div>
      ))}
    </div>
  </div>
)

// ─── Slide Config ─────────────────────────────────────────────────────────────

const SLIDES: { name: string; component: React.FC }[] = [
  { name: 'Home Page',             component: HomePageScreen },
  { name: 'Home · Banner',         component: HomePageVariantScreen },
  { name: 'Search',                component: SearchScreen },
  { name: 'Restaurant · Offers',  component: RestaurantOffersScreen },
  { name: 'Restaurant · Reviews', component: RestaurantReviewsScreen },
  { name: 'Full Review',           component: FullReviewScreen },
  { name: 'Score Card',            component: ScoreCardScreen },
  { name: 'Login / Sign Up',       component: LoginSignupScreen },
  { name: 'Activity · Enter',      component: ActivityEnterScreen },
  { name: 'Activity · Rate',       component: ActivityRatingScreen },
  { name: 'Enter Full Name',       component: EnterFullNameScreen },
  { name: 'Enter Coupon Code',     component: EnterCouponCodeScreen },
]

// ─── Page Shell ───────────────────────────────────────────────────────────────

const RewardsExperiments: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const page = pageRef.current
    if (!page) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = slideRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) setActiveIndex(index)
          }
        }
      },
      { root: page, threshold: 0.5 }
    )
    slideRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.page} ref={pageRef}>
      <nav className={styles.tabNav}>
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            className={`${styles.tab} ${activeIndex === i ? styles.tabActive : ''}`}
            onClick={() => scrollToSlide(i)}
          >
            {slide.name}
          </button>
        ))}
      </nav>

      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={styles.slide}
          ref={el => { slideRefs.current[i] = el }}
        >
          <slide.component />
        </div>
      ))}
    </div>
  )
}

export default RewardsExperiments
