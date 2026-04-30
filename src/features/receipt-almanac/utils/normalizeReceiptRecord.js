import { buildIssueCode, buildReceiptDateBlock, buildSerialNo, formatPrintedAt, getTodayIsoDate, } from '../../../lib/date';
import { buildMockReceipt } from '../data/mockReceipt';
function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
function asList(value, fallback) {
    if (!Array.isArray(value)) {
        return fallback;
    }
    var normalized = value
        .map(function (item) { return (typeof item === 'string' ? item.trim() : ''); })
        .filter(Boolean)
        .slice(0, 5);
    return normalized.length > 0 ? normalized : fallback;
}
export function normalizeReceiptRecord(raw, input) {
    var date = isNonEmptyString(input.date) ? input.date : getTodayIsoDate();
    var fallback = buildMockReceipt(input.userInput, date);
    if (typeof raw !== 'object' || raw === null) {
        return fallback;
    }
    var data = raw;
    var normalizedDate = buildReceiptDateBlock(date);
    var issueCode = isNonEmptyString(data.issueCode) ? data.issueCode : buildIssueCode(date);
    var serialNo = isNonEmptyString(data.serialNo)
        ? data.serialNo
        : buildSerialNo("".concat(date, ":").concat(input.userInput));
    var metaSource = typeof data.meta === 'object' && data.meta !== null ? data.meta : {};
    return {
        title: isNonEmptyString(data.title) ? data.title : fallback.title,
        subtitle: isNonEmptyString(data.subtitle) ? data.subtitle : fallback.subtitle,
        issueCode: issueCode,
        serialNo: serialNo,
        date: normalizedDate,
        stateLabel: isNonEmptyString(data.stateLabel) ? data.stateLabel : fallback.stateLabel,
        headline: isNonEmptyString(data.headline) ? data.headline : fallback.headline,
        yi: asList(data.yi, fallback.yi),
        ji: asList(data.ji, fallback.ji),
        meta: {
            auspiciousTime: isNonEmptyString(metaSource.auspiciousTime)
                ? metaSource.auspiciousTime
                : fallback.meta.auspiciousTime,
            direction: isNonEmptyString(metaSource.direction) ? metaSource.direction : fallback.meta.direction,
            luckyColor: isNonEmptyString(metaSource.luckyColor)
                ? metaSource.luckyColor
                : fallback.meta.luckyColor,
            energy: isNonEmptyString(metaSource.energy) ? metaSource.energy : fallback.meta.energy,
            memo: isNonEmptyString(metaSource.memo) ? metaSource.memo : input.userInput || fallback.meta.memo,
        },
        printedAt: isNonEmptyString(data.printedAt) ? data.printedAt : formatPrintedAt(),
        barcodeValue: isNonEmptyString(data.barcodeValue)
            ? data.barcodeValue
            : "".concat(issueCode, "-").concat(serialNo.slice(-6)),
    };
}
