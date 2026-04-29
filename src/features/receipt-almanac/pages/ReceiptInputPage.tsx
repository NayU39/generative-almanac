import { useState } from 'react'
import '../styles/receipt.css'

type ReceiptInputPageProps = {
  defaultValue: string
  loading: boolean
  error: string | null
  onSubmit: (value: string) => void
}

export function ReceiptInputPage({
  defaultValue,
  loading,
  error,
  onSubmit,
}: ReceiptInputPageProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <main className="receipt-app-shell">
      <section className="receipt-input-card">
        <p className="receipt-eyebrow">Receipt Almanac MVP</p>
        <h1>生成式黄历小票</h1>
        <p className="receipt-lead">
          输入你今天的状态、计划或一句心情，系统会先用 mock 生成一张可保存的小票黄历。
        </p>

        <textarea
          className="receipt-textarea"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="例如：下午想安静处理待办，少开会，先把写作和整理完成。"
          rows={10}
        />

        {error ? <p className="receipt-error">{error}</p> : null}

        <button
          className="receipt-primary-button"
          onClick={() => onSubmit(value)}
          disabled={loading || !value.trim()}
          type="button"
        >
          {loading ? '鐢熸垚涓?..' : '鎵撳嵃浠婃棩榛勫巻'}
        </button>
      </section>
    </main>
  )
}
