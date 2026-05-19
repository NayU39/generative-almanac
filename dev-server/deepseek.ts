import type { ReceiptAiPayload } from '../src/features/receipt-almanac/types/receipt'

type DeepSeekConfig = {
  apiKey: string
  model: string
}

type GenerateRequest = {
  userInput: string
  date: string
  timezone: string
}

const SYSTEM_PROMPT = [
  'You generate copy for a receipt-style daily almanac.',
  'Return JSON only. Do not return Markdown, code fences, notes, or explanations.',
  'The JSON must contain exactly these keys: summary, headline, yi, ji, auspiciousTime, direction, luckyColor.',
  'Write all values in Simplified Chinese.',
  'Use the tone of a traditional Chinese almanac, but keep it readable and grounded in the user input.',
  'summary: 28-36 Chinese characters, one sentence, calm, concrete, and lightly tinged with traditional almanac phrasing.',
  'headline: 4-8 Chinese characters, suitable for the main judgement line, with a concise almanac flavor.',
  'yi: array of exactly 4 items, each item should preferably be exactly 2 Chinese characters; use traditional almanac-style wording such as 修文, 赴会, 静坐, 开卷, and only exceed 2 characters when absolutely necessary.',
  'ji: array of exactly 4 items, each item should preferably be exactly 2 Chinese characters; use traditional almanac-style wording such as 迟疑, 空耗, 夜熬, 争执, and only exceed 2 characters when absolutely necessary.',
  'auspiciousTime: time range string like 09:00 - 11:30.',
  'direction: 16-24 Chinese characters, short phrase or sentence.',
  'luckyColor: 2-3 color words separated by " / ".',
  'Keep the content closely tied to the user input and date context.',
  'Avoid modern workplace slogans, internet catchphrases, mystic filler, vague blessings, and generic motivational language.',
].join('\n')

function buildUserPrompt(input: GenerateRequest) {
  return [
    `日期: ${input.date}`,
    `时区: ${input.timezone}`,
    `用户输入: ${input.userInput}`,
    '请基于以上信息生成当日小票内容。',
  ].join('\n')
}

function parseJsonContent(content: string) {
  const normalized = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '')
  return JSON.parse(normalized) as ReceiptAiPayload
}

export async function generateReceiptWithDeepSeek(
  input: GenerateRequest,
  config: DeepSeekConfig,
): Promise<ReceiptAiPayload> {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      temperature: 0.8,
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
