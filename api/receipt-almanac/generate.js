import { generateReceiptWithDeepSeek } from '../../dev-server/deepseek.js'

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatPrintedAt(date = new Date()) {
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

function buildReceiptDateBlock(inputDate) {
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
  const lunarParts = lunarFormatter.formatToParts(date)
  const relatedYear = lunarParts.find((part) => part.type === 'relatedYear')?.value ?? String(date.getFullYear())
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

function buildIssueCode(inputDate) {
  return `RA-${inputDate.split('-').join('')}`
}

function buildSerialNo(seed) {
  let hash = 0

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  return `SN-${String(hash).padStart(10, '0').slice(0, 10)}`
}

function buildMockContent(userInput) {
  const input = userInput.trim()

  if (/(论文|写作|文章|方案|毕业设计|答辩)/.test(input)) {
    return {
      summary: '今日适合梳理结构与节奏，把关键任务按顺序推进完成。',
      headline: '宜稳步推进',
      yi: ['梳理论文', '细化方案', '分段写作', '晚间阅读'],
      ji: ['反复改题', '频繁切换', '拖到深夜', '空想不写'],
      auspiciousTime: '09:00 - 11:30',
      direction: '朝向采光稳定与桌面清洁的一侧更顺。',
      luckyColor: '米白 / 暖灰 / 墨黑',
    }
  }

  if (/(开会|沟通|汇报|协作|复盘)/.test(input)) {
    return {
      summary: '今日适合先统一重点，再把沟通成本压到最少的范围内。',
      headline: '宜先定重点',
      yi: ['明确议程', '简洁表达', '同步进度', '会后收束'],
      ji: ['临场发散', '重复解释', '情绪争辩', '遗漏结论'],
      auspiciousTime: '10:30 - 12:00',
      direction: '靠近安静入口与信息集中的一侧更有利。',
      luckyColor: '石白 / 雾蓝 / 深灰',
    }
  }

  return {
    summary: '今日适合稳步完成计划，也适合把杂念留在纸面之外。',
    headline: '适合整理日程',
    yi: ['整理日程', '推进写作', '安静独处', '按时休息'],
    ji: ['过度分心', '临时拖延', '深夜熬夜', '重复内耗'],
    auspiciousTime: '09:00 - 11:30',
    direction: '面向安静与清醒感的一侧更容易进入状态。',
    luckyColor: '米白 / 暖灰 / 墨黑',
  }
}

function buildMockReceipt(userInput, date) {
  const compactInput = userInput.trim() || '今日宜整理思绪，慢慢推进手头计划。'
  const seed = `${date}:${compactInput}`
  const generated = buildMockContent(compactInput)

  return {
    title: 'RECEIPT ALMANAC',
    subtitle: 'Generated Daily Ticket',
    issueCode: buildIssueCode(date),
    serialNo: buildSerialNo(seed),
    date: buildReceiptDateBlock(date),
    stateLabel: '已生成',
    summary: generated.summary,
    headline: generated.headline,
    yi: generated.yi,
    ji: generated.ji,
    meta: {
      auspiciousTime: generated.auspiciousTime,
      direction: generated.direction,
      luckyColor: generated.luckyColor,
      memo: compactInput,
    },
    printedAt: formatPrintedAt(),
    barcodeValue: `${buildIssueCode(date)}-${buildSerialNo(seed).slice(-6)}`,
    source: 'mock',
  }
}

function writeJson(res, statusCode, payload) {
  res.status(statusCode).json(payload)
}

function normalizeRequest(raw) {
  const body = typeof raw === 'object' && raw !== null ? raw : {}
  const userInput = typeof body.userInput === 'string' ? body.userInput.trim() : ''
  const date = typeof body.date === 'string' ? body.date : new Date().toISOString().slice(0, 10)
  const timezone = typeof body.timezone === 'string' ? body.timezone : 'Asia/Shanghai'

  if (!userInput) {
    throw new Error('userInput is required.')
  }

  return { userInput, date, timezone }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    writeJson(res, 405, { error: 'Method not allowed.' })
    return
  }

  try {
    const input = normalizeRequest(req.body ?? {})
    const apiKey = process.env.DEEPSEEK_API_KEY
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'

    if (!apiKey) {
      writeJson(res, 200, {
        receipt: buildMockReceipt(input.userInput, input.date),
        source: 'mock',
        warning: 'DEEPSEEK_API_KEY is missing, fallback to mock.',
      })
      return
    }

    try {
      const receipt = await generateReceiptWithDeepSeek(input, { apiKey, model })
      writeJson(res, 200, { receipt, source: 'ai' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI generation error.'
      writeJson(res, 200, {
        receipt: buildMockReceipt(input.userInput, input.date),
        source: 'mock',
        warning: message,
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error.'
    writeJson(res, 500, { error: message })
  }
}
