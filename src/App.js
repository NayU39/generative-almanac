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
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { ReceiptInputPage } from './features/receipt-almanac/pages/ReceiptInputPage';
import { ReceiptResultPage } from './features/receipt-almanac/pages/ReceiptResultPage';
import { generateReceiptContent } from './features/receipt-almanac/services/generateReceiptContent';
export default function App() {
    var _this = this;
    var _a = useState('鎯冲畨闈欐帹杩涗粖澶╃殑浜嬶紝涓嬪崍鐣欑粰鏁寸悊銆佸啓浣滃拰鎱㈡參瀹屾垚銆?'), draft = _a[0], setDraft = _a[1];
    var _b = useState(null), receipt = _b[0], setReceipt = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var handleGenerate = function (nextDraft) { return __awaiter(_this, void 0, void 0, function () {
        var nextReceipt, generationError_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setDraft(nextDraft);
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, generateReceiptContent({
                            userInput: nextDraft,
                        })];
                case 2:
                    nextReceipt = _a.sent();
                    setReceipt(nextReceipt);
                    return [3 /*break*/, 5];
                case 3:
                    generationError_1 = _a.sent();
                    setError(generationError_1 instanceof Error ? generationError_1.message : '鐢熸垚澶辫触銆?');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!receipt) {
        return (_jsx(ReceiptInputPage, { defaultValue: draft, loading: loading, error: error, onSubmit: handleGenerate }));
    }
    return (_jsx(ReceiptResultPage, { draft: draft, receipt: receipt, loading: loading, error: error, onBack: function () { return setReceipt(null); }, onRegenerate: function () { return handleGenerate(draft); } }));
}
