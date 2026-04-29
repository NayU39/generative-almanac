type ReceiptYiJiBlockProps = {
  label: string
  items: string[]
}

export function ReceiptYiJiBlock({ label, items }: ReceiptYiJiBlockProps) {
  return (
    <section className="receipt-section receipt-list-block">
      <p className="receipt-section-label">{label}</p>
      <ul>
        {items.map((item) => (
          <li key={`${label}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
