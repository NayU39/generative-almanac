import {
  buildIssueCode,
  buildReceiptDateBlock,
  buildSerialNo,
  formatPrintedAt,
  getTodayIsoDate,
} from '../../../lib/date'
import type { ReceiptAlmanac } from '../types/receipt'

export function buildMockReceipt(userInput: string, date = getTodayIsoDate()): ReceiptAlmanac {
  const compactInput = userInput.trim() || '\u4eca\u65e5\u5b9c\u6574\u7406\u601d\u7eea\uff0c\u6162\u6162\u63a8\u8fdb\u624b\u5934\u8ba1\u5212\u3002'
  const seed = `${date}:${compactInput}`

  return {
    title: 'RECEIPT ALMANAC',
    subtitle: 'Generated Daily Ticket',
    issueCode: buildIssueCode(date),
    serialNo: buildSerialNo(seed),
    date: buildReceiptDateBlock(date),
    stateLabel: '\u5df2\u751f\u6210',
    headline: '\u4eca\u65e5\u9002\u5408\u7a33\u6b65\u5b8c\u6210\u8ba1\u5212\uff0c\u4e5f\u9002\u5408\u628a\u6742\u5ff5\u7559\u5728\u7eb8\u9762\u4e4b\u5916\u3002',
    yi: ['\u6574\u7406\u65e5\u7a0b', '\u63a8\u8fdb\u5199\u4f5c', '\u5b89\u9759\u72ec\u5904', '\u6309\u65f6\u4f11\u606f'],
    ji: ['\u8fc7\u5ea6\u5206\u5fc3', '\u4e34\u65f6\u62d6\u5ef6', '\u6df1\u591c\u71ac\u591c', '\u91cd\u590d\u5185\u8017'],
    meta: {
      auspiciousTime: '09:00 - 11:30',
      direction: '\u9762\u5411\u5b89\u9759\u4e0e\u6e05\u9192\u611f\u7684\u4e00\u4fa7\u3002',
      luckyColor: '\u7c73\u767d / \u6696\u7070 / \u58a8\u9ed1',
      energy: '\u9002\u5408\u628a\u91cd\u8981\u4e8b\u9879\u62c6\u5c0f\uff0c\u6309\u987a\u5e8f\u5b8c\u6210\u3002',
      memo: compactInput,
    },
    printedAt: formatPrintedAt(),
    barcodeValue: `${buildIssueCode(date)}-${buildSerialNo(seed).slice(-6)}`,
  }
}
