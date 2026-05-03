var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { buildIssueCode, buildReceiptDateBlock, buildSerialNo, formatPrintedAt, getTodayIsoDate, } from '../../../lib/date';
var DEFAULT_YI = ['整理日程', '推进写作', '安静独处', '按时休息'];
var DEFAULT_JI = ['过度分心', '临时拖延', '深夜熬夜', '重复内耗'];
function pickByKeywords(userInput) {
    var input = userInput.trim();
    if (/(论文|写作|文章|方案|毕业设计|答辩)/.test(input)) {
        return {
            summary: '今日适合梳理结构与节奏，把关键任务按顺序推进完成。',
            headline: '宜稳步推进',
            yi: ['梳理论文', '细化方案', '分段写作', '晚间阅读'],
            ji: ['反复改题', '频繁切换', '拖到深夜', '空想不写'],
            auspiciousTime: '09:00 - 11:30',
            direction: '朝向采光稳定与桌面清爽的一侧更顺。',
            luckyColor: '米白 / 暖灰 / 墨黑',
        };
    }
    if (/(开会|沟通|汇报|协作|复盘)/.test(input)) {
        return {
            summary: '今日适合先统一重点，再把沟通成本压到最少的范围内。',
            headline: '宜先定重点',
            yi: ['明确议程', '简洁表达', '同步进度', '会后收束'],
            ji: ['临场发散', '重复解释', '情绪争辩', '遗漏结论'],
            auspiciousTime: '10:30 - 12:00',
            direction: '靠近安静入口与信息集中的一侧更有利。',
            luckyColor: '石白 / 雾蓝 / 深灰',
        };
    }
    return {
        summary: '今日适合稳步完成计划，也适合把杂念留在纸面之外。',
        headline: '适合整理日程',
        yi: __spreadArray([], DEFAULT_YI, true),
        ji: __spreadArray([], DEFAULT_JI, true),
        auspiciousTime: '09:00 - 11:30',
        direction: '面向安静与清醒感的一侧更容易进入状态。',
        luckyColor: '米白 / 暖灰 / 墨黑',
    };
}
export function buildMockReceipt(userInput, date) {
    if (date === void 0) { date = getTodayIsoDate(); }
    var compactInput = userInput.trim() || '\u4eca\u65e5\u5b9c\u6574\u7406\u601d\u7eea\uff0c\u6162\u6162\u63a8\u8fdb\u624b\u5934\u8ba1\u5212\u3002';
    var seed = "".concat(date, ":").concat(compactInput);
    var generated = pickByKeywords(compactInput);
    return {
        title: 'RECEIPT ALMANAC',
        subtitle: 'Generated Daily Ticket',
        issueCode: buildIssueCode(date),
        serialNo: buildSerialNo(seed),
        date: buildReceiptDateBlock(date),
        stateLabel: '\u5df2\u751f\u6210',
        summary: generated.summary,
        headline: generated.headline,
        yi: generated.yi,
        ji: generated.ji,
        meta: {
            auspiciousTime: generated.auspiciousTime,
            direction: generated.direction,
            luckyColor: generated.luckyColor,
            memo: compactInput,
        },
        printedAt: formatPrintedAt(),
        barcodeValue: "".concat(buildIssueCode(date), "-").concat(buildSerialNo(seed).slice(-6)),
        source: 'mock',
    };
}
