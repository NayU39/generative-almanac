import { buildIssueCode, buildReceiptDateBlock, buildSerialNo, formatPrintedAt, getTodayIsoDate, } from '../../../lib/date';
import { buildMockReceipt } from '../data/mockReceipt';
function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
function normalizeSentence(value, fallback) {
    return isNonEmptyString(value) ? value.trim() : fallback;
}
function asFixedList(value, fallback, size) {
    if (size === void 0) { size = 4; }
    var normalized = Array.isArray(value)
        ? value
            .map(function (item) { return (typeof item === 'string' ? item.trim() : ''); })
            .filter(Boolean)
        : [];
    var next = normalized.slice(0, size);
    for (var _i = 0, fallback_1 = fallback; _i < fallback_1.length; _i++) {
        var item = fallback_1[_i];
        if (next.length >= size) {
            break;
        }
        next.push(item);
    }
    return next.slice(0, size);
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
        summary: normalizeSentence(data.summary, fallback.summary),
        headline: normalizeSentence(data.headline, fallback.headline),
        yi: asFixedList(data.yi, fallback.yi),
        ji: asFixedList(data.ji, fallback.ji),
        meta: {
            auspiciousTime: isNonEmptyString(metaSource.auspiciousTime)
                ? metaSource.auspiciousTime
                : normalizeSentence(data.auspiciousTime, fallback.meta.auspiciousTime),
            direction: isNonEmptyString(metaSource.direction)
                ? metaSource.direction
                : normalizeSentence(data.direction, fallback.meta.direction),
            luckyColor: isNonEmptyString(metaSource.luckyColor)
                ? metaSource.luckyColor
                : normalizeSentence(data.luckyColor, fallback.meta.luckyColor),
            energy: isNonEmptyString(metaSource.energy) ? metaSource.energy : fallback.meta.energy,
            memo: isNonEmptyString(metaSource.memo) ? metaSource.memo : input.userInput || fallback.meta.memo,
        },
        printedAt: isNonEmptyString(data.printedAt) ? data.printedAt : formatPrintedAt(),
        barcodeValue: isNonEmptyString(data.barcodeValue)
            ? data.barcodeValue
            : "".concat(issueCode, "-").concat(serialNo.slice(-6)),
        source: data.source === 'mock' ? 'mock' : 'ai',
        warning: isNonEmptyString(data.warning) ? data.warning : undefined,
    };
}
