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
function buildPrompt(input) {
    return [
        '浣犳槸涓€涓€淩eceipt Almanac / 榛勫巻灏忕エ鈥濈殑缁撴瀯鍖栧唴瀹圭敓鎴愬櫒銆?',
        '璇锋牴鎹敤鎴疯緭鍏ョ敓鎴愪竴寮犵湡瀹?receipt 椋庢牸灏忕エ鎵€闇€鐨?JSON銆?',
        '涓嶈杈撳嚭 markdown锛屼笉瑕佽В閲婏紝鍙緭鍑?JSON銆?',
        '鍐呭瑕佸厠鍒躲€佺幇浠ｃ€佸彲鎵ц锛屼笉瑕佹槦绌恒€佹按澧ㄣ€佺巹瀛﹀璇濄€?',
        '瀛楁蹇呴』鍖呭惈锛歵itle, subtitle, issueCode, serialNo, date, stateLabel, headline, yi, ji, meta, printedAt, barcodeValue銆?',
        'yi 鍜?ji 鍚勮緭鍑?3 鍒?5 鏉°€?',
        'meta 閲屽繀椤诲寘鍚?auspiciousTime, direction, luckyColor, energy, memo銆?',
        "\u93C3\u30E6\u6E61: ".concat(input.date),
        "\u93C3\u8DFA\u5C2F: ".concat(input.timezone),
        "\u9422\u3126\u57DB\u6748\u64B3\u53C6: ".concat(input.userInput),
    ].join('\n');
}
function parseJsonContent(content) {
    var normalized = content.trim().replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '');
    return JSON.parse(normalized);
}
export function generateReceiptWithDeepSeek(input, config) {
    return __awaiter(this, void 0, void 0, function () {
        var response, errorText, result, content;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fetch('https://api.deepseek.com/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: "Bearer ".concat(config.apiKey),
                        },
                        body: JSON.stringify({
                            model: config.model,
                            messages: [{ role: 'user', content: buildPrompt(input) }],
                            temperature: 0.7,
                            response_format: { type: 'json_object' },
                        }),
                    })];
                case 1:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorText = _d.sent();
                    throw new Error("DeepSeek API error (".concat(response.status, "): ").concat(errorText));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    result = (_d.sent());
                    content = (_c = (_b = (_a = result.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                    if (!content) {
                        throw new Error('DeepSeek returned empty content.');
                    }
                    return [2 /*return*/, parseJsonContent(content)];
            }
        });
    });
}
