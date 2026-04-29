import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import '../styles/receipt.css';
export function ReceiptInputPage(_a) {
    var defaultValue = _a.defaultValue, loading = _a.loading, error = _a.error, onSubmit = _a.onSubmit;
    var _b = useState(defaultValue), value = _b[0], setValue = _b[1];
    return (_jsx("main", { className: "receipt-app-shell", children: _jsxs("section", { className: "receipt-input-card", children: [_jsx("p", { className: "receipt-eyebrow", children: "Receipt Almanac MVP" }), _jsx("h1", { children: "\u751F\u6210\u5F0F\u9EC4\u5386\u5C0F\u7968" }), _jsx("p", { className: "receipt-lead", children: "\u8F93\u5165\u4F60\u4ECA\u5929\u7684\u72B6\u6001\u3001\u8BA1\u5212\u6216\u4E00\u53E5\u5FC3\u60C5\uFF0C\u7CFB\u7EDF\u4F1A\u5148\u7528 mock \u751F\u6210\u4E00\u5F20\u53EF\u4FDD\u5B58\u7684\u5C0F\u7968\u9EC4\u5386\u3002" }), _jsx("textarea", { className: "receipt-textarea", value: value, onChange: function (event) { return setValue(event.target.value); }, placeholder: "\u4F8B\u5982\uFF1A\u4E0B\u5348\u60F3\u5B89\u9759\u5904\u7406\u5F85\u529E\uFF0C\u5C11\u5F00\u4F1A\uFF0C\u5148\u628A\u5199\u4F5C\u548C\u6574\u7406\u5B8C\u6210\u3002", rows: 10 }), error ? _jsx("p", { className: "receipt-error", children: error }) : null, _jsx("button", { className: "receipt-primary-button", onClick: function () { return onSubmit(value); }, disabled: loading || !value.trim(), type: "button", children: loading ? '鐢熸垚涓?..' : '鎵撳嵃浠婃棩榛勫巻' })] }) }));
}
