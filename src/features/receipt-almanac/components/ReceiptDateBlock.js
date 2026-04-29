import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ReceiptDateBlock(_a) {
    var date = _a.date;
    return (_jsxs("section", { className: "receipt-section receipt-date-block", children: [_jsxs("div", { className: "receipt-date-main", children: [_jsx("span", { className: "receipt-date-day", children: date.day }), _jsxs("div", { children: [_jsxs("p", { className: "receipt-date-month", children: [date.year, ".", date.month] }), _jsxs("p", { className: "receipt-date-weekday", children: [date.weekdayZh, " / ", date.weekdayEn] })] })] }), _jsx("div", { className: "receipt-divider" }), _jsxs("div", { className: "receipt-date-submeta", children: [_jsxs("span", { children: ["SOLAR ", date.solar] }), _jsxs("span", { children: ["LUNAR ", date.lunar] }), _jsx("span", { children: date.ganzhi })] })] }));
}
