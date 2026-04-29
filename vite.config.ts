import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { receiptApiPlugin } from './dev-server/receiptApiPlugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      receiptApiPlugin({
        apiKey: env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY,
        model: env.DEEPSEEK_MODEL || process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
      }),
    ],
    server: {
      host: '127.0.0.1',
    },
    preview: {
      host: '127.0.0.1',
    },
  }
})
