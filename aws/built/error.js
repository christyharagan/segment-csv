"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agg_error = exports.error = void 0;
function error(analytics, data, key, bucket, e) {
    analytics.track({
        event: 'CSV Import Error',
        anonymousId: '$error',
        properties: {
            data,
            key,
            bucket,
            message: JSON.stringify(e)
        }
    });
}
exports.error = error;
function agg_error(analytics, lines, key, bucket) {
    if (lines.length > 0) {
        analytics.track({
            event: 'CSV Aggregate Import Error',
            anonymousId: '$error',
            properties: {
                lines,
                key,
                bucket
            }
        });
    }
}
exports.agg_error = agg_error;
//# sourceMappingURL=error.js.map