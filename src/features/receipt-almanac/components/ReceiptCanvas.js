import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { ReceiptBarcode } from './ReceiptBarcode';
import { ReceiptDateBlock } from './ReceiptDateBlock';
import { ReceiptFooter } from './ReceiptFooter';
import { ReceiptHeader } from './ReceiptHeader';
import { ReceiptJudgement } from './ReceiptJudgement';
import { ReceiptMetaGrid } from './ReceiptMetaGrid';
import { ReceiptYiJiBlock } from './ReceiptYiJiBlock';
export var ReceiptCanvas = forwardRef(function ReceiptCanvas(_a, ref) {
    var receipt = _a.receipt;
    return (_jsxs("div", { className: "receipt-canvas", ref: ref, children: [_jsx(ReceiptHeader, { receipt: receipt }), _jsx(ReceiptDateBlock, { date: receipt.date }), _jsx(ReceiptJudgement, { stateLabel: receipt.stateLabel, headline: receipt.headline }), _jsx(ReceiptYiJiBlock, { label: "\u5B9C / DO", items: receipt.yi }), _jsx(ReceiptYiJiBlock, { label: "\u5FCC / DON'T", items: receipt.ji }), _jsx(ReceiptMetaGrid, { meta: receipt.meta }), _jsx(ReceiptBarcode, { value: receipt.barcodeValue }), _jsx(ReceiptFooter, { receipt: receipt })] }));
});
