import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ReceiptHeader(_a) {
    var receipt = _a.receipt;
    return (_jsxs("header", { className: "receipt-section receipt-header", children: [_jsxs("div", { children: [_jsx("p", { className: "receipt-kicker", children: receipt.title }), _jsx("h2", { children: receipt.subtitle })] }), _jsxs("div", { className: "receipt-header-meta", children: [_jsx("span", { children: receipt.issueCode }), _jsx("span", { children: receipt.serialNo })] })] }));
}
