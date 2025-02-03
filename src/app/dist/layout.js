"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var Header_1 = require("../bounded-context/common/Header");
var react_1 = require("react");
var GlobalProviders_1 = require("../global/provider/GlobalProviders");
var utils_1 = require("@/shared/libs/utils");
var inter = google_1.Inter({ subsets: ["latin"] });
exports.metadata = {
    title: "Pageflow"
};
function RootLayout(_a) {
    var children = _a.children;
    return (react_1["default"].createElement("html", { lang: "ko", suppressHydrationWarning: true },
        react_1["default"].createElement("head", null),
        react_1["default"].createElement("body", { className: utils_1.cn(inter.className) },
            react_1["default"].createElement(GlobalProviders_1["default"], null,
                react_1["default"].createElement(Header_1["default"], null),
                react_1["default"].createElement("div", { className: "container" }, children)))));
}
exports["default"] = RootLayout;
