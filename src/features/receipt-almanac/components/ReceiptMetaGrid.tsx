import type { ReceiptMeta } from '../types/receipt'

type ReceiptMetaGridProps = {
  meta: ReceiptMeta
}

const metaEntries = (meta: ReceiptMeta) => [
  ['AUSPICIOUS TIME', meta.auspiciousTime],
  ['DIRECTION', meta.direction],
  ['LUCKY COLOR', meta.luckyColor],
  ['ENERGY', meta.energy],
  ['MEMO', meta.memo],
] as const

export function ReceiptMetaGrid({ meta }: ReceiptMetaGridProps) {
  return (
    <section className="receipt-section receipt-meta-grid">
      {metaEntries(meta).map(([label, value]) => (
        <div className="receipt-meta-item" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  )
}
