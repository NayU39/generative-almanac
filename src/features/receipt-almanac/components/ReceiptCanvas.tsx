import { forwardRef } from 'react'
import type { ReceiptAlmanac } from '../types/receipt'
import { ReceiptBarcode } from './ReceiptBarcode'
import { ReceiptDateBlock } from './ReceiptDateBlock'
import { ReceiptFooter } from './ReceiptFooter'
import { ReceiptHeader } from './ReceiptHeader'
import { ReceiptJudgement } from './ReceiptJudgement'
import { ReceiptMetaGrid } from './ReceiptMetaGrid'
import { ReceiptYiJiBlock } from './ReceiptYiJiBlock'

type ReceiptCanvasProps = {
  receipt: ReceiptAlmanac
}

export const ReceiptCanvas = forwardRef<HTMLDivElement, ReceiptCanvasProps>(function ReceiptCanvas(
  { receipt },
  ref,
) {
  return (
    <div className="receipt-canvas" ref={ref}>
      <ReceiptHeader receipt={receipt} />
      <ReceiptDateBlock date={receipt.date} />
      <ReceiptJudgement stateLabel={receipt.stateLabel} headline={receipt.headline} />
      <ReceiptYiJiBlock label="宜 / DO" items={receipt.yi} />
      <ReceiptYiJiBlock label="忌 / DON'T" items={receipt.ji} />
      <ReceiptMetaGrid meta={receipt.meta} />
      <ReceiptBarcode value={receipt.barcodeValue} />
      <ReceiptFooter receipt={receipt} />
    </div>
  )
})
