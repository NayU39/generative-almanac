import { useRef } from 'react'
import type { ReceiptAlmanac } from '../types/receipt'
import { ExportReceiptButton } from '../components/ExportReceiptButton'
import { ReceiptCanvas } from '../components/ReceiptCanvas'

type ReceiptResultPageProps = {
  draft: string
  receipt: ReceiptAlmanac
  loading: boolean
  error: string | null
  onBack: () => void
  onRegenerate: () => void
}

export function ReceiptResultPage({
  draft,
  receipt,
  loading,
  error,
  onBack,
  onRegenerate,
}: ReceiptResultPageProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <main className="receipt-app-shell receipt-result-shell">
      <section className="receipt-stage">
        <ReceiptCanvas ref={canvasRef} receipt={receipt} />
      </section>

      <aside className="receipt-toolbar">
        <p className="receipt-eyebrow">Current Input</p>
        <p className="receipt-toolbar-copy">{draft}</p>

        {error ? <p className="receipt-error">{error}</p> : null}

        <div className="receipt-toolbar-actions">
          <button className="receipt-secondary-button" onClick={onBack} type="button">
            返回修改
          </button>
          <button
            className="receipt-primary-button"
            onClick={onRegenerate}
            disabled={loading}
            type="button"
          >
            {loading ? '閲嶆柊鐢熸垚涓?..' : '閲嶆柊鐢熸垚'}
          </button>
          <ExportReceiptButton receipt={receipt} targetRef={canvasRef} />
        </div>
      </aside>
    </main>
  )
}
