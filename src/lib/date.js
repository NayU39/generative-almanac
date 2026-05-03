var pad = function (value) { return String(value).padStart(2, '0'); };
export function getTodayIsoDate() {
    var now = new Date();
    return "".concat(now.getFullYear(), "-").concat(pad(now.getMonth() + 1), "-").concat(pad(now.getDate()));
}
export function formatPrintedAt(date) {
    if (date === void 0) { date = new Date(); }
    return [
        date.getFullYear(),
        '-',
        pad(date.getMonth() + 1),
        '-',
        pad(date.getDate()),
        ' ',
        pad(date.getHours()),
        ':',
        pad(date.getMinutes()),
    ].join('');
}
export function buildReceiptDateBlock(inputDate) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var date = new Date("".concat(inputDate, "T12:00:00"));
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid date: ".concat(inputDate));
    }
    var solar = new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
    var weekdayZh = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(date);
    var weekdayEn = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date).toUpperCase();
    var lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    var lunarParts = lunarFormatter.formatToParts(date);
    var relatedYear = (_b = (_a = lunarParts.find(function (part) { return part.type === 'relatedYear'; })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : String(date.getFullYear());
    var yearName = (_d = (_c = lunarParts.find(function (part) { return part.type === 'yearName'; })) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : '\u7532\u8fb0';
    var lunarMonth = (_f = (_e = lunarParts.find(function (part) { return part.type === 'month'; })) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : '';
    var lunarDay = (_h = (_g = lunarParts.find(function (part) { return part.type === 'day'; })) === null || _g === void 0 ? void 0 : _g.value) !== null && _h !== void 0 ? _h : '';
    return {
        solar: solar,
        year: String(date.getFullYear()),
        month: pad(date.getMonth() + 1),
        day: pad(date.getDate()),
        weekdayZh: weekdayZh,
        weekdayEn: weekdayEn,
        lunar: "".concat(lunarMonth).concat(lunarDay),
        ganzhi: "".concat(yearName, "\u5E74 (").concat(relatedYear, ")"),
    };
}
export function buildIssueCode(inputDate) {
    return "RA-".concat(inputDate.split('-').join(''));
}
export function buildSerialNo(seed) {
    var hash = 0;
    for (var _i = 0, seed_1 = seed; _i < seed_1.length; _i++) {
        var char = seed_1[_i];
        hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }
    return "SN-".concat(String(hash).padStart(10, '0').slice(0, 10));
}
