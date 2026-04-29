import { buildIssueCode, buildReceiptDateBlock, buildSerialNo, formatPrintedAt, getTodayIsoDate } from '../../../lib/date'
import { buildMockReceipt } from '../data/mockReceipt'
import type { GenerateReceiptParams, ReceiptAlmanac } from '../types/receipt'

function getApiUrl() {
  if (typeof window === 'undefined') {
    return '/api/receipt-almanac/generate'
  }

  if (window.location.protocol === 'file:') {
    return '/api/receipt-almanac/generate'
  }

  const { origin, hostname, protocol, port } = window.location
  if (hostname === 'localhost') {
    return `${protocol}//127.0.0.1${port ? `:${port}` : ''}/api/receipt-almanac/generate`
  }

  return `${origin}/api/receipt-almanac/generate`
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function asList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, 5)

  return normalized.length > 0 ? normalized : fallback
}

function normalizeReceipt(raw: unknown, input: GenerateReceiptParams): ReceiptAlmanac {
  const fallback = buildMockReceipt(input.userInput, input.date ?? getTodayIsoDate())

  if (typeof raw !== 'object' || raw === null) {
    return fallback
  }

  const data = raw as Record<string, unknown>
  const date = isNonEmptyString(input.date) ? input.date : getTodayIsoDate()
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
    headline: isNonEmptyString(data.headline) ? data.headline : fallback.headline,
    yi: asList(data.yi, fallback.yi),
    ji: asList(data.ji, fallback.ji),
    meta: {
      auspiciousTime: isNonEmptyString(metaSource.auspiciousTime)
        ? metaSource.auspiciousTime
        : fallback.meta.auspiciousTime,
      direction: isNonEmptyString(metaSource.direction) ? metaSource.direction : fallback.meta.direction,
      luckyColor: isNonEmptyString(metaSource.luckyColor)
        ? metaSource.luckyColor
        : fallback.meta.luckyColor,
      energy: isNonEmptyString(metaSource.energy) ? metaSource.energy : fallback.meta.energy,
      memo: isNonEmptyString(metaSource.memo) ? metaSource.memo : input.userInput || fallback.meta.memo,
    },
    printedAt: isNonEmptyString(data.printedAt) ? data.printedAt : formatPrintedAt(),
    barcodeValue: isNonEmptyString(data.barcodeValue)
      ? data.barcodeValue
      : `${issueCode}-${serialNo.slice(-6)}`,
  }
}

export async function generateReceiptContent(input: GenerateReceiptParams): Promise<ReceiptAlmanac> {
  const requestBody = {
    userInput: input.userInput,
    date: input.date ?? getTodayIsoDate(),
    timezone: input.timezone ?? 'Asia/Shanghai',
  }

  try {
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error('Receipt generation request failed.')
    }

    const payload = (await response.json()) as { receipt?: unknown }
    return normalizeReceipt(payload.receipt, requestBody)
  } catch {
    return buildMockReceipt(requestBody.userInput, requestBody.date)
  }
}
