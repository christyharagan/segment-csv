(this["webpackJsonpmonaco"] = this["webpackJsonpmonaco"] || []).push([[14],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/csp/csp.js":
/*!**********************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/csp/csp.js ***!
  \**********************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\n/*---------------------------------------------------------------------------------------------\r\n *  Copyright (c) Microsoft Corporation. All rights reserved.\r\n *  Licensed under the MIT License. See License.txt in the project root for license information.\r\n *--------------------------------------------------------------------------------------------*/\r\nvar conf = {\r\n    brackets: [],\r\n    autoClosingPairs: [],\r\n    surroundingPairs: []\r\n};\r\nvar language = {\r\n    // Set defaultToken to invalid to see what you do not tokenize yet\r\n    // defaultToken: 'invalid',\r\n    keywords: [],\r\n    typeKeywords: [],\r\n    tokenPostfix: '.csp',\r\n    operators: [],\r\n    symbols: /[=><!~?:&|+\\-*\\/\\^%]+/,\r\n    escapes: /\\\\(?:[abfnrtv\\\\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,\r\n    tokenizer: {\r\n        root: [\r\n            [/child-src/, 'string.quote'],\r\n            [/connect-src/, 'string.quote'],\r\n            [/default-src/, 'string.quote'],\r\n            [/font-src/, 'string.quote'],\r\n            [/frame-src/, 'string.quote'],\r\n            [/img-src/, 'string.quote'],\r\n            [/manifest-src/, 'string.quote'],\r\n            [/media-src/, 'string.quote'],\r\n            [/object-src/, 'string.quote'],\r\n            [/script-src/, 'string.quote'],\r\n            [/style-src/, 'string.quote'],\r\n            [/worker-src/, 'string.quote'],\r\n            [/base-uri/, 'string.quote'],\r\n            [/plugin-types/, 'string.quote'],\r\n            [/sandbox/, 'string.quote'],\r\n            [/disown-opener/, 'string.quote'],\r\n            [/form-action/, 'string.quote'],\r\n            [/frame-ancestors/, 'string.quote'],\r\n            [/report-uri/, 'string.quote'],\r\n            [/report-to/, 'string.quote'],\r\n            [/upgrade-insecure-requests/, 'string.quote'],\r\n            [/block-all-mixed-content/, 'string.quote'],\r\n            [/require-sri-for/, 'string.quote'],\r\n            [/reflected-xss/, 'string.quote'],\r\n            [/referrer/, 'string.quote'],\r\n            [/policy-uri/, 'string.quote'],\r\n            [/'self'/, 'string.quote'],\r\n            [/'unsafe-inline'/, 'string.quote'],\r\n            [/'unsafe-eval'/, 'string.quote'],\r\n            [/'strict-dynamic'/, 'string.quote'],\r\n            [/'unsafe-hashed-attributes'/, 'string.quote']\r\n        ]\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack://monaco/./node_modules/monaco-editor/esm/vs/basic-languages/csp/csp.js?");

/***/ })

}]);