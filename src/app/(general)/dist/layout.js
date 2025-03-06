"use strict";
exports.__esModule = true;
require("../globals.css");
var Header_1 = require("../../bounded-context/common/Header");
var react_1 = require("react");
var GlobalLayout_1 = require("../GlobalLayout");
function RootLayout(_a) {
    var children = _a.children;
    return (react_1["default"].createElement(GlobalLayout_1["default"], null,
        react_1["default"].createElement(Header_1["default"], null),
        react_1["default"].createElement("div", { className: "container" }, children)));
}
exports["default"] = RootLayout;
