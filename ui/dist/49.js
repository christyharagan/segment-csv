(this["webpackJsonpmonaco"] = this["webpackJsonpmonaco"] || []).push([[49],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/razor/razor.js":
/*!**************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/razor/razor.js ***!
  \**************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\n/* harmony import */ var _fillers_monaco_editor_core_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../fillers/monaco-editor-core.js */ \"./node_modules/monaco-editor/esm/vs/basic-languages/fillers/monaco-editor-core.js\");\n/*---------------------------------------------------------------------------------------------\r\n *  Copyright (c) Microsoft Corporation. All rights reserved.\r\n *  Licensed under the MIT License. See License.txt in the project root for license information.\r\n *--------------------------------------------------------------------------------------------*/\r\n\r\nvar EMPTY_ELEMENTS = [\r\n    'area',\r\n    'base',\r\n    'br',\r\n    'col',\r\n    'embed',\r\n    'hr',\r\n    'img',\r\n    'input',\r\n    'keygen',\r\n    'link',\r\n    'menuitem',\r\n    'meta',\r\n    'param',\r\n    'source',\r\n    'track',\r\n    'wbr'\r\n];\r\nvar conf = {\r\n    wordPattern: /(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\$\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\'\\\"\\,\\.\\<\\>\\/\\s]+)/g,\r\n    comments: {\r\n        blockComment: ['<!--', '-->']\r\n    },\r\n    brackets: [\r\n        ['<!--', '-->'],\r\n        ['<', '>'],\r\n        ['{', '}'],\r\n        ['(', ')']\r\n    ],\r\n    autoClosingPairs: [\r\n        { open: '{', close: '}' },\r\n        { open: '[', close: ']' },\r\n        { open: '(', close: ')' },\r\n        { open: '\"', close: '\"' },\r\n        { open: \"'\", close: \"'\" }\r\n    ],\r\n    surroundingPairs: [\r\n        { open: '\"', close: '\"' },\r\n        { open: \"'\", close: \"'\" },\r\n        { open: '<', close: '>' }\r\n    ],\r\n    onEnterRules: [\r\n        {\r\n            beforeText: new RegExp(\"<(?!(?:\" + EMPTY_ELEMENTS.join('|') + \"))(\\\\w[\\\\w\\\\d]*)([^/>]*(?!/)>)[^<]*$\", 'i'),\r\n            afterText: /^<\\/(\\w[\\w\\d]*)\\s*>$/i,\r\n            action: {\r\n                indentAction: _fillers_monaco_editor_core_js__WEBPACK_IMPORTED_MODULE_0__[\"languages\"].IndentAction.IndentOutdent\r\n            }\r\n        },\r\n        {\r\n            beforeText: new RegExp(\"<(?!(?:\" + EMPTY_ELEMENTS.join('|') + \"))(\\\\w[\\\\w\\\\d]*)([^/>]*(?!/)>)[^<]*$\", 'i'),\r\n            action: { indentAction: _fillers_monaco_editor_core_js__WEBPACK_IMPORTED_MODULE_0__[\"languages\"].IndentAction.Indent }\r\n        }\r\n    ]\r\n};\r\nvar language = {\r\n    defaultToken: '',\r\n    tokenPostfix: '',\r\n    // ignoreCase: true,\r\n    // The main tokenizer for our languages\r\n    tokenizer: {\r\n        root: [\r\n            [/@@/],\r\n            [/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.root' }],\r\n            [/<!DOCTYPE/, 'metatag.html', '@doctype'],\r\n            [/<!--/, 'comment.html', '@comment'],\r\n            [/(<)(\\w+)(\\/>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],\r\n            [/(<)(script)/, ['delimiter.html', { token: 'tag.html', next: '@script' }]],\r\n            [/(<)(style)/, ['delimiter.html', { token: 'tag.html', next: '@style' }]],\r\n            [/(<)([:\\w]+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],\r\n            [/(<\\/)(\\w+)/, ['delimiter.html', { token: 'tag.html', next: '@otherTag' }]],\r\n            [/</, 'delimiter.html'],\r\n            [/[ \\t\\r\\n]+/],\r\n            [/[^<@]+/] // text\r\n        ],\r\n        doctype: [\r\n            [/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.comment' }],\r\n            [/[^>]+/, 'metatag.content.html'],\r\n            [/>/, 'metatag.html', '@pop']\r\n        ],\r\n        comment: [\r\n            [/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.comment' }],\r\n            [/-->/, 'comment.html', '@pop'],\r\n            [/[^-]+/, 'comment.content.html'],\r\n            [/./, 'comment.content.html']\r\n        ],\r\n        otherTag: [\r\n            [/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.otherTag' }],\r\n            [/\\/?>/, 'delimiter.html', '@pop'],\r\n            [/\"([^\"]*)\"/, 'attribute.value'],\r\n            [/'([^']*)'/, 'attribute.value'],\r\n            [/[\\w\\-]+/, 'attribute.name'],\r\n            [/=/, 'delimiter'],\r\n            [/[ \\t\\r\\n]+/] // whitespace\r\n        ],\r\n        // -- BEGIN <script> tags handling\r\n        // After <script\r\n        script: [\r\n            [/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.script' }],\r\n            [/type/, 'attribute.name', '@scriptAfterType'],\r\n            [/\"([^\"]*)\"/, 'attribute.value'],\r\n            [/'([^']*)'/, 'attribute.value'],\r\n            [/[\\w\\-]+/, 'attribute.name'],\r\n            [/=/, 'delimiter'],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@scriptEmbedded.text/javascript',\r\n                    nextEmbedded: 'text/javascript'\r\n                }\r\n            ],\r\n            [/[ \\t\\r\\n]+/],\r\n            [\r\n                /(<\\/)(script\\s*)(>)/,\r\n                ['delimiter.html', 'tag.html', { token: 'delimiter.html', next: '@pop' }]\r\n            ]\r\n        ],\r\n        // After <script ... type\r\n        scriptAfterType: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInSimpleState.scriptAfterType'\r\n                }\r\n            ],\r\n            [/=/, 'delimiter', '@scriptAfterTypeEquals'],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@scriptEmbedded.text/javascript',\r\n                    nextEmbedded: 'text/javascript'\r\n                }\r\n            ],\r\n            [/[ \\t\\r\\n]+/],\r\n            [/<\\/script\\s*>/, { token: '@rematch', next: '@pop' }]\r\n        ],\r\n        // After <script ... type =\r\n        scriptAfterTypeEquals: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInSimpleState.scriptAfterTypeEquals'\r\n                }\r\n            ],\r\n            [\r\n                /\"([^\"]*)\"/,\r\n                {\r\n                    token: 'attribute.value',\r\n                    switchTo: '@scriptWithCustomType.$1'\r\n                }\r\n            ],\r\n            [\r\n                /'([^']*)'/,\r\n                {\r\n                    token: 'attribute.value',\r\n                    switchTo: '@scriptWithCustomType.$1'\r\n                }\r\n            ],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@scriptEmbedded.text/javascript',\r\n                    nextEmbedded: 'text/javascript'\r\n                }\r\n            ],\r\n            [/[ \\t\\r\\n]+/],\r\n            [/<\\/script\\s*>/, { token: '@rematch', next: '@pop' }]\r\n        ],\r\n        // After <script ... type = $S2\r\n        scriptWithCustomType: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInSimpleState.scriptWithCustomType.$S2'\r\n                }\r\n            ],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@scriptEmbedded.$S2',\r\n                    nextEmbedded: '$S2'\r\n                }\r\n            ],\r\n            [/\"([^\"]*)\"/, 'attribute.value'],\r\n            [/'([^']*)'/, 'attribute.value'],\r\n            [/[\\w\\-]+/, 'attribute.name'],\r\n            [/=/, 'delimiter'],\r\n            [/[ \\t\\r\\n]+/],\r\n            [/<\\/script\\s*>/, { token: '@rematch', next: '@pop' }]\r\n        ],\r\n        scriptEmbedded: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInEmbeddedState.scriptEmbedded.$S2',\r\n                    nextEmbedded: '@pop'\r\n                }\r\n            ],\r\n            [/<\\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]\r\n        ],\r\n        // -- END <script> tags handling\r\n        // -- BEGIN <style> tags handling\r\n        // After <style\r\n        style: [\r\n            [/@[^@]/, { token: '@rematch', switchTo: '@razorInSimpleState.style' }],\r\n            [/type/, 'attribute.name', '@styleAfterType'],\r\n            [/\"([^\"]*)\"/, 'attribute.value'],\r\n            [/'([^']*)'/, 'attribute.value'],\r\n            [/[\\w\\-]+/, 'attribute.name'],\r\n            [/=/, 'delimiter'],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@styleEmbedded.text/css',\r\n                    nextEmbedded: 'text/css'\r\n                }\r\n            ],\r\n            [/[ \\t\\r\\n]+/],\r\n            [\r\n                /(<\\/)(style\\s*)(>)/,\r\n                ['delimiter.html', 'tag.html', { token: 'delimiter.html', next: '@pop' }]\r\n            ]\r\n        ],\r\n        // After <style ... type\r\n        styleAfterType: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInSimpleState.styleAfterType'\r\n                }\r\n            ],\r\n            [/=/, 'delimiter', '@styleAfterTypeEquals'],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@styleEmbedded.text/css',\r\n                    nextEmbedded: 'text/css'\r\n                }\r\n            ],\r\n            [/[ \\t\\r\\n]+/],\r\n            [/<\\/style\\s*>/, { token: '@rematch', next: '@pop' }]\r\n        ],\r\n        // After <style ... type =\r\n        styleAfterTypeEquals: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInSimpleState.styleAfterTypeEquals'\r\n                }\r\n            ],\r\n            [\r\n                /\"([^\"]*)\"/,\r\n                {\r\n                    token: 'attribute.value',\r\n                    switchTo: '@styleWithCustomType.$1'\r\n                }\r\n            ],\r\n            [\r\n                /'([^']*)'/,\r\n                {\r\n                    token: 'attribute.value',\r\n                    switchTo: '@styleWithCustomType.$1'\r\n                }\r\n            ],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@styleEmbedded.text/css',\r\n                    nextEmbedded: 'text/css'\r\n                }\r\n            ],\r\n            [/[ \\t\\r\\n]+/],\r\n            [/<\\/style\\s*>/, { token: '@rematch', next: '@pop' }]\r\n        ],\r\n        // After <style ... type = $S2\r\n        styleWithCustomType: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInSimpleState.styleWithCustomType.$S2'\r\n                }\r\n            ],\r\n            [\r\n                />/,\r\n                {\r\n                    token: 'delimiter.html',\r\n                    next: '@styleEmbedded.$S2',\r\n                    nextEmbedded: '$S2'\r\n                }\r\n            ],\r\n            [/\"([^\"]*)\"/, 'attribute.value'],\r\n            [/'([^']*)'/, 'attribute.value'],\r\n            [/[\\w\\-]+/, 'attribute.name'],\r\n            [/=/, 'delimiter'],\r\n            [/[ \\t\\r\\n]+/],\r\n            [/<\\/style\\s*>/, { token: '@rematch', next: '@pop' }]\r\n        ],\r\n        styleEmbedded: [\r\n            [\r\n                /@[^@]/,\r\n                {\r\n                    token: '@rematch',\r\n                    switchTo: '@razorInEmbeddedState.styleEmbedded.$S2',\r\n                    nextEmbedded: '@pop'\r\n                }\r\n            ],\r\n            [/<\\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }]\r\n        ],\r\n        // -- END <style> tags handling\r\n        razorInSimpleState: [\r\n            [/@\\*/, 'comment.cs', '@razorBlockCommentTopLevel'],\r\n            [/@[{(]/, 'metatag.cs', '@razorRootTopLevel'],\r\n            [/(@)(\\s*[\\w]+)/, ['metatag.cs', { token: 'identifier.cs', switchTo: '@$S2.$S3' }]],\r\n            [/[})]/, { token: 'metatag.cs', switchTo: '@$S2.$S3' }],\r\n            [/\\*@/, { token: 'comment.cs', switchTo: '@$S2.$S3' }]\r\n        ],\r\n        razorInEmbeddedState: [\r\n            [/@\\*/, 'comment.cs', '@razorBlockCommentTopLevel'],\r\n            [/@[{(]/, 'metatag.cs', '@razorRootTopLevel'],\r\n            [\r\n                /(@)(\\s*[\\w]+)/,\r\n                [\r\n                    'metatag.cs',\r\n                    {\r\n                        token: 'identifier.cs',\r\n                        switchTo: '@$S2.$S3',\r\n                        nextEmbedded: '$S3'\r\n                    }\r\n                ]\r\n            ],\r\n            [\r\n                /[})]/,\r\n                {\r\n                    token: 'metatag.cs',\r\n                    switchTo: '@$S2.$S3',\r\n                    nextEmbedded: '$S3'\r\n                }\r\n            ],\r\n            [\r\n                /\\*@/,\r\n                {\r\n                    token: 'comment.cs',\r\n                    switchTo: '@$S2.$S3',\r\n                    nextEmbedded: '$S3'\r\n                }\r\n            ]\r\n        ],\r\n        razorBlockCommentTopLevel: [\r\n            [/\\*@/, '@rematch', '@pop'],\r\n            [/[^*]+/, 'comment.cs'],\r\n            [/./, 'comment.cs']\r\n        ],\r\n        razorBlockComment: [\r\n            [/\\*@/, 'comment.cs', '@pop'],\r\n            [/[^*]+/, 'comment.cs'],\r\n            [/./, 'comment.cs']\r\n        ],\r\n        razorRootTopLevel: [\r\n            [/\\{/, 'delimiter.bracket.cs', '@razorRoot'],\r\n            [/\\(/, 'delimiter.parenthesis.cs', '@razorRoot'],\r\n            [/[})]/, '@rematch', '@pop'],\r\n            { include: 'razorCommon' }\r\n        ],\r\n        razorRoot: [\r\n            [/\\{/, 'delimiter.bracket.cs', '@razorRoot'],\r\n            [/\\(/, 'delimiter.parenthesis.cs', '@razorRoot'],\r\n            [/\\}/, 'delimiter.bracket.cs', '@pop'],\r\n            [/\\)/, 'delimiter.parenthesis.cs', '@pop'],\r\n            { include: 'razorCommon' }\r\n        ],\r\n        razorCommon: [\r\n            [\r\n                /[a-zA-Z_]\\w*/,\r\n                {\r\n                    cases: {\r\n                        '@razorKeywords': { token: 'keyword.cs' },\r\n                        '@default': 'identifier.cs'\r\n                    }\r\n                }\r\n            ],\r\n            // brackets\r\n            [/[\\[\\]]/, 'delimiter.array.cs'],\r\n            // whitespace\r\n            [/[ \\t\\r\\n]+/],\r\n            // comments\r\n            [/\\/\\/.*$/, 'comment.cs'],\r\n            [/@\\*/, 'comment.cs', '@razorBlockComment'],\r\n            // strings\r\n            [/\"([^\"]*)\"/, 'string.cs'],\r\n            [/'([^']*)'/, 'string.cs'],\r\n            // simple html\r\n            [/(<)(\\w+)(\\/>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],\r\n            [/(<)(\\w+)(>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],\r\n            [/(<\\/)(\\w+)(>)/, ['delimiter.html', 'tag.html', 'delimiter.html']],\r\n            // delimiters\r\n            [/[\\+\\-\\*\\%\\&\\|\\^\\~\\!\\=\\<\\>\\/\\?\\;\\:\\.\\,]/, 'delimiter.cs'],\r\n            // numbers\r\n            [/\\d*\\d+[eE]([\\-+]?\\d+)?/, 'number.float.cs'],\r\n            [/\\d*\\.\\d+([eE][\\-+]?\\d+)?/, 'number.float.cs'],\r\n            [/0[xX][0-9a-fA-F']*[0-9a-fA-F]/, 'number.hex.cs'],\r\n            [/0[0-7']*[0-7]/, 'number.octal.cs'],\r\n            [/0[bB][0-1']*[0-1]/, 'number.binary.cs'],\r\n            [/\\d[\\d']*/, 'number.cs'],\r\n            [/\\d/, 'number.cs']\r\n        ]\r\n    },\r\n    razorKeywords: [\r\n        'abstract',\r\n        'as',\r\n        'async',\r\n        'await',\r\n        'base',\r\n        'bool',\r\n        'break',\r\n        'by',\r\n        'byte',\r\n        'case',\r\n        'catch',\r\n        'char',\r\n        'checked',\r\n        'class',\r\n        'const',\r\n        'continue',\r\n        'decimal',\r\n        'default',\r\n        'delegate',\r\n        'do',\r\n        'double',\r\n        'descending',\r\n        'explicit',\r\n        'event',\r\n        'extern',\r\n        'else',\r\n        'enum',\r\n        'false',\r\n        'finally',\r\n        'fixed',\r\n        'float',\r\n        'for',\r\n        'foreach',\r\n        'from',\r\n        'goto',\r\n        'group',\r\n        'if',\r\n        'implicit',\r\n        'in',\r\n        'int',\r\n        'interface',\r\n        'internal',\r\n        'into',\r\n        'is',\r\n        'lock',\r\n        'long',\r\n        'nameof',\r\n        'new',\r\n        'null',\r\n        'namespace',\r\n        'object',\r\n        'operator',\r\n        'out',\r\n        'override',\r\n        'orderby',\r\n        'params',\r\n        'private',\r\n        'protected',\r\n        'public',\r\n        'readonly',\r\n        'ref',\r\n        'return',\r\n        'switch',\r\n        'struct',\r\n        'sbyte',\r\n        'sealed',\r\n        'short',\r\n        'sizeof',\r\n        'stackalloc',\r\n        'static',\r\n        'string',\r\n        'select',\r\n        'this',\r\n        'throw',\r\n        'true',\r\n        'try',\r\n        'typeof',\r\n        'uint',\r\n        'ulong',\r\n        'unchecked',\r\n        'unsafe',\r\n        'ushort',\r\n        'using',\r\n        'var',\r\n        'virtual',\r\n        'volatile',\r\n        'void',\r\n        'when',\r\n        'while',\r\n        'where',\r\n        'yield',\r\n        'model',\r\n        'inject' // Razor specific\r\n    ],\r\n    escapes: /\\\\(?:[abfnrtv\\\\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/\r\n};\r\n\n\n//# sourceURL=webpack://monaco/./node_modules/monaco-editor/esm/vs/basic-languages/razor/razor.js?");

/***/ })

}]);