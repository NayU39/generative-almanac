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
import { getTodayIsoDate } from '../../../lib/date';
import { buildMockReceipt } from '../data/mockReceipt';
import { normalizeReceiptRecord } from '../utils/normalizeReceiptRecord';
var DEFAULT_API_PATH = '/api/receipt-almanac/generate';
function joinApiUrl(baseUrl, path) {
    var normalizedBase = baseUrl.replace(/\/+$/, '');
    var normalizedPath = path.startsWith('/') ? path : "/".concat(path);
    return "".concat(normalizedBase).concat(normalizedPath);
}
function getApiUrl() {
    var _a;
    var configuredBaseUrl = (_a = import.meta.env.VITE_API_BASE_URL) === null || _a === void 0 ? void 0 : _a.trim();
    if (configuredBaseUrl) {
        return joinApiUrl(configuredBaseUrl, DEFAULT_API_PATH);
    }
    if (typeof window === 'undefined') {
        return DEFAULT_API_PATH;
    }
    if (window.location.protocol === 'file:') {
        return DEFAULT_API_PATH;
    }
    var _b = window.location, origin = _b.origin, hostname = _b.hostname, protocol = _b.protocol, port = _b.port;
    if (hostname === 'localhost') {
        return "".concat(protocol, "//127.0.0.1").concat(port ? ":".concat(port) : '').concat(DEFAULT_API_PATH);
    }
    return "".concat(origin).concat(DEFAULT_API_PATH);
}
export function generateReceiptContent(input) {
    return __awaiter(this, void 0, void 0, function () {
        var requestBody, response, payload, error_1, fallback;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    requestBody = {
                        userInput: input.userInput,
                        date: (_a = input.date) !== null && _a !== void 0 ? _a : getTodayIsoDate(),
                        timezone: (_b = input.timezone) !== null && _b !== void 0 ? _b : 'Asia/Shanghai',
                    };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(getApiUrl(), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody),
                        })];
                case 2:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error('Receipt generation request failed.');
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    payload = (_c.sent());
                    return [2 /*return*/, normalizeReceiptRecord(__assign(__assign({}, (typeof payload.receipt === 'object' && payload.receipt !== null
                            ? payload.receipt
                            : {})), { source: payload.source, warning: payload.warning }), requestBody)];
                case 4:
                    error_1 = _c.sent();
                    fallback = buildMockReceipt(requestBody.userInput, requestBody.date);
                    return [2 /*return*/, __assign(__assign({}, fallback), { source: 'mock', warning: error_1 instanceof Error ? error_1.message : 'Receipt generation failed, fallback to mock.' })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
