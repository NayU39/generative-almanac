import type { ReceiptAlmanac } from '../types/receipt'

type ReceiptFooterProps = {
  receipt: ReceiptAlmanac
}

export function ReceiptFooter({ receipt }: ReceiptFooterProps) {
  return (
    <footer className="receipt-section receipt-footer">
      <span>PRINTED AT {receipt.printedAt}</span>
      <span>SERIAL {receipt.serialNo}</span>
    </footer>
  )
}
