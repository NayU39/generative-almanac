import type { GenerateReceiptParams, ReceiptAlmanac } from '../types/receipt';
export declare function normalizeReceiptRecord(raw: unknown, input: Pick<GenerateReceiptParams, 'userInput' | 'date'>): ReceiptAlmanac;
