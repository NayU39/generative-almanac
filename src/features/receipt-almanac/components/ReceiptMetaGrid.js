import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var metaEntries = function (meta) { return [
    ['AUSPICIOUS TIME', meta.auspiciousTime],
    ['DIRECTION', meta.direction],
    ['LUCKY COLOR', meta.luckyColor],
    ['ENERGY', meta.energy],
    ['MEMO', meta.memo],
]; };
export function ReceiptMetaGrid(_a) {
    var meta = _a.meta;
    return (_jsx("section", { className: "receipt-section receipt-meta-grid", children: metaEntries(meta).map(function (_a) {
            var label = _a[0], value = _a[1];
            return (_jsxs("div", { className: "receipt-meta-item", children: [_jsx("span", { children: label }), _jsx("strong", { children: value })] }, label));
        }) }));
}
