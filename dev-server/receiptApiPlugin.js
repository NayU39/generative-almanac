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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { buildMockReceipt } from '../src/features/receipt-almanac/data/mockReceipt';
import { generateReceiptWithDeepSeek } from './deepseek';
function writeJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
}
function readBody(req) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, chunk, e_1_1;
        var _a, req_1, req_1_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    chunks = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _a = true, req_1 = __asyncValues(req);
                    _e.label = 2;
                case 2: return [4 /*yield*/, req_1.next()];
                case 3:
                    if (!(req_1_1 = _e.sent(), _b = req_1_1.done, !_b)) return [3 /*break*/, 5];
                    _d = req_1_1.value;
                    _a = false;
                    chunk = _d;
                    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                    _e.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(!_a && !_b && (_c = req_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(req_1)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, Buffer.concat(chunks).toString('utf8')];
            }
        });
    });
}
function normalizeRequest(raw) {
    var body = typeof raw === 'object' && raw !== null ? raw : {};
    var userInput = typeof body.userInput === 'string' ? body.userInput.trim() : '';
    var date = typeof body.date === 'string' ? body.date : new Date().toISOString().slice(0, 10);
    var timezone = typeof body.timezone === 'string' ? body.timezone : 'Asia/Shanghai';
    if (!userInput) {
        throw new Error('userInput is required.');
    }
    return { userInput: userInput, date: date, timezone: timezone };
}
function handleGenerateRequest(req, res, options) {
    return __awaiter(this, void 0, void 0, function () {
        var rawBody, input, receipt, error_1, message, error_2, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, readBody(req)];
                case 1:
                    rawBody = _a.sent();
                    input = normalizeRequest(rawBody ? JSON.parse(rawBody) : {});
                    if (!options.apiKey) {
                        writeJson(res, 200, {
                            receipt: buildMockReceipt(input.userInput, input.date),
                            source: 'mock',
                            warning: 'DEEPSEEK_API_KEY is missing, fallback to mock.',
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, generateReceiptWithDeepSeek(input, {
                            apiKey: options.apiKey,
                            model: options.model,
                        })];
                case 3:
                    receipt = _a.sent();
                    writeJson(res, 200, { receipt: receipt, source: 'ai' });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    message = error_1 instanceof Error ? error_1.message : 'Unknown AI generation error.';
                    writeJson(res, 200, {
                        receipt: buildMockReceipt(input.userInput, input.date),
                        source: 'mock',
                        warning: message,
                    });
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    message = error_2 instanceof Error ? error_2.message : 'Unknown server error.';
                    writeJson(res, 500, { error: message });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function createMiddleware(options) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.url === '/api/receipt-almanac/generate' && req.method === 'POST')) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleGenerateRequest(req, res, options)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2:
                    next();
                    return [2 /*return*/];
            }
        });
    }); };
}
export function receiptApiPlugin(options) {
    return {
        name: 'receipt-api-plugin',
        configureServer: function (server) {
            server.middlewares.use(createMiddleware(options));
        },
        configurePreviewServer: function (server) {
            server.middlewares.use(createMiddleware(options));
        },
    };
}
