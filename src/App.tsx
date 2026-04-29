import { useState } from 'react'
import { ReceiptInputPage } from './features/receipt-almanac/pages/ReceiptInputPage'
import { ReceiptResultPage } from './features/receipt-almanac/pages/ReceiptResultPage'
import { generateReceiptContent } from './features/receipt-almanac/services/generateReceiptContent'
import type { ReceiptAlmanac } from './features/receipt-almanac/types/receipt'

export default function App() {
  const [draft, setDraft] = useState('鎯冲畨闈欐帹杩涗粖澶╃殑浜嬶紝涓嬪崍鐣欑粰鏁寸悊銆佸啓浣滃拰鎱㈡參瀹屾垚銆?')
  const [receipt, setReceipt] = useState<ReceiptAlmanac | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (nextDraft: string) => {
    setDraft(nextDraft)
    setLoading(true)
    setError(null)

    try {
      const nextReceipt = await generateReceiptContent({
        userInput: nextDraft,
      })
      setReceipt(nextReceipt)
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : '鐢熸垚澶辫触銆?')
    } finally {
      setLoading(false)
    }
  }

  if (!receipt) {
    return (
      <ReceiptInputPage
        defaultValue={draft}
        loading={loading}
        error={error}
        onSubmit={handleGenerate}
      />
    )
  }

  return (
    <ReceiptResultPage
      draft={draft}
      receipt={receipt}
      loading={loading}
      error={error}
      onBack={() => setReceipt(null)}
      onRegenerate={() => handleGenerate(draft)}
    />
  )
}
