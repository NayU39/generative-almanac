import type { ReceiptAlmanac } from '../types/receipt'

type ReceiptHeaderProps = {
  receipt: ReceiptAlmanac
}

export function ReceiptHeader({ receipt }: ReceiptHeaderProps) {
  return (
    <header className="receipt-section receipt-header">
      <div>
        <p className="receipt-kicker">{receipt.title}</p>
        <h2>{receipt.subtitle}</h2>
      </div>
      <div className="receipt-header-meta">
        <span>{receipt.issueCode}</span>
        <span>{receipt.serialNo}</span>
      </div>
    </header>
  )
}
