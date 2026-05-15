import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord';
import '../styles/receipt.css';
var CHINESE_DIGITS = [
    '\u3007',
    '\u4e00',
    '\u4e8c',
    '\u4e09',
    '\u56db',
    '\u4e94',
    '\u516d',
    '\u4e03',
    '\u516b',
    '\u4e5d',
];
var STEMS = ['\u7532', '\u4e59', '\u4e19', '\u4e01', '\u620a', '\u5df1', '\u5e9a', '\u8f9b', '\u58ec', '\u7678'];
var BRANCHES = ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5'];
var BARCODE_PATTERN = [
    4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2,
    3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2,
];
var LUNAR_DAY_MAP = {
    '1': '\u521d\u4e00',
    '2': '\u521d\u4e8c',
    '3': '\u521d\u4e09',
    '4': '\u521d\u56db',
    '5': '\u521d\u4e94',
    '6': '\u521d\u516d',
    '7': '\u521d\u4e03',
    '8': '\u521d\u516b',
    '9': '\u521d\u4e5d',
    '10': '\u521d\u5341',
    '11': '\u5341\u4e00',
    '12': '\u5341\u4e8c',
    '13': '\u5341\u4e09',
    '14': '\u5341\u56db',
    '15': '\u5341\u4e94',
    '16': '\u5341\u516d',
    '17': '\u5341\u4e03',
    '18': '\u5341\u516b',
    '19': '\u5341\u4e5d',
    '20': '\u4e8c\u5341',
    '21': '\u5eff\u4e00',
    '22': '\u5eff\u4e8c',
    '23': '\u5eff\u4e09',
    '24': '\u5eff\u56db',
    '25': '\u5eff\u4e94',
    '26': '\u5eff\u516d',
    '27': '\u5eff\u4e03',
    '28': '\u5eff\u516b',
    '29': '\u5eff\u4e5d',
    '30': '\u4e09\u5341',
};
function toChineseYear(year) {
    return year
        .split('')
        .map(function (digit) { var _a; return (_a = CHINESE_DIGITS[Number(digit)]) !== null && _a !== void 0 ? _a : digit; })
        .join('');
}
function splitTimeLines(value) {
    var normalized = value
        .split(/[\uFF0C,\u3001\n/]/)
        .map(function (item) { return item.trim(); })
        .filter(Boolean);
    return normalized.length > 0 ? normalized.slice(0, 3) : ['09:00-11:00', '15:00-17:00'];
}
function formatPrintedAt(value) {
    var match = value.match(/(\d{4})-(\d{2})-(\d{2})[ T]?(\d{2}):(\d{2})/);
    if (!match) {
        return value;
    }
    var year = match[1], month = match[2], day = match[3], hour = match[4], minute = match[5];
    return "".concat(day, "/").concat(month, "/").concat(year, "   ").concat(hour, ":").concat(minute);
}
function buildEnergyBars(seed) {
    var hash = 0;
    for (var _i = 0, seed_1 = seed; _i < seed_1.length; _i++) {
        var char = seed_1[_i];
        hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
    }
    var inward = 32 + (hash % 24);
    var stable = 100 - inward;
    return [
        { label: '\u5185\u655b', value: inward },
        { label: '\u7a33\u5b9a', value: stable },
    ];
}
function parseLunarMonthNumber(monthText) {
    var _a;
    var normalized = monthText.replace('\u95f0', '').replace('\u6708', '');
    var monthMap = {
        '\u6b63': 1,
        '\u4e00': 1,
        '\u4e8c': 2,
        '\u4e09': 3,
        '\u56db': 4,
        '\u4e94': 5,
        '\u516d': 6,
        '\u4e03': 7,
        '\u516b': 8,
        '\u4e5d': 9,
        '\u5341': 10,
        '\u5341\u4e00': 11,
        '\u51ac': 11,
        '\u5341\u4e8c': 12,
        '\u814a': 12,
    };
    return (_a = monthMap[normalized]) !== null && _a !== void 0 ? _a : 1;
}
function getJulianDayNumber(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var a = Math.floor((14 - month) / 12);
    var y = year + 4800 - a;
    var m = month + 12 * a - 3;
    return (day +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045);
}
function normalizeLunarDisplay(label) {
    var match = label.trim().match(/^(.+\u6708)(\d{1,2}|[^\d]+)$/);
    if (!match) {
        return label;
    }
    var month = match[1], dayToken = match[2];
    var normalizedDay = dayToken in LUNAR_DAY_MAP ? "".concat(LUNAR_DAY_MAP[dayToken], "\u65E5") : dayToken.endsWith('日') ? dayToken : "".concat(dayToken, "\u65E5");
    return "".concat(month).concat(normalizedDay);
}
function buildLunarDetails(inputDate, fallbackDisplay) {
    var _a, _b, _c, _d, _e, _f, _g;
    var date = new Date("".concat(inputDate, "T12:00:00"));
    var formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    var parts = formatter.formatToParts(date);
    var fallbackMonth = fallbackDisplay.slice(0, 2) || '\u4e8c\u6708';
    var fallbackDay = fallbackDisplay.slice(2) || '\u5341\u56db';
    var yearName = (_b = (_a = parts.find(function (part) { return part.type === 'yearName'; })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '\u4e59\u5df3';
    var lunarMonth = (_d = (_c = parts.find(function (part) { return part.type === 'month'; })) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : fallbackMonth;
    var lunarDay = (_f = (_e = parts.find(function (part) { return part.type === 'day'; })) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : fallbackDay;
    var yearStemIndex = STEMS.indexOf((_g = yearName[0]) !== null && _g !== void 0 ? _g : '\u4e59');
    var monthNumber = parseLunarMonthNumber(lunarMonth);
    var firstMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10;
    var monthStem = STEMS[(firstMonthStem + monthNumber - 1) % 10];
    var monthBranch = BRANCHES[(2 + monthNumber - 1) % 12];
    var dayIndex = (getJulianDayNumber(date) + 49) % 60;
    var dayStem = STEMS[dayIndex % 10];
    var dayBranch = BRANCHES[dayIndex % 12];
    var pillarsZh = [
        "".concat(yearName, "\u5E74"),
        "".concat(monthStem).concat(monthBranch, "\u6708"),
        "".concat(dayStem).concat(dayBranch, "\u65E5"),
    ];
    return {
        display: normalizeLunarDisplay(fallbackDisplay || "".concat(lunarMonth).concat(lunarDay)),
        pillarsZh: pillarsZh,
    };
}
function buildViewModel(source) {
    var _a, _b, _c, _d, _e;
    var receipt = normalizeReceiptRecord(source, {
        userInput: (_b = (_a = source.meta) === null || _a === void 0 ? void 0 : _a.memo) !== null && _b !== void 0 ? _b : '',
        date: ((_c = source.date) === null || _c === void 0 ? void 0 : _c.year) && ((_d = source.date) === null || _d === void 0 ? void 0 : _d.month) && ((_e = source.date) === null || _e === void 0 ? void 0 : _e.day)
            ? "".concat(source.date.year, "-").concat(source.date.month, "-").concat(source.date.day)
            : undefined,
    });
    var dateIso = "".concat(receipt.date.year, "-").concat(receipt.date.month, "-").concat(receipt.date.day);
    return {
        receipt: receipt,
        chineseYear: toChineseYear(receipt.date.year),
        lunarDetails: buildLunarDetails(dateIso, receipt.date.lunar),
        timeLines: splitTimeLines(receipt.meta.auspiciousTime),
        printedAt: formatPrintedAt(receipt.printedAt),
        energyBars: buildEnergyBars("".concat(receipt.serialNo, ":").concat(receipt.barcodeValue)),
    };
}
export var ReceiptCanvas = forwardRef(function ReceiptCanvas(_a, ref) {
    var receipt = _a.receipt, _b = _a.mode, mode = _b === void 0 ? 'default' : _b;
    var view = buildViewModel(receipt);
    return (_jsx("div", { className: "receipt-canvas-shell ".concat(mode === 'preview' ? 'is-preview' : ''), children: _jsxs("article", { className: "receipt-canvas ".concat(mode === 'preview' ? 'is-preview' : ''), ref: ref, children: [_jsxs("header", { className: "receipt-top-meta receipt-section", children: [_jsxs("div", { children: [_jsx("span", { className: "receipt-label", children: "ISSUE CODE:" }), _jsx("strong", { children: view.receipt.issueCode })] }), _jsxs("div", { children: [_jsx("span", { className: "receipt-label", children: "SERIAL NO." }), _jsx("strong", { children: view.receipt.serialNo })] })] }), _jsxs("section", { className: "receipt-hero receipt-section", children: [_jsx("h2", { children: '\u4eca\u65e5' }), _jsx("p", { children: view.receipt.summary })] }), _jsxs("section", { className: "receipt-date-panel receipt-section", children: [_jsxs("div", { className: "receipt-date-panel__row", children: [_jsxs("div", { className: "receipt-bilingual-label", children: [_jsx("span", { children: '\u516c\u5386' }), _jsx("span", { children: "SOLAR CALANDER" })] }), _jsx("p", { className: "receipt-chinese-year", children: view.chineseYear })] }), _jsxs("div", { className: "receipt-date-stack", "aria-label": view.receipt.date.solar, children: [_jsx("p", { children: view.receipt.date.year }), _jsxs("div", { className: "receipt-date-stack__middle", children: [_jsx("span", { children: "-" }), _jsx("span", { children: view.receipt.date.month }), _jsxs("div", { className: "receipt-date-stack__badges", children: [_jsx("i", { children: '\u5e74' }), _jsx("i", { children: '\u6708' }), _jsx("i", { children: '\u65e5' })] })] }), _jsx("p", { children: view.receipt.date.day })] }), _jsx("div", { className: "receipt-date-panel__footer", children: _jsxs("div", { className: "receipt-weekday", children: [_jsx("span", { children: view.receipt.date.weekdayZh }), _jsx("span", { children: view.receipt.date.weekdayEn })] }) })] }), _jsxs("section", { className: "receipt-lunar receipt-section", children: [_jsxs("div", { className: "receipt-lunar__header", children: [_jsxs("div", { className: "receipt-bilingual-label", children: [_jsx("span", { children: '\u519c\u5386' }), _jsx("span", { children: "LUNAR CALANDER" })] }), _jsx("p", { children: view.lunarDetails.display })] }), _jsx("div", { className: "receipt-lunar__body", children: _jsx("div", { className: "receipt-lunar__pillars", children: view.lunarDetails.pillarsZh.map(function (item) { return (_jsx("span", { children: item }, item)); }) }) })] }), _jsxs("section", { className: "receipt-judgement receipt-section", children: [_jsx("h3", { children: '\u00b7 \u4eca\u65e5\u5224\u65ad \u00b7' }), _jsx("p", { children: view.receipt.headline })] }), _jsxs("section", { className: "receipt-yi-ji receipt-section", children: [_jsxs("div", { className: "receipt-yi-ji__column", children: [_jsx("div", { className: "receipt-yi-ji__badge", children: '\u5b9c' }), _jsx("ul", { children: view.receipt.yi.map(function (item) { return (_jsx("li", { children: item }, "yi-".concat(item))); }) })] }), _jsx("div", { className: "receipt-yi-ji__divider" }), _jsxs("div", { className: "receipt-yi-ji__column", children: [_jsx("div", { className: "receipt-yi-ji__badge", children: '\u5fcc' }), _jsx("ul", { children: view.receipt.ji.map(function (item) { return (_jsx("li", { children: item }, "ji-".concat(item))); }) })] })] }), _jsxs("section", { className: "receipt-meta receipt-section", children: [_jsxs("div", { className: "receipt-meta__column", children: [_jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: '\u5409\u65f6' }), _jsx("span", { children: "AUSPICCIOUS TIME" })] }), _jsx("div", { className: "receipt-meta__times", children: view.timeLines.map(function (line) { return (_jsx("p", { children: line }, line)); }) })] }), _jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: '\u65b9\u4f4d' }), _jsx("span", { children: "DIRECTION" })] }), _jsx("p", { className: "receipt-meta__text", children: view.receipt.meta.direction })] })] }), _jsx("div", { className: "receipt-meta__divider" }), _jsxs("div", { className: "receipt-meta__column", children: [_jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: '\u4eca\u65e5\u80fd\u91cf' }), _jsx("span", { children: "ENERGY INDEX" })] }), _jsx("div", { className: "receipt-energy", children: view.energyBars.map(function (item) { return (_jsxs("div", { className: "receipt-energy__row", children: [_jsx("span", { children: "".concat(item.label, "  ").concat(item.value, "%") }), _jsx("div", { className: "receipt-energy__track", children: _jsx("div", { className: "receipt-energy__fill", style: { width: "".concat(item.value, "%") } }) })] }, item.label)); }) })] }), _jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: '\u5e78\u8fd0\u8272' }), _jsx("span", { children: "LUCKY COLOR" })] }), _jsx("p", { className: "receipt-meta__text", children: view.receipt.meta.luckyColor })] })] })] }), _jsxs("section", { className: "receipt-stamps receipt-section", "aria-label": '\u9644\u52a0\u6807\u8bb0', children: [_jsx("p", { children: view.receipt.subtitle || '\u5f85\u5b9a' }), _jsx("p", { children: '\u5f85\u5b9a' })] }), _jsxs("footer", { className: "receipt-footer receipt-section", children: [_jsx("p", { className: "receipt-footer__title", children: "GENERATIVE ALMANAC" }), _jsx("p", { className: "receipt-footer__time", children: view.printedAt }), _jsx("p", { className: "receipt-footer__series", children: "RECEIPT ALMANAC SERIES" }), _jsx("div", { className: "receipt-barcode", "aria-hidden": "true", children: BARCODE_PATTERN.map(function (width, index) { return (_jsx("span", { style: { width: "".concat(width, "px") } }, "".concat(width, "-").concat(index))); }) }), _jsx("p", { className: "receipt-footer__code", children: view.receipt.barcodeValue })] })] }) }));
});
