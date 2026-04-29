import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'vite'
import { buildMockReceipt } from '../src/features/receipt-almanac/data/mockReceipt'
import { generateReceiptWithDeepSeek } from './deepseek'

type ReceiptApiPluginOptions = {
  apiKey?: string
  model: string
}

type GenerateRequest = {
  userInput: string
  date: string
  timezone: string
}

function writeJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks).toString('utf8')
}

function normalizeRequest(raw: unknown): GenerateRequest {
  const body = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {}
  const userInput = typeof body.userInput === 'string' ? body.userInput.trim() : ''
  const date = typeof body.date === 'string' ? body.date : new Date().toISOString().slice(0, 10)
  const timezone = typeof body.timezone === 'string' ? body.timezone : 'Asia/Shanghai'

  if (!userInput) {
    throw new Error('userInput is required.')
  }

  return { userInput, date, timezone }
}

async function handleGenerateRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: ReceiptApiPluginOptions,
) {
  try {
    const rawBody = await readBody(req)
    const input = normalizeRequest(rawBody ? JSON.parse(rawBody) : {})

    if (!options.apiKey) {
      writeJson(res, 200, {
        receipt: buildMockReceipt(input.userInput, input.date),
        source: 'mock',
      })
      return
    }

    const receipt = await generateReceiptWithDeepSeek(input, {
      apiKey: options.apiKey,
      model: options.model,
    })

    writeJson(res, 200, { receipt, source: 'ai' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error.'
    writeJson(res, 500, { error: message })
  }
}

function createMiddleware(options: ReceiptApiPluginOptions): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (req.url === '/api/receipt-almanac/generate' && req.method === 'POST') {
      await handleGenerateRequest(req, res, options)
      return
    }

    next()
  }
}

export function receiptApiPlugin(options: ReceiptApiPluginOptions) {
  return {
    name: 'receipt-api-plugin',
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(createMiddleware(options))
    },
    configurePreviewServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(createMiddleware(options))
    },
  }
}
