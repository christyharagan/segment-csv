"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_analytics = exports.lambda = void 0;
const parser_1 = require("./parser");
async function lambda(event) {
    if (!event.queryStringParameters) {
        return {
            statusCode: 500,
            headers: {},
            body: 'No query parameters provided. Requires "key"'
        };
    }
    else if (!event.queryStringParameters.key) {
        return {
            statusCode: 500,
            headers: {},
            body: '"key" query parameter not provided'
        };
    }
    const key = event.queryStringParameters.key;
    const _a = JSON.parse(event.body), { bucket } = _a, config = __rest(_a, ["bucket"]);
    let output = '[';
    const analytics = test_analytics(msg => {
        output += `${msg}`;
    });
    try {
        await parser_1.parse(bucket, key, analytics, config.csvParseOptions, config.fieldMappings, config.eventName);
    }
    catch (e) {
        analytics.track({
            event: 'CSV Import Error',
            anonymousId: '$error',
            properties: {
                config,
                key,
                bucket,
                message: JSON.stringify(e)
            }
        });
    }
    return {
        statusCode: 200,
        headers: {},
        body: output.length == 1 ? '[]' : (output.substring(0, output.length - 1) + ']')
    };
}
exports.lambda = lambda;
function test_analytics(output) {
    return {
        alias(_) {
            output(`["alias",${JSON.stringify(_)}],`);
        },
        group(_) {
            output(`["group",${JSON.stringify(_)}],`);
        },
        identify(_) {
            output(`["identify",${JSON.stringify(_)}],`);
        },
        track(_) {
            output(`["track",${JSON.stringify(_)}],`);
        },
        flush(cb) {
            cb();
        }
    };
}
exports.test_analytics = test_analytics;
//# sourceMappingURL=test_config.js.map