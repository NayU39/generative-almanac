import type { ReceiptAlmanac } from '../src/features/receipt-almanac/types/receipt'

type DeepSeekConfig = {
  apiKey: string
  model: string
}

type GenerateRequest = {
  userInput: string
  date: string
  timezone: string
}

function buildPrompt(input: GenerateRequest) {
  return [
    '浣犳槸涓€涓€淩eceipt Almanac / 榛勫巻灏忕エ鈥濈殑缁撴瀯鍖栧唴瀹圭敓鎴愬櫒銆?',
    '璇锋牴鎹敤鎴疯緭鍏ョ敓鎴愪竴寮犵湡瀹?receipt 椋庢牸灏忕エ鎵€闇€鐨?JSON銆?',
    '涓嶈杈撳嚭 markdown锛屼笉瑕佽В閲婏紝鍙緭鍑?JSON銆?',
    '鍐呭瑕佸厠鍒躲€佺幇浠ｃ€佸彲鎵ц锛屼笉瑕佹槦绌恒€佹按澧ㄣ€佺巹瀛﹀璇濄€?',
    '瀛楁蹇呴』鍖呭惈锛歵itle, subtitle, issueCode, serialNo, date, stateLabel, headline, yi, ji, meta, printedAt, barcodeValue銆?',
    'yi 鍜?ji 鍚勮緭鍑?3 鍒?5 鏉°€?',
    'meta 閲屽繀椤诲寘鍚?auspiciousTime, direction, luckyColor, energy, memo銆?',
    `鏃ユ湡: ${input.date}`,
    `鏃跺尯: ${input.timezone}`,
    `鐢ㄦ埛杈撳叆: ${input.userInput}`,
  ].join('\n')
}

function parseJsonContent(content: string) {
  const normalized = content.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '')
  return JSON.parse(normalized) as ReceiptAlmanac
}

export async function generateReceiptWithDeepSeek(
  input: GenerateRequest,
  config: DeepSeekConfig,
): Promise<ReceiptAlmanac> {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: buildPrompt(input) }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`)
  }

  const result = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | null
      }
    }>
  }

  const content = result.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('DeepSeek returned empty content.')
  }

  return parseJsonContent(content)
}
