'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var UserSchemata_1 = require("@/bounded-context/user/shared/UserSchemata");
var form_1 = require("@/shared/components/shadcn/form");
var input_1 = require("@/shared/components/shadcn/input");
var zod_1 = require("@hookform/resolvers/zod");
var button_1 = require("@/shared/components/shadcn/button");
var react_hook_form_1 = require("react-hook-form");
var zod_2 = require("zod");
var useRouting_1 = require("@/shared/hook/useRouting");
var signup_1 = require("@/bounded-context/user/api/signup");
function OAuth2SignupForm() {
    var getUrlState = useRouting_1.useRouting().getUrlState;
    // 라우팅으로 같이 넘어온 데이터가 존재하지 않음 -> 라우팅을 통한 접근이 아니므로 에러
    if (!getUrlState().signupCache) {
        throw new Error("url state가 존재하지 않습니다.");
    }
    var signupCache = getUrlState().signupCache;
    // Zod 스키마 정의
    var signupFormSchema = zod_2.z.object({
        // email
        email: zod_2.z.string().email(),
        // penname
        penname: UserSchemata_1.zodUserSchemata.penname
    });
    // form 객체 생성
    var signupForm = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(signupFormSchema),
        defaultValues: {
            email: signupCache.email,
            penname: signupCache.penname
        }
    });
    // 제출 이벤트 콜백
    function onSubmit(values) {
        // Post 요청에 담을 객체를 생성
        var signupForm = {
            username: signupCache.username,
            password: signupCache.password,
            email: values.email,
            penname: values.penname,
            profileImgUrl: signupCache.profileImgUrl
        };
        // 회원가입 요청 전송
        signup_1["default"](signupForm);
    }
    return (React.createElement(form_1.Form, __assign({}, signupForm),
        React.createElement("form", { id: "signup_form", onSubmit: signupForm.handleSubmit(onSubmit), className: "space-y-2" },
            React.createElement(form_1.FormField, { control: signupForm.control, name: "email", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uC774\uBA54\uC77C"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ type: "email", placeholder: "email" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } }),
            React.createElement(form_1.FormField, { control: signupForm.control, name: "penname", render: function (_a) {
                    var field = _a.field;
                    return (React.createElement(form_1.FormItem, null,
                        React.createElement(form_1.FormLabel, { className: "text-white" }, "\uD544\uBA85"),
                        React.createElement(form_1.FormControl, null,
                            React.createElement(input_1.Input, __assign({ type: "penname", placeholder: "penname" }, field))),
                        React.createElement(form_1.FormMessage, null)));
                } })),
        React.createElement(button_1.Button, { form: "signup_form", type: "submit", className: "rounded-full" }, "\uD68C\uC6D0\uAC00\uC785")));
}
exports["default"] = OAuth2SignupForm;
