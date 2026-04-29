import type { ReceiptDateBlock as ReceiptDateBlockType } from '../types/receipt'

type ReceiptDateBlockProps = {
  date: ReceiptDateBlockType
}

export function ReceiptDateBlock({ date }: ReceiptDateBlockProps) {
  return (
    <section className="receipt-section receipt-date-block">
      <div className="receipt-date-main">
        <span className="receipt-date-day">{date.day}</span>
        <div>
          <p className="receipt-date-month">{date.year}.{date.month}</p>
          <p className="receipt-date-weekday">
            {date.weekdayZh} / {date.weekdayEn}
          </p>
        </div>
      </div>
      <div className="receipt-divider" />
      <div className="receipt-date-submeta">
        <span>SOLAR {date.solar}</span>
        <span>LUNAR {date.lunar}</span>
        <span>{date.ganzhi}</span>
      </div>
    </section>
  )
}
