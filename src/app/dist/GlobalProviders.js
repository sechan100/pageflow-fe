'use client';
"use strict";
exports.__esModule = true;
exports.SessionContext = void 0;
var ThemeProvider_1 = require("@/global/theme/ThemeProvider");
var useSession_1 = require("@/bounded-context/user/hooks/useSession");
var DefaultAxiosFactory_1 = require("@/bounded-context/user/services/DefaultAxiosFactory");
var AccessTokenStorage_1 = require("@/bounded-context/user/services/AccessTokenStorage");
var react_1 = require("react");
var react_query_1 = require("react-query");
var AsyncRequestBuilder_1 = require("@/global/apis/AsyncRequestBuilder");
var ToastProvider_1 = require("@/global/toast/ToastProvider");
var queryClient = reactQueryConfig();
exports.SessionContext = react_1.createContext(initSession());
function GlobalProviders(_a) {
    var children = _a.children;
    react_1.useEffect(function () {
        var handleRejection = function (event) {
            var reason = event.reason;
            // CodeActions에 의해서 이미 처리된 Promise인 경우 무시
            if (reason instanceof AsyncRequestBuilder_1.RejectedForCodeActionCall) {
                console.debug(reason.name + "\uAC00 Action\uC5D0 \uC758\uD574\uC11C \uC62C\uBC14\uB974\uAC8C \uCC98\uB9AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
                event.preventDefault();
                return;
            }
        };
        // 거부된 프로미스 처리 로직
        window.addEventListener('unhandledrejection', handleRejection);
        return function () {
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);
    return (React.createElement(ThemeProvider_1.ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true },
        React.createElement(react_query_1.QueryClientProvider, { client: queryClient },
            React.createElement(exports.SessionContext.Provider, { value: initSession() },
                React.createElement(ToastProvider_1["default"], null, children)))));
}
exports["default"] = GlobalProviders;
// react-query
function reactQueryConfig() {
    // react-query 전역 객체
    var queryClient = new react_query_1.QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                retry: false,
                staleTime: 1000 * 60 * 60 // staleTime 1시간
            }
        }
    });
    return queryClient;
}
function initSession() {
    // AccessTokenStorage
    var accessTokenStorage = new AccessTokenStorage_1.PrivatePropertyAccessTokenStorage();
    // 세션 관리자
    var sessionManager = new useSession_1.useSession(accessTokenStorage);
    // ApiRequest
    var request = new DefaultAxiosFactory_1.DefaultAxiosFactory(accessTokenStorage);
    return {
        sessionManager: sessionManager,
        api: request
    };
}
