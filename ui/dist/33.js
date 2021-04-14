(this["webpackJsonpmonaco"] = this["webpackJsonpmonaco"] || []).push([[33],{

/***/ "./node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown.js":
/*!********************************************************************************!*\
  !*** ./node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown.js ***!
  \********************************************************************************/
/*! exports provided: conf, language */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"conf\", function() { return conf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"language\", function() { return language; });\n/*---------------------------------------------------------------------------------------------\r\n *  Copyright (c) Microsoft Corporation. All rights reserved.\r\n *  Licensed under the MIT License. See License.txt in the project root for license information.\r\n *--------------------------------------------------------------------------------------------*/\r\nvar conf = {\r\n    comments: {\r\n        blockComment: ['<!--', '-->']\r\n    },\r\n    brackets: [\r\n        ['{', '}'],\r\n        ['[', ']'],\r\n        ['(', ')']\r\n    ],\r\n    autoClosingPairs: [\r\n        { open: '{', close: '}' },\r\n        { open: '[', close: ']' },\r\n        { open: '(', close: ')' },\r\n        { open: '<', close: '>', notIn: ['string'] }\r\n    ],\r\n    surroundingPairs: [\r\n        { open: '(', close: ')' },\r\n        { open: '[', close: ']' },\r\n        { open: '`', close: '`' }\r\n    ],\r\n    folding: {\r\n        markers: {\r\n            start: new RegExp('^\\\\s*<!--\\\\s*#?region\\\\b.*-->'),\r\n            end: new RegExp('^\\\\s*<!--\\\\s*#?endregion\\\\b.*-->')\r\n        }\r\n    }\r\n};\r\nvar language = {\r\n    defaultToken: '',\r\n    tokenPostfix: '.md',\r\n    // escape codes\r\n    control: /[\\\\`*_\\[\\]{}()#+\\-\\.!]/,\r\n    noncontrol: /[^\\\\`*_\\[\\]{}()#+\\-\\.!]/,\r\n    escapes: /\\\\(?:@control)/,\r\n    // escape codes for javascript/CSS strings\r\n    jsescapes: /\\\\(?:[btnfr\\\\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,\r\n    // non matched elements\r\n    empty: [\r\n        'area',\r\n        'base',\r\n        'basefont',\r\n        'br',\r\n        'col',\r\n        'frame',\r\n        'hr',\r\n        'img',\r\n        'input',\r\n        'isindex',\r\n        'link',\r\n        'meta',\r\n        'param'\r\n    ],\r\n    tokenizer: {\r\n        root: [\r\n            // markdown tables\r\n            [/^\\s*\\|/, '@rematch', '@table_header'],\r\n            // headers (with #)\r\n            [\r\n                /^(\\s{0,3})(#+)((?:[^\\\\#]|@escapes)+)((?:#+)?)/,\r\n                ['white', 'keyword', 'keyword', 'keyword']\r\n            ],\r\n            // headers (with =)\r\n            [/^\\s*(=+|\\-+)\\s*$/, 'keyword'],\r\n            // headers (with ***)\r\n            [/^\\s*((\\*[ ]?)+)\\s*$/, 'meta.separator'],\r\n            // quote\r\n            [/^\\s*>+/, 'comment'],\r\n            // list (starting with * or number)\r\n            [/^\\s*([\\*\\-+:]|\\d+\\.)\\s/, 'keyword'],\r\n            // code block (4 spaces indent)\r\n            [/^(\\t|[ ]{4})[^ ].*$/, 'string'],\r\n            // code block (3 tilde)\r\n            [/^\\s*~~~\\s*((?:\\w|[\\/\\-#])+)?\\s*$/, { token: 'string', next: '@codeblock' }],\r\n            // github style code blocks (with backticks and language)\r\n            [\r\n                /^\\s*```\\s*((?:\\w|[\\/\\-#])+).*$/,\r\n                { token: 'string', next: '@codeblockgh', nextEmbedded: '$1' }\r\n            ],\r\n            // github style code blocks (with backticks but no language)\r\n            [/^\\s*```\\s*$/, { token: 'string', next: '@codeblock' }],\r\n            // markup within lines\r\n            { include: '@linecontent' }\r\n        ],\r\n        table_header: [\r\n            { include: '@table_common' },\r\n            [/[^\\|]+/, 'keyword.table.header'] // table header\r\n        ],\r\n        table_body: [{ include: '@table_common' }, { include: '@linecontent' }],\r\n        table_common: [\r\n            [/\\s*[\\-:]+\\s*/, { token: 'keyword', switchTo: 'table_body' }],\r\n            [/^\\s*\\|/, 'keyword.table.left'],\r\n            [/^\\s*[^\\|]/, '@rematch', '@pop'],\r\n            [/^\\s*$/, '@rematch', '@pop'],\r\n            [\r\n                /\\|/,\r\n                {\r\n                    cases: {\r\n                        '@eos': 'keyword.table.right',\r\n                        '@default': 'keyword.table.middle' // inner |\r\n                    }\r\n                }\r\n            ]\r\n        ],\r\n        codeblock: [\r\n            [/^\\s*~~~\\s*$/, { token: 'string', next: '@pop' }],\r\n            [/^\\s*```\\s*$/, { token: 'string', next: '@pop' }],\r\n            [/.*$/, 'variable.source']\r\n        ],\r\n        // github style code blocks\r\n        codeblockgh: [\r\n            [/```\\s*$/, { token: 'variable.source', next: '@pop', nextEmbedded: '@pop' }],\r\n            [/[^`]+/, 'variable.source']\r\n        ],\r\n        linecontent: [\r\n            // escapes\r\n            [/&\\w+;/, 'string.escape'],\r\n            [/@escapes/, 'escape'],\r\n            // various markup\r\n            [/\\b__([^\\\\_]|@escapes|_(?!_))+__\\b/, 'strong'],\r\n            [/\\*\\*([^\\\\*]|@escapes|\\*(?!\\*))+\\*\\*/, 'strong'],\r\n            [/\\b_[^_]+_\\b/, 'emphasis'],\r\n            [/\\*([^\\\\*]|@escapes)+\\*/, 'emphasis'],\r\n            [/`([^\\\\`]|@escapes)+`/, 'variable'],\r\n            // links\r\n            [/\\{+[^}]+\\}+/, 'string.target'],\r\n            [/(!?\\[)((?:[^\\]\\\\]|@escapes)*)(\\]\\([^\\)]+\\))/, ['string.link', '', 'string.link']],\r\n            [/(!?\\[)((?:[^\\]\\\\]|@escapes)*)(\\])/, 'string.link'],\r\n            // or html\r\n            { include: 'html' }\r\n        ],\r\n        // Note: it is tempting to rather switch to the real HTML mode instead of building our own here\r\n        // but currently there is a limitation in Monarch that prevents us from doing it: The opening\r\n        // '<' would start the HTML mode, however there is no way to jump 1 character back to let the\r\n        // HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,\r\n        // we cannot correctly tokenize it in that mode yet.\r\n        html: [\r\n            // html tags\r\n            [/<(\\w+)\\/>/, 'tag'],\r\n            [\r\n                /<(\\w+)/,\r\n                {\r\n                    cases: {\r\n                        '@empty': { token: 'tag', next: '@tag.$1' },\r\n                        '@default': { token: 'tag', next: '@tag.$1' }\r\n                    }\r\n                }\r\n            ],\r\n            [/<\\/(\\w+)\\s*>/, { token: 'tag' }],\r\n            [/<!--/, 'comment', '@comment']\r\n        ],\r\n        comment: [\r\n            [/[^<\\-]+/, 'comment.content'],\r\n            [/-->/, 'comment', '@pop'],\r\n            [/<!--/, 'comment.content.invalid'],\r\n            [/[<\\-]/, 'comment.content']\r\n        ],\r\n        // Almost full HTML tag matching, complete with embedded scripts & styles\r\n        tag: [\r\n            [/[ \\t\\r\\n]+/, 'white'],\r\n            [\r\n                /(type)(\\s*=\\s*)(\")([^\"]+)(\")/,\r\n                [\r\n                    'attribute.name.html',\r\n                    'delimiter.html',\r\n                    'string.html',\r\n                    { token: 'string.html', switchTo: '@tag.$S2.$4' },\r\n                    'string.html'\r\n                ]\r\n            ],\r\n            [\r\n                /(type)(\\s*=\\s*)(')([^']+)(')/,\r\n                [\r\n                    'attribute.name.html',\r\n                    'delimiter.html',\r\n                    'string.html',\r\n                    { token: 'string.html', switchTo: '@tag.$S2.$4' },\r\n                    'string.html'\r\n                ]\r\n            ],\r\n            [\r\n                /(\\w+)(\\s*=\\s*)(\"[^\"]*\"|'[^']*')/,\r\n                ['attribute.name.html', 'delimiter.html', 'string.html']\r\n            ],\r\n            [/\\w+/, 'attribute.name.html'],\r\n            [/\\/>/, 'tag', '@pop'],\r\n            [\r\n                />/,\r\n                {\r\n                    cases: {\r\n                        '$S2==style': {\r\n                            token: 'tag',\r\n                            switchTo: 'embeddedStyle',\r\n                            nextEmbedded: 'text/css'\r\n                        },\r\n                        '$S2==script': {\r\n                            cases: {\r\n                                $S3: {\r\n                                    token: 'tag',\r\n                                    switchTo: 'embeddedScript',\r\n                                    nextEmbedded: '$S3'\r\n                                },\r\n                                '@default': {\r\n                                    token: 'tag',\r\n                                    switchTo: 'embeddedScript',\r\n                                    nextEmbedded: 'text/javascript'\r\n                                }\r\n                            }\r\n                        },\r\n                        '@default': { token: 'tag', next: '@pop' }\r\n                    }\r\n                }\r\n            ]\r\n        ],\r\n        embeddedStyle: [\r\n            [/[^<]+/, ''],\r\n            [/<\\/style\\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],\r\n            [/</, '']\r\n        ],\r\n        embeddedScript: [\r\n            [/[^<]+/, ''],\r\n            [/<\\/script\\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],\r\n            [/</, '']\r\n        ]\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack://monaco/./node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown.js?");

/***/ })

}]);