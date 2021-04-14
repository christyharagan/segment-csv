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
const s3 = new AWS.S3();
async function lambda(event) {
    if (!event.queryStringParameters) {
        return {
            statusCode: 500,
            headers: {},
            body: 'No query parameters provided. Requires "type" and "bucket"'
        };
    }
    else if (!event.queryStringParameters.type) {
        return {
            statusCode: 500,
            headers: {},
            body: '"type" query parameter not provided'
        };
    }
    else if (!event.queryStringParameters.bucket) {
        return {
            statusCode: 500,
            headers: {},
            body: '"bucket" query parameter not provided'
        };
    }
    const type = event.queryStringParameters.type;
    const bucket = event.queryStringParameters.bucket;
    try {
        const body = await s3.getObject({
            Bucket: bucket,
            Key: type + '.json'
        }).promise();
        return {
            statusCode: 200,
            headers: {},
            body: body.Body.toString()
        };
    }
    catch (err) {
        if (err.code === 'NotFound' || err.code == 'AccessDenied') {
            return {
                statusCode: 200,
                headers: {},
                body: ''
            };
        }
        return {
            statusCode: 500,
            headers: {},
            body: JSON.stringify(err)
        };
    }
}
exports.lambda = lambda;
//# sourceMappingURL=fetch.js.map