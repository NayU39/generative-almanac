type ReceiptJudgementProps = {
  stateLabel: string
  headline: string
}

export function ReceiptJudgement({ stateLabel, headline }: ReceiptJudgementProps) {
  return (
    <section className="receipt-section receipt-judgement">
      <p className="receipt-chip">{stateLabel}</p>
      <h3>{headline}</h3>
    </section>
  )
}
