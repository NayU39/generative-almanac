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

const CHINESE_DIGITS = [
  '\u3007',
  '\u4e00',
  '\u4e8c',
  '\u4e09',
  '\u56db',
  '\u4e94',
  '\u516d',
  '\u4e03',
  '\u516b',
  '\u4e5d',
]
const STEMS = ['\u7532', '\u4e59', '\u4e19', '\u4e01', '\u620a', '\u5df1', '\u5e9a', '\u8f9b', '\u58ec', '\u7678']
const BRANCHES = ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5']
const STEM_PINYIN: Record<string, string> = {
  '\u7532': 'JIA',
  '\u4e59': 'YI',
  '\u4e19': 'BING',
  '\u4e01': 'DING',
  '\u620a': 'WU',
  '\u5df1': 'JI',
  '\u5e9a': 'GENG',
  '\u8f9b': 'XIN',
  '\u58ec': 'REN',
  '\u7678': 'GUI',
}
const BRANCH_PINYIN: Record<string, string> = {
  '\u5b50': 'ZI',
  '\u4e11': 'CHOU',
  '\u5bc5': 'YIN',
  '\u536f': 'MAO',
  '\u8fb0': 'CHEN',
  '\u5df3': 'SI',
  '\u5348': 'WU',
  '\u672a': 'WEI',
  '\u7533': 'SHEN',
  '\u9149': 'YOU',
  '\u620c': 'XU',
  '\u4ea5': 'HAI',
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

function splitTimeLines(value: string) {
  const normalized = value
    .split(/[\uFF0C,\u3001\n/]/)
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
    { label: '\u5185\u655b', value: inward },
    { label: '\u7a33\u5b9a', value: stable },
  ]
}

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

function toPinyinGanzhi(token: string) {
  const chars = token.replace(/[\u5e74\u6708\u65e5]/g, '').split('')
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
  const fallbackMonth = fallbackDisplay.slice(0, 2) || '\u4e8c\u6708'
  const fallbackDay = fallbackDisplay.slice(2) || '\u5341\u56db'
  const yearName = parts.find((part) => part.type === 'yearName')?.value ?? '\u4e59\u5df3'
  const lunarMonth = parts.find((part) => part.type === 'month')?.value ?? fallbackMonth
  const lunarDay = parts.find((part) => part.type === 'day')?.value ?? fallbackDay
  const yearStemIndex = STEMS.indexOf(yearName[0] ?? '\u4e59')
  const monthNumber = parseLunarMonthNumber(lunarMonth)
  const firstMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10
  const monthStem = STEMS[(firstMonthStem + monthNumber - 1) % 10]
  const monthBranch = BRANCHES[(2 + monthNumber - 1) % 12]
  const dayIndex = (getJulianDayNumber(date) + 49) % 60
  const dayStem = STEMS[dayIndex % 10]
  const dayBranch = BRANCHES[dayIndex % 12]
  const pillarsZh: [string, string, string] = [
    `${yearName}\u5e74`,
    `${monthStem}${monthBranch}\u6708`,
    `${dayStem}${dayBranch}\u65e5`,
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
          <h2>{'\u4eca\u65e5'}</h2>
          <p>{view.receipt.summary}</p>
        </section>

        <section className="receipt-date-panel receipt-section">
          <div className="receipt-date-panel__row">
            <div className="receipt-bilingual-label">
              <span>{'\u516c\u5386'}</span>
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
                <i>{'\u5e74'}</i>
                <i>{'\u6708'}</i>
                <i>{'\u65e5'}</i>
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
              <span>{'\u519c\u5386'}</span>
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
          <h3>{'\u00b7 \u4eca\u65e5\u5224\u65ad \u00b7'}</h3>
          <p>{view.receipt.headline}</p>
        </section>

        <section className="receipt-yi-ji receipt-section">
          <div className="receipt-yi-ji__column">
            <div className="receipt-yi-ji__badge">{'\u5b9c'}</div>
            <ul>
              {view.receipt.yi.map((item) => (
                <li key={`yi-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="receipt-yi-ji__divider" />
          <div className="receipt-yi-ji__column">
            <div className="receipt-yi-ji__badge">{'\u5fcc'}</div>
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
                <strong>{'\u5409\u65f6'}</strong>
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
                <strong>{'\u65b9\u4f4d'}</strong>
                <span>DIRECTION</span>
              </div>
              <p className="receipt-meta__text">{view.receipt.meta.direction}</p>
            </div>
          </div>

          <div className="receipt-meta__divider" />

          <div className="receipt-meta__column">
            <div className="receipt-meta__group">
              <div className="receipt-inline-label">
                <strong>{'\u4eca\u65e5\u80fd\u91cf'}</strong>
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
                <strong>{'\u5e78\u8fd0\u8272'}</strong>
                <span>LUCKY COLOR</span>
              </div>
              <p className="receipt-meta__text">{view.receipt.meta.luckyColor}</p>
            </div>
          </div>
        </section>

        <section className="receipt-stamps receipt-section" aria-label={'\u9644\u52a0\u6807\u8bb0'}>
          <p>{view.receipt.subtitle || '\u5f85\u5b9a'}</p>
          <p>{'\u5f85\u5b9a'}</p>
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
