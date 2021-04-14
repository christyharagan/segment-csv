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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const AWS = __importStar(require("aws-sdk"));
require("segment-typescript-definitions/common");
const error_1 = require("./error");
const uuid_1 = require("uuid");
const s3 = new AWS.S3();
async function parse(s3_bucket, s3_key, analytics, options, mapping, event_name) {
    const c = csv_parser_1.default(Object.assign({ mapHeaders: ({ header, index }) => {
            if (header === mapping.userId || index === mapping.userId) {
                return 'userId';
            }
            else if (header === mapping.anonymousId || index === mapping.anonymousId) {
                return 'anonymousId';
            }
            else if (mapping.kind == 'track' && (header === mapping.event || index === mapping.event)) {
                return 'event';
            }
            else {
                const m = mapping.properties[header] || mapping.properties[index];
                if (m) {
                    return m.name || header;
                }
                else {
                    return header;
                }
            }
        } }, options));
    let row = 1;
    const error_rows = [];
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: s3_bucket,
            Key: s3_key
        })
            .createReadStream()
            .pipe(c)
            .on('data', (data) => {
            if (!data.userId && !data.anonymousId) {
                data.anonymousId = uuid_1.v4();
                // error(analytics, data, s3_key, s3_bucket, 'Row does have a userId or anonymousId')
                // return
            }
            let has_errors = false;
            Object.keys(mapping.properties).forEach(n => {
                const m = mapping.properties[n];
                if (m.type) {
                    const v = data[m.name || n];
                    if (v !== undefined && v !== null && v !== '') {
                        switch (m.type) {
                            case 'bool': {
                                if (v.toString().toLowerCase() == 'true' || v.toString() == '1') {
                                    data[m.name || n] = true;
                                }
                                else if (v.toString().toLowerCase() == 'false' || v.toString() == '0') {
                                    data[m.name || n] = false;
                                }
                                else {
                                    error_rows.push(row);
                                    error_1.error(analytics, data, s3_key, s3_bucket, `Header "n" should be a boolean value, but instead is ${v}`);
                                    has_errors = true;
                                }
                                return;
                            }
                            case 'date': {
                                const nv = Date.parse(v);
                                if (isNaN(nv)) {
                                    error_rows.push(row);
                                    error_1.error(analytics, data, s3_key, s3_bucket, `Header "n" should be a date value, but instead is ${v}`);
                                    has_errors = true;
                                }
                                else {
                                    data[m.name || n] = new Date(nv);
                                }
                                return;
                            }
                            case 'int': {
                                const nv = parseInt(v);
                                if (isNaN(nv)) {
                                    error_rows.push(row);
                                    error_1.error(analytics, data, s3_key, s3_bucket, `Header "n" should be an integer value, but instead is ${v}`);
                                    has_errors = true;
                                }
                                else {
                                    data[m.name || n] = nv;
                                }
                                return;
                            }
                            case 'float': {
                                const nv = parseFloat(v);
                                if (isNaN(nv)) {
                                    error_rows.push(row);
                                    error_1.error(analytics, data, s3_key, s3_bucket, `Header "n" should be a float value, but instead is ${v}`);
                                    has_errors = true;
                                }
                                else {
                                    data[m.name || n] = nv;
                                }
                                return;
                            }
                        }
                    }
                }
            });
            if (!has_errors) {
                switch (mapping.kind) {
                    case 'identify': {
                        const { userId, anonymousId } = data, traits = __rest(data, ["userId", "anonymousId"]);
                        analytics.identify({
                            userId,
                            anonymousId,
                            traits
                        });
                        break;
                    }
                    case 'track': {
                        const { userId, anonymousId, event } = data, properties = __rest(data, ["userId", "anonymousId", "event"]);
                        if (!event && !event_name) {
                            error_rows.push(row);
                            error_1.error(analytics, data, s3_key, s3_bucket, 'Row event column is blank, and the type does not specify an event name');
                            return;
                        }
                        analytics.track({
                            userId,
                            anonymousId,
                            event: event || event_name,
                            properties
                        });
                        break;
                    }
                }
            }
            row++;
        })
            .on('error', err => {
            error_1.error(analytics, {}, s3_key, s3_bucket, err);
            error_1.agg_error(analytics, error_rows, s3_key, s3_bucket);
            analytics.flush(function (_err) {
                if (_err) {
                    console.error(_err);
                }
                reject(err);
            });
        })
            .on('end', () => {
            error_1.agg_error(analytics, error_rows, s3_key, s3_bucket);
            analytics.flush(function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(undefined);
                }
            });
        });
    });
}
exports.parse = parse;
//# sourceMappingURL=parser.js.map