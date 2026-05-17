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

async function generateReceiptWithDeepSeek(input, env) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
      messages: [
        {
          role: 'system',
          content: [
            'You generate copy for a receipt-style daily almanac.',
            'Return JSON only. Do not return Markdown, code fences, notes, or explanations.',
            'The JSON must contain exactly these keys: summary, headline, yi, ji, auspiciousTime, direction, luckyColor.',
            'Write all values in Simplified Chinese.',
            'summary: 28-36 Chinese characters, one sentence, calm and concrete.',
            'headline: 4-8 Chinese characters, suitable for the main judgement line.',
            'yi: array of exactly 4 items, each item 4-6 Chinese characters.',
            'ji: array of exactly 4 items, each item 4-6 Chinese characters.',
            'auspiciousTime: time range string like 09:00 - 11:30.',
            'direction: 16-24 Chinese characters, short phrase or sentence.',
            'luckyColor: 2-3 color words separated by " / ".',
            'Keep the content closely tied to the user input and date context.',
            'Avoid mystic filler, vague blessings, and generic motivational slogans.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: [
            `日期: ${input.date}`,
            `时区: ${input.timezone}`,
            `用户输入: ${input.userInput}`,
            '请基于以上信息生成当日小票内容。',
          ].join('\n'),
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`)
  }

  const result = await response.json()
  const content = result?.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('DeepSeek returned empty content.')
  }

  return JSON.parse(String(content).trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, ''))
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}

export async function onRequestPost({ request, env }) {
  try {
    const input = normalizeRequest(await request.json())

    if (!env?.DEEPSEEK_API_KEY) {
      return json({
        receipt: buildMockReceipt(input.userInput, input.date),
        source: 'mock',
        warning: 'DEEPSEEK_API_KEY is missing, fallback to mock.',
      })
    }

    try {
      const receipt = await generateReceiptWithDeepSeek(input, env)
      return json({ receipt, source: 'ai' })
    } catch (error) {
      return json({
        receipt: buildMockReceipt(input.userInput, input.date),
        source: 'mock',
        warning: error instanceof Error ? error.message : 'Unknown AI generation error.',
      })
    }
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown server error.' },
      500,
    )
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  })
}

