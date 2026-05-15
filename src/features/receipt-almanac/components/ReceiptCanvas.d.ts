import type { ReceiptAlmanac } from '../types/receipt';
import '../styles/receipt.css';
type ReceiptCanvasProps = {
    receipt: ReceiptAlmanac;
    mode?: 'default' | 'preview';
};
export declare const ReceiptCanvas: import("react").ForwardRefExoticComponent<ReceiptCanvasProps & import("react").RefAttributes<HTMLElement>>;
export {};
