import type { ReceiptDateBlock } from '../features/receipt-almanac/types/receipt'

const pad = (value: number) => String(value).padStart(2, '0')

export function getTodayIsoDate() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function formatPrintedAt(date = new Date()) {
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    ' ',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('')
}

export function buildReceiptDateBlock(inputDate: string): ReceiptDateBlock {
  const date = new Date(`${inputDate}T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${inputDate}`)
  }

  const solar = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  const weekdayZh = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(date)
  const weekdayEn = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date).toUpperCase()
  const lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const lunarParts = lunarFormatter.formatToParts(date) as Array<{ type: string; value: string }>
  const relatedYear =
    lunarParts.find((part) => part.type === 'relatedYear')?.value ?? String(date.getFullYear())
  const yearName = lunarParts.find((part) => part.type === 'yearName')?.value ?? '甲辰'
  const lunarMonth = lunarParts.find((part) => part.type === 'month')?.value ?? ''
  const lunarDay = lunarParts.find((part) => part.type === 'day')?.value ?? ''

  return {
    solar,
    year: String(date.getFullYear()),
    month: pad(date.getMonth() + 1),
    day: pad(date.getDate()),
    weekdayZh,
    weekdayEn,
    lunar: `${lunarMonth}${lunarDay}`,
    ganzhi: `${yearName}年 (${relatedYear})`,
  }
}

export function buildIssueCode(inputDate: string) {
  return `RA-${inputDate.split('-').join('')}`
}

export function buildSerialNo(seed: string) {
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  return `SN-${String(hash).padStart(10, '0').slice(0, 10)}`
}
