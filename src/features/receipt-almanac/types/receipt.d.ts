export type ReceiptDateBlock = {
    solar: string;
    year: string;
    month: string;
    day: string;
    weekdayZh: string;
    weekdayEn: string;
    lunar: string;
    ganzhi: string;
};
export type ReceiptMeta = {
    auspiciousTime: string;
    direction: string;
    luckyColor: string;
    energy: string;
    memo: string;
};
export type ReceiptAlmanac = {
    title: string;
    subtitle: string;
    issueCode: string;
    serialNo: string;
    date: ReceiptDateBlock;
    stateLabel: string;
    headline: string;
    yi: string[];
    ji: string[];
    meta: ReceiptMeta;
    printedAt: string;
    barcodeValue: string;
};
export type GenerateReceiptParams = {
    userInput: string;
    date?: string;
    timezone?: string;
};
