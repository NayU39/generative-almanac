import type { RefObject } from 'react'
import { exportNodeAsPng } from '../../../lib/exportImage'
import type { ReceiptAlmanac } from '../types/receipt'

type ExportReceiptButtonProps = {
  receipt: ReceiptAlmanac
  targetRef: RefObject<HTMLDivElement>
}

export function ExportReceiptButton({ receipt, targetRef }: ExportReceiptButtonProps) {
  const handleExport = async () => {
    if (!targetRef.current) {
      return
    }

    await exportNodeAsPng(targetRef.current, `${receipt.issueCode}-${receipt.serialNo}.png`)
  }

  return (
    <button className="receipt-secondary-button" onClick={handleExport} type="button">
      保存图片
    </button>
  )
}
