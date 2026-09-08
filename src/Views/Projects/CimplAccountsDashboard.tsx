import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CimplAccountsDashboard.module.css'

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

export type Status = 'OPEN' | 'DEACTIVATED' | 'CLOSED' | 'FLAGGED'

export type Row = {
  costCenterName: string; costCenterNo: string; accountNo: string
  provider: string; accountName: string; status: Status
  accountType: string; level: string; openDate: string
  closeDate: string; paymentType: string; currency: string
}

export const CHIP_CLASS: Record<Status, string> = {
  OPEN:        styles.chipOpen,
  DEACTIVATED: styles.chipDeactivated,
  CLOSED:      styles.chipClosed,
  FLAGGED:     styles.chipFlagged,
}

export const ROWS: Row[] = [
  { costCenterName: 'Communications', costCenterNo: '105488', accountNo: '810044515191', provider: 'Zayo Canada',  accountName: '810044515191 - All Services',    status: 'OPEN',        accountType: 'Default',      level: 'Hierarchy',  openDate: '2021-02-20', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'Operations',     costCenterNo: '107321', accountNo: '810000314432', provider: 'AT&T',         accountName: '810000314432 - All Services',    status: 'DEACTIVATED', accountType: 'Default',      level: 'Hierarchy',  openDate: '2020-08-11', closeDate: '2021-03-15', paymentType: 'End User',   currency: 'USD' },
  { costCenterName: 'Finance',        costCenterNo: '203412', accountNo: '810000539272', provider: 'Bell Canada',  accountName: '810000539272 - All Services',    status: 'OPEN',        accountType: 'Default',      level: 'Hierarchy',  openDate: '2021-05-03', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'IT Services',    costCenterNo: '301122', accountNo: '810000324212', provider: 'Zayo Canada',  accountName: '810000324212 - All Services',    status: 'CLOSED',      accountType: 'Default',      level: 'Hierarchy',  openDate: '2020-11-14', closeDate: '2022-01-30', paymentType: 'End User',   currency: 'CAD' },
  { costCenterName: 'Marketing',      costCenterNo: '402001', accountNo: '810005232412', provider: 'Telus',        accountName: '810005232412 - All Services',    status: 'FLAGGED',     accountType: 'Manual/Paper', level: 'Standalone', openDate: '2021-02-20', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'Communications', costCenterNo: '105488', accountNo: '810005532321', provider: 'Rogers Communications', accountName: '810005532321 - All Services',   status: 'OPEN',        accountType: 'Default',      level: 'Hierarchy',  openDate: '2022-03-07', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'Operations',     costCenterNo: '107321', accountNo: '820031244100', provider: 'Zayo Canada',  accountName: '820031244100 - Canada West',     status: 'OPEN',        accountType: 'Default',      level: 'Hierarchy',  openDate: '2021-09-18', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'Finance',        costCenterNo: '203412', accountNo: '810000314432', provider: 'AT&T',         accountName: '810000314432 - Canada West',     status: 'CLOSED',      accountType: 'Default',      level: 'Hierarchy',  openDate: '2020-06-22', closeDate: '2021-03-15', paymentType: 'End User',   currency: 'USD' },
  { costCenterName: 'IT Services',    costCenterNo: '301122', accountNo: '810000539272', provider: 'Bell Canada',  accountName: '810000539272 - Canada West',     status: 'OPEN',        accountType: 'Default',      level: 'Standalone', openDate: '2021-07-01', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'Marketing',      costCenterNo: '402001', accountNo: '810000324212', provider: 'Telus',        accountName: '810000324212 - Canada West',     status: 'DEACTIVATED', accountType: 'Default',      level: 'Hierarchy',  openDate: '2020-04-15', closeDate: '2021-11-20', paymentType: 'End User',   currency: 'CAD' },
  { costCenterName: 'Communications', costCenterNo: '105488', accountNo: '810005232412', provider: 'Rogers Communications', accountName: '810005232412 - Canada West',    status: 'OPEN',        accountType: 'Manual/Paper', level: 'Standalone', openDate: '2022-01-10', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'Operations',     costCenterNo: '107321', accountNo: '820044812344', provider: 'Zayo Canada',  accountName: '820044812344 - Wireline',        status: 'FLAGGED',     accountType: 'Default',      level: 'Standalone', openDate: '2021-03-25', closeDate: '',           paymentType: 'Manual/Paper', currency: 'USD' },
  { costCenterName: 'Finance',        costCenterNo: '203412', accountNo: '820091223344', provider: 'AT&T',         accountName: '820091223344 - Data Services',   status: 'OPEN',        accountType: 'Default',      level: 'Hierarchy',  openDate: '2020-12-05', closeDate: '',           paymentType: 'Electronic', currency: 'USD' },
  { costCenterName: 'IT Services',    costCenterNo: '301122', accountNo: '820112334455', provider: 'Bell Canada',  accountName: '820112334455 - Fiber',           status: 'DEACTIVATED', accountType: 'Manual/Paper', level: 'Hierarchy',  openDate: '2020-09-30', closeDate: '2022-04-01', paymentType: 'End User',   currency: 'CAD' },
  { costCenterName: 'Marketing',      costCenterNo: '402001', accountNo: '820223445566', provider: 'Telus',        accountName: '820223445566 - VoIP',            status: 'OPEN',        accountType: 'Default',      level: 'Standalone', openDate: '2022-05-19', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { costCenterName: 'Communications', costCenterNo: '105488', accountNo: '820334556677', provider: 'Rogers Communications', accountName: '820334556677 - Broadband',      status: 'FLAGGED',     accountType: 'Default',      level: 'Hierarchy',  openDate: '2021-11-08', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
]

export const MI = ({ name, style }: { name: string; style?: React.CSSProperties }) => (
  <span className="material-icons-outlined" style={{ fontSize: 24, lineHeight: 1, ...style }}>{name}</span>
)

const NAV_ITEMS: { icon: string; arrow?: boolean }[] = [
  { icon: 'shopping_cart' },
  { icon: 'storefront',    arrow: true },
  { icon: 'request_quote' },
  { icon: 'insert_chart',  arrow: true },
  { icon: 'assignment',    arrow: true },
  { icon: 'event',         arrow: true },
  { icon: 'settings',      arrow: true },
]

export const COLUMNS = [
  'Cost Center Name', 'Cost Center No.', 'Account No.', 'Provider',
  'Account Name', 'Status', 'Account type', 'Level',
  'Open date', 'Close date', 'Payment type', 'Currency',
]

export const ACCOUNT_TABS = ['Overview', 'Related Accounts', 'Costs', 'Services', 'Allocations', 'Activity']

export const SideNav: React.FC<{
  settingsActive?: boolean
  tuneActive?: boolean
  assignmentActive?: boolean
  insertChartActive?: boolean
  onSettingsClick?: () => void
  onTuneClick?: () => void
  onAssignmentClick?: () => void
  onInsertChartClick?: () => void
}> = ({ settingsActive = true, tuneActive = false, assignmentActive = false, insertChartActive = false, onSettingsClick, onTuneClick, onAssignmentClick, onInsertChartClick }) => (
  <nav className={styles.sideNav}>
    {NAV_ITEMS.map(({ icon, arrow }) => (
      <div
        key={icon}
        className={`${styles.navItem} ${
          (icon === 'settings' && settingsActive) ||
          (icon === 'event' && tuneActive) ||
          (icon === 'assignment' && assignmentActive) ||
          (icon === 'insert_chart' && insertChartActive)
            ? styles.navItemActive : ''
        }`}
        onClick={
          icon === 'settings' ? onSettingsClick
          : icon === 'event' ? onTuneClick
          : icon === 'assignment' ? onAssignmentClick
          : icon === 'insert_chart' ? onInsertChartClick
          : undefined
        }
        style={
          (icon === 'settings' && onSettingsClick) ||
          (icon === 'event' && onTuneClick) ||
          (icon === 'assignment' && onAssignmentClick) ||
          (icon === 'insert_chart' && onInsertChartClick)
            ? { cursor: 'pointer' } : undefined
        }
      >
        <MI name={icon} />
        {arrow && <span className={styles.navArrow} />}
      </div>
    ))}
    <div className={styles.navItem} style={{ marginTop: 'auto' }}>
      <MI name="help_outline" />
    </div>
    <div className={styles.navBottomBar} />
  </nav>
)

export const TopBar: React.FC = () => (
  <div className={styles.topBar}>
    <div className={styles.topBarLeft}>
      <button className={styles.hamburger}>
        <MI name="menu" style={{ color: 'white' }} />
      </button>
      <span className={styles.pageTitle}>Configuration</span>
    </div>
    <div className={styles.topBarRight}>
      <button className={styles.topBarIconBtn}>
        <MI name="notifications" style={{ color: 'white' }} />
      </button>
      <div className={styles.avatar}>
        <img src="https://i.pravatar.cc/34?img=47" alt="User avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  </div>
)

export const EditModal: React.FC<{
  title: string
  fields: { label: string; defaultValue: string }[]
  onClose: () => void
}> = ({ title, fields, onClose }) => (
  <div className={styles.scrim} onClick={onClose}>
    <div className={styles.dialog} onClick={e => e.stopPropagation()}>
      <div className={styles.dialogTitle}>{title}</div>
      <div className={styles.dialogBody}>
        {fields.map(f => (
          <div key={f.label} className={styles.floatGroup}>
            <label className={styles.floatLabel}>{f.label}</label>
            <input className={styles.inputField} defaultValue={f.defaultValue} style={{ maxWidth: 'none', width: '100%' }} />
          </div>
        ))}
      </div>
      <div className={styles.dialogActions}>
        <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={onClose}>Cancel</button>
        <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={onClose}>Apply</button>
      </div>
    </div>
  </div>
)

export const ConfirmModal: React.FC<{
  onConfirm: () => void; onCancel: () => void
  title?: string; message?: string; confirmLabel?: string
}> = ({ onConfirm, onCancel, title = 'Remove item', message = 'Are you sure you want to remove this item? This action cannot be undone.', confirmLabel = 'Delete' }) => (
  <div className={styles.scrim} onClick={onCancel}>
    <div className={styles.dialog} onClick={e => e.stopPropagation()}>
      <div className={styles.dialogTitle}>{title}</div>
      <div className={styles.dialogBody}>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>{message}</p>
      </div>
      <div className={styles.dialogActions}>
        <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={onCancel}>Cancel</button>
        <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
)

const AutoTextarea: React.FC<{ label: string; defaultValue?: string }> = ({ label, defaultValue }) => {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  function resize() {
    if (ref.current) {
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }

  React.useEffect(() => {
    const t = setTimeout(resize, 350)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.floatGroup}>
      <label className={styles.floatLabel}>{label}</label>
      <textarea
        ref={ref}
        className={`${styles.inputField} ${styles.autoTextarea}`}
        defaultValue={defaultValue}
        onInput={resize}
      />
    </div>
  )
}

export const SummaryContent: React.FC = () => {
  const [visible, setVisible] = React.useState({ provider: true, responsible: true, costCenter: true })
  const [pending, setPending] = React.useState<keyof typeof visible | null>(null)
  const [editing, setEditing] = React.useState<keyof typeof visible | null>(null)
  const accountLevel = useDropdown('Subaccount')
  const accountType = useDropdown('Manual/Paper')
  const summaryCurrency = useDropdown('USD')
  useCloseDropdownsOnOutsideClick([accountLevel.ref, accountType.ref, summaryCurrency.ref], [accountLevel.setOpen, accountType.setOpen, summaryCurrency.setOpen])

  const EDIT_FIELDS = {
    provider: [
      { label: 'Provider', defaultValue: 'ATT' },
      { label: 'Contact', defaultValue: 'No contact selected.' },
    ],
    responsible: [
      { label: 'Name', defaultValue: 'Haris Marin - Wireline Rep' },
      { label: 'Email', defaultValue: 'hmartin@cimpl.com' },
      { label: 'Phone', defaultValue: '(257) 475-4043' },
      { label: 'Cell', defaultValue: '(257) 475-4043' },
      { label: 'Fax', defaultValue: '(257) 475-4043' },
    ],
    costCenter: [
      { label: 'Cost Center No.', defaultValue: '234545' },
      { label: 'Name', defaultValue: 'Market Development' },
    ],
  }

  function confirmDelete() {
    if (pending) setVisible(v => ({ ...v, [pending]: false }))
    setPending(null)
  }

  return (<>
  <div className={styles.summaryContent}>
    <div className={styles.summaryPadded}>
    {/* Meta */}
    <div className={styles.summaryMeta}>
      <div>
        <div className={styles.metaLabel}>Created by</div>
        <div className={styles.metaValue}>Aaron Almaraz</div>
      </div>
      <span className={styles.requiredNote}>* required fields</span>
    </div>

    {/* Dates */}
    <div className={styles.datesRow}>
      <div>
        <div className={styles.metaLabel}>Open Date</div>
        <div className={styles.metaValue}>2/6/2021</div>
      </div>
      <div>
        <div className={styles.metaLabel}>Close Date</div>
        <div className={styles.metaValue}>2/6/2021</div>
      </div>
    </div>

    {/* Form fields */}
    <div className={styles.formFields}>
      <div className={styles.floatGroup}>
        <label className={styles.floatLabel}>Account No*</label>
        <input className={styles.inputField} defaultValue="100000315555" />
      </div>
      <AutoTextarea label="Account Name*" defaultValue="100000315230 100000315555 - Allstream Wireline" />
      <div className={styles.floatGroup}>
        <label className={styles.floatLabel}>Account Level*</label>
        <CustomDropdown dd={accountLevel} options={['Subaccount', 'Hierarchy', 'Standalone']} />
      </div>
      <div className={styles.floatGroup}>
        <label className={styles.floatLabel}>Account Type*</label>
        <CustomDropdown dd={accountType} options={['Manual/Paper', 'Default']} />
      </div>
      <div className={`${styles.floatGroup} ${styles.narrowField}`}>
        <label className={styles.floatLabel}>Currency*</label>
        <CustomDropdown dd={summaryCurrency} options={['USD', 'CAD']} />
      </div>
    </div>{/* end formFields */}
    </div>{/* end summaryPadded */}

    {/* Provider */}
    <div className={styles.subSection}>
      <div className={styles.subSectionTitleRow}>
        <span className={styles.subSectionTitle}>Provider *</span>
        {!visible.provider && <button className={styles.addBtn} onClick={() => setVisible(v => ({ ...v, provider: true }))}><MI name="add" style={{ fontSize: 20 }} /></button>}
      </div>
      {visible.provider && (
        <div className={styles.subSectionRow}>
          <div>
            <div className={styles.rowPrimary}>ATT</div>
            <div className={styles.rowSecondary}>No contact selected.</div>
          </div>
          <div className={styles.rowActions}>
            <button className={styles.rowIconBtn} onClick={() => setPending('provider')}><MI name="delete" style={{ fontSize: 20 }} /></button>
            <button className={styles.rowIconBtn} onClick={() => setEditing('provider')}><MI name="edit" style={{ fontSize: 20 }} /></button>
          </div>
        </div>
      )}
    </div>

    {/* Account Responsible */}
    <div className={styles.subSection}>
      <div className={styles.subSectionTitleRow}>
        <span className={styles.subSectionTitle}>Account Responsible</span>
        {!visible.responsible && <button className={styles.addBtn} onClick={() => setVisible(v => ({ ...v, responsible: true }))}><MI name="add" style={{ fontSize: 20 }} /></button>}
      </div>
      {visible.responsible && (
        <div className={styles.subSectionRow}>
          <div>
            <div className={styles.rowPrimary}>Haris Marin - Wireline Rep <MI name="star" style={{ fontSize: 16, color: '#4CAF50' }} /></div>
            <div className={styles.rowSecondary}>Email: hmartin@cimpl.com</div>
            <div className={styles.rowSecondary}>Phone: (257) 475-4043</div>
            <div className={styles.rowSecondary}>Cell: (257) 475-4043</div>
            <div className={styles.rowSecondary}>Fax: (257) 475-4043</div>
          </div>
          <div className={styles.rowActions}>
            <button className={styles.rowIconBtn} onClick={() => setPending('responsible')}><MI name="delete" style={{ fontSize: 20 }} /></button>
            <button className={styles.rowIconBtn} onClick={() => setEditing('responsible')}><MI name="edit" style={{ fontSize: 20 }} /></button>
          </div>
        </div>
      )}
    </div>

    {/* Cost Center */}
    <div className={styles.subSection}>
      <div className={styles.subSectionTitleRow}>
        <span className={styles.subSectionTitle}>Cost Center</span>
        {!visible.costCenter && <button className={styles.addBtn} onClick={() => setVisible(v => ({ ...v, costCenter: true }))}><MI name="add" style={{ fontSize: 20 }} /></button>}
      </div>
      {visible.costCenter && (
        <div className={styles.subSectionRow}>
          <div>
            <div className={styles.rowPrimary}>234545</div>
            <div className={styles.rowSecondary}>Market Development</div>
          </div>
          <div className={styles.rowActions}>
            <button className={styles.rowIconBtn} onClick={() => setPending('costCenter')}><MI name="delete" style={{ fontSize: 20 }} /></button>
            <button className={styles.rowIconBtn} onClick={() => setEditing('costCenter')}><MI name="edit" style={{ fontSize: 20 }} /></button>
          </div>
        </div>
      )}
    </div>

    <div className={styles.sectionDivider} />
    <div className={styles.summaryPadded}>
    {/* Comments */}
    <textarea className={styles.commentsField} placeholder="Comments" />

    {/* Locks */}
    <div className={styles.locksSection}>
      <div className={styles.locksTitle}>Locks</div>
      <label className={styles.checkboxRow}>
        <input type="checkbox" className={styles.checkbox} />
        Prevent Manual Update
      </label>
      <label className={styles.checkboxRow}>
        <input type="checkbox" className={styles.checkbox} />
        Prevent Auto Update
      </label>
    </div>
    </div>
  </div>

  {pending && <ConfirmModal onConfirm={confirmDelete} onCancel={() => setPending(null)} />}
  {editing && (
    <EditModal
      title={editing === 'responsible' ? 'Edit Account Responsible' : editing === 'costCenter' ? 'Edit Cost Center' : 'Edit Provider'}
      fields={EDIT_FIELDS[editing]}
      onClose={() => setEditing(null)}
    />
  )}
  </>)
}

export const BillingContent: React.FC = () => {
  const [isBillable, setIsBillable] = React.useState(true)
  const [isPayable, setIsPayable] = React.useState(true)
  const [showRemittance, setShowRemittance] = React.useState(true)
  const [pendingDelete, setPendingDelete] = React.useState(false)
  const [editingRemittance, setEditingRemittance] = React.useState(false)
  const paymentDue = useDropdown('2')
  const paymentType = useDropdown('Electronic')
  useCloseDropdownsOnOutsideClick([paymentDue.ref, paymentType.ref], [paymentDue.setOpen, paymentType.setOpen])

  const REMITTANCE_FIELDS = [
    { label: 'Address', defaultValue: 'A111 - Carrefour Laval, 1366 Tchesinkut Lake Rd.' },
    { label: 'City', defaultValue: 'Armstrong' },
    { label: 'Province', defaultValue: 'British Columbia' },
    { label: 'Country', defaultValue: 'Canada' },
    { label: 'Postal Code', defaultValue: '10001' },
  ]

  return (<>
    <div className={styles.summaryContent}>
      <div className={styles.summaryPadded}>

        {/* Is Billable */}
        <div className={styles.checkboxHeaderRow}>
          <label className={styles.checkboxHeaderLeft}>
            <input type="checkbox" className={styles.checkbox} checked={isBillable} onChange={e => setIsBillable(e.target.checked)} />
            Is Billable
          </label>
          <span className={styles.requiredNote}>* required fields</span>
        </div>

        {isBillable && (
          <div className={styles.checkboxRevealContent}>
            <div>
              <div className={styles.metaLabel}>Billing Month</div>
              <div className={styles.metaValue}>Loading current month</div>
            </div>
            <div>
              <div className={styles.metaLabel}>Expected Available Day</div>
              <div className={styles.metaValue}>2nd of the month</div>
            </div>
            <div>
              <div className={styles.metaLabel}>Billing Day</div>
              <div className={styles.metaValue}>5th of the month</div>
            </div>
          </div>
        )}

        {/* Is Payable */}
        <label className={styles.checkboxHeaderLeft} style={{ marginBottom: 16 }}>
          <input type="checkbox" className={styles.checkbox} checked={isPayable} onChange={e => setIsPayable(e.target.checked)} />
          Is Payable
        </label>

        {isPayable && (
          <div className={styles.checkboxRevealContent}>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Payment Due*</label>
              <CustomDropdown dd={paymentDue} options={['1', '2', '3']} />
            </div>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Payment Type</label>
              <CustomDropdown dd={paymentType} options={['Electronic', 'End User', 'Manual/Paper']} />
            </div>
            <div>
              <textarea className={styles.fullTextarea} placeholder="Late Payment Policy" />
              <div className={styles.charLimit}>Character Limit: 1000</div>
            </div>
          </div>
        )}

      </div>

      {/* Remittance Address */}
      <div className={styles.subSection}>
        <div className={styles.subSectionTitleRow}>
          <span className={styles.subSectionTitle}>Remittance Address</span>
          {!showRemittance && <button className={styles.addBtn} onClick={() => setShowRemittance(true)}><MI name="add" style={{ fontSize: 20 }} /></button>}
        </div>
        {showRemittance && (
          <div className={styles.subSectionRow}>
            <div>
              <div className={styles.rowPrimary}>A111 - Carrefour Laval, 1366 Tchesinkut Lake Rd.</div>
              <div className={styles.rowSecondary}>City: Armstrong</div>
              <div className={styles.rowSecondary}>Province: British Columbia</div>
              <div className={styles.rowSecondary}>Country: Canada</div>
              <div className={styles.rowSecondary}>Postal Code: 10001</div>
            </div>
            <div className={styles.rowActions}>
              <button className={styles.rowIconBtn} onClick={() => setPendingDelete(true)}><MI name="delete" style={{ fontSize: 20 }} /></button>
              <button className={styles.rowIconBtn} onClick={() => setEditingRemittance(true)}><MI name="edit" style={{ fontSize: 20 }} /></button>
            </div>
          </div>
        )}
      </div>
    </div>

    {pendingDelete && <ConfirmModal onConfirm={() => { setShowRemittance(false); setPendingDelete(false) }} onCancel={() => setPendingDelete(false)} />}
    {editingRemittance && <EditModal title="Edit Remittance Address" fields={REMITTANCE_FIELDS} onClose={() => setEditingRemittance(false)} />}
  </>)
}

type RelatedRow = {
  accountNo: string; provider: string; accountName: string; status: Status
  accountType: string; relation: string; openDate: string; closeDate: string
  paymentType: string; currency: string
}

const RELATED_ROWS: RelatedRow[] = [
  { accountNo: '100000315230', provider: 'All Stream',  accountName: '100000315230 - Allstream Wireline',   status: 'OPEN',    accountType: 'Default',      relation: 'Parent', openDate: '2021-02-20', closeDate: '2021-02-20', paymentType: 'Electronic', currency: 'CAD' },
  { accountNo: '3445223',      provider: 'All Stream',  accountName: '3445223 - Allstream Metro',           status: 'OPEN',    accountType: 'Default',      relation: 'Child',  openDate: '2021-02-20', closeDate: '2021-02-20', paymentType: 'Electronic', currency: 'CAD' },
  { accountNo: '810000539272', provider: 'Zayo Canada',  accountName: '810000539272 - All Services',        status: 'OPEN',    accountType: 'Default',      relation: 'Child',  openDate: '2021-02-20', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
  { accountNo: '810000324212', provider: 'Zayo Canada',  accountName: '810000324212 - Canada West',         status: 'CLOSED',  accountType: 'Default',      relation: 'Parent', openDate: '2021-02-20', closeDate: '2021-03-15', paymentType: 'End User',   currency: 'CAD' },
  { accountNo: '810005232412', provider: 'Zayo Canada',  accountName: '810005232412 - Canada West',         status: 'FLAGGED', accountType: 'Manual/Paper', relation: 'Child',  openDate: '2021-02-20', closeDate: '',           paymentType: 'Electronic', currency: 'CAD' },
]

const RELATED_COLS = ['Account No.', 'Provider', 'Account Name', 'Status', 'Account type', 'Relation', 'Open date', 'Close date', 'Payment type', 'Currency']

const MODAL_ROWS = [
  { accountNo: '91318912',     accountName: '908123128 91318912 All stream',   accountType: 'Default', relation: 'Child'  },
  { accountNo: '123412351',    accountName: '908123128 123412351 All stream',  accountType: 'Default', relation: 'Child'  },
  { accountNo: '132412341234', accountName: '132412341234 All stream',         accountType: 'Default', relation: 'Child'  },
  { accountNo: '908123128',    accountName: '908123128 All stream',            accountType: 'Default', relation: 'Child'  },
  { accountNo: '91318912',     accountName: '91318912 All stream',             accountType: 'Default', relation: 'Child'  },
  { accountNo: '91318912',     accountName: '908123128 91318912 All stream',   accountType: 'Default', relation: 'Parent' },
  { accountNo: '12342134',     accountName: '908123128 12342134 All stream',   accountType: 'Default', relation: 'Parent' },
  { accountNo: '7345334563',   accountName: '908123128 7345334563 All stream', accountType: 'Default', relation: 'Parent' },
  { accountNo: '623452',       accountName: '908123128 623452 All stream',     accountType: 'Default', relation: 'Parent' },
  { accountNo: '412341341',    accountName: '412341341 All stream',            accountType: 'Default', relation: 'Parent' },
]

const MODAL_COLS = ['All', 'Account No.', 'Account Name', 'Status', 'Account Type', 'Account Relation'] as const
type ModalCol = typeof MODAL_COLS[number]
const MODAL_COL_FIELD: Partial<Record<ModalCol, keyof typeof MODAL_ROWS[0]>> = {
  'Account No.': 'accountNo',
  'Account Name': 'accountName',
  'Account Type': 'accountType',
}

const AddRelatedModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [relations, setRelations] = React.useState<string[]>(MODAL_ROWS.map(r => r.relation))
  const [search, setSearch] = React.useState('')
  const [filterCol, setFilterCol] = React.useState<ModalCol>('All')
  const [filterOpen, setFilterOpen] = React.useState(false)
  const filterRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!filterOpen) return
    function handleClick(e: MouseEvent) {
      if (!filterRef.current?.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])
  const searchLower = search.trim().toLowerCase()
  const visibleRows = MODAL_ROWS.filter((r, i) => {
    if (!searchLower) return true
    if (filterCol === 'All') return [r.accountNo, r.accountName, 'open', r.accountType, relations[i]].some(v => v.toLowerCase().includes(searchLower))
    if (filterCol === 'Status') return 'open'.includes(searchLower)
    if (filterCol === 'Account Relation') return relations[i].toLowerCase().includes(searchLower)
    const field = MODAL_COL_FIELD[filterCol]
    if (field) return r[field].toLowerCase().includes(searchLower)
    return true
  })

  return (
    <div className={styles.scrim} onClick={onClose}>
      <div className={`${styles.dialog} ${styles.addRelatedDialog}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.addRelatedDialogHeader}>
          <span className={styles.dialogTitle} style={{ padding: 0 }}>Add related account</span>
          <button className={styles.rowIconBtn} onClick={onClose}>
            <MI name="close" style={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Search bar */}
        <div ref={filterRef} className={styles.addRelatedFilterWrap}>
          <div className={styles.addRelatedSearchBar}>
            <button
              className={styles.addRelatedFilterBtn}
              onClick={() => setFilterOpen(o => !o)}
            >
              {filterCol}
              <MI name="arrow_drop_down" style={{ fontSize: 18 }} />
            </button>
            <div className={styles.activitySearchInput} style={{ flex: 1 }}>
              <input placeholder="Search accounts" style={{ border: 'none', borderRadius: 0 }} value={search} onChange={e => setSearch(e.target.value)} />
              <span className={`${styles.activitySearchIcon} material-icons-outlined`}>search</span>
            </div>
          </div>
          {filterOpen && (
            <div className={styles.addRelatedFilterDropdown}>
              {MODAL_COLS.map(col => (
                <button
                  key={col}
                  className={`${styles.addRelatedFilterItem} ${filterCol === col ? styles.addRelatedFilterItemActive : ''}`}
                  onClick={() => { setFilterCol(col); setSearch(''); setFilterOpen(false) }}
                >
                  {col}
                  {filterCol === col && <MI name="check" style={{ fontSize: 18, marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className={styles.addRelatedTableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['Account No.', 'Account Name', 'Status', 'Account Type', 'Account Relation'].map(col => (
                  <th key={col}>
                    <span className={styles.thInner}>
                      {col}
                      <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} />
                    </span>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, i) => (
                <tr key={i}>
                  <td>{highlight(row.accountNo, search.trim())}</td>
                  <td>{highlight(row.accountName, search.trim())}</td>
                  <td><span className={`${styles.chip} ${styles.chipOpen}`}>OPEN</span></td>
                  <td>{highlight(row.accountType, search.trim())}</td>
                  <td>
                    <div className={styles.selectWrapper}>
                      <select
                        className={`${styles.selectField} ${styles.addRelatedRelationSelect}`}
                        value={relations[MODAL_ROWS.indexOf(row)]}
                        onChange={e => { const idx = MODAL_ROWS.indexOf(row); setRelations(prev => prev.map((r, j) => j === idx ? e.target.value : r)) }}
                      >
                        <option>Child</option>
                        <option>Parent</option>
                      </select>
                      <span className={`${styles.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={onClose}>
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={styles.pagination}>
          <span>2,571 items total</span>
          <div className={styles.paginationRight}>
            <div className={styles.rowsPerPage}>
              <span>Rows per page:</span>
              <select className={styles.rowsSelect} defaultValue="10">
                <option>10</option><option>25</option><option>50</option>
              </select>
            </div>
            <div className={styles.pageControls}>
              <button className={styles.pageNavBtn}><MI name="first_page" style={{ fontSize: 16 }} /></button>
              <button className={styles.pageNavBtn}><MI name="chevron_left" style={{ fontSize: 16 }} /></button>
              <span className={styles.pageLabel}>Page</span>
              <input className={styles.pageInput} defaultValue="1000" />
              <span className={styles.pageLabel}>of 1050</span>
              <button className={styles.pageNavBtn}><MI name="chevron_right" style={{ fontSize: 16 }} /></button>
              <button className={styles.pageNavBtn}><MI name="last_page" style={{ fontSize: 16 }} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RelatedAccountsContent: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false)
  return (<>
  <div className={styles.relatedPanel}>
    <div className={styles.relatedActionsBar}>
      <button className={`${styles.button} ${styles.buttonDefault}`} onClick={() => setModalOpen(true)}>
        <MI name="add" style={{ fontSize: 18 }} />
        Add Related Account
      </button>
    </div>
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {RELATED_COLS.map(col => (
              <th key={col}>
                <span className={styles.thInner}>
                  {col}
                  <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} />
                </span>
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {RELATED_ROWS.map((row, i) => (
            <tr key={i}>
              <td><span className={styles.accountLink}>{row.accountNo}</span></td>
              <td>{row.provider}</td>
              <td>{row.accountName}</td>
              <td><span className={`${styles.chip} ${CHIP_CLASS[row.status]}`}>{row.status}</span></td>
              <td>{row.accountType}</td>
              <td>{row.relation}</td>
              <td>{row.openDate}</td>
              <td>{row.closeDate}</td>
              <td>{row.paymentType}</td>
              <td>{row.currency}</td>
              <td>
                <div className={styles.rowActions}>
                  <button className={styles.rowIconBtn}><MI name="edit" style={{ fontSize: 18 }} /></button>
                  <button className={styles.rowIconBtn}><MI name="delete" style={{ fontSize: 18 }} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  {modalOpen && <AddRelatedModal onClose={() => setModalOpen(false)} />}
  </>)
}

const SERVICES_ROWS = [
  { serviceId: '105488',   type: 'Toll Free',    status: 'ACTIVE', provider: 'Zayo Canada Allstream' },
  { serviceId: '1263432',  type: 'Toll Free',    status: 'ACTIVE', provider: 'Zayo Canada Allstream' },
  { serviceId: '12341235', type: 'LD 3rd Party', status: 'ACTIVE', provider: 'Zayo Canada Allstream' },
  { serviceId: '9982310',  type: 'Local',        status: 'ACTIVE', provider: 'Zayo Canada Allstream' },
  { serviceId: '4471829',  type: 'VoIP',         status: 'ACTIVE', provider: 'Zayo Canada Allstream' },
]

const SERVICES_SUBACCOUNT_ROWS = [
  { serviceId: '8823401',  type: 'Toll Free',    status: 'ACTIVE', provider: 'Allstream West' },
  { serviceId: '3310982',  type: 'Data',         status: 'ACTIVE', provider: 'Allstream West' },
  { serviceId: '7741203',  type: 'LD 3rd Party', status: 'ACTIVE', provider: 'Allstream East' },
]

const SERVICES_COLS = ['Service ID', 'Type', 'Status', 'Provider']

const ServicesContent: React.FC = () => {
  const [showSub, setShowSub] = React.useState(false)

  return (
    <div className={styles.relatedPanel}>
      <div className={styles.relatedActionsBar}>
        <label className={styles.toggleWrapper} onClick={() => setShowSub(v => !v)}>
          <div className={`${styles.toggle} ${showSub ? styles.toggleOn : ''}`}>
            <div className={styles.toggleThumb} />
          </div>
          Show subaccounts
        </label>
      </div>
      <div className={styles.tableWrapper}>
        <table className={`${styles.table} ${styles.tableCompact}`}>
          <thead>
            <tr>
              {SERVICES_COLS.map(col => (
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
            {[...SERVICES_ROWS, ...(showSub ? SERVICES_SUBACCOUNT_ROWS : [])].map((row, i) => (
              <tr key={i}>
                <td><span className={styles.accountLink}>{row.serviceId}</span></td>
                <td>{row.type}</td>
                <td><span className={`${styles.chip} ${styles.chipActive}`}>{row.status}</span></td>
                <td>{row.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export type ActivityEntry = {
  id: number; author: string; datetime: string; isHistory: boolean
  subject: string; type: string; dueDate: string; status: string; notes: string
}

export const ACTIVITY_DATA: ActivityEntry[] = [
  { id: 1, author: 'Noefal Ahmed', datetime: '08/11/2020 12:31 am', isHistory: false, subject: 'First Note',     type: 'Follow-up', dueDate: '08/30/2020', status: 'None',    notes: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.' },
  { id: 2, author: 'Noefal Ahmed', datetime: '08/09/2020 3:14 pm',  isHistory: false, subject: 'Account Review', type: 'General',   dueDate: '09/01/2020', status: 'Pending', notes: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.' },
  { id: 3, author: 'Noefal Ahmed', datetime: '08/11/2020 12:31 am', isHistory: true,  subject: 'Status Change',  type: 'System',    dueDate: '08/11/2020', status: 'Resolved', notes: 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.' },
  { id: 4, author: 'Sarah Connor', datetime: '07/28/2020 9:05 am',  isHistory: true,  subject: 'Provider Update',type: 'System',    dueDate: '07/28/2020', status: 'Resolved', notes: 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.' },
  { id: 5, author: 'Noefal Ahmed', datetime: '07/15/2020 11:47 am', isHistory: false, subject: 'Billing Query',  type: 'Follow-up', dueDate: '07/22/2020', status: 'None',    notes: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.' },
]

export const ActivityContent: React.FC<{ filter?: 'all' | 'notes' | 'history'; fill?: boolean }> = ({ filter, fill }) => {
  const [showNotes, setShowNotes] = React.useState(true)
  const [showHistory, setShowHistory] = React.useState(true)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [addingNote, setAddingNote] = React.useState(false)
  const [entries, setEntries] = React.useState(ACTIVITY_DATA)
  const [search, setSearch] = React.useState('')
  const statusFilter = useDropdown('Filter by Status')
  useCloseDropdownsOnOutsideClick([statusFilter.ref], [statusFilter.setOpen])

  const searchLower = search.trim().toLowerCase()
  const filtered = (filter
    ? entries.filter(e => filter === 'all' ? true : filter === 'notes' ? !e.isHistory : e.isHistory)
    : entries.filter(e => e.isHistory ? showHistory : showNotes)
  ).filter(e => !searchLower || [e.author, e.datetime, e.subject, e.type, e.dueDate, e.status, e.notes].some(v => v.toLowerCase().includes(searchLower)))
  const editingEntry = entries.find(e => e.id === editingId)

  function confirmDelete() {
    setEntries(prev => prev.filter(e => e.id !== deletingId))
    setDeletingId(null)
  }

  const inner = (
    <>
      {fill ? (
        /* V2: search (half-width) + Add Note in one row */
        <div className={styles.activityActionsBar}>
          <div className={styles.activitySearchInput} style={{ flex: '0 0 50%' }}>
            <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
            <span className={`${styles.activitySearchIcon} material-icons-outlined`}>search</span>
          </div>
          <button className={`${styles.button} ${styles.buttonDefault}`} onClick={() => setAddingNote(true)}>
            <MI name="add" style={{ fontSize: 20 }} />
            Add Note
          </button>
        </div>
      ) : (
        <>
          {/* Actions Bar */}
          <div className={styles.activityActionsBar}>
            <div className={styles.activityShowGroup}>
              <span className={styles.activityShowLabel}>Show:</span>
              <label className={styles.activityCheckLabel}>
                <input type="checkbox" className={styles.checkbox} checked={showNotes} onChange={e => setShowNotes(e.target.checked)} />
                Notes
              </label>
              <label className={styles.activityCheckLabel}>
                <input type="checkbox" className={styles.checkbox} checked={showHistory} onChange={e => setShowHistory(e.target.checked)} />
                History
              </label>
            </div>
            <button className={`${styles.button} ${styles.buttonDefault}`} onClick={() => setAddingNote(true)}>
              <MI name="add" style={{ fontSize: 18 }} />
              Add Note
            </button>
          </div>

          {/* Search */}
          <div className={styles.activitySearchRow}>
            <div className={styles.activitySearchInput}>
              <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
              <span className={`${styles.activitySearchIcon} material-icons-outlined`}>search</span>
            </div>
          </div>
        </>
      )}

      {/* Filters */}
      <div className={styles.activityFiltersRow}>
        <CustomDropdown dd={statusFilter} options={['Filter by Status', 'None', 'Pending', 'Resolved']} maxWidth={200} />
        <div className={styles.activityDateInput}>
          <input placeholder="From" />
          <span className={`${styles.activityDateIcon} material-icons-outlined`}>calendar_today</span>
        </div>
        <div className={styles.activityDateInput}>
          <input placeholder="To" />
          <span className={`${styles.activityDateIcon} material-icons-outlined`}>calendar_today</span>
        </div>
      </div>

      {/* Feed */}
      <div className={styles.activityFeed}>
        {filtered.map(entry => (
          <div key={entry.id} className={styles.activityCard}>
            <div className={styles.activityCardHeader}>
              <div className={styles.activityCardMeta}>
                {highlight(entry.author, search.trim())}&nbsp;&nbsp;{highlight(entry.datetime, search.trim())}
                {entry.isHistory
                  ? <span className={styles.chipHistory}>History</span>
                  : <span className={styles.chipNotes}>Notes</span>
                }
              </div>
              {!entry.isHistory && (
                <div className={styles.activityCardActions}>
                  <button className={styles.rowIconBtn} onClick={() => setDeletingId(entry.id)}>
                    <MI name="delete" style={{ fontSize: 18 }} />
                  </button>
                  <button className={styles.rowIconBtn} onClick={() => setEditingId(entry.id)}>
                    <MI name="edit" style={{ fontSize: 18 }} />
                  </button>
                </div>
              )}
            </div>
            <div className={styles.activityFieldRow}><span className={styles.activityFieldLabel}>Subject:</span><span className={styles.activityFieldValue}>{highlight(entry.subject, search.trim())}</span></div>
            <div className={styles.activityFieldRow}><span className={styles.activityFieldLabel}>Type:</span><span className={styles.activityFieldValue}>{highlight(entry.type, search.trim())}</span></div>
            <div className={styles.activityFieldRow}><span className={styles.activityFieldLabel}>Due Date:</span><span className={styles.activityFieldValue}>{highlight(entry.dueDate, search.trim())}</span></div>
            <div className={styles.activityFieldRow}><span className={styles.activityFieldLabel}>Status:</span><span className={styles.activityFieldValue}>{highlight(entry.status, search.trim())}</span></div>
            <div className={styles.activityFieldRow}><span className={styles.activityFieldLabel}>Notes:</span><span className={styles.activityFieldNotes}>{highlight(entry.notes, search.trim())}</span></div>
          </div>
        ))}
      </div>

      {addingNote && (
        <EditModal
          title="Add Note"
          fields={[
            { label: 'Subject',  defaultValue: '' },
            { label: 'Type',     defaultValue: '' },
            { label: 'Due Date', defaultValue: '' },
            { label: 'Status',   defaultValue: '' },
            { label: 'Notes',    defaultValue: '' },
          ]}
          onClose={() => setAddingNote(false)}
        />
      )}
      {editingEntry && (
        <EditModal
          title="Edit Note"
          fields={[
            { label: 'Subject',  defaultValue: editingEntry.subject  },
            { label: 'Type',     defaultValue: editingEntry.type     },
            { label: 'Due Date', defaultValue: editingEntry.dueDate  },
            { label: 'Status',   defaultValue: editingEntry.status   },
            { label: 'Notes',    defaultValue: editingEntry.notes    },
          ]}
          onClose={() => setEditingId(null)}
        />
      )}
      {deletingId !== null && (
        <ConfirmModal onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />
      )}
    </>
  )

  if (fill) {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'white', scrollbarColor: '#BFC6CE transparent', scrollbarWidth: 'thin', '--activity-px': '16px' } as React.CSSProperties}>
        {inner}
      </div>
    )
  }

  return (
    <div className={styles.activityWrap}>
      <div className={styles.activityContainer}>
        {inner}
      </div>
    </div>
  )
}

const ALLOC_ROWS = [
  { projectCode: 'PRJ1001', accountNo: '127537465', subAccountNo: '127537465', budgetCode: '127537465', budgetTier: '127537465', glCode: '127537465', amount: '127537465' },
  { projectCode: 'PRJ1002', accountNo: '984312700', subAccountNo: '984312700', budgetCode: '984312700', budgetTier: '984312700', glCode: '984312700', amount: '984312700' },
  { projectCode: 'PRJ1003', accountNo: '561029843', subAccountNo: '561029843', budgetCode: '561029843', budgetTier: '561029843', glCode: '561029843', amount: '561029843' },
]


const AllocEditModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className={styles.scrim} onClick={onClose}>
    <div className={styles.dialog} onClick={e => e.stopPropagation()}>
      <div className={styles.dialogTitle}>Edit Allocation</div>
      <div className={styles.dialogBody}>
        <div className={styles.dialogRow}>
          <div className={styles.floatGroup}>
            <label className={styles.floatLabel}>Project Code</label>
            <div className={styles.selectWrapper} style={{ maxWidth: 'none' }}>
              <select className={styles.selectField} style={{ maxWidth: 'none', width: '100%' }} defaultValue="PRJ1001">
                <option>PRJ1001</option><option>PRJ1002</option><option>PRJ1003</option>
              </select>
              <span className={`${styles.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
            </div>
          </div>
          <div className={styles.floatGroup}>
            <label className={styles.floatLabel}>Amount</label>
            <input className={styles.inputField} defaultValue="100" style={{ maxWidth: 'none', width: '100%' }} />
          </div>
        </div>
        {[
          { label: 'Account Number',     value: '—'          },
          { label: 'Sub-Account Number', value: 'Menna-mlps' },
          { label: 'Budget Code',        value: 'Content'    },
          { label: 'Budget Tier',        value: 'Content'    },
          { label: 'GL Code',            value: 'Content'    },
        ].map(f => (
          <div key={f.label} className={styles.floatGroup}>
            <label className={styles.floatLabel}>{f.label}</label>
            <input className={styles.inputField} defaultValue={f.value} style={{ maxWidth: 'none', width: '100%' }} />
          </div>
        ))}
      </div>
      <div className={styles.dialogActions}>
        <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={onClose}>Cancel</button>
        <button className={`${styles.button} ${styles.buttonTextPrimary}`} onClick={onClose}>Apply</button>
      </div>
    </div>
  </div>
)

const DIV = { borderLeft: '1px solid var(--color-quaternary)' } as React.CSSProperties
const DIV_R = { borderRight: '1px solid var(--color-quaternary)' } as React.CSSProperties

const AllocationsContent: React.FC = () => {
  const [editing, setEditing] = React.useState(false)

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
        <table className={styles.table}>
          <thead>
            {/* Group header row */}
            <tr className={styles.thGroupRow}>
              <th style={{ width: 48 }} />
              <th className={styles.thGroup} style={DIV_R}>Code</th>
              <th className={styles.thGroup} colSpan={2} style={DIV_R}>Account</th>
              <th className={styles.thGroup} colSpan={2} style={DIV_R}>Budget</th>
              <th className={styles.thGroup} colSpan={2}>GL</th>
            </tr>
            {/* Sub-column header row */}
            <tr className={styles.thSubRow}>
              <th style={{ width: 48 }} />
              <th><span className={styles.thInner}>Project Code <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={DIV}><span className={styles.thInner}>Account Number <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th><span className={styles.thInner}>Sub Account Number <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={DIV}><span className={styles.thInner}>Budget Code <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th><span className={styles.thInner}>Budget Tier <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th style={DIV}><span className={styles.thInner}>GL Code <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
              <th><span className={styles.thInner}>Amount <MI name="swap_vert" style={{ fontSize: 16, color: '#6B7786' }} /></span></th>
            </tr>
          </thead>
          <tbody>
            {ALLOC_ROWS.map((row, i) => (
              <tr key={i}>
                <td>
                  <button className={styles.rowIconBtn} onClick={() => setEditing(true)}>
                    <MI name="edit" style={{ fontSize: 18 }} />
                  </button>
                </td>
                <td>{row.projectCode}</td>
                <td>{row.accountNo}</td>
                <td>{row.subAccountNo}</td>
                <td>{row.budgetCode}</td>
                <td>{row.budgetTier}</td>
                <td>{row.glCode}</td>
                <td>{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {editing && <AllocEditModal onClose={() => setEditing(false)} />}
  </>)
}

export const COSTS_CHART_DATA = [
  { month: 'January 21',  services: 65,  costs: 82 },
  { month: 'February 21', services: 65,  costs: 84 },
  { month: 'March 21',    services: 65,  costs: 53 },
  { month: 'April 21',    services: 100, costs: 88 },
  { month: 'May 21',      services: 100, costs: 62 },
  { month: 'June 21',     services: 100, costs: 42 },
]

const COSTS_CHART_DATA_SUB = [
  { month: 'January 21',  services: 78,  costs: 95 },
  { month: 'February 21', services: 72,  costs: 96 },
  { month: 'March 21',    services: 80,  costs: 68 },
  { month: 'April 21',    services: 100, costs: 100 },
  { month: 'May 21',      services: 100, costs: 77 },
  { month: 'June 21',     services: 100, costs: 58 },
]

const COSTS_TABLE_ROWS = [
  { invoiceDate: '01/01/2021', fixedCost: 'USD$ 120.00', usageCost: 'USD$ 34.43', maintenance: 'USD$ 15.00', otherCharges: 'USD$ 0.00',  taxes: 'USD$ 8.47',  totalCharges: 'USD$ 177.90' },
  { invoiceDate: '02/01/2021', fixedCost: 'USD$ 0.00',   usageCost: 'USD$ 58.21', maintenance: 'USD$ 0.00',  otherCharges: 'USD$ 12.50', taxes: 'USD$ 4.21',  totalCharges: 'USD$ 74.92'  },
  { invoiceDate: '03/01/2021', fixedCost: 'USD$ 200.00', usageCost: 'USD$ 91.07', maintenance: 'USD$ 25.00', otherCharges: 'USD$ 0.00',  taxes: 'USD$ 19.63', totalCharges: 'USD$ 335.70' },
  { invoiceDate: '04/01/2021', fixedCost: 'USD$ 0.00',   usageCost: 'USD$ 17.88', maintenance: 'USD$ 0.00',  otherCharges: 'USD$ 5.00',  taxes: 'USD$ 1.34',  totalCharges: 'USD$ 24.22'  },
  { invoiceDate: '05/01/2021', fixedCost: 'USD$ 75.50',  usageCost: 'USD$ 43.60', maintenance: 'USD$ 10.00', otherCharges: 'USD$ 0.00',  taxes: 'USD$ 6.47',  totalCharges: 'USD$ 135.57' },
  { invoiceDate: '06/01/2021', fixedCost: 'USD$ 0.00',   usageCost: 'USD$ 102.34',maintenance: 'USD$ 0.00',  otherCharges: 'USD$ 22.00', taxes: 'USD$ 9.73',  totalCharges: 'USD$ 134.07' },
]

const COSTS_SUB_ROWS = [
  { invoiceDate: '01/01/2021', fixedCost: 'USD$ 45.00',  usageCost: 'USD$ 12.10', maintenance: 'USD$ 5.00',  otherCharges: 'USD$ 0.00',  taxes: 'USD$ 3.10',  totalCharges: 'USD$ 65.20'  },
  { invoiceDate: '02/01/2021', fixedCost: 'USD$ 0.00',   usageCost: 'USD$ 22.40', maintenance: 'USD$ 0.00',  otherCharges: 'USD$ 4.00',  taxes: 'USD$ 1.56',  totalCharges: 'USD$ 27.96'  },
]

const COSTS_COLS = ['Invoice Date', 'Fixed cost', 'Usage cost', 'Maintenance', 'Other Charges', 'Taxes', 'Total Charges']

// SVG chart constants
const SVG_H = 280
const CL = 95, CR = 20, CT = 15, CB = 55
const CH = SVG_H - CT - CB   // 210
const GRID = [0, 25, 50, 75, 100]
const LEFT_LABELS = [0, 1, 2, 3]
const BAR_W = 40, BAR_GAP = 10
const gy = (v: number) => CT + CH - (v / 100) * CH

type ChartTooltip = { x: number; y: number; text: string } | null

export const CostsChart: React.FC<{ showSub: boolean }> = ({ showSub }) => {
  const chartData = showSub ? COSTS_CHART_DATA_SUB : COSTS_CHART_DATA
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [svgW, setSvgW] = React.useState(800)
  const [tooltip, setTooltip] = React.useState<ChartTooltip>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(e => setSvgW(e[0].contentRect.width))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cw = svgW - CL - CR
  const groupW = cw / chartData.length
  const getbx = (i: number, side: 0 | 1) => {
    const cx = CL + (i + 0.5) * groupW
    return side === 0 ? cx - BAR_W - BAR_GAP / 2 : cx + BAR_GAP / 2
  }
  const divXs = Array.from({ length: chartData.length - 1 }, (_, i) => CL + (i + 1) * groupW)

  return (
    <div ref={containerRef}>
      <svg width={svgW} height={SVG_H} style={{ display: 'block', overflow: 'visible' }}>
        {/* Horizontal grid lines */}
        {GRID.map(v => (
          <line key={v} x1={CL} x2={CL + cw} y1={gy(v)} y2={gy(v)} stroke="#E0E0E0" strokeWidth="1" />
        ))}
        {/* Vertical group separators */}
        {divXs.map(x => (
          <line key={x} x1={x} x2={x} y1={CT} y2={CT + CH} stroke="#E0E0E0" strokeWidth="1" />
        ))}
        {/* Y-axis separator between the two label sets */}
        <line x1={18} x2={18} y1={CT} y2={CT + CH} stroke="#E0E0E0" strokeWidth="1" />
        {/* Chart left edge */}
        <line x1={CL} x2={CL} y1={CT} y2={CT + CH} stroke="#E0E0E0" strokeWidth="1" />
        {/* Y-axis labels — left scale (0,1,2,3) */}
        {LEFT_LABELS.map((lbl, i) => (
          <text key={lbl} x={0} y={gy(i * 25) + 5} textAnchor="start" fontSize={14} fontWeight={600} fill="#6B7786">{lbl}</text>
        ))}
        {/* Y-axis labels — right scale (0,25,50,75,100) */}
        {GRID.map(v => (
          <text key={v} x={88} y={gy(v) + 5} textAnchor="end" fontSize={14} fontWeight={600} fill="#6B7786">{v}</text>
        ))}
        {/* Bars */}
        {chartData.map((d, i) => {
          const sh = (d.services / 100) * CH
          const ch = (d.costs / 100) * CH
          const bxS = getbx(i, 0), bxC = getbx(i, 1)
          return (
            <g key={i}>
              <rect x={bxS} y={gy(d.services)} width={BAR_W} height={sh} fill="#00C8E0" style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltip({ x: bxS + BAR_W / 2, y: gy(d.services), text: `Services: ${d.services}` })}
                onMouseLeave={() => setTooltip(null)}
              />
              <rect x={bxC} y={gy(d.costs)} width={BAR_W} height={ch} fill="#162040" style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltip({ x: bxC + BAR_W / 2, y: gy(d.costs), text: `Costs: ${d.costs}` })}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          )
        })}
        {/* X-axis labels */}
        {chartData.map((d, i) => (
          <text key={i} x={CL + (i + 0.5) * groupW} y={CT + CH + 30} textAnchor="middle" fontSize={14} fontWeight={600} fill="#6B7786">{d.month}</text>
        ))}
        {/* Bottom axis line */}
        <line x1={CL} x2={CL + cw} y1={gy(0)} y2={gy(0)} stroke="#E0E0E0" strokeWidth="1" />
        {/* Tooltip */}
        {tooltip && (() => {
          const pad = 12, th = 30, tw = tooltip.text.length * 7.5 + pad * 2
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tooltip.x - tw / 2} y={tooltip.y - th - 8} width={tw} height={th} rx={6} fill="#2D3748" />
              <text x={tooltip.x} y={tooltip.y - th - 8 + th / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="white" fontFamily="'Open Sans', sans-serif">
                {tooltip.text}
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

function useDropdown(initial: string) {
  const [value, setValue] = React.useState(initial)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  return { value, setValue, open, setOpen, ref }
}

function CustomDropdown({ dd, options, maxWidth, placeholder }: {
  dd: ReturnType<typeof useDropdown>; options: string[]; maxWidth?: number; placeholder?: string
}) {
  return (
    <div ref={dd.ref} className={styles.selectWrapper} style={maxWidth ? { maxWidth } : undefined}>
      <button
        className={styles.selectField}
        style={{ ...(maxWidth ? { maxWidth, width: '100%' } : { width: '100%' }), textAlign: 'left', background: 'white', cursor: 'pointer', ...(dd.open ? { borderColor: 'var(--color-primary)', borderWidth: 2 } : {}), ...(!dd.value ? { color: 'var(--color-text-secondary)' } : {}) }}
        onClick={() => dd.setOpen(o => !o)}
      >
        {dd.value || placeholder || ''}
      </button>
      <span className={`${styles.selectArrow} material-icons-outlined`} style={{ pointerEvents: 'none' }}>arrow_drop_down</span>
      {dd.open && (
        <div className={styles.addRelatedFilterDropdown} style={{ minWidth: '100%' }}>
          {options.map(opt => (
            <button
              key={opt}
              className={`${styles.addRelatedFilterItem} ${dd.value === opt ? styles.addRelatedFilterItemActive : ''}`}
              onClick={() => { dd.setValue(opt); dd.setOpen(false) }}
            >
              {opt}
              {dd.value === opt && <MI name="check" style={{ fontSize: 18, marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function useCloseDropdownsOnOutsideClick(refs: React.RefObject<HTMLDivElement>[], setters: ((v: boolean) => void)[]) {
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      refs.forEach((ref, i) => { if (!ref.current?.contains(e.target as Node)) setters[i](false) })
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
}

const CostsContent: React.FC = () => {
  const [showSub, setShowSub] = React.useState(false)
  const currency = useDropdown('USD')
  const rangeType = useDropdown('Recent Months')
  const range = useDropdown('Last 6 Months')
  useCloseDropdownsOnOutsideClick([currency.ref, rangeType.ref, range.ref], [currency.setOpen, rangeType.setOpen, range.setOpen])

  return (
    <div className={styles.costsTab}>

      {/* Filters Row */}
      <div className={styles.costsFiltersRow}>
        <div className={styles.costsFilters}>
          <div className={styles.floatGroup} style={{ marginTop: 0 }}>
            <label className={styles.floatLabel}>Currency</label>
            <CustomDropdown dd={currency} options={['USD', 'CAD']} maxWidth={120} />
          </div>
          <div className={styles.floatGroup} style={{ marginTop: 0 }}>
            <label className={styles.floatLabel}>Range Type</label>
            <CustomDropdown dd={rangeType} options={['Recent Months', 'Custom Range']} maxWidth={200} />
          </div>
          {rangeType.value === 'Custom Range' ? (<>
            <div className={styles.floatGroup} style={{ marginTop: 0 }}>
              <label className={styles.floatLabel}>From</label>
              <div className={styles.activityDateInput}>
                <input placeholder="MM/DD/YYYY" />
                <span className={`${styles.activityDateIcon} material-icons-outlined`}>calendar_today</span>
              </div>
            </div>
            <div className={styles.floatGroup} style={{ marginTop: 0 }}>
              <label className={styles.floatLabel}>To</label>
              <div className={styles.activityDateInput}>
                <input placeholder="MM/DD/YYYY" />
                <span className={`${styles.activityDateIcon} material-icons-outlined`}>calendar_today</span>
              </div>
            </div>
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', alignSelf: 'center' }}>Range upto 18 months</span>
          </>) : (
            <div className={styles.floatGroup} style={{ marginTop: 0 }}>
              <label className={styles.floatLabel}>Range</label>
              <CustomDropdown dd={range} options={['Last 6 Months', 'Last 3 Months', 'Last 12 Months']} maxWidth={200} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className={styles.toggleWrapper} onClick={() => setShowSub(v => !v)}>
            <div className={`${styles.toggle} ${showSub ? styles.toggleOn : ''}`}>
              <div className={styles.toggleThumb} />
            </div>
            Show subaccounts
          </label>
        </div>
      </div>

      <div className={styles.costsScrollArea}>
      {/* Chart */}
      <div className={styles.costsChartPanel}>
        <div className={styles.costsChartHeader}>
          <span className={styles.subtitlePrimary}>Total Cost Vs Services</span>
          <div className={styles.costsLegend} style={{ marginRight: CR }}>
            <span className={styles.legendItem}><span className={styles.legendSwatch} style={{ background: '#00C8E0' }} />Services</span>
            <span className={styles.legendItem}><span className={styles.legendSwatch} style={{ background: '#162040' }} />Costs</span>
          </div>
        </div>
        <CostsChart showSub={showSub} />
      </div>

      {/* Table */}
      <div className={styles.costsTablePanel}>
        <div className={styles.tableActions}>
          <div />
          <button className={`${styles.button} ${styles.buttonText}`}>
            <MI name="file_upload" />
            Export
          </button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {COSTS_COLS.map(col => (
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
              {COSTS_TABLE_ROWS.map((row, i) => (
                <tr key={i}>
                  <td>{row.invoiceDate}</td>
                  <td>{row.fixedCost}</td>
                  <td>{row.usageCost}</td>
                  <td>{row.maintenance}</td>
                  <td>{row.otherCharges}</td>
                  <td>{row.taxes}</td>
                  <td>{row.totalCharges}</td>
                </tr>
              ))}
              {showSub && COSTS_SUB_ROWS.map((row, i) => (
                <tr key={`sub-${i}`}>
                  <td>{row.invoiceDate}</td>
                  <td>{row.fixedCost}</td>
                  <td>{row.usageCost}</td>
                  <td>{row.maintenance}</td>
                  <td>{row.otherCharges}</td>
                  <td>{row.taxes}</td>
                  <td>{row.totalCharges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>{/* end costsScrollArea */}

    </div>
  )
}

const OVERVIEW_SECTIONS = [
  'Summary',
  'Billing Information',
  'Contact Information',
]

export const AccountDetail: React.FC<{ row: Row; onBack: () => void; activityContent?: React.ReactNode; overviewContent?: React.ReactNode; allocationsContent?: React.ReactNode }> = ({ row, onBack, activityContent, overviewContent, allocationsContent }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)

  function toggleSection(i: number) {
    setExpanded(prev => prev === i ? null : i)
  }

  return (
    <div className={styles.wrapper} data-nocursor="true">
      <TopBar />
      <div className={styles.body}>
        <SideNav />
        <div className={styles.mainContent}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarLeft}>
              <button className={styles.backBtn} onClick={onBack}>
                <MI name="arrow_back" style={{ color: '#6B7786' }} />
              </button>
              <h1 className={styles.titleBarHeading}>{row.accountName}</h1>
              <span className={`${styles.chip} ${CHIP_CLASS[row.status]}`} style={{ marginLeft: 12 }}>{row.status}</span>
            </div>
            <button className={`${styles.button} ${styles.buttonOutlined}`}>
              <MI name="arrow_drop_down" style={{ color: 'var(--color-primary)', fontSize: 20 }} />
              Actions
            </button>
          </div>
          <div className={styles.tabsBar}>
            {ACCOUNT_TABS.map((tab, i) => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className={styles.tabContent}>
            {activeTab === 0 && (overviewContent ?? (
              <div className={styles.overviewContainer}>
                <div className={styles.accordionsArea}>
                  {OVERVIEW_SECTIONS.map((section, i) => (
                    <div key={section} className={styles.accordionCard}>
                      <div className={styles.accordionHeader} onClick={() => toggleSection(i)}>
                        <span className={`${styles.accordionArrow} ${expanded === i ? styles.accordionArrowOpen : ''}`}>
                          <MI name="chevron_right" style={{ fontSize: 20 }} />
                        </span>
                        <span className={styles.accordionTitle}>{section}</span>
                      </div>
                      <div className={`${styles.accordionBody} ${expanded === i ? styles.accordionBodyOpen : ''}`}>
                        <div className={styles.accordionBodyInner}>
                          {i === 0 && <SummaryContent />}
                          {i === 1 && <BillingContent />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.overviewActionBar}>
                  <button className={`${styles.button} ${styles.buttonText}`}>Cancel</button>
                  <button className={`${styles.button} ${styles.buttonDefault}`}>Apply</button>
                </div>
              </div>
            ))}
            {activeTab === 1 && <RelatedAccountsContent />}
            {activeTab === 2 && <CostsContent />}
            {activeTab === 3 && <ServicesContent />}
            {activeTab === 4 && (allocationsContent ?? <AllocationsContent />)}
            {activeTab === 5 && (activityContent ?? <ActivityContent />)}
          </div>
        </div>
      </div>
    </div>
  )
}

const FiltersPanel: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [billingAccount, setBillingAccount] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const activeFilters: string[] = [
    status ? `Status: ${status}` : '',
    billingAccount ? `Billing Account: ${billingAccount}` : '',
    dateFrom || dateTo ? `Date Opened: ${dateFrom || '…'} – ${dateTo || '…'}` : '',
  ].filter(Boolean)

  return (
    <div className={styles.filtersPanel}>
      <div className={styles.filtersBar} onClick={() => setOpen(v => !v)}>
        <MI
          name="keyboard_arrow_down"
          style={{ color: '#6B7786', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
        />
        <MI name="filter_alt" style={{ color: '#6B7786' }} />
        <span>Filters</span>
        {activeFilters.length > 0 && (
          <span className={styles.filtersActiveBadge}>{activeFilters.length}</span>
        )}
      </div>

      {open && (
        <div className={styles.filtersContent}>
          <div className={styles.filtersGrid}>
            {/* Status */}
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Status</label>
              <div className={styles.selectWrapper}>
                <select className={styles.selectField} value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="">Any</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="New">New</option>
                </select>
                <span className={`${styles.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
              </div>
            </div>

            {/* Is Billing Account */}
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Is Billing Account</label>
              <div className={styles.selectWrapper}>
                <select className={styles.selectField} value={billingAccount} onChange={e => setBillingAccount(e.target.value)}>
                  <option value="">Any</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <span className={`${styles.selectArrow} material-icons-outlined`}>arrow_drop_down</span>
              </div>
            </div>

            {/* Date Opened */}
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Date Opened</label>
              <div className={styles.filterDateRange}>
                <input type="date" className={styles.inputField} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                <span className={styles.filterDateSep}>–</span>
                <input type="date" className={styles.inputField} value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
            </div>
          </div>

          <button className={`${styles.button} ${styles.buttonTextPrimary}`} style={{ marginTop: 4 }}>
            <MI name="add" style={{ fontSize: 18 }} />
            Add Filter
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Circular Chip ── */
function CircularChip({ index, state }: { index: number; state: 'active' | 'done' | 'inactive' }) {
  return (
    <div className={`${styles.newAccCircle} ${state === 'active' ? styles.newAccCircleActive : state === 'done' ? styles.newAccCircleDone : ''}`}>
      {state === 'done' ? <MI name="check" style={{ fontSize: 14 }} /> : index + 1}
    </div>
  )
}

/* ── New Account Flow ── */
const NEW_ACC_STEPS = ['Summary', 'Billing Information', 'Additional Information']

const NewAccountFlow: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [step, setStep] = React.useState(0)

  // Step 1 dropdowns
  const accountLevel = useDropdown('')
  const accountType = useDropdown('')
  const currency = useDropdown('')
  useCloseDropdownsOnOutsideClick(
    [accountLevel.ref, accountType.ref, currency.ref],
    [accountLevel.setOpen, accountType.setOpen, currency.setOpen]
  )

  // Step 2 dropdowns
  const [isBillable, setIsBillable] = React.useState(false)
  const [isPayable, setIsPayable] = React.useState(false)
  const paymentDue = useDropdown('')
  const paymentType = useDropdown('')
  useCloseDropdownsOnOutsideClick(
    [paymentDue.ref, paymentType.ref],
    [paymentDue.setOpen, paymentType.setOpen]
  )

  function renderStep() {
    if (step === 0) return (
      <div className={styles.summaryContent}>
        <div className={styles.summaryPadded}>
          <div className={styles.formFields}>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Account Number*</label>
              <input className={styles.inputField} placeholder=" " />
            </div>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Account Name*</label>
              <input className={styles.inputField} placeholder=" " />
            </div>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Account Level*</label>
              <CustomDropdown dd={accountLevel} options={['Subaccount', 'Hierarchy', 'Standalone']} placeholder="Account Level*" />
            </div>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Account Type*</label>
              <CustomDropdown dd={accountType} options={['Manual/Paper', 'Default']} placeholder="Account Type*" />
            </div>
            <div className={`${styles.floatGroup} ${styles.narrowField}`}>
              <label className={styles.floatLabel}>Currency*</label>
              <CustomDropdown dd={currency} options={['USD', 'CAD']} placeholder="Currency*" />
            </div>
          </div>
        </div>
        <div className={styles.subSection}>
          <div className={styles.subSectionTitleRow}>
            <span className={styles.subSectionTitle}>Provider *</span>
            <button className={styles.addBtn}><MI name="add" style={{ fontSize: 20 }} /></button>
          </div>
        </div>
        <div className={styles.subSection}>
          <div className={styles.subSectionTitleRow}>
            <span className={styles.subSectionTitle}>Account Responsible</span>
            <button className={styles.addBtn}><MI name="add" style={{ fontSize: 20 }} /></button>
          </div>
        </div>
        <div className={styles.subSection}>
          <div className={styles.subSectionTitleRow}>
            <span className={styles.subSectionTitle}>Cost Center</span>
            <button className={styles.addBtn}><MI name="add" style={{ fontSize: 20 }} /></button>
          </div>
        </div>
        <div className={styles.sectionDivider} />
        <div className={styles.summaryPadded}>
          <textarea className={styles.commentsField} placeholder="Comments" />
          <div className={styles.locksSection}>
            <div className={styles.locksTitle}>Locks</div>
            <label className={styles.checkboxRow}>
              <input type="checkbox" className={styles.checkbox} />
              Prevent Manual Update
            </label>
            <label className={styles.checkboxRow}>
              <input type="checkbox" className={styles.checkbox} />
              Prevent Auto Update
            </label>
          </div>
        </div>
      </div>
    )

    if (step === 1) return (
      <div className={styles.summaryContent}>
        <div className={styles.summaryPadded}>
          <div className={styles.checkboxHeaderRow}>
            <label className={styles.checkboxHeaderLeft}>
              <input type="checkbox" className={styles.checkbox} checked={isBillable} onChange={e => setIsBillable(e.target.checked)} />
              Is Billable
            </label>
          </div>
          {isBillable && (
            <div className={styles.checkboxRevealContent}>
              <div className={styles.floatGroup}>
                <label className={styles.floatLabel}>Billing Month</label>
                <input className={styles.inputField} placeholder=" " />
              </div>
              <div className={styles.floatGroup}>
                <label className={styles.floatLabel}>Expected Available Day</label>
                <input className={styles.inputField} placeholder=" " />
              </div>
              <div className={styles.floatGroup}>
                <label className={styles.floatLabel}>Billing Day</label>
                <input className={styles.inputField} placeholder=" " />
              </div>
            </div>
          )}
          <label className={styles.checkboxHeaderLeft} style={{ marginBottom: 16 }}>
            <input type="checkbox" className={styles.checkbox} checked={isPayable} onChange={e => setIsPayable(e.target.checked)} />
            Is Payable
          </label>
          {isPayable && (
            <div className={styles.checkboxRevealContent}>
              <div className={styles.floatGroup}>
                <label className={styles.floatLabel}>Payment Due*</label>
                <CustomDropdown dd={paymentDue} options={['1', '2', '3']} placeholder="Payment Due*" />
              </div>
              <div className={styles.floatGroup}>
                <label className={styles.floatLabel}>Payment Type</label>
                <CustomDropdown dd={paymentType} options={['Electronic', 'End User', 'Manual/Paper']} placeholder="Payment Type" />
              </div>
              <div>
                <textarea className={styles.fullTextarea} placeholder="Late Payment Policy" />
                <div className={styles.charLimit}>Character Limit: 1000</div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.subSection}>
          <div className={styles.subSectionTitleRow}>
            <span className={styles.subSectionTitle}>Remittance Address</span>
            <button className={styles.addBtn}><MI name="add" style={{ fontSize: 20 }} /></button>
          </div>
        </div>
      </div>
    )

    return (
      <div className={styles.summaryContent}>
        <div className={styles.summaryPadded}>
          <div className={styles.formFields}>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>Custom Reference No.</label>
              <input className={styles.inputField} placeholder=" " />
            </div>
            <div className={styles.floatGroup}>
              <label className={styles.floatLabel}>External Reference</label>
              <input className={styles.inputField} placeholder=" " />
            </div>
            <div>
              <textarea className={styles.commentsField} placeholder="Notes" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper} data-nocursor="true">
      <TopBar />
      <div className={styles.body}>
        <SideNav />
        <div className={styles.mainContent}>
          <div className={styles.titleBar}>
            <div className={styles.titleBarLeft}>
              <button className={styles.backBtn} onClick={onCancel}>
                <MI name="arrow_back" style={{ color: '#6B7786' }} />
              </button>
              <h1 className={styles.titleBarHeading}>New Account</h1>
            </div>
          </div>
          <div className={styles.tabContent}>
            <div className={styles.newAccContainer}>
              <div className={styles.newAccStepper}>
                {NEW_ACC_STEPS.map((label, i) => (
                  <React.Fragment key={i}>
                    <div className={styles.newAccStep}>
                      <CircularChip index={i} state={i === step ? 'active' : i < step ? 'done' : 'inactive'} />
                      <span className={`${styles.newAccStepLabel} ${i === step ? styles.newAccStepLabelActive : ''}`}>{label}</span>
                    </div>
                    {i < NEW_ACC_STEPS.length - 1 && <div className={styles.newAccStepLine} />}
                  </React.Fragment>
                ))}
              </div>
              <div className={styles.newAccContent}>
                {renderStep()}
              </div>
              <div className={styles.newAccActions}>
                <button className={`${styles.button} ${styles.buttonText}`} onClick={onCancel}>Cancel</button>
                <div style={{ display: 'flex', gap: 8 }}>
                  {step > 0 && (
                    <button className={`${styles.button} ${styles.buttonOutlined}`} onClick={() => setStep(s => s - 1)}>Back</button>
                  )}
                  {step < NEW_ACC_STEPS.length - 1
                    ? <button className={`${styles.button} ${styles.buttonDefault}`} onClick={() => setStep(s => s + 1)}>Next</button>
                    : <button className={`${styles.button} ${styles.buttonDefault}`} onClick={onCancel}>Submit</button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CARD_STATUS: Record<string, Status> = {
  Opened: 'OPEN', Flagged: 'FLAGGED', Closed: 'CLOSED', Deactivated: 'DEACTIVATED',
}

const CimplAccountsDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [activeAccount, setActiveAccount] = useState<number | null>(null)
  const [cardFilter, setCardFilter] = useState<Status | null>(null)
  const [newAccount, setNewAccount] = useState(false)

  const visibleRows = cardFilter ? ROWS.filter(r => r.status === cardFilter) : ROWS
  const allSelected = selected.size === visibleRows.length && visibleRows.length > 0
  const someSelected = selected.size > 0 && !allSelected

  function toggleRow(i: number) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
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

  if (newAccount) {
    return <NewAccountFlow onCancel={() => setNewAccount(false)} />
  }

  if (activeAccount !== null) {
    return <AccountDetail row={ROWS[activeAccount]} onBack={() => setActiveAccount(null)} />
  }

  return (
    <div className={styles.wrapper} data-nocursor="true">
      <TopBar />
      <div className={styles.body}>
        <SideNav onTuneClick={() => navigate('/upland-v2')} onAssignmentClick={() => navigate('/upland-v3')} onInsertChartClick={() => navigate('/upland-v4')} />
        <div className={styles.mainContent}>

          <div className={styles.titleBar}>
            <h1 className={styles.titleBarHeading}>Accounts</h1>
            <button className={`${styles.button} ${styles.buttonDefault}`} onClick={() => setNewAccount(true)}>New Account</button>
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

          <FiltersPanel />

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
              <button className={`${styles.button} ${styles.buttonText}`}>
                <MI name="file_upload" />
                Export
              </button>
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
                    {COLUMNS.map(col => (
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
                      <td>{row.costCenterName}</td>
                      <td>{row.costCenterNo}</td>
                      <td>{row.accountNo}</td>
                      <td>{row.provider}</td>
                      <td>{row.accountName}</td>
                      <td>
                        <span className={`${styles.chip} ${CHIP_CLASS[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.accountType}</td>
                      <td>{row.level}</td>
                      <td>{row.openDate}</td>
                      <td>{row.closeDate}</td>
                      <td>{row.paymentType}</td>
                      <td>{row.currency}</td>
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
                    <option>15</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
                <div className={styles.pageControls}>
                  <button className={styles.pageNavBtn}>
                    <MI name="first_page" style={{ fontSize: 16 }} />
                  </button>
                  <button className={styles.pageNavBtn}>
                    <MI name="chevron_left" style={{ fontSize: 16 }} />
                  </button>
                  <span className={styles.pageLabel}>Page</span>
                  <input className={styles.pageInput} defaultValue="1000" />
                  <span className={styles.pageLabel}>of 1532</span>
                  <button className={styles.pageNavBtn}>
                    <MI name="chevron_right" style={{ fontSize: 16 }} />
                  </button>
                  <button className={styles.pageNavBtn}>
                    <MI name="last_page" style={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CimplAccountsDashboard
