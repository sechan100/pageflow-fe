'use client';
"use strict";
exports.__esModule = true;
var avatar_1 = require("@/components/ui/avatar");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function UserWidget() {
    var session = _getUserSession(1);
    return (React.createElement(React.Fragment, null, session.isLogin && React.createElement(LoginedUser, null) || React.createElement(AnonymousUser, null)));
}
exports["default"] = UserWidget;
function AnonymousUser() {
    return (React.createElement(link_1["default"], { href: "/login" },
        React.createElement(button_1.Button, { variant: "outline", className: "rounded-full" }, "\uB85C\uADF8\uC778")));
}
function LoginedUser() {
    return (React.createElement(React.Fragment, null,
        React.createElement(dropdown_menu_1.DropdownMenu, { modal: true },
            React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                React.createElement(button_1.Button, { variant: "ghost", asChild: true },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement(avatar_1.Avatar, { className: "mr-1" },
                            React.createElement(avatar_1.AvatarImage, { src: "https://avatars.githubusercontent.com/u/4233953?v=4", alt: "profile image" }),
                            React.createElement(avatar_1.AvatarFallback, null, "\uD398\uD50C")),
                        React.createElement("span", null, "pageflow \uC791\uAC00\uB2D8")))),
            React.createElement(dropdown_menu_1.DropdownMenuContent, null,
                React.createElement(dropdown_menu_1.DropdownMenuLabel, null, "100yearschan@gmail.com"),
                React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                React.createElement(DDLink, { href: "/account", name: "\uACC4\uC815 \uC124\uC815", icon: React.createElement(lucide_react_1.UserCog, null) }),
                React.createElement(DDLink, { href: "/support", name: "\uACE0\uAC1D\uC13C\uD130", icon: React.createElement(lucide_react_1.Phone, null) }),
                React.createElement(DDLink, { href: "/logout", name: "\uB85C\uADF8\uC544\uC6C3", icon: React.createElement(lucide_react_1.LogOut, null) })))));
}
// Dropdown Menu의 item중, Link 컴포넌트 기반 + 아이콘인 경우
function DDLink(_a) {
    var href = _a.href, name = _a.name, icon = _a.icon;
    return (React.createElement(link_1["default"], { href: href, className: "flex items-center" },
        React.createElement(dropdown_menu_1.DropdownMenuItem, { className: "w-full cursor-pointer" },
            icon,
            React.createElement("span", { className: "ml-2" }, name))));
}
function _getUserSession(UID) {
    return {
        isLogin: false,
        user: {
            id: 1,
            username: "pageflow",
            email: "email12944@pageflow.org",
            profileImgUrl: "https://avatars.githubusercontent.com/u/4233953?v=4",
            penname: "페플러"
        }
    };
}
