import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { ExportReceiptButton } from '../components/ExportReceiptButton';
import { ReceiptCanvas } from '../components/ReceiptCanvas';
export function ReceiptResultPage(_a) {
    var draft = _a.draft, receipt = _a.receipt, loading = _a.loading, error = _a.error, onBack = _a.onBack, onRegenerate = _a.onRegenerate;
    var canvasRef = useRef(null);
    return (_jsxs("main", { className: "receipt-app-shell receipt-result-shell", children: [_jsx("section", { className: "receipt-stage", children: _jsx(ReceiptCanvas, { ref: canvasRef, receipt: receipt }) }), _jsxs("aside", { className: "receipt-toolbar", children: [_jsx("p", { className: "receipt-eyebrow", children: "Current Input" }), _jsx("p", { className: "receipt-toolbar-copy", children: draft }), error ? _jsx("p", { className: "receipt-error", children: error }) : null, _jsxs("div", { className: "receipt-toolbar-actions", children: [_jsx("button", { className: "receipt-secondary-button", onClick: onBack, type: "button", children: "\u8FD4\u56DE\u4FEE\u6539" }), _jsx("button", { className: "receipt-primary-button", onClick: onRegenerate, disabled: loading, type: "button", children: loading ? '閲嶆柊鐢熸垚涓?..' : '閲嶆柊鐢熸垚' }), _jsx(ExportReceiptButton, { receipt: receipt, targetRef: canvasRef })] })] })] }));
}
