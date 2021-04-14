"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_analytics = void 0;
function test_analytics(output) {
    return {
        alias(_) {
            output(`Alias: ` + JSON.stringify(_));
        },
        group(_) {
            output(`Group: ` + JSON.stringify(_));
        },
        identify(_) {
            output(`Identify: ` + JSON.stringify(_));
        },
        track(_) {
            output(`Track: ` + JSON.stringify(_));
        }
    };
}
exports.test_analytics = test_analytics;
//# sourceMappingURL=test_analytics.js.map