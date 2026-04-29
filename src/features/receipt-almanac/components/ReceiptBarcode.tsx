type ReceiptBarcodeProps = {
  value: string
}

export function ReceiptBarcode({ value }: ReceiptBarcodeProps) {
  return (
    <section className="receipt-section receipt-barcode-section">
      <div className="receipt-barcode" aria-hidden="true" />
      <p>{value}</p>
    </section>
  )
}
