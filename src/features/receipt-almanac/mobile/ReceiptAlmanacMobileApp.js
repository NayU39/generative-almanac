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
import { ReceiptCanvas } from '../components/ReceiptCanvas';
import { generateReceiptContent } from '../services/generateReceiptContent';
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord';
import './receipt-almanac-mobile.css';
var MAX_CHARS = 300;
var GENERATION_DELAY_MS = 900;
var APP_TIMEZONE = 'Asia/Shanghai';
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
function wait(ms) {
    return new Promise(function (resolve) { return window.setTimeout(resolve, ms); });
}
function getEntryStatus(draft, generatedEntry) {
    var normalizedDraft = draft.trim();
    if (!normalizedDraft) {
        return 'empty';
    }
    if (generatedEntry && generatedEntry.draft === normalizedDraft) {
        return 'generated';
    }
    return 'draft';
}
function getStatusCopy(status) {
    if (status === 'generated') {
        return {
            label: 'generated',
            message: 'RECEIPT READY · 左滑查看',
        };
    }
    if (status === 'draft') {
        return {
            label: 'draft',
            message: 'DRAFT READY · 已保存输入，尚未生成小票',
        };
    }
    return {
        label: 'empty',
        message: 'EMPTY · 该日期还没有内容',
    };
}
function getGenerateLabel(status) {
    return status === 'generated' ? '更新今日小票' : '生成今日小票';
}
function scrollToPanel(container, panel) {
    if (!container) {
        return;
    }
    var nextLeft = panel === 'receipt' ? container.clientWidth : 0;
    container.scrollTo({ left: nextLeft, behavior: 'smooth' });
}
function ArrowIcon() {
    return (_jsx("svg", { "aria-hidden": "true", viewBox: "0 0 48 24", children: _jsx("path", { d: "M2 12h40m-9-9 9 9-9 9", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" }) }));
}
function ReceiptGlyph() {
    return (_jsxs("svg", { "aria-hidden": "true", viewBox: "0 0 32 32", children: [_jsx("path", { d: "M9 4.5h14v23l-3-2-4 2-4-2-3 2Zm3.5 7h7m-7 4h7m-7 4h4", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.3" }), _jsx("path", { d: "M5 8V4h4M23 4h4v4M5 24v4h4M23 28h4v-4", fill: "none", stroke: "currentColor", strokeWidth: "1.3" })] }));
}
function StatusDot(_a) {
    var active = _a.active;
    return _jsx("span", { className: "ra-pagination__dot ".concat(active ? 'is-active' : ''), "aria-hidden": "true" });
}
function ReceiptPreviewPanel(_a) {
    var entry = _a.entry, selectedDate = _a.selectedDate, draft = _a.draft;
    var normalizedDraft = draft.trim();
    if (!entry || entry.draft !== normalizedDraft) {
        return (_jsx("section", { className: "ra-receipt-preview ra-receipt-preview--empty", children: _jsxs("div", { className: "ra-receipt-preview__empty-card", children: [_jsx("p", { className: "ra-kicker", children: "RECEIPT PREVIEW" }), _jsx("h2", { children: "\u5F53\u524D\u8FD8\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u5C0F\u7968" }), _jsx("p", { children: normalizedDraft ? '先生成当前日期内容，再左滑查看正式小票。' : '这个日期还是空白，写下内容后即可生成小票。' }), _jsx("span", { children: selectedDate })] }) }));
    }
    var receipt = normalizeReceiptRecord(entry.receipt, {
        userInput: entry.draft,
        date: entry.dateIso,
    });
    return (_jsxs("section", { className: "ra-receipt-preview", children: [_jsxs("div", { className: "ra-receipt-preview__header", children: [_jsxs("div", { children: [_jsx("p", { className: "ra-kicker", children: "RECEIPT PREVIEW" }), _jsx("h2", { children: "\u5F53\u524D\u65E5\u671F\u5C0F\u7968" })] }), _jsx("span", { children: entry.generatedAt.slice(0, 10) })] }), _jsx("div", { className: "ra-receipt-preview__canvas", children: _jsx(ReceiptCanvas, { receipt: receipt, mode: "preview" }) })] }));
}
function GeneratingOverlay() {
    return (_jsx("div", { className: "ra-overlay", role: "status", "aria-live": "polite", children: _jsxs("div", { className: "ra-overlay__panel", children: [_jsx("p", { className: "ra-kicker", children: "GENERATING" }), _jsx("h2", { children: "\u6B63\u5728\u6574\u7406\u5E76\u751F\u6210\u5C0F\u7968" }), _jsx("p", { children: "\u8BF7\u7A0D\u5019\uFF0C\u5F53\u524D\u65E5\u671F\u7684\u5C0F\u7968\u5185\u5BB9\u6B63\u5728\u5199\u5165\u9884\u89C8\u9875\u3002" })] }) }));
}
export function ReceiptAlmanacMobileApp() {
    var _this = this;
    var _a;
    var todayIso = useMemo(function () { return formatIsoDate(getNowInTimezone(APP_TIMEZONE)); }, []);
    var _b = useState(todayIso), selectedDate = _b[0], setSelectedDate = _b[1];
    var _c = useState({}), drafts = _c[0], setDrafts = _c[1];
    var _d = useState({}), generatedMap = _d[0], setGeneratedMap = _d[1];
    var _e = useState(false), isGenerating = _e[0], setIsGenerating = _e[1];
    var _f = useState('input'), activePanel = _f[0], setActivePanel = _f[1];
    var panelRef = useRef(null);
    var draft = (_a = drafts[selectedDate]) !== null && _a !== void 0 ? _a : '';
    var generatedEntry = generatedMap[selectedDate];
    var status = getEntryStatus(draft, generatedEntry);
    var statusCopy = getStatusCopy(status);
    var dateMeta = buildReceiptDateBlock(selectedDate);
    var isReceiptAvailable = status === 'generated';
    var handleDraftChange = function (value) {
        setDrafts(function (current) {
            var _a;
            return (__assign(__assign({}, current), (_a = {}, _a[selectedDate] = value, _a)));
        });
    };
    var handleGenerate = function () { return __awaiter(_this, void 0, void 0, function () {
        var normalizedDraft, receipt, nextEntry_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalizedDraft = draft.trim();
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
    return (_jsxs("main", { className: "ra-app-shell", children: [_jsx("div", { className: "ra-page-frame", children: _jsxs("div", { className: "ra-panels", ref: panelRef, onScroll: function (event) {
                        var container = event.currentTarget;
                        setActivePanel(container.scrollLeft > container.clientWidth / 2 ? 'receipt' : 'input');
                    }, children: [_jsx("section", { className: "ra-panel ra-panel--input", children: _jsxs("div", { className: "ra-screen", children: [_jsxs("header", { className: "ra-hero", children: [_jsxs("div", { className: "ra-hero__topline", children: [_jsx("span", { children: "RECEIPT ALMANAC" }), _jsx("span", { className: "ra-barcode-mark", "aria-hidden": "true", children: "||||||||||" })] }), _jsxs("div", { className: "ra-hero__copy", children: [_jsx("p", { className: "ra-kicker", children: "\u4ECA\u65E5\u9EC4\u5386\u5C0F\u7968" }), _jsx("h1", { children: "\u4ECA\u65E5\u9EC4\u5386\u5C0F\u7968" }), _jsx("p", { children: "\u8BB0\u5F55\u6B64\u523B\uFF0C\u751F\u6210\u4F60\u7684\u8FD9\u4E00\u5929\u3002" })] })] }), _jsxs("section", { className: "ra-date-section", children: [_jsxs("div", { className: "ra-date-section__header", children: [_jsxs("div", { children: [_jsx("p", { className: "ra-kicker", children: "DATE" }), _jsx("span", { className: "ra-date-section__type", children: "\u516C\u5386 / SOLAR" })] }), _jsxs("label", { className: "ra-status-pill is-".concat(status), children: [_jsx("span", { className: "ra-status-pill__dot" }), statusCopy.label] })] }), _jsxs("label", { className: "ra-date-display", children: [_jsxs("div", { className: "ra-date-display__numbers", children: [_jsx("span", { children: dateMeta.year }), _jsx("em", { children: "/" }), _jsx("span", { children: dateMeta.month }), _jsx("em", { children: "/" }), _jsx("span", { children: dateMeta.day })] }), _jsxs("div", { className: "ra-date-display__side", children: [_jsxs("span", { className: "ra-weekday-capsule", children: [_jsx("strong", { children: dateMeta.weekdayZh.replace('星期', '周') }), _jsx("small", { children: dateMeta.weekdayEn.slice(0, 3) })] }), _jsx("span", { className: "ra-date-display__chevron", children: "\u2304" })] }), _jsx("input", { "aria-label": "\u9009\u62E9\u65E5\u671F", className: "ra-date-display__input", type: "date", value: selectedDate, onChange: function (event) { return setSelectedDate(event.target.value); } })] }), _jsxs("div", { className: "ra-lunar-row", "aria-label": "\u519C\u5386\u4FE1\u606F", children: [_jsx("span", { children: "LUNAR" }), _jsx("span", { children: dateMeta.ganzhi }), _jsx("span", { children: dateMeta.lunar })] })] }), _jsxs("section", { className: "ra-input-section", children: [_jsxs("div", { className: "ra-input-section__header", children: [_jsxs("div", { children: [_jsx("p", { className: "ra-kicker", children: "INPUT FOR THIS DATE" }), _jsx("h2", { children: "\u5199\u4E0B\u8FD9\u4E00\u5929" }), _jsx("p", { children: "\u968F\u624B\u8BB0\u5F55\u6B64\u523B\u7684\u60F3\u6CD5\u3001\u611F\u53D7\u6216\u91CD\u8981\u4E8B\u9879\u3002" })] }), _jsxs("span", { className: "ra-count", children: [draft.length, " / ", MAX_CHARS] })] }), _jsx("label", { className: "ra-textarea-shell", children: _jsx("textarea", { value: draft, onChange: function (event) { return handleDraftChange(event.target.value.slice(0, MAX_CHARS)); }, placeholder: "\u5199\u4E0B\u8FD9\u4E00\u5929\u3002", rows: 8 }) })] }), _jsx("section", { className: "ra-status-line", "aria-label": "\u5F53\u524D\u65E5\u671F\u72B6\u6001", children: _jsx("span", { children: statusCopy.message }) }), _jsxs("button", { className: "ra-generate-button", onClick: handleGenerate, type: "button", disabled: isGenerating || !draft.trim(), children: [_jsx("span", { className: "ra-generate-button__icon", children: _jsx(ReceiptGlyph, {}) }), _jsxs("span", { className: "ra-generate-button__copy", children: [_jsx("strong", { children: getGenerateLabel(status) }), _jsx("small", { children: "GENERATE RECEIPT" })] }), _jsx("span", { className: "ra-generate-button__arrow", children: _jsx(ArrowIcon, {}) })] }), _jsxs("nav", { className: "ra-pagination", "aria-label": "\u9875\u9762\u5207\u6362", children: [_jsx("button", { className: "ra-pagination__item ".concat(activePanel === 'input' ? 'is-active' : ''), onClick: function () {
                                                    setActivePanel('input');
                                                    scrollToPanel(panelRef.current, 'input');
                                                }, type: "button", children: "INPUT" }), _jsx(StatusDot, { active: activePanel === 'input' }), _jsx("button", { className: "ra-pagination__item ".concat(activePanel === 'receipt' ? 'is-active' : ''), onClick: function () {
                                                    if (isReceiptAvailable) {
                                                        setActivePanel('receipt');
                                                        scrollToPanel(panelRef.current, 'receipt');
                                                    }
                                                }, type: "button", disabled: !isReceiptAvailable, children: "RECEIPT" })] })] }) }), _jsx("section", { className: "ra-panel ra-panel--receipt", children: _jsx("div", { className: "ra-screen", children: _jsx(ReceiptPreviewPanel, { entry: generatedEntry, selectedDate: selectedDate, draft: draft }) }) })] }) }), isGenerating ? _jsx(GeneratingOverlay, {}) : null] }));
}
