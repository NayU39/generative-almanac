import type { ReceiptAlmanac } from '../src/features/receipt-almanac/types/receipt';
type DeepSeekConfig = {
    apiKey: string;
    model: string;
};
type GenerateRequest = {
    userInput: string;
    date: string;
    timezone: string;
};
export declare function generateReceiptWithDeepSeek(input: GenerateRequest, config: DeepSeekConfig): Promise<ReceiptAlmanac>;
export {};
