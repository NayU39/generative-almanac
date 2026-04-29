import { buildIssueCode, buildReceiptDateBlock, buildSerialNo, formatPrintedAt, getTodayIsoDate, } from '../../../lib/date';
export function buildMockReceipt(userInput, date) {
    if (date === void 0) { date = getTodayIsoDate(); }
    var compactInput = userInput.trim() || '鎯虫妸浠婂ぉ杩囧緱瀹夐潤涓€鐐广€?';
    var seed = "".concat(date, ":").concat(compactInput);
    return {
        title: 'RECEIPT ALMANAC',
        subtitle: 'Quiet Afternoon Edition',
        issueCode: buildIssueCode(date),
        serialNo: buildSerialNo(seed),
        date: buildReceiptDateBlock(date),
        stateLabel: '瀹夐潤鍗堝悗',
        headline: '鍐烽潤鎵ц锛屾瘮棰濆鍙戝姏鏇撮噸瑕併€?',
        yi: ['鏁寸悊妗岄潰', '鍒嗘鎺ㄨ繘', '瀹夐潤鍐欎綔', '纭缁嗚妭'],
        ji: ['鍙嶅鍒囨崲', '涓存椂鍔犵爜', '绌鸿浆鐒﹁檻', '鎷栧埌娣卞'],
        meta: {
            auspiciousTime: '14:10 - 17:40',
            direction: '鏈濈獥杈瑰潗锛屽厛鍋氭渶瀹夐潤鐨勪竴椤?',
            luckyColor: '闆剧伆 / 绾哥背 / 娣卞ⅷ',
            energy: '绋冲畾鍋忎綆锛屽疁鎱㈢儹杩涘叆鐘舵€?',
            memo: compactInput,
        },
        printedAt: formatPrintedAt(),
        barcodeValue: "".concat(buildIssueCode(date), "-").concat(buildSerialNo(seed).slice(-6)),
    };
}
