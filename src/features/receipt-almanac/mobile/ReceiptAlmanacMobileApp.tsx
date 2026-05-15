import { useMemo, useRef, useState } from 'react'
import type { Ref, RefObject } from 'react'
import { buildReceiptDateBlock } from '../../../lib/date'
import { exportNodeAsPng } from '../../../lib/exportImage'
import { ReceiptCanvas } from '../components/ReceiptCanvas'
import { generateReceiptContent } from '../services/generateReceiptContent'
import type { ReceiptAlmanac } from '../types/receipt'
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord'
import './receipt-almanac-mobile.css'

const MAX_CHARS = 300
const GENERATION_DELAY_MS = 900
const APP_TIMEZONE = 'Asia/Shanghai'

const COPY = {
  title: '\u4eca\u65e5\u9ec4\u5386\u5c0f\u7968',
  subtitle: '\u8bb0\u5f55\u6b64\u523b\uff0c\u751f\u6210\u4f60\u7684\u4e00\u65e5\u5c0f\u7968',
  archive: '\u5f80\u671f\u5c0f\u7968',
  prevDay: '\u4e0a\u4e00\u5929',
  nextDay: '\u4e0b\u4e00\u5929',
  solar: '\u516c\u5386 / SOLAR',
  lunar: '\u519c\u5386 / LUNAR',
  recorded: '\u5df2\u8bb0\u5f55',
  available: '\u53ef\u8bb0\u5f55',
  inputTitle: '\u5199\u4e0b\u8fd9\u4e00\u5929',
  inputHint: '\u968f\u5fc3\u8bb0\u5f55\u4eca\u5929\u7684\u60f3\u6cd5\u3001\u611f\u53d7\u6216\u91cd\u8981\u4e4b\u4e8b\u3002',
  placeholder: '\u5199\u4e0b\u8fd9\u4e00\u5929\u3002',
  swipeHint: '\u5de6\u6ed1\u67e5\u770b\u4eca\u65e5\u5c0f\u7968',
  generate: '\u751f\u6210\u4eca\u65e5\u5c0f\u7968',
  backToInput: '\u8fd4\u56de\u8f93\u5165\u9875',
  save: '\u4fdd\u5b58',
  previewEmptyTitle: '\u5f53\u524d\u8fd8\u6ca1\u6709\u53ef\u9884\u89c8\u7684\u5c0f\u7968',
  previewEmptyDraft:
    '\u5148\u751f\u6210\u5f53\u524d\u65e5\u671f\u5185\u5bb9\uff0c\u518d\u5de6\u6ed1\u67e5\u770b\u5f53\u65e5\u5c0f\u7968\u3002',
  previewEmptyBlank: '\u5148\u5199\u4e0b\u8fd9\u4e00\u5929\uff0c\u518d\u751f\u6210\u5f53\u524d\u65e5\u671f\u7684\u5c0f\u7968\u3002',
  overlayTitle: '\u6b63\u5728\u751f\u6210\u5f53\u65e5\u5c0f\u7968',
  overlayBody: '\u9875\u9762\u4f1a\u5728\u751f\u6210\u5b8c\u6210\u540e\u81ea\u52a8\u5207\u6362\u5230\u5c0f\u7968\u9884\u89c8\u9875\u3002',
  archiveEmptyTitle: '\u8fd8\u6ca1\u6709\u751f\u6210\u8fc7\u5f80\u671f\u5c0f\u7968\u3002',
  archiveEmptyBody: '\u5148\u5199\u4e0b\u8fd9\u4e00\u5929\uff0c\u518d\u751f\u6210\u5c5e\u4e8e\u4eca\u5929\u7684\u5c0f\u7968\u3002',
} as const

const LUNAR_DAY_MAP: Record<string, string> = {
  1: '\u521d\u4e00',
  2: '\u521d\u4e8c',
  3: '\u521d\u4e09',
  4: '\u521d\u56db',
  5: '\u521d\u4e94',
  6: '\u521d\u516d',
  7: '\u521d\u4e03',
  8: '\u521d\u516b',
  9: '\u521d\u4e5d',
  10: '\u521d\u5341',
  11: '\u5341\u4e00',
  12: '\u5341\u4e8c',
  13: '\u5341\u4e09',
  14: '\u5341\u56db',
  15: '\u5341\u4e94',
  16: '\u5341\u516d',
  17: '\u5341\u4e03',
  18: '\u5341\u516b',
  19: '\u5341\u4e5d',
  20: '\u4e8c\u5341',
  21: '\u5eff\u4e00',
  22: '\u5eff\u4e8c',
  23: '\u5eff\u4e09',
  24: '\u5eff\u56db',
  25: '\u5eff\u4e94',
  26: '\u5eff\u516d',
  27: '\u5eff\u4e03',
  28: '\u5eff\u516b',
  29: '\u5eff\u4e5d',
  30: '\u4e09\u5341',
}

type GeneratedReceiptEntry = {
  dateIso: string
  draft: string
  generatedAt: string
  receipt: ReceiptAlmanac
}

type PanelView = 'input' | 'receipt'

type DateOption = {
  iso: string
  monthDay: string
  weekdayZh: string
  isGenerated: boolean
}

type LunarSummary = {
  yearPillar: string
  monthPillar: string
  dayPillar: string
  lunarLabel: string
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

const STEMS = ['\u7532', '\u4e59', '\u4e19', '\u4e01', '\u620a', '\u5df1', '\u5e9a', '\u8f9b', '\u58ec', '\u7678']
const BRANCHES = ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5']

function parseLunarMonthNumber(monthText: string) {
  const normalized = monthText.replace('\u95f0', '').replace('\u6708', '')
  const monthMap: Record<string, number> = {
    '\u6b63': 1,
    '\u4e00': 1,
    '\u4e8c': 2,
    '\u4e09': 3,
    '\u56db': 4,
    '\u4e94': 5,
    '\u516d': 6,
    '\u4e03': 7,
    '\u516b': 8,
    '\u4e5d': 9,
    '\u5341': 10,
    '\u5341\u4e00': 11,
    '\u51ac': 11,
    '\u5341\u4e8c': 12,
    '\u814a': 12,
  }

  return monthMap[normalized] ?? 1
}

function getJulianDayNumber(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

function normalizeLunarLabel(label: string) {
  const match = label.match(/^(.+\u6708)(\d{1,2})$/)

  if (!match) {
    return label
  }

  const [, month, day] = match
  return `${month}${LUNAR_DAY_MAP[day] ?? day}`
}

function buildLunarSummary(inputDate: string, ganzhi: string, lunarLabel: string): LunarSummary {
  const date = new Date(`${inputDate}T12:00:00`)
  const formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const parts = formatter.formatToParts(date) as Array<{ type: string; value: string }>
  const yearName = parts.find((part) => part.type === 'yearName')?.value ?? ganzhi.slice(0, 2)
  const monthText = parts.find((part) => part.type === 'month')?.value ?? lunarLabel.slice(0, 2)
  const monthNumber = parseLunarMonthNumber(monthText)
  const yearStemIndex = STEMS.indexOf(yearName[0] ?? '\u4e59')
  const firstMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10
  const monthPillar = `${STEMS[(firstMonthStem + monthNumber - 1) % 10]}${BRANCHES[(2 + monthNumber - 1) % 12]}\u6708`
  const dayIndex = (getJulianDayNumber(date) + 49) % 60
  const dayPillar = `${STEMS[dayIndex % 10]}${BRANCHES[dayIndex % 12]}\u65e5`

  return {
    yearPillar: `${yearName}\u5e74`,
    monthPillar,
    dayPillar,
    lunarLabel: normalizeLunarLabel(lunarLabel),
  }
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
      weekdayZh: meta.weekdayZh.replace('\u661f\u671f', ''),
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
        strokeWidth="1.5"
      />
      <path
        d="M5 8V4h4M23 4h4v4M5 24v4h4M23 28h4v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function FeatherIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M19.5 4.5c-4.6 1.2-8.4 5-9.6 9.6L8.8 18.6l4.5-1.1c4.6-1.2 8.4-5 9.6-9.6l.6-2.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8.8 18.6 5 19.5l.9-3.8m4.8-1.2L15 18M12 10l4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
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
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M4.5 7.5h15m-13 0V18a1.5 1.5 0 0 0 1.5 1.5h8A1.5 1.5 0 0 0 18 18V7.5m-9-3h6a1.5 1.5 0 0 1 1.5 1.5v1.5h-9V6A1.5 1.5 0 0 1 9 4.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function SwipeHintIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M20 12H6m5-5-5 5 5 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="m6 6 12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ReceiptPreviewPanel({
  receipt,
  selectedDate,
  hasDraft,
  receiptRef,
}: {
  receipt?: ReceiptAlmanac
  selectedDate: string
  hasDraft: boolean
  receiptRef: RefObject<HTMLElement | null>
}) {
  if (!receipt) {
    return (
      <section className="ra-receipt-preview ra-receipt-preview--empty">
        <div className="ra-receipt-preview__empty-card">
          <p className="ra-mono-label">RECEIPT PREVIEW</p>
          <h2>{COPY.previewEmptyTitle}</h2>
          <p>{hasDraft ? COPY.previewEmptyDraft : COPY.previewEmptyBlank}</p>
          <span>{selectedDate}</span>
        </div>
      </section>
    )
  }

  return (
      <section className="ra-receipt-preview">
        <div className="ra-receipt-preview__canvas">
          <ReceiptCanvas receipt={receipt} mode="preview" ref={receiptRef as Ref<HTMLElement>} />
        </div>
      </section>
  )
}

function GeneratingOverlay() {
  return (
    <div className="ra-overlay" role="status" aria-live="polite">
      <div className="ra-overlay__panel">
        <p className="ra-mono-label">GENERATING</p>
        <h2>{COPY.overlayTitle}</h2>
        <p>{COPY.overlayBody}</p>
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
  const [, setActivePanel] = useState<PanelView>('input')
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const receiptRef = useRef<HTMLElement>(null!)

  const draft = drafts[selectedDate] ?? ''
  const generatedEntry = generatedMap[selectedDate]
  const normalizedDraft = draft.trim()
  const dateMeta = buildReceiptDateBlock(selectedDate)
  const lunarSummary = useMemo(
    () => buildLunarSummary(selectedDate, dateMeta.ganzhi, dateMeta.lunar),
    [dateMeta.ganzhi, dateMeta.lunar, selectedDate],
  )
  const dateOptions = useMemo(() => buildDateOptions(selectedDate, generatedMap), [generatedMap, selectedDate])
  const archiveEntries = useMemo(
    () =>
      Object.values(generatedMap)
        .sort((left, right) => right.dateIso.localeCompare(left.dateIso))
        .map((entry) => {
          const meta = buildReceiptDateBlock(entry.dateIso)

          return {
            ...entry,
            label: `${meta.month}/${meta.day}`,
            weekdayZh: meta.weekdayZh.replace('\u661f\u671f', '\u5468'),
          }
        }),
    [generatedMap],
  )
  const previewEntry =
    generatedEntry && generatedEntry.draft === normalizedDraft
      ? normalizeReceiptRecord(generatedEntry.receipt, {
          userInput: generatedEntry.draft,
          date: generatedEntry.dateIso,
        })
      : undefined

  const handleDraftChange = (value: string) => {
    setDrafts((current) => ({
      ...current,
      [selectedDate]: value,
    }))
  }

  const handleGenerate = async () => {
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

  const handleSaveReceipt = async () => {
    if (!previewEntry || !receiptRef.current) {
      return
    }

    await exportNodeAsPng(
      receiptRef.current,
      `${previewEntry.issueCode}-${previewEntry.serialNo}-long.png`,
    )
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
                <div className="ra-home-header__row">
                  <div className="ra-home-header__copy">
                    <div className="ra-title-box">
                      <h1>{COPY.title}</h1>
                    </div>

                    <div className="ra-subtitle-box">
                      <p>{COPY.subtitle}</p>
                    </div>
                  </div>

                  <button
                    className="ra-archive-entry"
                    onClick={() => setIsArchiveOpen(true)}
                    type="button"
                    aria-label={COPY.archive}
                  >
                    <span>{COPY.archive}</span>
                    <small>ARCHIVE</small>
                  </button>
                </div>
              </header>

              <section className="ra-strip-card">
                <button
                  className="ra-strip-card__arrow"
                  onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
                  type="button"
                  aria-label={COPY.prevDay}
                >
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

                <button
                  className="ra-strip-card__arrow"
                  onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
                  type="button"
                  aria-label={COPY.nextDay}
                >
                  <ChevronIcon direction="right" />
                </button>
              </section>

              <section className="ra-date-card">
                <div className="ra-date-card__top">
                  <div className="ra-date-card__labels">
                    <span className="ra-date-card__solar ra-date-card__solar--primary">{COPY.solar}</span>
                  </div>

                  <div className="ra-date-card__status">
                    <span className="ra-radio-status is-active">
                      <i />
                      {COPY.recorded}
                    </span>
                    <span className="ra-radio-status">
                      <i />
                      {COPY.available}
                    </span>
                  </div>
                </div>

                <div className="ra-date-card__main">
                  <div className="ra-date-card__digits">
                    <div className="ra-date-card__line">
                      <span>{dateMeta.year}</span>
                      <em> / </em>
                    </div>
                    <div className="ra-date-card__line">
                      <span>{dateMeta.month}</span>
                      <em> / </em>
                      <span>{dateMeta.day}</span>
                    </div>
                  </div>

                  <div className="ra-weekday-capsule">
                    <strong>{dateMeta.weekdayZh.replace('\u661f\u671f', '\u5468')}</strong>
                    <small>{dateMeta.weekdayEn.slice(0, 3)}</small>
                  </div>
                </div>

                <div className="ra-date-card__bottom">
                  <span className="ra-date-card__solar ra-date-card__solar--primary">{COPY.lunar}</span>
                  <div className="ra-date-card__lunar-row">
                    <span>{lunarSummary.yearPillar}</span>
                    <span>{lunarSummary.monthPillar}</span>
                    <span>{lunarSummary.dayPillar}</span>
                    <span>{lunarSummary.lunarLabel}</span>
                  </div>
                </div>
              </section>

              <div className="ra-divider" aria-hidden="true">
                <span />
              </div>

              <section className="ra-input-card">
                <div className="ra-input-card__head">
                  <div>
                    <p className="ra-mono-label">INPUT FOR THIS DAY</p>
                    <h2>{COPY.inputTitle}</h2>
                    <p>{COPY.inputHint}</p>
                  </div>
                  <span className="ra-input-card__count">
                    {draft.length} / {MAX_CHARS}
                  </span>
                </div>
              </section>

              <section className="ra-editor-card">
                <div className="ra-editor-card__field">
                  <textarea
                    value={draft}
                    onChange={(event) => handleDraftChange(event.target.value.slice(0, MAX_CHARS))}
                    placeholder={COPY.placeholder}
                    rows={6}
                  />
                  <span className="ra-editor-card__feather" aria-hidden="true">
                    <FeatherIcon />
                  </span>
                </div>
              </section>

              <section className="ra-swipe-hint" aria-label={COPY.swipeHint}>
                <span className="ra-swipe-hint__icon" aria-hidden="true">
                  <SwipeHintIcon />
                </span>
                <div className="ra-swipe-hint__copy">
                  <strong>{COPY.swipeHint}</strong>
                  <small>SWIPE LEFT TO VIEW TODAY&apos;S RECEIPT</small>
                </div>
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
                  <strong>{COPY.generate}</strong>
                </span>
                <span className="ra-generate-button__arrow">
                  <ArrowIcon />
                </span>
              </button>
            </div>
          </section>

          <section className="ra-panel ra-panel--receipt">
            <div className="ra-screen ra-screen--receipt">
              <section className="ra-receipt-toolbar">
                <button
                  className="ra-receipt-toolbar__back"
                  onClick={() => {
                    setActivePanel('input')
                    scrollToPanel(panelRef.current, 'input')
                  }}
                  type="button"
                >
                  <SwipeHintIcon />
                  <span>{COPY.backToInput}</span>
                </button>
                <div className="ra-receipt-toolbar__actions">
                  <button
                    className="ra-receipt-toolbar__save"
                    onClick={handleSaveReceipt}
                    type="button"
                    disabled={!previewEntry}
                  >
                    <span>{COPY.save}</span>
                  </button>
                  <button
                    className="ra-receipt-toolbar__archive"
                    onClick={() => setIsArchiveOpen(true)}
                    type="button"
                    aria-label={COPY.archive}
                  >
                    <ArchiveIcon />
                  </button>
                </div>
              </section>

              <ReceiptPreviewPanel
                receipt={previewEntry}
                selectedDate={selectedDate}
                hasDraft={Boolean(normalizedDraft)}
                receiptRef={receiptRef}
              />
            </div>
          </section>
        </div>

        {isArchiveOpen ? (
          <div className="ra-archive-layer" role="dialog" aria-modal="true" aria-label={COPY.archive}>
            <button
              className="ra-archive-layer__backdrop"
              onClick={() => setIsArchiveOpen(false)}
              type="button"
              aria-label={COPY.archive}
            />
            <aside className="ra-archive-drawer">
              <div className="ra-archive-drawer__head">
                <div>
                  <p className="ra-mono-label">ARCHIVE</p>
                  <h2>{COPY.archive}</h2>
                </div>
                <button
                  className="ra-archive-drawer__close"
                  onClick={() => setIsArchiveOpen(false)}
                  type="button"
                  aria-label={COPY.archive}
                >
                  <CloseIcon />
                </button>
              </div>

              {archiveEntries.length > 0 ? (
                <div className="ra-archive-list">
                  {archiveEntries.map((entry) => (
                    <button
                      key={entry.dateIso}
                      className={`ra-archive-item ${entry.dateIso === selectedDate ? 'is-current' : ''}`}
                      onClick={() => {
                        setSelectedDate(entry.dateIso)
                        setIsArchiveOpen(false)
                        setActivePanel('receipt')
                        scrollToPanel(panelRef.current, 'receipt')
                      }}
                      type="button"
                    >
                      <div className="ra-archive-item__date">
                        <strong>{entry.label}</strong>
                        <span>{entry.weekdayZh}</span>
                      </div>
                      <p>{entry.draft}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="ra-archive-empty">
                  <p>{COPY.archiveEmptyTitle}</p>
                  <span>{COPY.archiveEmptyBody}</span>
                </div>
              )}
            </aside>
          </div>
        ) : null}
      </div>

      {isGenerating ? <GeneratingOverlay /> : null}
    </main>
  )
}
