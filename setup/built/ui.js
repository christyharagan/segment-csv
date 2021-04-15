"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambda = void 0;
const UI = '';
async function lambda() {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
            "Content-Encoding": "gzip"
        },
        "isBase64Encoded": true,
        body: UI
    };
}
exports.lambda = lambda;
//# sourceMappingURL=ui.js.map