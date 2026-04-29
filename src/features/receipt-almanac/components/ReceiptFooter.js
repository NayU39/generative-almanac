import { jsxs as _jsxs } from "react/jsx-runtime";
export function ReceiptFooter(_a) {
    var receipt = _a.receipt;
    return (_jsxs("footer", { className: "receipt-section receipt-footer", children: [_jsxs("span", { children: ["PRINTED AT ", receipt.printedAt] }), _jsxs("span", { children: ["SERIAL ", receipt.serialNo] })] }));
}
