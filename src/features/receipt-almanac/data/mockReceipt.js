import { buildIssueCode, buildReceiptDateBlock, buildSerialNo, formatPrintedAt, getTodayIsoDate, } from '../../../lib/date';
export function buildMockReceipt(userInput, date) {
    if (date === void 0) { date = getTodayIsoDate(); }
    var compactInput = userInput.trim() || '今日宜整理心绪，慢慢推进手头计划。';
    var seed = "".concat(date, ":").concat(compactInput);
    return {
        title: 'RECEIPT ALMANAC',
        subtitle: 'Generated Daily Ticket',
        issueCode: buildIssueCode(date),
        serialNo: buildSerialNo(seed),
        date: buildReceiptDateBlock(date),
        stateLabel: '已生成',
        headline: '今日适合稳步完成计划，也适合把杂念留在纸面之外。',
        yi: ['整理日程', '推进写作', '安静独处', '按时休息'],
        ji: ['过度分心', '临时拖延', '深夜熬夜', '重复内耗'],
        meta: {
            auspiciousTime: '09:00 - 11:30',
            direction: '朝向安静与清晰感的一侧。',
            luckyColor: '米白 / 暖灰 / 墨黑',
            energy: '适合把重要事项拆小，按顺序完成。',
            memo: compactInput,
        },
        printedAt: formatPrintedAt(),
        barcodeValue: "".concat(buildIssueCode(date), "-").concat(buildSerialNo(seed).slice(-6)),
    };
}
