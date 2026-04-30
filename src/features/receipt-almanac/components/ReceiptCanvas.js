import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord';
import '../styles/receipt.css';
var CHINESE_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
var STEM_PINYIN = {
    甲: 'JIA',
    乙: 'YI',
    丙: 'BING',
    丁: 'DING',
    戊: 'WU',
    己: 'JI',
    庚: 'GENG',
    辛: 'XIN',
    壬: 'REN',
    癸: 'GUI',
};
var BRANCH_PINYIN = {
    子: 'ZI',
    丑: 'CHOU',
    寅: 'YIN',
    卯: 'MAO',
    辰: 'CHEN',
    巳: 'SI',
    午: 'WU',
    未: 'WEI',
    申: 'SHEN',
    酉: 'YOU',
    戌: 'XU',
    亥: 'HAI',
};
var BARCODE_PATTERN = [
    4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2,
    3, 2, 4, 3, 2, 2, 4, 2, 2, 3, 4, 2, 3, 2, 4, 3, 2, 2,
];
function toChineseYear(year) {
    return year
        .split('')
        .map(function (digit) { var _a; return (_a = CHINESE_DIGITS[Number(digit)]) !== null && _a !== void 0 ? _a : digit; })
        .join('');
}
function splitMemoLines(memo, fallback) {
    var lines = memo
        .split(/[，。；;、\n]/)
        .map(function (line) { return line.trim(); })
        .filter(Boolean);
    return lines.length >= 2 ? lines.slice(0, 2) : fallback;
}
function splitTimeLines(value) {
    var normalized = value
        .split(/[，,、\n/]/)
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
        { label: '内敛', value: inward },
        { label: '稳定', value: stable },
    ];
}
function parseLunarMonthNumber(monthText) {
    var _a;
    var normalized = monthText.replace('闰', '').replace('月', '');
    var monthMap = {
        正: 1,
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9,
        十: 10,
        十一: 11,
        冬: 11,
        十二: 12,
        腊: 12,
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
function toPinyinGanzhi(token) {
    var _a, _b;
    var chars = token.replace(/[年月日]/g, '').split('');
    if (chars.length < 2) {
        return token.toUpperCase();
    }
    var stem = chars[0], branch = chars[1];
    return "".concat((_a = STEM_PINYIN[stem]) !== null && _a !== void 0 ? _a : stem, "-").concat((_b = BRANCH_PINYIN[branch]) !== null && _b !== void 0 ? _b : branch);
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
    var yearName = (_b = (_a = parts.find(function (part) { return part.type === 'yearName'; })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '乙巳';
    var lunarMonth = (_d = (_c = parts.find(function (part) { return part.type === 'month'; })) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : (fallbackDisplay.slice(0, 2) || '二月');
    var lunarDay = (_f = (_e = parts.find(function (part) { return part.type === 'day'; })) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : (fallbackDisplay.slice(2) || '十四');
    var yearStemIndex = STEMS.indexOf((_g = yearName[0]) !== null && _g !== void 0 ? _g : '乙');
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
        display: fallbackDisplay || "".concat(lunarMonth).concat(lunarDay),
        pillarsZh: pillarsZh,
        pillarsEn: [
            "YEAR OF ".concat(toPinyinGanzhi(pillarsZh[0])),
            "MONTH OF ".concat(toPinyinGanzhi(pillarsZh[1])),
            "DAY OF ".concat(toPinyinGanzhi(pillarsZh[2])),
        ],
    };
}
function buildViewModel(source) {
    var _a, _b, _c, _d, _e, _f, _g;
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
        memoLines: splitMemoLines(receipt.meta.memo, [
            "\u9002\u5408".concat((_f = receipt.yi[0]) !== null && _f !== void 0 ? _f : '安静吸收'),
            "\u4E0D\u5B9C".concat((_g = receipt.ji[0]) !== null && _g !== void 0 ? _g : '过度打断'),
        ]),
        lunarDetails: buildLunarDetails(dateIso, receipt.date.lunar),
        timeLines: splitTimeLines(receipt.meta.auspiciousTime),
        printedAt: formatPrintedAt(receipt.printedAt),
        energyBars: buildEnergyBars("".concat(receipt.serialNo, ":").concat(receipt.barcodeValue)),
    };
}
export var ReceiptCanvas = forwardRef(function ReceiptCanvas(_a, ref) {
    var receipt = _a.receipt, _b = _a.mode, mode = _b === void 0 ? 'default' : _b;
    var view = buildViewModel(receipt);
    return (_jsx("div", { className: "receipt-canvas-shell ".concat(mode === 'preview' ? 'is-preview' : ''), children: _jsxs("article", { className: "receipt-canvas ".concat(mode === 'preview' ? 'is-preview' : ''), ref: ref, children: [_jsxs("header", { className: "receipt-top-meta receipt-section", children: [_jsxs("div", { children: [_jsx("span", { className: "receipt-label", children: "ISSUE CODE:" }), _jsx("strong", { children: view.receipt.issueCode })] }), _jsxs("div", { children: [_jsx("span", { className: "receipt-label", children: "SERIAL NO." }), _jsx("strong", { children: view.receipt.serialNo })] })] }), _jsxs("section", { className: "receipt-hero receipt-section", children: [_jsx("h2", { children: "\u4ECA\u65E5" }), _jsx("p", { children: view.receipt.headline })] }), _jsxs("section", { className: "receipt-date-panel receipt-section", children: [_jsxs("div", { className: "receipt-date-panel__row", children: [_jsxs("div", { className: "receipt-bilingual-label", children: [_jsx("span", { children: "\u516C\u5386" }), _jsx("span", { children: "SOLAR CALANDER" })] }), _jsx("p", { className: "receipt-chinese-year", children: view.chineseYear })] }), _jsxs("div", { className: "receipt-date-stack", "aria-label": view.receipt.date.solar, children: [_jsx("p", { children: view.receipt.date.year }), _jsxs("div", { className: "receipt-date-stack__middle", children: [_jsx("span", { children: "-" }), _jsx("span", { children: view.receipt.date.month }), _jsxs("div", { className: "receipt-date-stack__badges", children: [_jsx("i", { children: "\u5E74" }), _jsx("i", { children: "\u6708" }), _jsx("i", { children: "\u65E5" })] })] }), _jsx("p", { children: view.receipt.date.day })] }), _jsx("div", { className: "receipt-date-panel__footer", children: _jsxs("div", { className: "receipt-weekday", children: [_jsx("span", { children: view.receipt.date.weekdayZh }), _jsx("span", { children: view.receipt.date.weekdayEn })] }) })] }), _jsxs("section", { className: "receipt-lunar receipt-section", children: [_jsxs("div", { className: "receipt-lunar__header", children: [_jsxs("div", { className: "receipt-bilingual-label", children: [_jsx("span", { children: "\u519C\u5386" }), _jsx("span", { children: "LUNAR CALANDER" })] }), _jsx("p", { children: view.lunarDetails.display })] }), _jsxs("div", { className: "receipt-lunar__body", children: [_jsx("div", { className: "receipt-lunar__pillars", children: view.lunarDetails.pillarsZh.map(function (item) { return (_jsx("span", { children: item }, item)); }) }), _jsx("div", { className: "receipt-lunar__gloss", children: view.lunarDetails.pillarsEn.map(function (item) { return (_jsx("span", { children: item }, item)); }) })] })] }), _jsxs("section", { className: "receipt-judgement receipt-section", children: [_jsx("h3", { children: "\u00B7 \u4ECA\u65E5\u5224\u65AD \u00B7" }), view.memoLines.map(function (line) { return (_jsx("p", { children: line }, line)); })] }), _jsxs("section", { className: "receipt-yi-ji receipt-section", children: [_jsxs("div", { className: "receipt-yi-ji__column", children: [_jsx("div", { className: "receipt-yi-ji__badge", children: "\u5B9C" }), _jsx("ul", { children: view.receipt.yi.map(function (item) { return (_jsx("li", { children: item }, "yi-".concat(item))); }) })] }), _jsx("div", { className: "receipt-yi-ji__divider" }), _jsxs("div", { className: "receipt-yi-ji__column", children: [_jsx("div", { className: "receipt-yi-ji__badge", children: "\u5FCC" }), _jsx("ul", { children: view.receipt.ji.map(function (item) { return (_jsx("li", { children: item }, "ji-".concat(item))); }) })] })] }), _jsxs("section", { className: "receipt-meta receipt-section", children: [_jsxs("div", { className: "receipt-meta__column", children: [_jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: "\u5409\u65F6" }), _jsx("span", { children: "AUSPICCIOUS TIME" })] }), _jsx("div", { className: "receipt-meta__times", children: view.timeLines.map(function (line) { return (_jsx("p", { children: line }, line)); }) })] }), _jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: "\u65B9\u4F4D" }), _jsx("span", { children: "DIRECTION" })] }), _jsx("p", { className: "receipt-meta__text", children: view.receipt.meta.direction })] })] }), _jsx("div", { className: "receipt-meta__divider" }), _jsxs("div", { className: "receipt-meta__column", children: [_jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: "\u4ECA\u65E5\u80FD\u91CF" }), _jsx("span", { children: "ENERGY INDEX" })] }), _jsx("div", { className: "receipt-energy", children: view.energyBars.map(function (item) { return (_jsxs("div", { className: "receipt-energy__row", children: [_jsx("span", { children: "".concat(item.label, "  ").concat(item.value, "%") }), _jsx("div", { className: "receipt-energy__track", children: _jsx("div", { className: "receipt-energy__fill", style: { width: "".concat(item.value, "%") } }) })] }, item.label)); }) })] }), _jsxs("div", { className: "receipt-meta__group", children: [_jsxs("div", { className: "receipt-inline-label", children: [_jsx("strong", { children: "\u5E78\u8FD0\u8272" }), _jsx("span", { children: "LUCKY COLOR" })] }), _jsx("p", { className: "receipt-meta__text", children: view.receipt.meta.luckyColor })] })] })] }), _jsxs("section", { className: "receipt-stamps receipt-section", "aria-label": "\u9644\u52A0\u6807\u8BB0", children: [_jsx("p", { children: view.receipt.subtitle || '待定' }), _jsx("p", { children: "\u5F85\u5B9A" })] }), _jsxs("footer", { className: "receipt-footer receipt-section", children: [_jsx("p", { className: "receipt-footer__title", children: "GENERATIVE ALMANAC" }), _jsx("p", { className: "receipt-footer__time", children: view.printedAt }), _jsx("p", { className: "receipt-footer__series", children: "RECEIPT ALMANAC SERIES" }), _jsx("div", { className: "receipt-barcode", "aria-hidden": "true", children: BARCODE_PATTERN.map(function (width, index) { return (_jsx("span", { style: { width: "".concat(width, "px") } }, "".concat(width, "-").concat(index))); }) }), _jsx("p", { className: "receipt-footer__code", children: view.receipt.barcodeValue })] })] }) }));
});
