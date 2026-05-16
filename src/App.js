import { jsx as _jsx } from "react/jsx-runtime";
import { ReceiptAlmanacMobileApp } from './features/receipt-almanac/mobile/ReceiptAlmanacMobileApp';
export default function App() {
    return (_jsx("div", { className: "ra-demo-shell", children: _jsx("div", { className: "ra-mobile-frame", children: _jsx(ReceiptAlmanacMobileApp, {}) }) }));
}
