"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_analytics = void 0;
const analytics_node_1 = __importDefault(require("analytics-node"));
async function load_analytics(config) {
    const write_key = config.segmentWriteKey;
    if (!write_key) {
        throw new Error('Invalid config file: missing "segmentWriteKey" property');
    }
    return new analytics_node_1.default(config.segmentWriteKey, { flushAt: 10 });
}
exports.load_analytics = load_analytics;
//# sourceMappingURL=analytics.js.map