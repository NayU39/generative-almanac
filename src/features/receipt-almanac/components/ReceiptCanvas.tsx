import { forwardRef } from 'react'
import type { ReceiptAlmanac } from '../types/receipt'
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord'
import '../styles/receipt.css'

type ReceiptCanvasProps = {
  receipt: ReceiptAlmanac
  mode?: 'default' | 'preview'
}

type LunarDetails = {
  display: string
  pillarsZh: [string, string, string]
  pillarsEn: [string, string, string]
}

const CHINESE_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const STEM_PINYIN: Record<string, string> = {
  甲: 'JIA',
  乙: 'YI',
  丙: 'BING',
  丁: 'DING',
  戊: 'WU',
  己: 'JI',
  庚: 'GENG',
  辛: 'XIN',
  壬: 'REN',
  癸: 'GUI',
}
const BRANCH_PINYIN: Record<string, string> = {
  子: 'ZI',
  丑: 'CHOU',
  寅: 'YIN',
  卯: 'MAO',
  辰: 'CHEN',
  巳: 'SI',
  午: 'WU',
  未: 'WEI',
  申: 'SHEN',
  酉: 'YOU',
  戌: 'XU',
  亥: 'HAI',
}
const BARCODE_PATTERN = [
  4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2,
  3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2,
]

function toChineseYear(year: string) {
  return year
    .split('')
    .map((digit) => CHINESE_DIGITS[Number(digit)] ?? digit)
    .join('')
}

function splitMemoLines(memo: string, fallback: string[]) {
  const lines = memo
    .split(/[，。；;、\n]/)
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length >= 2 ? lines.slice(0, 2) : fallback
}

function splitTimeLines(value: string) {
  const normalized = value
    .split(/[，,、\n/]/)
    .map((item) => item.trim())
    .filter(Boolean)

  return normalized.length > 0 ? normalized.slice(0, 3) : ['09:00-11:00', '15:00-17:00']
}

function formatPrintedAt(value: string) {
  const match = value.match(/(\d{4})-(\d{2})-(\d{2})[ T]?(\d{2}):(\d{2})/)
  if (!match) {
    return value
  }

  const [, year, month, day, hour, minute] = match
  return `${day}/${month}/${year}   ${hour}:${minute}`
}

function buildEnergyBars(seed: string) {
  let hash = 0

  for (const char of seed) {
    hash = (hash * 33 + char.charCodeAt(0)) >>> 0
  }

  const inward = 32 + (hash % 24)
  const stable = 100 - inward

  return [
    { label: '内敛', value: inward },
    { label: '稳定', value: stable },
  ]
}

function parseLunarMonthNumber(monthText: string) {
  const normalized = monthText.replace('闰', '').replace('月', '')
  const monthMap: Record<string, number> = {
    正: 1,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    十一: 11,
    冬: 11,
    十二: 12,
    腊: 12,
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

function toPinyinGanzhi(token: string) {
  const chars = token.replace(/[年月日]/g, '').split('')
  if (chars.length < 2) {
    return token.toUpperCase()
  }

  const [stem, branch] = chars
  return `${STEM_PINYIN[stem] ?? stem}-${BRANCH_PINYIN[branch] ?? branch}`
}

function buildLunarDetails(inputDate: string, fallbackDisplay: string): LunarDetails {
  const date = new Date(`${inputDate}T12:00:00`)
  const formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const parts = formatter.formatToParts(date) as Array<{ type: string; value: string }>
  const yearName = parts.find((part) => part.type === 'yearName')?.value ?? '乙巳'
  const lunarMonth = parts.find((part) => part.type === 'month')?.value ?? (fallbackDisplay.slice(0, 2) || '二月')
  const lunarDay = parts.find((part) => part.type === 'day')?.value ?? (fallbackDisplay.slice(2) || '十四')
  const yearStemIndex = STEMS.indexOf(yearName[0] ?? '乙')
  const monthNumber = parseLunarMonthNumber(lunarMonth)
  const firstMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10
  const monthStem = STEMS[(firstMonthStem + monthNumber - 1) % 10]
  const monthBranch = BRANCHES[(2 + monthNumber - 1) % 12]
  const dayIndex = (getJulianDayNumber(date) + 49) % 60
  const dayStem = STEMS[dayIndex % 10]
  const dayBranch = BRANCHES[dayIndex % 12]
  const pillarsZh: [string, string, string] = [
    `${yearName}年`,
    `${monthStem}${monthBranch}月`,
    `${dayStem}${dayBranch}日`,
  ]

  return {
    display: fallbackDisplay || `${lunarMonth}${lunarDay}`,
    pillarsZh,
    pillarsEn: [
      `YEAR OF ${toPinyinGanzhi(pillarsZh[0])}`,
      `MONTH OF ${toPinyinGanzhi(pillarsZh[1])}`,
      `DAY OF ${toPinyinGanzhi(pillarsZh[2])}`,
    ],
  }
}

function buildViewModel(source: ReceiptAlmanac) {
  const receipt = normalizeReceiptRecord(source, {
    userInput: source.meta?.memo ?? '',
    date:
      source.date?.year && source.date?.month && source.date?.day
        ? `${source.date.year}-${source.date.month}-${source.date.day}`
        : undefined,
  })
  const dateIso = `${receipt.date.year}-${receipt.date.month}-${receipt.date.day}`

  return {
    receipt,
    chineseYear: toChineseYear(receipt.date.year),
    memoLines: splitMemoLines(receipt.meta.memo, [
      `适合${receipt.yi[0] ?? '安静吸收'}`,
      `不宜${receipt.ji[0] ?? '过度打断'}`,
    ]),
    lunarDetails: buildLunarDetails(dateIso, receipt.date.lunar),
    timeLines: splitTimeLines(receipt.meta.auspiciousTime),
    printedAt: formatPrintedAt(receipt.printedAt),
    energyBars: buildEnergyBars(`${receipt.serialNo}:${receipt.barcodeValue}`),
  }
}

export const ReceiptCanvas = forwardRef<HTMLDivElement, ReceiptCanvasProps>(function ReceiptCanvas(
  { receipt, mode = 'default' },
  ref,
) {
  const view = buildViewModel(receipt)

  return (
    <div className={`receipt-canvas-shell ${mode === 'preview' ? 'is-preview' : ''}`}>
      <article className={`receipt-canvas ${mode === 'preview' ? 'is-preview' : ''}`} ref={ref}>
        <header className="receipt-top-meta receipt-section">
          <div>
            <span className="receipt-label">ISSUE CODE:</span>
            <strong>{view.receipt.issueCode}</strong>
          </div>
          <div>
            <span className="receipt-label">SERIAL NO.</span>
            <strong>{view.receipt.serialNo}</strong>
          </div>
        </header>

        <section className="receipt-hero receipt-section">
          <h2>今日</h2>
          <p>{view.receipt.headline}</p>
        </section>

        <section className="receipt-date-panel receipt-section">
          <div className="receipt-date-panel__row">
            <div className="receipt-bilingual-label">
              <span>公历</span>
              <span>SOLAR CALANDER</span>
            </div>
            <p className="receipt-chinese-year">{view.chineseYear}</p>
          </div>

          <div className="receipt-date-stack" aria-label={view.receipt.date.solar}>
            <p>{view.receipt.date.year}</p>
            <div className="receipt-date-stack__middle">
              <span>-</span>
              <span>{view.receipt.date.month}</span>
              <div className="receipt-date-stack__badges">
                <i>年</i>
                <i>月</i>
                <i>日</i>
              </div>
            </div>
            <p>{view.receipt.date.day}</p>
          </div>

          <div className="receipt-date-panel__footer">
            <div className="receipt-weekday">
              <span>{view.receipt.date.weekdayZh}</span>
              <span>{view.receipt.date.weekdayEn}</span>
            </div>
          </div>
        </section>

        <section className="receipt-lunar receipt-section">
          <div className="receipt-lunar__header">
            <div className="receipt-bilingual-label">
              <span>农历</span>
              <span>LUNAR CALANDER</span>
            </div>
            <p>{view.lunarDetails.display}</p>
          </div>

          <div className="receipt-lunar__body">
            <div className="receipt-lunar__pillars">
              {view.lunarDetails.pillarsZh.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="receipt-lunar__gloss">
              {view.lunarDetails.pillarsEn.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="receipt-judgement receipt-section">
          <h3>· 今日判断 ·</h3>
          {view.memoLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>

        <section className="receipt-yi-ji receipt-section">
          <div className="receipt-yi-ji__column">
            <div className="receipt-yi-ji__badge">宜</div>
            <ul>
              {view.receipt.yi.map((item) => (
                <li key={`yi-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="receipt-yi-ji__divider" />
          <div className="receipt-yi-ji__column">
            <div className="receipt-yi-ji__badge">忌</div>
            <ul>
              {view.receipt.ji.map((item) => (
                <li key={`ji-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="receipt-meta receipt-section">
          <div className="receipt-meta__column">
            <div className="receipt-meta__group">
              <div className="receipt-inline-label">
                <strong>吉时</strong>
                <span>AUSPICCIOUS TIME</span>
              </div>
              <div className="receipt-meta__times">
                {view.timeLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="receipt-meta__group">
              <div className="receipt-inline-label">
                <strong>方位</strong>
                <span>DIRECTION</span>
              </div>
              <p className="receipt-meta__text">{view.receipt.meta.direction}</p>
            </div>
          </div>

          <div className="receipt-meta__divider" />

          <div className="receipt-meta__column">
            <div className="receipt-meta__group">
              <div className="receipt-inline-label">
                <strong>今日能量</strong>
                <span>ENERGY INDEX</span>
              </div>
              <div className="receipt-energy">
                {view.energyBars.map((item) => (
                  <div className="receipt-energy__row" key={item.label}>
                    <span>{`${item.label}  ${item.value}%`}</span>
                    <div className="receipt-energy__track">
                      <div className="receipt-energy__fill" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="receipt-meta__group">
              <div className="receipt-inline-label">
                <strong>幸运色</strong>
                <span>LUCKY COLOR</span>
              </div>
              <p className="receipt-meta__text">{view.receipt.meta.luckyColor}</p>
            </div>
          </div>
        </section>

        <section className="receipt-stamps receipt-section" aria-label="附加标记">
          <p>{view.receipt.subtitle || '待定'}</p>
          <p>待定</p>
        </section>

        <footer className="receipt-footer receipt-section">
          <p className="receipt-footer__title">GENERATIVE ALMANAC</p>
          <p className="receipt-footer__time">{view.printedAt}</p>
          <p className="receipt-footer__series">RECEIPT ALMANAC SERIES</p>
          <div className="receipt-barcode" aria-hidden="true">
            {BARCODE_PATTERN.map((width, index) => (
              <span key={`${width}-${index}`} style={{ width: `${width}px` }} />
            ))}
          </div>
          <p className="receipt-footer__code">{view.receipt.barcodeValue}</p>
        </footer>
      </article>
    </div>
  )
})
