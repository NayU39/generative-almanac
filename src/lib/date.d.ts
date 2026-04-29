import type { ReceiptDateBlock } from '../features/receipt-almanac/types/receipt';
export declare function getTodayIsoDate(): string;
export declare function formatPrintedAt(date?: Date): string;
export declare function buildReceiptDateBlock(inputDate: string): ReceiptDateBlock;
export declare function buildIssueCode(inputDate: string): string;
export declare function buildSerialNo(seed: string): string;
