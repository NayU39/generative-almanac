import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ReceiptYiJiBlock(_a) {
    var label = _a.label, items = _a.items;
    return (_jsxs("section", { className: "receipt-section receipt-list-block", children: [_jsx("p", { className: "receipt-section-label", children: label }), _jsx("ul", { children: items.map(function (item) { return (_jsx("li", { children: item }, "".concat(label, "-").concat(item))); }) })] }));
}
