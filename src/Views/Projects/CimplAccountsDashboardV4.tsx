import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CimplAccountsDashboard.module.css'
import v3 from './CimplAccountsDashboardV3.module.css'
import {
  type Status, type Row,
  CHIP_CLASS, ROWS, COLUMNS, CARD_STATUS,
  MI, TopBar, SideNav, AccountDetail,
} from './CimplAccountsDashboard'

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

type ExpandableRow = Row & { subRows: Row[] }
const EXPANDABLE_INDICES = new Set([0, 2, 4, 6, 8, 10, 13])
const ROWS_V4: ExpandableRow[] = ROWS.map((row, i) => {
  if (!EXPANDABLE_INDICES.has(i)) return { ...row, subRows: [] }
  const count = i % 3 === 0 ? 2 : 3
  const subRows: Row[] = []
  for (let k = 1; subRows.length < count; k++) {
    const j = (i + k * 3) % ROWS.length
    if (j !== i) subRows.push(ROWS[j])
  }
  return { ...row, subRows }
})

/* Fixed column widths matching the Regular variant */
const CB = 56   /* checkbox column */
const W  = 176  /* data columns    */

const cellStyle = (w: number): React.CSSProperties => ({
  width: w, maxWidth: w, minWidth: w,
  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
  boxSizing: 'border-box',
})

const CimplAccountsDashboardV4: React.FC = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [selectedSubs, setSelectedSubs] = useState<Map<number, Set<number>>>(new Map())
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [activeAccount, setActiveAccount] = useState<number | null>(null)
  const [cardFilter, setCardFilter] = useState<Status | null>(null)

  const visibleRows = cardFilter
    ? ROWS_V4.filter(r => r.status === cardFilter)
    : ROWS_V4

  const allSelected = selected.size === visibleRows.length && visibleRows.length > 0
  const someSelected = selected.size > 0 && !allSelected
  const totalSubsSelected = Array.from(selectedSubs.values()).reduce((sum, s) => sum + s.size, 0)
  const totalSelected = selected.size + totalSubsSelected

  function toggleRow(i: number) {
    const isSelected = selected.has(i)
    const row = visibleRows[i]
    setSelected(prev => {
      const next = new Set(prev)
      if (isSelected) next.delete(i); else next.add(i)
      return next
    })
    if (row.subRows.length > 0) {
      setSelectedSubs(prev => {
        const next = new Map(prev)
        if (isSelected) next.delete(i)
        else next.set(i, new Set(row.subRows.map((_, j) => j)))
        return next
      })
    }
  }

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(visibleRows.map((_, i) => i)))
  }

  function toggleExpand(i: number) {
    setExpandedRow(prev => prev === i ? null : i)
  }

  function toggleSubRow(parentIdx: number, subIdx: number) {
    setSelectedSubs(prev => {
      const next = new Map(prev)
      const subs = new Set(next.get(parentIdx) ?? [])
      if (subs.has(subIdx)) subs.delete(subIdx); else subs.add(subIdx)
      next.set(parentIdx, subs)
      return next
    })
  }

  function toggleCard(label: string) {
    const s = CARD_STATUS[label]
    setCardFilter(prev => prev === s ? null : s)
    setSelected(new Set())
  }

  if (activeAccount !== null) {
    return <AccountDetail row={ROWS[activeAccount]} onBack={() => setActiveAccount(null)} />
  }

  return (
    <div className={styles.wrapper} data-nocursor="true">
      <TopBar />
      <div className={styles.body}>
        <SideNav
          insertChartActive
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
                {totalSelected > 0 && (
                  <>
                    <span className={styles.selectedCount}>{totalSelected} selected</span>
                    <div className={styles.actionsDivider} />
                  </>
                )}
                <button
                  className={`${styles.button} ${styles.buttonText}`}
                  disabled={totalSelected === 0}
                  style={{ paddingLeft: 0, ...(totalSelected === 0 ? { opacity: 0.38, cursor: 'default' } : {}) }}
                >
                  <MI name="arrow_drop_down" />
                  Bulk Actions
                </button>
              </div>
              <button className={`${styles.button} ${styles.buttonText}`}>
                <MI name="file_upload" />
                Export
              </button>
            </div>

            <div className={styles.tableWrapper} style={{ overflowX: 'scroll', overflowY: 'scroll' }}>
              <table
                className={styles.table}
                style={{ tableLayout: 'fixed', width: 'auto' }}
              >
                <thead>
                  <tr>
                    <th style={{ ...cellStyle(CB), position: 'sticky', top: 0, background: 'white', zIndex: 2, boxShadow: 'inset 0 -1px 0 var(--color-quaternary)' }}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected }}
                        onChange={toggleAll}
                      />
                    </th>
                    <th style={{ ...cellStyle(48), padding: 0, position: 'sticky', top: 0, background: 'white', zIndex: 2, boxShadow: 'inset 0 -1px 0 var(--color-quaternary)' }} />
                    {COLUMNS.map(col => (
                      <th key={col} style={{ ...cellStyle(W), position: 'sticky', top: 0, background: 'white', zIndex: 2, boxShadow: 'inset 0 -1px 0 var(--color-quaternary)' }}>
                        <span className={styles.thInner}>
                          {col}
                          <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => {
                    const isExpandable = row.subRows.length > 0
                    const isExpanded = expandedRow === i
                    const subSelected = selectedSubs.get(i) ?? new Set<number>()

                    return (
                      <React.Fragment key={i}>
                        <tr
                          className={`${isExpanded ? v3.expandedParentRow : ''} ${selected.has(i) ? styles.rowSelected : ''}`}
                          onClick={() => {
                            if (isExpandable) toggleExpand(i)
                            else setActiveAccount(ROWS.indexOf(row))
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={cellStyle(CB)} onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={selected.has(i)}
                              onChange={() => toggleRow(i)}
                            />
                          </td>
                          <td style={{ ...cellStyle(48), padding: 0 }}>
                            {isExpandable && (
                              <span
                                className={v3.chevron}
                                onClick={e => { e.stopPropagation(); toggleExpand(i) }}
                              >
                                <span className={v3.chevronBox}>
                                  <MI
                                    name={isExpanded ? 'expand_more' : 'chevron_right'}
                                    style={{ fontSize: 18, color: 'var(--color-icon)' }}
                                  />
                                </span>
                              </span>
                            )}
                          </td>
                          {COLUMNS.map(col => (
                            <td key={col} style={col === 'Account No.' ? { ...cellStyle(W), color: '#2574DB', textDecoration: 'underline', cursor: 'pointer' } : cellStyle(W)}>
                              {col === 'Status'
                                ? <span className={`${styles.chip} ${CHIP_CLASS[row.status]}`}>{row.status}</span>
                                : String(row[COL_KEYS[col]] ?? '')
                              }
                            </td>
                          ))}
                        </tr>

                        {isExpandable && isExpanded && (
                          <tr className={v3.subSectionRow}>
                            <td colSpan={14} className={v3.subSection}>
                              <table className={v3.subTable} style={{ tableLayout: 'fixed', width: 'auto' }}>
                                <thead>
                                  <tr className={v3.subHeaderRow}>
                                    <td style={{ ...cellStyle(CB), padding: 0 }} />
                                    <td style={{ ...cellStyle(48), padding: 0 }} />
                                    {COLUMNS.map(col => (
                                      <td key={col} className={v3.subHeaderCell} style={cellStyle(W)}>
                                        <span className={styles.thInner}>
                                          {col}
                                          <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} />
                                        </span>
                                      </td>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {row.subRows.map((subRow, j) => (
                                    <tr
                                      key={j}
                                      className={subSelected.has(j) ? styles.rowSelected : undefined}
                                      onClick={() => setActiveAccount(ROWS.indexOf(subRow))}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <td style={cellStyle(CB)} onClick={e => e.stopPropagation()}>
                                        <input
                                          type="checkbox"
                                          className={styles.checkbox}
                                          checked={subSelected.has(j)}
                                          onChange={() => toggleSubRow(i, j)}
                                        />
                                      </td>
                                      <td style={{ ...cellStyle(48), padding: 0 }} />
                                      {COLUMNS.map(col => (
                                        <td key={col} style={col === 'Account No.' ? { ...cellStyle(W), color: '#2574DB', textDecoration: 'underline', cursor: 'pointer' } : cellStyle(W)}>
                                          {col === 'Status'
                                            ? <span className={`${styles.chip} ${CHIP_CLASS[subRow.status]}`}>{subRow.status}</span>
                                            : String(subRow[COL_KEYS[col]] ?? '')
                                          }
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
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
      </div>
    </div>
  )
}

export default CimplAccountsDashboardV4
