import type { RefObject } from 'react';
import type { ReceiptAlmanac } from '../types/receipt';
type ExportReceiptButtonProps = {
    receipt: ReceiptAlmanac;
    targetRef: RefObject<HTMLDivElement>;
};
export declare function ExportReceiptButton({ receipt, targetRef }: ExportReceiptButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
