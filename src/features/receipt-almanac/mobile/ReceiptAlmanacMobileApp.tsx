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
type DateOption = {
  iso: string
  monthDay: string
  weekdayZh: string
  isGenerated: boolean
}

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

function shiftDate(baseIso: string, offset: number) {
  const date = new Date(`${baseIso}T12:00:00`)
  date.setDate(date.getDate() + offset)
  return formatIsoDate(date)
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
      badge: '已记录',
      message: 'RECEIPT READY · 左滑查看',
    }
  }

  if (status === 'draft') {
    return {
      badge: '可记录',
      message: 'DRAFT · 已保存输入，尚未生成',
    }
  }

  return {
    badge: '可记录',
    message: 'EMPTY · 该日期还没有内容',
  }
}

function getGenerateLabel(status: EntryStatus) {
  return status === 'generated' ? '生成 / 更新今日小票' : '生成今日小票'
}

function scrollToPanel(container: HTMLDivElement | null, panel: PanelView) {
  if (!container) {
    return
  }

  const nextLeft = panel === 'receipt' ? container.clientWidth : 0
  container.scrollTo({ left: nextLeft, behavior: 'smooth' })
}

function buildDateOptions(
  centerIso: string,
  generatedMap: Record<string, GeneratedReceiptEntry>,
): DateOption[] {
  return [-2, -1, 0, 1, 2].map((offset) => {
    const iso = shiftDate(centerIso, offset)
    const meta = buildReceiptDateBlock(iso)

    return {
      iso,
      monthDay: `${meta.month}/${meta.day}`,
      weekdayZh: meta.weekdayZh.replace('星期', ''),
      isGenerated: Boolean(generatedMap[iso]),
    }
  })
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
        strokeWidth="1.6"
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
        strokeWidth="1.25"
      />
      <path d="M5 8V4h4M23 4h4v4M5 24v4h4M23 28h4v-4" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path
        d={direction === 'left' ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5'}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  )
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
          <p className="ra-mono-label">RECEIPT PREVIEW</p>
          <h2>当前还没有可预览的小票</h2>
          <p>{normalizedDraft ? '先生成当前日期内容，再左滑查看当前日期的小票预览。' : '先写下这一天，再生成当前日期的小票。'}</p>
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
          <p className="ra-mono-label">RECEIPT PREVIEW</p>
          <h2>当前日期小票</h2>
        </div>
        <span>{entry.dateIso}</span>
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
        <p className="ra-mono-label">GENERATING</p>
        <h2>正在生成当前日期小票</h2>
        <p>页面会在生成完成后自动切换到小票预览页。</p>
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
  const hiddenDateRef = useRef<HTMLInputElement>(null)

  const draft = drafts[selectedDate] ?? ''
  const generatedEntry = generatedMap[selectedDate]
  const status = getEntryStatus(draft, generatedEntry)
  const statusCopy = getStatusCopy(status)
  const dateMeta = buildReceiptDateBlock(selectedDate)
  const dateOptions = useMemo(
    () => buildDateOptions(selectedDate, generatedMap),
    [generatedMap, selectedDate],
  )
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
              <header className="ra-home-header">
                <div className="ra-home-header__top">
                  <span>RECEIPT ALMANAC</span>
                  <span className="ra-home-header__barcode">||||||||||||</span>
                </div>

                <div className="ra-title-box">
                  <h1>今日黄历小票</h1>
                </div>

                <div className="ra-subtitle-box">
                  <p>记录此刻，生成你的一日小票</p>
                </div>
              </header>

              <section className="ra-strip-card">
                <button className="ra-strip-card__arrow" onClick={() => setSelectedDate(shiftDate(selectedDate, -1))} type="button" aria-label="上一天">
                  <ChevronIcon direction="left" />
                </button>

                <div className="ra-strip-card__dates">
                  {dateOptions.map((option) => {
                    const isSelected = option.iso === selectedDate
                    return (
                      <button
                        key={option.iso}
                        className={`ra-mini-date ${isSelected ? 'is-selected' : ''} ${option.isGenerated ? 'is-generated' : 'is-empty'}`}
                        onClick={() => setSelectedDate(option.iso)}
                        type="button"
                      >
                        <span>{option.monthDay}</span>
                        <strong>{option.weekdayZh}</strong>
                        <i />
                      </button>
                    )
                  })}
                </div>

                <button className="ra-strip-card__arrow" onClick={() => setSelectedDate(shiftDate(selectedDate, 1))} type="button" aria-label="下一天">
                  <ChevronIcon direction="right" />
                </button>
              </section>

              <section className="ra-date-card">
                <div className="ra-date-card__top">
                  <div className="ra-date-card__labels">
                    <span className="ra-mono-label">DATE</span>
                    <span className="ra-date-card__solar">公历 / SOLAR</span>
                  </div>

                  <div className="ra-date-card__status">
                    <span className={`ra-radio-status ${status === 'generated' ? 'is-active' : ''}`}>
                      <i />
                      已记录
                    </span>
                    <span className={`ra-radio-status ${status !== 'generated' ? 'is-active' : ''}`}>
                      <i />
                      可记录
                    </span>
                  </div>
                </div>

                <button className="ra-date-card__main" onClick={() => hiddenDateRef.current?.showPicker?.()} type="button">
                  <div className="ra-date-card__digits">
                    <span>{dateMeta.year}</span>
                    <em>/</em>
                    <span>{dateMeta.month}</span>
                    <em>/</em>
                    <span>{dateMeta.day}</span>
                  </div>

                  <div className="ra-weekday-capsule">
                    <strong>{dateMeta.weekdayZh.replace('星期', '周')}</strong>
                    <small>{dateMeta.weekdayEn.slice(0, 3)}</small>
                  </div>
                </button>

                <div className="ra-date-card__bottom">
                  <span className="ra-mono-label">LUNAR</span>
                  <span>{dateMeta.ganzhi}</span>
                  <span>{dateMeta.lunar}</span>
                </div>

                <input
                  ref={hiddenDateRef}
                  aria-label="选择日期"
                  className="ra-hidden-date-input"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </section>

              <div className="ra-divider" />

              <section className="ra-input-card">
                <div className="ra-input-card__head">
                  <div>
                    <p className="ra-mono-label">INPUT FOR THIS DATE</p>
                    <h2>写下这一天</h2>
                    <p>随心记录此刻的想法、感受或重要之事。</p>
                  </div>
                  <span className="ra-input-card__count">{draft.length} / {MAX_CHARS}</span>
                </div>
              </section>

              <section className="ra-editor-card">
                <textarea
                  value={draft}
                  onChange={(event) => handleDraftChange(event.target.value.slice(0, MAX_CHARS))}
                  placeholder="写下这一天。"
                  rows={6}
                />
              </section>

              <section className="ra-status-line" aria-label="当前日期状态">
                <span className="ra-status-line__corner ra-status-line__corner--left" aria-hidden="true" />
                <p>{statusCopy.message}</p>
                <span className="ra-status-line__corner ra-status-line__corner--right" aria-hidden="true" />
              </section>

              <button className="ra-generate-button" onClick={handleGenerate} type="button" disabled={isGenerating || !draft.trim()}>
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
                <span className={`ra-pagination__dot ${activePanel === 'input' ? 'is-active' : ''}`} aria-hidden="true" />
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
