import { useMemo, useRef, useState } from 'react'
import { buildReceiptDateBlock } from '../../../lib/date'
import { ReceiptCanvas } from '../components/ReceiptCanvas'
import { generateReceiptContent } from '../services/generateReceiptContent'
import type { ReceiptAlmanac } from '../types/receipt'
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord'
import './receipt-almanac-mobile.css'

const MAX_CHARS = 300
const GENERATION_DELAY_MS = 900
const APP_TIMEZONE = 'Asia/Shanghai'

type GeneratedReceiptEntry = {
  dateIso: string
  draft: string
  generatedAt: string
  receipt: ReceiptAlmanac
}

type PanelView = 'input' | 'receipt'
type EntryStatus = 'empty' | 'draft' | 'generated'

function getNowInTimezone(timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(new Date())
  const year = parts.find((part) => part.type === 'year')?.value ?? '2026'
  const month = parts.find((part) => part.type === 'month')?.value ?? '01'
  const day = parts.find((part) => part.type === 'day')?.value ?? '01'

  return new Date(`${year}-${month}-${day}T12:00:00`)
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function getEntryStatus(draft: string, generatedEntry?: GeneratedReceiptEntry): EntryStatus {
  const normalizedDraft = draft.trim()

  if (!normalizedDraft) {
    return 'empty'
  }

  if (generatedEntry && generatedEntry.draft === normalizedDraft) {
    return 'generated'
  }

  return 'draft'
}

function getStatusCopy(status: EntryStatus) {
  if (status === 'generated') {
    return {
      label: 'generated',
      message: 'RECEIPT READY · 左滑查看',
    }
  }

  if (status === 'draft') {
    return {
      label: 'draft',
      message: 'DRAFT READY · 已保存输入，尚未生成小票',
    }
  }

  return {
    label: 'empty',
    message: 'EMPTY · 该日期还没有内容',
  }
}

function getGenerateLabel(status: EntryStatus) {
  return status === 'generated' ? '更新今日小票' : '生成今日小票'
}

function scrollToPanel(container: HTMLDivElement | null, panel: PanelView) {
  if (!container) {
    return
  }

  const nextLeft = panel === 'receipt' ? container.clientWidth : 0
  container.scrollTo({ left: nextLeft, behavior: 'smooth' })
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 24">
      <path
        d="M2 12h40m-9-9 9 9-9 9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ReceiptGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path
        d="M9 4.5h14v23l-3-2-4 2-4-2-3 2Zm3.5 7h7m-7 4h7m-7 4h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
      <path d="M5 8V4h4M23 4h4v4M5 24v4h4M23 28h4v-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function StatusDot({ active }: { active: boolean }) {
  return <span className={`ra-pagination__dot ${active ? 'is-active' : ''}`} aria-hidden="true" />
}

function ReceiptPreviewPanel({
  entry,
  selectedDate,
  draft,
}: {
  entry?: GeneratedReceiptEntry
  selectedDate: string
  draft: string
}) {
  const normalizedDraft = draft.trim()

  if (!entry || entry.draft !== normalizedDraft) {
    return (
      <section className="ra-receipt-preview ra-receipt-preview--empty">
        <div className="ra-receipt-preview__empty-card">
          <p className="ra-kicker">RECEIPT PREVIEW</p>
          <h2>当前还没有可预览的小票</h2>
          <p>{normalizedDraft ? '先生成当前日期内容，再左滑查看正式小票。' : '这个日期还是空白，写下内容后即可生成小票。'}</p>
          <span>{selectedDate}</span>
        </div>
      </section>
    )
  }

  const receipt = normalizeReceiptRecord(entry.receipt, {
    userInput: entry.draft,
    date: entry.dateIso,
  })

  return (
    <section className="ra-receipt-preview">
      <div className="ra-receipt-preview__header">
        <div>
          <p className="ra-kicker">RECEIPT PREVIEW</p>
          <h2>当前日期小票</h2>
        </div>
        <span>{entry.generatedAt.slice(0, 10)}</span>
      </div>

      <div className="ra-receipt-preview__canvas">
        <ReceiptCanvas receipt={receipt} mode="preview" />
      </div>
    </section>
  )
}

function GeneratingOverlay() {
  return (
    <div className="ra-overlay" role="status" aria-live="polite">
      <div className="ra-overlay__panel">
        <p className="ra-kicker">GENERATING</p>
        <h2>正在整理并生成小票</h2>
        <p>请稍候，当前日期的小票内容正在写入预览页。</p>
      </div>
    </div>
  )
}

export function ReceiptAlmanacMobileApp() {
  const todayIso = useMemo(() => formatIsoDate(getNowInTimezone(APP_TIMEZONE)), [])
  const [selectedDate, setSelectedDate] = useState(todayIso)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [generatedMap, setGeneratedMap] = useState<Record<string, GeneratedReceiptEntry>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [activePanel, setActivePanel] = useState<PanelView>('input')
  const panelRef = useRef<HTMLDivElement>(null)

  const draft = drafts[selectedDate] ?? ''
  const generatedEntry = generatedMap[selectedDate]
  const status = getEntryStatus(draft, generatedEntry)
  const statusCopy = getStatusCopy(status)
  const dateMeta = buildReceiptDateBlock(selectedDate)
  const isReceiptAvailable = status === 'generated'

  const handleDraftChange = (value: string) => {
    setDrafts((current) => ({
      ...current,
      [selectedDate]: value,
    }))
  }

  const handleGenerate = async () => {
    const normalizedDraft = draft.trim()
    if (!normalizedDraft || isGenerating) {
      return
    }

    setIsGenerating(true)

    try {
      const [receipt] = await Promise.all([
        generateReceiptContent({
          userInput: normalizedDraft,
          date: selectedDate,
          timezone: APP_TIMEZONE,
        }),
        wait(GENERATION_DELAY_MS),
      ])

      const nextEntry: GeneratedReceiptEntry = {
        dateIso: selectedDate,
        draft: normalizedDraft,
        generatedAt: new Date().toISOString(),
        receipt,
      }

      setGeneratedMap((current) => ({
        ...current,
        [selectedDate]: nextEntry,
      }))
      setActivePanel('receipt')
      scrollToPanel(panelRef.current, 'receipt')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="ra-app-shell">
      <div className="ra-page-frame">
        <div
          className="ra-panels"
          ref={panelRef}
          onScroll={(event) => {
            const container = event.currentTarget
            setActivePanel(container.scrollLeft > container.clientWidth / 2 ? 'receipt' : 'input')
          }}
        >
          <section className="ra-panel ra-panel--input">
            <div className="ra-screen">
              <header className="ra-hero">
                <div className="ra-hero__topline">
                  <span>RECEIPT ALMANAC</span>
                  <span className="ra-barcode-mark" aria-hidden="true">
                    ||||||||||
                  </span>
                </div>
                <div className="ra-hero__copy">
                  <p className="ra-kicker">今日黄历小票</p>
                  <h1>今日黄历小票</h1>
                  <p>记录此刻，生成你的这一天。</p>
                </div>
              </header>

              <section className="ra-date-section">
                <div className="ra-date-section__header">
                  <div>
                    <p className="ra-kicker">DATE</p>
                    <span className="ra-date-section__type">公历 / SOLAR</span>
                  </div>
                  <label className={`ra-status-pill is-${status}`}>
                    <span className="ra-status-pill__dot" />
                    {statusCopy.label}
                  </label>
                </div>

                <label className="ra-date-display">
                  <div className="ra-date-display__numbers">
                    <span>{dateMeta.year}</span>
                    <em>/</em>
                    <span>{dateMeta.month}</span>
                    <em>/</em>
                    <span>{dateMeta.day}</span>
                  </div>
                  <div className="ra-date-display__side">
                    <span className="ra-weekday-capsule">
                      <strong>{dateMeta.weekdayZh.replace('星期', '周')}</strong>
                      <small>{dateMeta.weekdayEn.slice(0, 3)}</small>
                    </span>
                    <span className="ra-date-display__chevron">⌄</span>
                  </div>
                  <input
                    aria-label="选择日期"
                    className="ra-date-display__input"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </label>

                <div className="ra-lunar-row" aria-label="农历信息">
                  <span>LUNAR</span>
                  <span>{dateMeta.ganzhi}</span>
                  <span>{dateMeta.lunar}</span>
                </div>
              </section>

              <section className="ra-input-section">
                <div className="ra-input-section__header">
                  <div>
                    <p className="ra-kicker">INPUT FOR THIS DATE</p>
                    <h2>写下这一天</h2>
                    <p>随手记录此刻的想法、感受或重要事项。</p>
                  </div>
                  <span className="ra-count">
                    {draft.length} / {MAX_CHARS}
                  </span>
                </div>

                <label className="ra-textarea-shell">
                  <textarea
                    value={draft}
                    onChange={(event) => handleDraftChange(event.target.value.slice(0, MAX_CHARS))}
                    placeholder="写下这一天。"
                    rows={8}
                  />
                </label>
              </section>

              <section className="ra-status-line" aria-label="当前日期状态">
                <span>{statusCopy.message}</span>
              </section>

              <button
                className="ra-generate-button"
                onClick={handleGenerate}
                type="button"
                disabled={isGenerating || !draft.trim()}
              >
                <span className="ra-generate-button__icon">
                  <ReceiptGlyph />
                </span>
                <span className="ra-generate-button__copy">
                  <strong>{getGenerateLabel(status)}</strong>
                  <small>GENERATE RECEIPT</small>
                </span>
                <span className="ra-generate-button__arrow">
                  <ArrowIcon />
                </span>
              </button>

              <nav className="ra-pagination" aria-label="页面切换">
                <button
                  className={`ra-pagination__item ${activePanel === 'input' ? 'is-active' : ''}`}
                  onClick={() => {
                    setActivePanel('input')
                    scrollToPanel(panelRef.current, 'input')
                  }}
                  type="button"
                >
                  INPUT
                </button>
                <StatusDot active={activePanel === 'input'} />
                <button
                  className={`ra-pagination__item ${activePanel === 'receipt' ? 'is-active' : ''}`}
                  onClick={() => {
                    if (isReceiptAvailable) {
                      setActivePanel('receipt')
                      scrollToPanel(panelRef.current, 'receipt')
                    }
                  }}
                  type="button"
                  disabled={!isReceiptAvailable}
                >
                  RECEIPT
                </button>
              </nav>
            </div>
          </section>

          <section className="ra-panel ra-panel--receipt">
            <div className="ra-screen">
              <ReceiptPreviewPanel entry={generatedEntry} selectedDate={selectedDate} draft={draft} />
            </div>
          </section>
        </div>
      </div>

      {isGenerating ? <GeneratingOverlay /> : null}
    </main>
  )
}
