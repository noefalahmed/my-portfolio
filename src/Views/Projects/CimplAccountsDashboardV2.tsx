import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CimplAccountsDashboard.module.css'
import v2 from './CimplAccountsDashboardV2.module.css'
import {
  type Status, type Row,
  CHIP_CLASS, ROWS, COLUMNS, CARD_STATUS,
  MI, TopBar, SideNav, AccountDetail, ActivityContent,
  SummaryContent, BillingContent, ConfirmModal,
} from './CimplAccountsDashboard'

/* ── Highlight helper ── */
function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return <>{parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} style={{ background: '#FFF176', borderRadius: 2, padding: '0 1px' }}>{part}</mark>
      : part
  )}</>
}

/* ── Column key map ── */
const COL_KEYS: Record<string, keyof Row> = {
  'Cost Center Name': 'costCenterName',
  'Cost Center No.':  'costCenterNo',
  'Account No.':      'accountNo',
  'Provider':         'provider',
  'Account Name':     'accountName',
  'Status':           'status',
  'Account type':     'accountType',
  'Level':            'level',
  'Open date':        'openDate',
  'Close date':       'closeDate',
  'Payment type':     'paymentType',
  'Currency':         'currency',
}

/* ── Filter sidebar ── */
type FilterItem = { id: string; name: string; value: string; enabled: boolean }

const DEFAULT_FILTERS: FilterItem[] = [
  { id: 'status',  name: 'Status',            value: 'Is Open, Closed, New',         enabled: true },
  { id: 'billing', name: 'Is Billing Account', value: 'Yes',                          enabled: true },
  { id: 'date',    name: 'Date opened',        value: '2021/01/01 to 2021/06/01',     enabled: true },
]

const FILTER_OPTIONS: Record<string, string[]> = {
  status:  ['Open', 'Closed', 'Deactivated', 'Flagged'],
  billing: ['Yes', 'No'],
}

const FiltersSidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [filters, setFilters] = useState<FilterItem[]>(DEFAULT_FILTERS)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selections, setSelections] = useState<Record<string, Set<string>>>({
    status: new Set(['Open', 'Closed', 'New']),
    billing: new Set(['Yes']),
  })

  function toggle(id: string) {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  function clearAll() {
    setFilters(prev => prev.map(f => ({ ...f, enabled: false })))
  }

  function toggleOption(filterId: string, opt: string) {
    setSelections(prev => {
      const next = new Set(prev[filterId] ?? [])
      next.has(opt) ? next.delete(opt) : next.add(opt)
      return { ...prev, [filterId]: next }
    })
  }

  return (
    <div className={v2.sidebar}>
      {/* Header */}
      <div className={v2.sidebarHeader}>
        <span className={v2.sidebarTitle}>Filters</span>
        <button className={styles.rowIconBtn} onClick={onClose}>
          <MI name="close" style={{ fontSize: 20 }} />
        </button>
      </div>

      {/* Content */}
      <div className={v2.sidebarContent}>
        <div className={v2.sidebarSectionLabel}>Active Filters</div>

        {filters.map(f => (
          <div key={f.id} className={`${v2.filterCard} ${expanded === f.id ? v2.filterCardOpen : ''}`}>
            {/* Card header row */}
            <div className={v2.filterCardHeader} onClick={() => setExpanded(prev => prev === f.id ? null : f.id)}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={f.enabled}
                onChange={() => toggle(f.id)}
                onClick={e => e.stopPropagation()}
              />
              <div className={v2.filterCardBody}>
                <div className={v2.filterCardName}>{f.name}</div>
                <div className={v2.filterCardValue}>{f.value}</div>
              </div>
              <MI name="keyboard_arrow_down" style={{ fontSize: 20, color: 'var(--color-icon)', flexShrink: 0, transition: 'transform 0.2s', transform: expanded === f.id ? 'rotate(180deg)' : 'none' }} />
            </div>

            {/* Expanded options */}
            {expanded === f.id && (
              <div className={v2.filterCardOptions}>
                {f.id === 'date' ? (
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                    <div className={styles.activityDateInput} style={{ flex: 1, minWidth: 0 }}>
                      <input placeholder="From" style={{ width: '100%' }} />
                      <span className={`${styles.activityDateIcon} material-icons-outlined`}>calendar_today</span>
                    </div>
                    <div className={styles.activityDateInput} style={{ flex: 1, minWidth: 0 }}>
                      <input placeholder="To" style={{ width: '100%' }} />
                      <span className={`${styles.activityDateIcon} material-icons-outlined`}>calendar_today</span>
                    </div>
                  </div>
                ) : (
                  (FILTER_OPTIONS[f.id] ?? []).map(opt => (
                    <label key={opt} className={v2.filterOption}>
                      <input
                        type={f.id === 'billing' ? 'radio' : 'checkbox'}
                        name={f.id === 'billing' ? 'billing-filter' : undefined}
                        className={f.id === 'billing' ? styles.radio : styles.checkbox}
                        checked={selections[f.id]?.has(opt) ?? false}
                        onChange={() => f.id === 'billing'
                          ? setSelections(prev => ({ ...prev, billing: new Set([opt]) }))
                          : toggleOption(f.id, opt)
                        }
                      />
                      {opt}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        <button className={`${styles.button} ${styles.buttonTextPrimary}`} style={{ marginTop: 4 }}>
          <MI name="add" style={{ fontSize: 18 }} />
          Add Filter
        </button>
      </div>

      {/* Footer */}
      <div className={v2.sidebarFooter}>
        <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={clearAll}>
          Clear All
        </button>
        <button className={`${styles.button} ${styles.buttonDefault}`}>
          Apply Filters
        </button>
      </div>
    </div>
  )
}

/* ── Activity V2 ── */
type ActivityFilter = 'all' | 'notes' | 'history'

const ActivityContentV2: React.FC = () => {
  const [filter, setFilter] = useState<ActivityFilter>('all')

  return (
    <div className={v2.activityContainer}>
      {/* Level 3 contextual nav */}
      <nav className={v2.activityNav}>
        {(['all', 'notes', 'history'] as const).map(f => (
          <button
            key={f}
            className={`${v2.activityNavItem} ${filter === f ? v2.activityNavItemActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </nav>
      <ActivityContent filter={filter} fill />
    </div>
  )
}

/* ── Allocations V2 (inline edit) ── */
const DIV  = { borderLeft:  '1px solid var(--color-quaternary)' } as React.CSSProperties
const DIV_R = { borderRight: '1px solid var(--color-quaternary)' } as React.CSSProperties

type AllocRow = {
  projectCode: string; accountNo: string; subAccountNo: string
  budgetCode: string; budgetTier: string; glCode: string; amount: string
}

const ALLOC_DATA: AllocRow[] = [
  { projectCode: 'PRJ1001', accountNo: '127537465', subAccountNo: '127537465', budgetCode: '127537465', budgetTier: '127537465', glCode: '127537465', amount: '127537465' },
  { projectCode: 'PRJ1002', accountNo: '984312700', subAccountNo: '984312700', budgetCode: '984312700', budgetTier: '984312700', glCode: '984312700', amount: '984312700' },
  { projectCode: 'PRJ1003', accountNo: '561029843', subAccountNo: '561029843', budgetCode: '561029843', budgetTier: '561029843', glCode: '561029843', amount: '561029843' },
]

const PROJ_OPTIONS = ['PRJ1001', 'PRJ1002', 'PRJ1003']

const AllocationsContentV2: React.FC = () => {
  const [rows, setRows] = useState<AllocRow[]>(ALLOC_DATA)
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [draft, setDraft] = useState<AllocRow | null>(null)
  const [confirmingRow, setConfirmingRow] = useState<number | null>(null)
  const [projDropOpen, setProjDropOpen] = useState(false)
  const projDropRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!projDropOpen) return
    function handleClick(e: MouseEvent) {
      if (!projDropRef.current?.contains(e.target as Node)) setProjDropOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [projDropOpen])

  function startEdit(i: number) {
    setEditingRow(i)
    setDraft({ ...rows[i] })
  }

  function commitConfirm() {
    if (draft && confirmingRow !== null) {
      setRows(prev => prev.map((r, idx) => idx === confirmingRow ? draft : r))
    }
    setEditingRow(null)
    setDraft(null)
    setConfirmingRow(null)
  }

  const TEXT_FIELDS: (keyof AllocRow)[] = ['accountNo', 'subAccountNo', 'budgetCode', 'budgetTier', 'glCode', 'amount']

  return (<>
    <div className={styles.relatedPanel}>
      <div className={styles.tableActions}>
        <div />
        <button className={`${styles.button} ${styles.buttonDefault}`}>
          <MI name="add" style={{ fontSize: 18 }} />
          Add Allocation
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table} style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className={styles.thGroupRow}>
              <th className={styles.thGroup} style={DIV_R}>Code</th>
              <th className={styles.thGroup} colSpan={2} style={DIV_R}>Account</th>
              <th className={styles.thGroup} colSpan={2} style={DIV_R}>Budget</th>
              <th className={styles.thGroup} colSpan={2}>GL</th>
              <th style={{ width: 48 }} />
            </tr>
            <tr className={styles.thSubRow}>
              <th><span className={styles.thInner}>Project Code <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={DIV}><span className={styles.thInner}>Account Number <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th><span className={styles.thInner}>Sub Account Number <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={DIV}><span className={styles.thInner}>Budget Code <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th><span className={styles.thInner}>Budget Tier <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={DIV}><span className={styles.thInner}>GL Code <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th><span className={styles.thInner}>Amount <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isEditing = editingRow === i
              return (
                <tr key={i}>
                  {isEditing ? (
                    <>
                      <td style={{ position: 'relative' }}>
                        <div ref={projDropRef} className={styles.selectWrapper} style={{ maxWidth: 'none' }}>
                          <button
                            className={styles.selectField}
                            style={{ maxWidth: 'none', width: '100%', textAlign: 'left', background: 'white', cursor: 'pointer', ...(projDropOpen ? { borderColor: 'var(--color-primary)', borderWidth: 2 } : {}) }}
                            onClick={() => setProjDropOpen(o => !o)}
                          >
                            {draft!.projectCode}
                          </button>
                          <span className={`${styles.selectArrow} material-icons-outlined`} style={{ pointerEvents: 'none' }}>arrow_drop_down</span>
                          {projDropOpen && (
                            <div className={styles.addRelatedFilterDropdown} style={{ minWidth: '100%' }}>
                              {PROJ_OPTIONS.map(opt => (
                                <button
                                  key={opt}
                                  className={`${styles.addRelatedFilterItem} ${draft!.projectCode === opt ? styles.addRelatedFilterItemActive : ''}`}
                                  onClick={() => { setDraft(d => ({ ...d!, projectCode: opt })); setProjDropOpen(false) }}
                                >
                                  {opt}
                                  {draft!.projectCode === opt && <MI name="check" style={{ fontSize: 18, marginLeft: 'auto' }} />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      {TEXT_FIELDS.map(field => (
                        <td key={field}>
                          <input
                            className={styles.inputField}
                            style={{ maxWidth: 'none', width: '100%', boxSizing: 'border-box' }}
                            value={draft![field]}
                            onChange={e => setDraft(d => ({ ...d!, [field]: e.target.value }))}
                          />
                        </td>
                      ))}
                    </>
                  ) : (
                    <>
                      <td>{row.projectCode}</td>
                      <td>{row.accountNo}</td>
                      <td>{row.subAccountNo}</td>
                      <td>{row.budgetCode}</td>
                      <td>{row.budgetTier}</td>
                      <td>{row.glCode}</td>
                      <td>{row.amount}</td>
                    </>
                  )}
                  <td style={{ padding: '0 8px' }}>
                    <div className={styles.rowActions}>
                      {isEditing ? (
                        <button className={styles.rowIconBtn} onClick={() => setConfirmingRow(i)}>
                          <MI name="check" style={{ fontSize: 18 }} />
                        </button>
                      ) : (
                        <button className={styles.rowIconBtn} onClick={() => startEdit(i)}>
                          <MI name="edit" style={{ fontSize: 18 }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
    {confirmingRow !== null && (
      <ConfirmModal
        title="Save changes"
        message="Are you sure you want to save the changes to this allocation?"
        confirmLabel="Save"
        onConfirm={commitConfirm}
        onCancel={() => setConfirmingRow(null)}
      />
    )}
  </>)
}

/* ── Overview V2 ── */
type OverviewSection = 'summary' | 'billing' | 'contact'

const OverviewContentV2: React.FC = () => {
  const [section, setSection] = useState<OverviewSection>('summary')

  const NAV_ITEMS: { key: OverviewSection; label: string }[] = [
    { key: 'summary',  label: 'Summary' },
    { key: 'billing',  label: 'Billing Information' },
    { key: 'contact',  label: 'Contact Information' },
  ]

  return (
    <div className={v2.activityContainer}>
      <nav className={v2.activityNav}>
        {NAV_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            className={`${v2.activityNavItem} ${section === key ? v2.activityNavItemActive : ''}`}
            onClick={() => setSection(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarColor: '#BFC6CE transparent', scrollbarWidth: 'thin' } as React.CSSProperties}>
          {section === 'summary' && <SummaryContent />}
          {section === 'billing' && <BillingContent />}
          {section === 'contact' && (
            <div style={{ padding: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
              No contact information available.
            </div>
          )}
        </div>
        <div className={styles.overviewActionBar}>
          <button className={`${styles.button} ${styles.buttonText}`}>Cancel</button>
          <button className={`${styles.button} ${styles.buttonDefault}`}>Apply</button>
        </div>
      </div>
    </div>
  )
}

/* ── Main dashboard V2 ── */
const CimplAccountsDashboardV2: React.FC = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [activeAccount, setActiveAccount] = useState<number | null>(null)
  const [cardFilter, setCardFilter] = useState<Status | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [colsOpen, setColsOpen] = useState(false)
  const [visibleCols, setVisibleCols] = useState<Set<string>>(new Set(COLUMNS))
  const [search, setSearch] = useState('')
  const colBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!colsOpen) return
    function handle(e: MouseEvent) {
      if (colBtnRef.current && !colBtnRef.current.contains(e.target as Node)) {
        setColsOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [colsOpen])

  function toggleCol(col: string) {
    setVisibleCols(prev => {
      const next = new Set(prev)
      if (next.has(col)) next.delete(col); else next.add(col)
      return next
    })
  }

  const searchLower = search.trim().toLowerCase()
  const visibleRows = ROWS
    .filter(r => !cardFilter || r.status === cardFilter)
    .filter(r => !searchLower || Object.values(r).some(v => String(v).toLowerCase().includes(searchLower)))
  const allSelected = selected.size === visibleRows.length && visibleRows.length > 0
  const someSelected = selected.size > 0 && !allSelected

  function toggleRow(i: number) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(visibleRows.map((_, i) => i)))
  }

  function toggleCard(label: string) {
    const s = CARD_STATUS[label]
    setCardFilter(prev => prev === s ? null : s)
    setSelected(new Set())
  }

  if (activeAccount !== null) {
    return (
      <AccountDetail
        row={ROWS[activeAccount]}
        onBack={() => setActiveAccount(null)}
        overviewContent={<OverviewContentV2 />}
        allocationsContent={<AllocationsContentV2 />}
        activityContent={<ActivityContentV2 />}
      />
    )
  }

  return (
    <div className={styles.wrapper} data-nocursor="true">
      <TopBar />
      <div className={styles.body}>
        <SideNav
          tuneActive
          settingsActive={false}
          onSettingsClick={() => navigate('/upland')}
          onTuneClick={() => navigate('/upland-v2')}
          onAssignmentClick={() => navigate('/upland-v3')}
          onInsertChartClick={() => navigate('/upland-v4')}
        />
        <div className={styles.mainContent}>

          <div className={styles.titleBar}>
            <h1 className={styles.titleBarHeading}>Accounts</h1>
            <button className={`${styles.button} ${styles.buttonDefault}`}>New Account</button>
          </div>

          <div className={styles.statCards}>
            {([
              { label: 'Opened',      cls: styles.statCardOpened,      value: 250 },
              { label: 'Flagged',     cls: styles.statCardFlagged,     value: 38  },
              { label: 'Closed',      cls: styles.statCardClosed,      value: 15  },
              { label: 'Deactivated', cls: styles.statCardDeactivated, value: 74  },
            ] as const).map(({ label, cls, value }) => (
              <div
                key={label}
                className={`${styles.statCard} ${cls} ${cardFilter === CARD_STATUS[label] ? styles.statCardActive : ''}`}
                onClick={() => toggleCard(label)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.statCardLabel}>{label}</div>
                <div className={styles.statCardSub}>Last three months</div>
                <div className={styles.statCardValue}>{value}</div>
              </div>
            ))}
          </div>

          <div className={styles.panel}>
            <div className={styles.tableActions} style={{ paddingLeft: 16 }}>
              <div className={styles.tableActionsLeft}>
                {selected.size > 0 && (
                  <>
                    <span className={styles.selectedCount}>{selected.size} selected</span>
                    <div className={styles.actionsDivider} />
                  </>
                )}
                <button
                  className={`${styles.button} ${styles.buttonText}`}
                  disabled={selected.size === 0}
                  style={{ paddingLeft: 0, ...(selected.size === 0 ? { opacity: 0.38, cursor: 'default' } : {}) }}
                >
                  <MI name="arrow_drop_down" />
                  Bulk Actions
                </button>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {/* Search */}
                <div className={styles.activitySearchInput} style={{ width: 240 }}>
                  <input
                    placeholder="Search"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setSelected(new Set()) }}
                  />
                  <span className={`${styles.activitySearchIcon} material-icons-outlined`}>search</span>
                </div>
                {/* Column visibility */}
                <div ref={colBtnRef} style={{ position: 'relative' }}>
                  <button
                    className={`${styles.rowIconBtn} ${styles.rowIconBtnLg}`}
                    onClick={() => setColsOpen(o => !o)}
                  >
                    <span className={`${styles.iconBtnBox} ${colsOpen ? styles.iconBtnBoxActive : ''}`}>
                      <MI name="view_column" style={{ fontSize: 20 }} />
                    </span>
                  </button>
                  {colsOpen && (
                    <div className={v2.colDropdown}>
                      <div className={v2.colDropdownHeader}>Visible Columns</div>
                      <div className={v2.colDropdownSearch}>
                        <input
                          className={styles.inputField}
                          placeholder="Search item"
                          style={{ width: '100%', maxWidth: 'none', paddingRight: 36 }}
                        />
                        <MI name="search" style={{ fontSize: 20, color: 'var(--color-icon)', position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                      <div className={v2.colDropdownDivider} />
                      <div className={v2.colDropdownList}>
                        {COLUMNS.map(col => (
                          <label key={col} className={v2.colDropdownItem}>
                            <span className={v2.colDropdownCheckboxWrap}>
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={visibleCols.has(col)}
                                onChange={() => toggleCol(col)}
                              />
                            </span>
                            {col}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Filter */}
                <button
                  className={`${styles.rowIconBtn} ${styles.rowIconBtnLg}`}
                  onClick={() => setSidebarOpen(o => !o)}
                >
                  <span className={`${styles.iconBtnBox} ${sidebarOpen ? styles.iconBtnBoxActive : ''}`}>
                    <MI name="filter_alt" style={{ fontSize: 20 }} />
                  </span>
                </button>
                <button className={`${styles.button} ${styles.buttonText}`}>
                  <MI name="file_upload" />
                  Export
                </button>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: 40, paddingLeft: 16 }}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected }}
                        onChange={toggleAll}
                      />
                    </th>
                    {COLUMNS.filter(col => visibleCols.has(col)).map(col => (
                      <th key={col}>
                        <span className={styles.thInner}>
                          {col}
                          <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => (
                    <tr
                      key={i}
                      className={selected.has(i) ? styles.rowSelected : undefined}
                      onClick={() => setActiveAccount(ROWS.indexOf(row))}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ paddingLeft: 16 }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selected.has(i)}
                          onChange={() => toggleRow(i)}
                        />
                      </td>
                      {COLUMNS.filter(col => visibleCols.has(col)).map(col => (
                        <td key={col}>
                          {col === 'Status'
                            ? <span className={`${styles.chip} ${CHIP_CLASS[row.status]}`}>{row.status}</span>
                            : highlight(String(row[COL_KEYS[col]] ?? ''), search.trim())
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <span className={styles.paginationCount}>20,571 Accounts</span>
              <div className={styles.paginationRight}>
                <div className={styles.rowsPerPage}>
                  <span>Rows per page:</span>
                  <select className={styles.rowsSelect} defaultValue="15">
                    <option>15</option><option>25</option><option>50</option>
                  </select>
                </div>
                <div className={styles.pageControls}>
                  <button className={styles.pageNavBtn}><MI name="first_page" style={{ fontSize: 16 }} /></button>
                  <button className={styles.pageNavBtn}><MI name="chevron_left" style={{ fontSize: 16 }} /></button>
                  <span className={styles.pageLabel}>Page</span>
                  <input className={styles.pageInput} defaultValue="1000" />
                  <span className={styles.pageLabel}>of 1532</span>
                  <button className={styles.pageNavBtn}><MI name="chevron_right" style={{ fontSize: 16 }} /></button>
                  <button className={styles.pageNavBtn}><MI name="last_page" style={{ fontSize: 16 }} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {sidebarOpen && <FiltersSidebar onClose={() => setSidebarOpen(false)} />}
      </div>
    </div>
  )
}

export default CimplAccountsDashboardV2
