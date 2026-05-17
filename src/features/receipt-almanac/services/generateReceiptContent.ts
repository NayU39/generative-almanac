import { getTodayIsoDate } from '../../../lib/date'
import { buildMockReceipt } from '../data/mockReceipt'
import type { GenerateReceiptParams, ReceiptAlmanac } from '../types/receipt'
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord'

const DEFAULT_API_PATH = '/api/receipt-almanac/generate'

function joinApiUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function getApiUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  if (configuredBaseUrl) {
    return joinApiUrl(configuredBaseUrl, DEFAULT_API_PATH)
  }

  if (typeof window === 'undefined') {
    return DEFAULT_API_PATH
  }

  if (window.location.protocol === 'file:') {
    return DEFAULT_API_PATH
  }

  const { origin, hostname, protocol, port } = window.location
  if (hostname === 'localhost') {
    return `${protocol}//127.0.0.1${port ? `:${port}` : ''}${DEFAULT_API_PATH}`
  }

  return `${origin}${DEFAULT_API_PATH}`
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

    const payload = (await response.json()) as { receipt?: unknown; source?: unknown; warning?: unknown }
    return normalizeReceiptRecord(
      {
        ...(typeof payload.receipt === 'object' && payload.receipt !== null
          ? (payload.receipt as Record<string, unknown>)
          : {}),
        source: payload.source,
        warning: payload.warning,
      },
      requestBody,
    )
  } catch (error) {
    const fallback = buildMockReceipt(requestBody.userInput, requestBody.date)
    return {
      ...fallback,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Receipt generation failed, fallback to mock.',
    }
  }
}
