import {
  buildIssueCode,
  buildReceiptDateBlock,
  buildSerialNo,
  formatPrintedAt,
  getTodayIsoDate,
} from '../../../lib/date'
import { buildMockReceipt } from '../data/mockReceipt'
import type { GenerateReceiptParams, ReceiptAiPayload, ReceiptAlmanac } from '../types/receipt'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeSentence(value: unknown, fallback: string) {
  return isNonEmptyString(value) ? value.trim() : fallback
}

function asFixedList(value: unknown, fallback: string[], size = 4) {
  const normalized = Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean)
    : []

  const next = normalized.slice(0, size)

  for (const item of fallback) {
    if (next.length >= size) {
      break
    }

    next.push(item)
  }

  return next.slice(0, size)
}

export function normalizeReceiptRecord(
  raw: unknown,
  input: Pick<GenerateReceiptParams, 'userInput' | 'date'>,
): ReceiptAlmanac {
  const date = isNonEmptyString(input.date) ? input.date : getTodayIsoDate()
  const fallback = buildMockReceipt(input.userInput, date)

  if (typeof raw !== 'object' || raw === null) {
    return fallback
  }

  const data = raw as ReceiptAiPayload & {
    title?: unknown
    subtitle?: unknown
    stateLabel?: unknown
    issueCode?: unknown
    serialNo?: unknown
    meta?: unknown
    printedAt?: unknown
    barcodeValue?: unknown
    source?: unknown
    warning?: unknown
  }
  const normalizedDate = buildReceiptDateBlock(date)
  const issueCode = isNonEmptyString(data.issueCode) ? data.issueCode : buildIssueCode(date)
  const serialNo = isNonEmptyString(data.serialNo)
    ? data.serialNo
    : buildSerialNo(`${date}:${input.userInput}`)
  const metaSource =
    typeof data.meta === 'object' && data.meta !== null ? (data.meta as Record<string, unknown>) : {}

  return {
    title: isNonEmptyString(data.title) ? data.title : fallback.title,
    subtitle: isNonEmptyString(data.subtitle) ? data.subtitle : fallback.subtitle,
    issueCode,
    serialNo,
    date: normalizedDate,
    stateLabel: isNonEmptyString(data.stateLabel) ? data.stateLabel : fallback.stateLabel,
    summary: normalizeSentence(data.summary, fallback.summary),
    headline: normalizeSentence(data.headline, fallback.headline),
    yi: asFixedList(data.yi, fallback.yi),
    ji: asFixedList(data.ji, fallback.ji),
    meta: {
      auspiciousTime: isNonEmptyString(metaSource.auspiciousTime)
        ? metaSource.auspiciousTime
        : normalizeSentence(data.auspiciousTime, fallback.meta.auspiciousTime),
      direction: isNonEmptyString(metaSource.direction)
        ? metaSource.direction
        : normalizeSentence(data.direction, fallback.meta.direction),
      luckyColor: isNonEmptyString(metaSource.luckyColor)
        ? metaSource.luckyColor
        : normalizeSentence(data.luckyColor, fallback.meta.luckyColor),
      energy: isNonEmptyString(metaSource.energy) ? metaSource.energy : fallback.meta.energy,
      memo: isNonEmptyString(metaSource.memo) ? metaSource.memo : input.userInput || fallback.meta.memo,
    },
    printedAt: isNonEmptyString(data.printedAt) ? data.printedAt : formatPrintedAt(),
    barcodeValue: isNonEmptyString(data.barcodeValue)
      ? data.barcodeValue
      : `${issueCode}-${serialNo.slice(-6)}`,
    source: data.source === 'mock' ? 'mock' : 'ai',
    warning: isNonEmptyString(data.warning) ? data.warning : undefined,
  }
}
