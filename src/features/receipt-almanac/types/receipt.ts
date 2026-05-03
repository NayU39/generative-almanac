export type ReceiptDateBlock = {
  solar: string
  year: string
  month: string
  day: string
  weekdayZh: string
  weekdayEn: string
  lunar: string
  ganzhi: string
}

export type ReceiptMeta = {
  auspiciousTime: string
  direction: string
  luckyColor: string
  memo: string
  energy?: string
}

export type ReceiptContentFields = {
  summary: string
  headline: string
  yi: string[]
  ji: string[]
  auspiciousTime: string
  direction: string
  luckyColor: string
}

export type ReceiptAiPayload = {
  summary?: unknown
  headline?: unknown
  yi?: unknown
  ji?: unknown
  auspiciousTime?: unknown
  direction?: unknown
  luckyColor?: unknown
}

export type ReceiptAlmanac = {
  title: string
  subtitle: string
  issueCode: string
  serialNo: string
  date: ReceiptDateBlock
  stateLabel: string
  summary: string
  headline: string
  yi: string[]
  ji: string[]
  meta: ReceiptMeta
  printedAt: string
  barcodeValue: string
  source?: 'ai' | 'mock'
  warning?: string
}

export type GenerateReceiptParams = {
  userInput: string
  date?: string
  timezone?: string
}
