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
var SYSTEM_PROMPT = [
    'You generate copy for a receipt-style daily almanac.',
    'Return JSON only. Do not return Markdown, code fences, notes, or explanations.',
    'The JSON must contain exactly these keys: summary, headline, yi, ji, auspiciousTime, direction, luckyColor.',
    'Write all values in Simplified Chinese.',
    'summary: 28-36 Chinese characters, one sentence, calm and concrete.',
    'headline: 4-8 Chinese characters, suitable for the main judgement line.',
    'yi: array of exactly 4 items, each item 4-6 Chinese characters.',
    'ji: array of exactly 4 items, each item 4-6 Chinese characters.',
    'auspiciousTime: time range string like 09:00 - 11:30.',
    'direction: 16-24 Chinese characters, short phrase or sentence.',
    'luckyColor: 2-3 color words separated by " / ".',
    'Keep the content closely tied to the user input and date context.',
    'Avoid mystic filler, vague blessings, and generic motivational slogans.',
].join('\n');
function buildUserPrompt(input) {
    return [
        "\u65E5\u671F: ".concat(input.date),
        "\u65F6\u533A: ".concat(input.timezone),
        "\u7528\u6237\u8F93\u5165: ".concat(input.userInput),
        '请基于以上信息生成当日小票内容。',
    ].join('\n');
}
function parseJsonContent(content) {
    var normalized = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
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
                            messages: [
                                { role: 'system', content: SYSTEM_PROMPT },
                                { role: 'user', content: buildUserPrompt(input) },
                            ],
                            temperature: 0.8,
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
