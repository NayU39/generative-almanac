import '../styles/receipt.css';
type ReceiptInputPageProps = {
    defaultValue: string;
    loading: boolean;
    error: string | null;
    onSubmit: (value: string) => void;
};
export declare function ReceiptInputPage({ defaultValue, loading, error, onSubmit, }: ReceiptInputPageProps): import("react/jsx-runtime").JSX.Element;
export {};
