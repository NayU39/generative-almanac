import type { ReceiptAlmanac } from '../types/receipt';
type ReceiptResultPageProps = {
    draft: string;
    receipt: ReceiptAlmanac;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onRegenerate: () => void;
};
export declare function ReceiptResultPage({ draft, receipt, loading, error, onBack, onRegenerate, }: ReceiptResultPageProps): import("react/jsx-runtime").JSX.Element;
export {};
