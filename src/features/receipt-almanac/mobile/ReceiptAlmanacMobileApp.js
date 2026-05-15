var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef, useState } from 'react';
import { buildReceiptDateBlock } from '../../../lib/date';
import { exportNodeAsPng } from '../../../lib/exportImage';
import { ReceiptCanvas } from '../components/ReceiptCanvas';
import { generateReceiptContent } from '../services/generateReceiptContent';
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord';
import './receipt-almanac-mobile.css';
var MAX_CHARS = 300;
var GENERATION_DELAY_MS = 900;
var APP_TIMEZONE = 'Asia/Shanghai';
var COPY = {
    title: '\u4eca\u65e5\u9ec4\u5386\u5c0f\u7968',
    subtitle: '\u8bb0\u5f55\u6b64\u523b\uff0c\u751f\u6210\u4f60\u7684\u4e00\u65e5\u5c0f\u7968',
    archive: '\u5f80\u671f\u5c0f\u7968',
    prevDay: '\u4e0a\u4e00\u5929',
    nextDay: '\u4e0b\u4e00\u5929',
    solar: '\u516c\u5386 / SOLAR',
    lunar: '\u519c\u5386 / LUNAR',
    recorded: '\u5df2\u8bb0\u5f55',
    available: '\u53ef\u8bb0\u5f55',
    inputTitle: '\u5199\u4e0b\u8fd9\u4e00\u5929',
    inputHint: '\u968f\u5fc3\u8bb0\u5f55\u4eca\u5929\u7684\u60f3\u6cd5\u3001\u611f\u53d7\u6216\u91cd\u8981\u4e4b\u4e8b\u3002',
    placeholder: '\u5199\u4e0b\u8fd9\u4e00\u5929\u3002',
    swipeHint: '\u5de6\u6ed1\u67e5\u770b\u4eca\u65e5\u5c0f\u7968',
    generate: '\u751f\u6210\u4eca\u65e5\u5c0f\u7968',
    backToInput: '\u8fd4\u56de\u8f93\u5165\u9875',
    save: '\u4fdd\u5b58',
    previewEmptyTitle: '\u5f53\u524d\u8fd8\u6ca1\u6709\u53ef\u9884\u89c8\u7684\u5c0f\u7968',
    previewEmptyDraft: '\u5148\u751f\u6210\u5f53\u524d\u65e5\u671f\u5185\u5bb9\uff0c\u518d\u5de6\u6ed1\u67e5\u770b\u5f53\u65e5\u5c0f\u7968\u3002',
    previewEmptyBlank: '\u5148\u5199\u4e0b\u8fd9\u4e00\u5929\uff0c\u518d\u751f\u6210\u5f53\u524d\u65e5\u671f\u7684\u5c0f\u7968\u3002',
    overlayTitle: '\u6b63\u5728\u751f\u6210\u5f53\u65e5\u5c0f\u7968',
    overlayBody: '\u9875\u9762\u4f1a\u5728\u751f\u6210\u5b8c\u6210\u540e\u81ea\u52a8\u5207\u6362\u5230\u5c0f\u7968\u9884\u89c8\u9875\u3002',
    archiveEmptyTitle: '\u8fd8\u6ca1\u6709\u751f\u6210\u8fc7\u5f80\u671f\u5c0f\u7968\u3002',
    archiveEmptyBody: '\u5148\u5199\u4e0b\u8fd9\u4e00\u5929\uff0c\u518d\u751f\u6210\u5c5e\u4e8e\u4eca\u5929\u7684\u5c0f\u7968\u3002',
};
var LUNAR_DAY_MAP = {
    1: '\u521d\u4e00',
    2: '\u521d\u4e8c',
    3: '\u521d\u4e09',
    4: '\u521d\u56db',
    5: '\u521d\u4e94',
    6: '\u521d\u516d',
    7: '\u521d\u4e03',
    8: '\u521d\u516b',
    9: '\u521d\u4e5d',
    10: '\u521d\u5341',
    11: '\u5341\u4e00',
    12: '\u5341\u4e8c',
    13: '\u5341\u4e09',
    14: '\u5341\u56db',
    15: '\u5341\u4e94',
    16: '\u5341\u516d',
    17: '\u5341\u4e03',
    18: '\u5341\u516b',
    19: '\u5341\u4e5d',
    20: '\u4e8c\u5341',
    21: '\u5eff\u4e00',
    22: '\u5eff\u4e8c',
    23: '\u5eff\u4e09',
    24: '\u5eff\u56db',
    25: '\u5eff\u4e94',
    26: '\u5eff\u516d',
    27: '\u5eff\u4e03',
    28: '\u5eff\u516b',
    29: '\u5eff\u4e5d',
    30: '\u4e09\u5341',
};
function getNowInTimezone(timeZone) {
    var _a, _b, _c, _d, _e, _f;
    var formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    var parts = formatter.formatToParts(new Date());
    var year = (_b = (_a = parts.find(function (part) { return part.type === 'year'; })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '2026';
    var month = (_d = (_c = parts.find(function (part) { return part.type === 'month'; })) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : '01';
    var day = (_f = (_e = parts.find(function (part) { return part.type === 'day'; })) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : '01';
    return new Date("".concat(year, "-").concat(month, "-").concat(day, "T12:00:00"));
}
function formatIsoDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return "".concat(year, "-").concat(month, "-").concat(day);
}
function shiftDate(baseIso, offset) {
    var date = new Date("".concat(baseIso, "T12:00:00"));
    date.setDate(date.getDate() + offset);
    return formatIsoDate(date);
}
function wait(ms) {
    return new Promise(function (resolve) { return window.setTimeout(resolve, ms); });
}
var STEMS = ['\u7532', '\u4e59', '\u4e19', '\u4e01', '\u620a', '\u5df1', '\u5e9a', '\u8f9b', '\u58ec', '\u7678'];
var BRANCHES = ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5'];
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
function normalizeLunarLabel(label) {
    var _a;
    var match = label.match(/^(.+\u6708)(\d{1,2})$/);
    if (!match) {
        return label;
    }
    var month = match[1], day = match[2];
    return "".concat(month).concat((_a = LUNAR_DAY_MAP[day]) !== null && _a !== void 0 ? _a : day);
}
function buildLunarSummary(inputDate, ganzhi, lunarLabel) {
    var _a, _b, _c, _d, _e;
    var date = new Date("".concat(inputDate, "T12:00:00"));
    var formatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    var parts = formatter.formatToParts(date);
    var yearName = (_b = (_a = parts.find(function (part) { return part.type === 'yearName'; })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ganzhi.slice(0, 2);
    var monthText = (_d = (_c = parts.find(function (part) { return part.type === 'month'; })) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : lunarLabel.slice(0, 2);
    var monthNumber = parseLunarMonthNumber(monthText);
    var yearStemIndex = STEMS.indexOf((_e = yearName[0]) !== null && _e !== void 0 ? _e : '\u4e59');
    var firstMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10;
    var monthPillar = "".concat(STEMS[(firstMonthStem + monthNumber - 1) % 10]).concat(BRANCHES[(2 + monthNumber - 1) % 12], "\u6708");
    var dayIndex = (getJulianDayNumber(date) + 49) % 60;
    var dayPillar = "".concat(STEMS[dayIndex % 10]).concat(BRANCHES[dayIndex % 12], "\u65E5");
    return {
        yearPillar: "".concat(yearName, "\u5E74"),
        monthPillar: monthPillar,
        dayPillar: dayPillar,
        lunarLabel: normalizeLunarLabel(lunarLabel),
    };
}
function scrollToPanel(container, panel) {
    if (!container) {
        return;
    }
    var nextLeft = panel === 'receipt' ? container.clientWidth : 0;
    container.scrollTo({ left: nextLeft, behavior: 'smooth' });
}
function buildDateOptions(centerIso, generatedMap) {
    return [-2, -1, 0, 1, 2].map(function (offset) {
        var iso = shiftDate(centerIso, offset);
        var meta = buildReceiptDateBlock(iso);
        return {
            iso: iso,
            monthDay: "".concat(meta.month, "/").concat(meta.day),
            weekdayZh: meta.weekdayZh.replace('\u661f\u671f', ''),
            isGenerated: Boolean(generatedMap[iso]),
        };
    });
}
function ArrowIcon() {
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 48 24", children: _jsx("path", { d: "M2 12h40m-9-9 9 9-9 9", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }) }));
}
function ReceiptGlyph() {
    return (_jsxs("svg", { "aria-hidden": "true", viewBox: "0 0 32 32", children: [_jsx("path", { d: "M9 4.5h14v23l-3-2-4 2-4-2-3 2Zm3.5 7h7m-7 4h7m-7 4h4", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }), _jsx("path", { d: "M5 8V4h4M23 4h4v4M5 24v4h4M23 28h4v-4", fill: "none", stroke: "currentColor", strokeWidth: "1.5" })] }));
}
function FeatherIcon() {
    return (_jsxs("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M19.5 4.5c-4.6 1.2-8.4 5-9.6 9.6L8.8 18.6l4.5-1.1c4.6-1.2 8.4-5 9.6-9.6l.6-2.4Z", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }), _jsx("path", { d: "M8.8 18.6 5 19.5l.9-3.8m4.8-1.2L15 18M12 10l4 4", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" })] }));
}
function ChevronIcon(_a) {
    var direction = _a.direction;
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 16 16", children: _jsx("path", { d: direction === 'left' ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5', fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }) }));
}
function ArchiveIcon() {
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", children: _jsx("path", { d: "M4.5 7.5h15m-13 0V18a1.5 1.5 0 0 0 1.5 1.5h8A1.5 1.5 0 0 0 18 18V7.5m-9-3h6a1.5 1.5 0 0 1 1.5 1.5v1.5h-9V6A1.5 1.5 0 0 1 9 4.5Z", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }) }));
}
function SwipeHintIcon() {
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", children: _jsx("path", { d: "M20 12H6m5-5-5 5 5 5", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }) }));
}
function CloseIcon() {
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", children: _jsx("path", { d: "m6 6 12 12M18 6 6 18", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }) }));
}
function ReceiptPreviewPanel(_a) {
    var receipt = _a.receipt, selectedDate = _a.selectedDate, hasDraft = _a.hasDraft, receiptRef = _a.receiptRef;
    if (!receipt) {
        return (_jsx("section", { className: "ra-receipt-preview ra-receipt-preview--empty", children: _jsxs("div", { className: "ra-receipt-preview__empty-card", children: [_jsx("p", { className: "ra-mono-label", children: "RECEIPT PREVIEW" }), _jsx("h2", { children: COPY.previewEmptyTitle }), _jsx("p", { children: hasDraft ? COPY.previewEmptyDraft : COPY.previewEmptyBlank }), _jsx("span", { children: selectedDate })] }) }));
    }
    return (_jsx("section", { className: "ra-receipt-preview", children: _jsx("div", { className: "ra-receipt-preview__canvas", children: _jsx(ReceiptCanvas, { receipt: receipt, mode: "preview", ref: receiptRef }) }) }));
}
function GeneratingOverlay() {
    return (_jsx("div", { className: "ra-overlay", role: "status", "aria-live": "polite", children: _jsxs("div", { className: "ra-overlay__panel", children: [_jsx("p", { className: "ra-mono-label", children: "GENERATING" }), _jsx("h2", { children: COPY.overlayTitle }), _jsx("p", { children: COPY.overlayBody })] }) }));
}
export function ReceiptAlmanacMobileApp() {
    var _this = this;
    var _a;
    var todayIso = useMemo(function () { return formatIsoDate(getNowInTimezone(APP_TIMEZONE)); }, []);
    var _b = useState(todayIso), selectedDate = _b[0], setSelectedDate = _b[1];
    var _c = useState({}), drafts = _c[0], setDrafts = _c[1];
    var _d = useState({}), generatedMap = _d[0], setGeneratedMap = _d[1];
    var _e = useState(false), isGenerating = _e[0], setIsGenerating = _e[1];
    var _f = useState('input'), setActivePanel = _f[1];
    var _g = useState(false), isArchiveOpen = _g[0], setIsArchiveOpen = _g[1];
    var panelRef = useRef(null);
    var receiptRef = useRef(null);
    var draft = (_a = drafts[selectedDate]) !== null && _a !== void 0 ? _a : '';
    var generatedEntry = generatedMap[selectedDate];
    var normalizedDraft = draft.trim();
    var dateMeta = buildReceiptDateBlock(selectedDate);
    var lunarSummary = useMemo(function () { return buildLunarSummary(selectedDate, dateMeta.ganzhi, dateMeta.lunar); }, [dateMeta.ganzhi, dateMeta.lunar, selectedDate]);
    var dateOptions = useMemo(function () { return buildDateOptions(selectedDate, generatedMap); }, [generatedMap, selectedDate]);
    var archiveEntries = useMemo(function () {
        return Object.values(generatedMap)
            .sort(function (left, right) { return right.dateIso.localeCompare(left.dateIso); })
            .map(function (entry) {
            var meta = buildReceiptDateBlock(entry.dateIso);
            return __assign(__assign({}, entry), { label: "".concat(meta.month, "/").concat(meta.day), weekdayZh: meta.weekdayZh.replace('\u661f\u671f', '\u5468') });
        });
    }, [generatedMap]);
    var previewEntry = generatedEntry && generatedEntry.draft === normalizedDraft
        ? normalizeReceiptRecord(generatedEntry.receipt, {
            userInput: generatedEntry.draft,
            date: generatedEntry.dateIso,
        })
        : undefined;
    var handleDraftChange = function (value) {
        setDrafts(function (current) {
            var _a;
            return (__assign(__assign({}, current), (_a = {}, _a[selectedDate] = value, _a)));
        });
    };
    var handleGenerate = function () { return __awaiter(_this, void 0, void 0, function () {
        var receipt, nextEntry_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!normalizedDraft || isGenerating) {
                        return [2 /*return*/];
                    }
                    setIsGenerating(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, Promise.all([
                            generateReceiptContent({
                                userInput: normalizedDraft,
                                date: selectedDate,
                                timezone: APP_TIMEZONE,
                            }),
                            wait(GENERATION_DELAY_MS),
                        ])];
                case 2:
                    receipt = (_a.sent())[0];
                    nextEntry_1 = {
                        dateIso: selectedDate,
                        draft: normalizedDraft,
                        generatedAt: new Date().toISOString(),
                        receipt: receipt,
                    };
                    setGeneratedMap(function (current) {
                        var _a;
                        return (__assign(__assign({}, current), (_a = {}, _a[selectedDate] = nextEntry_1, _a)));
                    });
                    setActivePanel('receipt');
                    scrollToPanel(panelRef.current, 'receipt');
                    return [3 /*break*/, 4];
                case 3:
                    setIsGenerating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSaveReceipt = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!previewEntry || !receiptRef.current) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, exportNodeAsPng(receiptRef.current, "".concat(previewEntry.issueCode, "-").concat(previewEntry.serialNo, "-long.png"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("main", { className: "ra-app-shell", children: [_jsxs("div", { className: "ra-page-frame", children: [_jsxs("div", { className: "ra-panels", ref: panelRef, onScroll: function (event) {
                            var container = event.currentTarget;
                            setActivePanel(container.scrollLeft > container.clientWidth / 2 ? 'receipt' : 'input');
                        }, children: [_jsx("section", { className: "ra-panel ra-panel--input", children: _jsxs("div", { className: "ra-screen", children: [_jsx("header", { className: "ra-home-header", children: _jsxs("div", { className: "ra-home-header__row", children: [_jsxs("div", { className: "ra-home-header__copy", children: [_jsx("div", { className: "ra-title-box", children: _jsx("h1", { children: COPY.title }) }), _jsx("div", { className: "ra-subtitle-box", children: _jsx("p", { children: COPY.subtitle }) })] }), _jsxs("button", { className: "ra-archive-entry", onClick: function () { return setIsArchiveOpen(true); }, type: "button", "aria-label": COPY.archive, children: [_jsx("span", { children: COPY.archive }), _jsx("small", { children: "ARCHIVE" })] })] }) }), _jsxs("section", { className: "ra-strip-card", children: [_jsx("button", { className: "ra-strip-card__arrow", onClick: function () { return setSelectedDate(shiftDate(selectedDate, -1)); }, type: "button", "aria-label": COPY.prevDay, children: _jsx(ChevronIcon, { direction: "left" }) }), _jsx("div", { className: "ra-strip-card__dates", children: dateOptions.map(function (option) {
                                                        var isSelected = option.iso === selectedDate;
                                                        return (_jsxs("button", { className: "ra-mini-date ".concat(isSelected ? 'is-selected' : '', " ").concat(option.isGenerated ? 'is-generated' : 'is-empty'), onClick: function () { return setSelectedDate(option.iso); }, type: "button", children: [_jsx("span", { children: option.monthDay }), _jsx("strong", { children: option.weekdayZh }), _jsx("i", {})] }, option.iso));
                                                    }) }), _jsx("button", { className: "ra-strip-card__arrow", onClick: function () { return setSelectedDate(shiftDate(selectedDate, 1)); }, type: "button", "aria-label": COPY.nextDay, children: _jsx(ChevronIcon, { direction: "right" }) })] }), _jsxs("section", { className: "ra-date-card", children: [_jsxs("div", { className: "ra-date-card__top", children: [_jsx("div", { className: "ra-date-card__labels", children: _jsx("span", { className: "ra-date-card__solar ra-date-card__solar--primary", children: COPY.solar }) }), _jsxs("div", { className: "ra-date-card__status", children: [_jsxs("span", { className: "ra-radio-status is-active", children: [_jsx("i", {}), COPY.recorded] }), _jsxs("span", { className: "ra-radio-status", children: [_jsx("i", {}), COPY.available] })] })] }), _jsxs("div", { className: "ra-date-card__main", children: [_jsxs("div", { className: "ra-date-card__digits", children: [_jsxs("div", { className: "ra-date-card__line", children: [_jsx("span", { children: dateMeta.year }), _jsx("em", { children: " / " })] }), _jsxs("div", { className: "ra-date-card__line", children: [_jsx("span", { children: dateMeta.month }), _jsx("em", { children: " / " }), _jsx("span", { children: dateMeta.day })] })] }), _jsxs("div", { className: "ra-weekday-capsule", children: [_jsx("strong", { children: dateMeta.weekdayZh.replace('\u661f\u671f', '\u5468') }), _jsx("small", { children: dateMeta.weekdayEn.slice(0, 3) })] })] }), _jsxs("div", { className: "ra-date-card__bottom", children: [_jsx("span", { className: "ra-date-card__solar ra-date-card__solar--primary", children: COPY.lunar }), _jsxs("div", { className: "ra-date-card__lunar-row", children: [_jsx("span", { children: lunarSummary.yearPillar }), _jsx("span", { children: lunarSummary.monthPillar }), _jsx("span", { children: lunarSummary.dayPillar }), _jsx("span", { children: lunarSummary.lunarLabel })] })] })] }), _jsx("div", { className: "ra-divider", "aria-hidden": "true", children: _jsx("span", {}) }), _jsx("section", { className: "ra-input-card", children: _jsxs("div", { className: "ra-input-card__head", children: [_jsxs("div", { children: [_jsx("p", { className: "ra-mono-label", children: "INPUT FOR THIS DAY" }), _jsx("h2", { children: COPY.inputTitle }), _jsx("p", { children: COPY.inputHint })] }), _jsxs("span", { className: "ra-input-card__count", children: [draft.length, " / ", MAX_CHARS] })] }) }), _jsx("section", { className: "ra-editor-card", children: _jsxs("div", { className: "ra-editor-card__field", children: [_jsx("textarea", { value: draft, onChange: function (event) { return handleDraftChange(event.target.value.slice(0, MAX_CHARS)); }, placeholder: COPY.placeholder, rows: 6 }), _jsx("span", { className: "ra-editor-card__feather", "aria-hidden": "true", children: _jsx(FeatherIcon, {}) })] }) }), _jsxs("section", { className: "ra-swipe-hint", "aria-label": COPY.swipeHint, children: [_jsx("span", { className: "ra-swipe-hint__icon", "aria-hidden": "true", children: _jsx(SwipeHintIcon, {}) }), _jsxs("div", { className: "ra-swipe-hint__copy", children: [_jsx("strong", { children: COPY.swipeHint }), _jsx("small", { children: "SWIPE LEFT TO VIEW TODAY'S RECEIPT" })] })] }), _jsxs("button", { className: "ra-generate-button", onClick: handleGenerate, type: "button", disabled: isGenerating || !draft.trim(), children: [_jsx("span", { className: "ra-generate-button__icon", children: _jsx(ReceiptGlyph, {}) }), _jsx("span", { className: "ra-generate-button__copy", children: _jsx("strong", { children: COPY.generate }) }), _jsx("span", { className: "ra-generate-button__arrow", children: _jsx(ArrowIcon, {}) })] })] }) }), _jsx("section", { className: "ra-panel ra-panel--receipt", children: _jsxs("div", { className: "ra-screen ra-screen--receipt", children: [_jsxs("section", { className: "ra-receipt-toolbar", children: [_jsxs("button", { className: "ra-receipt-toolbar__back", onClick: function () {
                                                        setActivePanel('input');
                                                        scrollToPanel(panelRef.current, 'input');
                                                    }, type: "button", children: [_jsx(SwipeHintIcon, {}), _jsx("span", { children: COPY.backToInput })] }), _jsxs("div", { className: "ra-receipt-toolbar__actions", children: [_jsx("button", { className: "ra-receipt-toolbar__save", onClick: handleSaveReceipt, type: "button", disabled: !previewEntry, children: _jsx("span", { children: COPY.save }) }), _jsx("button", { className: "ra-receipt-toolbar__archive", onClick: function () { return setIsArchiveOpen(true); }, type: "button", "aria-label": COPY.archive, children: _jsx(ArchiveIcon, {}) })] })] }), _jsx(ReceiptPreviewPanel, { receipt: previewEntry, selectedDate: selectedDate, hasDraft: Boolean(normalizedDraft), receiptRef: receiptRef })] }) })] }), isArchiveOpen ? (_jsxs("div", { className: "ra-archive-layer", role: "dialog", "aria-modal": "true", "aria-label": COPY.archive, children: [_jsx("button", { className: "ra-archive-layer__backdrop", onClick: function () { return setIsArchiveOpen(false); }, type: "button", "aria-label": COPY.archive }), _jsxs("aside", { className: "ra-archive-drawer", children: [_jsxs("div", { className: "ra-archive-drawer__head", children: [_jsxs("div", { children: [_jsx("p", { className: "ra-mono-label", children: "ARCHIVE" }), _jsx("h2", { children: COPY.archive })] }), _jsx("button", { className: "ra-archive-drawer__close", onClick: function () { return setIsArchiveOpen(false); }, type: "button", "aria-label": COPY.archive, children: _jsx(CloseIcon, {}) })] }), archiveEntries.length > 0 ? (_jsx("div", { className: "ra-archive-list", children: archiveEntries.map(function (entry) { return (_jsxs("button", { className: "ra-archive-item ".concat(entry.dateIso === selectedDate ? 'is-current' : ''), onClick: function () {
                                                setSelectedDate(entry.dateIso);
                                                setIsArchiveOpen(false);
                                                setActivePanel('receipt');
                                                scrollToPanel(panelRef.current, 'receipt');
                                            }, type: "button", children: [_jsxs("div", { className: "ra-archive-item__date", children: [_jsx("strong", { children: entry.label }), _jsx("span", { children: entry.weekdayZh })] }), _jsx("p", { children: entry.draft })] }, entry.dateIso)); }) })) : (_jsxs("div", { className: "ra-archive-empty", children: [_jsx("p", { children: COPY.archiveEmptyTitle }), _jsx("span", { children: COPY.archiveEmptyBody })] }))] })] })) : null] }), isGenerating ? _jsx(GeneratingOverlay, {}) : null] }));
}
