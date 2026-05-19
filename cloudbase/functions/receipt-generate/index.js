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
  const yearName = lunarParts.find((part) => part.type === 'yearName')?.value ?? '鐢茶景'
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
    ganzhi: `${yearName}骞?(${relatedYear})`,
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

  if (/(璁烘枃|鍐欎綔|鏂囩珷|鏂规|姣曚笟璁捐|绛旇京)/.test(input)) {
    return {
      summary: '浠婃棩閫傚悎姊崇悊缁撴瀯涓庤妭濂忥紝鎶婂叧閿换鍔℃寜椤哄簭鎺ㄨ繘瀹屾垚銆?',
      headline: '瀹滅ǔ姝ユ帹杩?',
      yi: ['姊崇悊璁烘枃', '缁嗗寲鏂规', '鍒嗘鍐欎綔', '鏅氶棿闃呰'],
      ji: ['鍙嶅鏀归', '棰戠箒鍒囨崲', '鎷栧埌娣卞', '绌烘兂涓嶅啓'],
      auspiciousTime: '09:00 - 11:30',
      direction: '鏈濆悜閲囧厜绋冲畾涓庢闈㈡竻娲佺殑涓€渚ф洿椤恒€?',
      luckyColor: '绫崇櫧 / 鏆栫伆 / 澧ㄩ粦',
    }
  }

  if (/(寮€浼殀娌熼€殀姹囨姤|鍗忎綔|澶嶇洏)/.test(input)) {
    return {
      summary: '浠婃棩閫傚悎鍏堢粺涓€閲嶇偣锛屽啀鎶婃矡閫氭垚鏈帇鍒版渶灏戠殑鑼冨洿鍐呫€?',
      headline: '瀹滃厛瀹氶噸鐐?',
      yi: ['鏄庣‘璁▼', '绠€娲佽〃杈?', '鍚屾杩涘害', '浼氬悗鏀舵潫'],
      ji: ['涓村満鍙戞暎', '閲嶅瑙ｉ噴', '鎯呯华浜夎京', '閬楁紡缁撹'],
      auspiciousTime: '10:30 - 12:00',
      direction: '闈犺繎瀹夐潤鍏ュ彛涓庝俊鎭泦涓殑涓€渚ф洿鏈夊埄銆?',
      luckyColor: '鐭崇櫧 / 闆捐摑 / 娣辩伆',
    }
  }

  return {
    summary: '浠婃棩閫傚悎绋虫瀹屾垚璁″垝锛屼篃閫傚悎鎶婃潅蹇电暀鍦ㄧ焊闈箣澶栥€?',
    headline: '閫傚悎鏁寸悊鏃ョ▼',
    yi: ['鏁寸悊鏃ョ▼', '鎺ㄨ繘鍐欎綔', '瀹夐潤鐙', '鎸夋椂浼戞伅'],
    ji: ['杩囧害鍒嗗績', '涓存椂鎷栧欢', '娣卞鐔', '閲嶅鍐呰€?'],
    auspiciousTime: '09:00 - 11:30',
    direction: '闈㈠悜瀹夐潤涓庢竻閱掓劅鐨勪竴渚ф洿瀹规槗杩涘叆鐘舵€併€?',
    luckyColor: '绫崇櫧 / 鏆栫伆 / 澧ㄩ粦',
  }
}

function buildMockReceipt(userInput, date) {
  const compactInput = userInput.trim() || '浠婃棩瀹滄暣鐞嗘€濈华锛屾參鎱㈡帹杩涙墜澶磋鍒掋€?'
  const seed = `${date}:${compactInput}`
  const generated = buildMockContent(compactInput)

  return {
    title: 'RECEIPT ALMANAC',
    subtitle: 'Generated Daily Ticket',
    issueCode: buildIssueCode(date),
    serialNo: buildSerialNo(seed),
    date: buildReceiptDateBlock(date),
    stateLabel: '宸茬敓鎴?',
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
            `鏃ユ湡: ${input.date}`,
            `鏃跺尯: ${input.timezone}`,
            `鐢ㄦ埛杈撳叆: ${input.userInput}`,
            '璇峰熀浜庝互涓婁俊鎭敓鎴愬綋鏃ュ皬绁ㄥ唴瀹广€?',
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

function json(payload, statusCode = 200, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  }
}

function getCorsHeaders(event) {
  const origin = event?.headers?.origin || event?.headers?.Origin || '*'

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function getHttpMethod(event) {
  const candidate =
    event?.httpMethod ||
    event?.method ||
    event?.requestContext?.http?.method ||
    event?.requestContext?.httpMethod ||
    event?.headers?.['x-http-method-override'] ||
    event?.headers?.['X-HTTP-Method-Override'] ||
    ''

  const normalized = String(candidate).trim().toUpperCase()
  if (normalized) {
    return normalized
  }

  return typeof event?.body === 'string' && event.body.trim() ? 'POST' : ''
}

function parseEventBody(event) {
  if (!event) {
    return {}
  }

  if (typeof event.body === 'string') {
    if (!event.body.trim()) {
      return {}
    }

    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body

    return JSON.parse(rawBody)
  }

  if (typeof event.body === 'object' && event.body !== null) {
    return event.body
  }

  if (
    typeof event.userInput === 'string' ||
    typeof event.date === 'string' ||
    typeof event.timezone === 'string'
  ) {
    return event
  }

  return {}
}

exports.main = async (event) => {
  const corsHeaders = getCorsHeaders(event)
  const httpMethod = getHttpMethod(event)

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...corsHeaders,
        Allow: 'POST, OPTIONS',
      },
      body: '',
    }
  }

  try {
    const input = normalizeRequest(parseEventBody(event))

    if (!process.env.DEEPSEEK_API_KEY) {
      return json({
        receipt: buildMockReceipt(input.userInput, input.date),
        source: 'mock',
        warning: 'DEEPSEEK_API_KEY is missing, fallback to mock.',
      }, 200, corsHeaders)
    }

    try {
      const receipt = await generateReceiptWithDeepSeek(input, process.env)
      return json({ receipt, source: 'ai' }, 200, corsHeaders)
    } catch (error) {
      return json({
        receipt: buildMockReceipt(input.userInput, input.date),
        source: 'mock',
        warning: error instanceof Error ? error.message : 'Unknown AI generation error.',
      }, 200, corsHeaders)
    }
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown server error.' },
      500,
      corsHeaders,
    )
  }
}
