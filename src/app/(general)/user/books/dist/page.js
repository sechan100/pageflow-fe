'use client';
"use strict";
exports.__esModule = true;
var MyBook_1 = require("@/bounded-context/book/bookshelf/MyBook");
var dummyInfo = {
    id: "dfkhjg2425",
    title: "Dummy Title",
    coverImageUrl: "http://localhost:8888/img/default-book-cover-img.png"
};
var MyBooks = function () {
    return (React.createElement("div", { className: "container h-full" },
        React.createElement("div", { className: "" }, "header"),
        React.createElement("div", { className: "grid grid-cols-4 gap-5" },
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }),
            React.createElement(MyBook_1["default"], { info: dummyInfo }))));
};
exports["default"] = MyBooks;
