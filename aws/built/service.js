"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambda = void 0;
const AWS = __importStar(require("aws-sdk"));
const parser_1 = require("./parser");
const analytics_1 = require("./analytics");
const error_1 = require("./error");
const s3 = new AWS.S3();
const SEPARATOR = '-';
function get_file_type(key) {
    const i = key.indexOf(SEPARATOR);
    const j = key.toLowerCase().indexOf('.csv');
    if (i == -1 || j == -1) {
        console.log('Ignoring file: ' + key);
        return;
    }
    return key.substring(0, i);
}
async function lambda(event) {
    var _a;
    // Object key may have spaces or unicode non-ASCII characters.
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const bucket = event.Records[0].s3.bucket.name;
    const type = get_file_type(key);
    if (!type) {
        console.log('File ignored: ' + key);
        return; // This isn't a file we're interested in
    }
    const config_obj = await s3.getObject({
        Bucket: bucket,
        Key: type + '.json'
    }).promise();
    const config_str = (_a = config_obj.Body) === null || _a === void 0 ? void 0 : _a.toString();
    if (!config_str) {
        throw new Error('Unable to read config file');
    }
    const config = JSON.parse(config_str);
    const analytics = await analytics_1.load_analytics(config);
    try {
        await parser_1.parse(bucket, key, analytics, config.csvParseOptions, config.fieldMappings, config.eventName);
    }
    catch (e) {
        error_1.error(analytics, config, key, bucket, e);
    }
}
exports.lambda = lambda;
//# sourceMappingURL=service.js.map