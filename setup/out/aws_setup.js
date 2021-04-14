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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.config_for_s3 = exports.get_lambda = void 0;
var AWS = __importStar(require("aws-sdk"));
function get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region) {
    var credentials = new AWS.Credentials({
        accessKeyId: lambdaAccessKeyId,
        secretAccessKey: lambdaSecretAccessKey
    });
    return {
        iam: new AWS.IAM({
            region: region,
            credentials: credentials
        }),
        lambda: new AWS.Lambda({
            region: region,
            credentials: credentials
        })
    };
}
function get_lambda(lambda, fn_name) {
    return lambda.getFunction({
        FunctionName: fn_name
    }).promise();
}
exports.get_lambda = get_lambda;
function get_lambda_role(lambda, fn_name) {
    return __awaiter(this, void 0, void 0, function () {
        var fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get_lambda(lambda, fn_name)];
                case 1:
                    fn = _a.sent();
                    return [2 /*return*/, fn.Configuration.Role];
            }
        });
    });
}
// export async function substitute_region(region: string) {
// }
function config_for_s3(_a) {
    var lambdaAccessKeyId = _a.lambdaAccessKeyId, lambdaSecretAccessKey = _a.lambdaSecretAccessKey, s3BucketName = _a.s3BucketName, region = _a.region;
    return __awaiter(this, void 0, void 0, function () {
        function policy(role_arn) {
            return "{\n    \"Effect\": \"Allow\",\n    \"Principal\": {\n        \"AWS\": \"" + role_arn + "\"\n    },\n    \"Action\": [\n        \"s3:GetObject\",\n        \"s3:PutObject\",\n        \"s3:PutObjectAcl\"\n    ],\n    \"Resource\": \"arn:aws:s3:::" + s3BucketName + "/*\"\n}";
        }
        var lambda, _b, service_fn, service_arn, config_arn, test_arn;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    lambda = get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region).lambda;
                    return [4 /*yield*/, Promise.all([
                            get_lambda(lambda, 'segment-csv-service'),
                            // lambda.getFunction({
                            //   FunctionName: 'segment-csv-service'
                            // }).promise(),
                            get_lambda_role(lambda, 'segment-csv-service'),
                            get_lambda_role(lambda, 'segment-csv-config'),
                            get_lambda_role(lambda, 'segment-csv-test')
                        ])];
                case 1:
                    _b = _c.sent(), service_fn = _b[0], service_arn = _b[1], config_arn = _b[2], test_arn = _b[3];
                    console.log('Service Lambda ARN: ' + service_fn.Configuration.FunctionArn);
                    console.log('');
                    console.log('S3 Policy:');
                    console.log(policy(service_arn) + ",\n" + policy(config_arn) + ",\n" + policy(test_arn));
                    return [2 /*return*/];
            }
        });
    });
}
exports.config_for_s3 = config_for_s3;
function setup(_a) {
    var s3BucketName = _a.s3BucketName, s3AccountId = _a.s3AccountId, region = _a.region, lambdaAccessKeyId = _a.lambdaAccessKeyId, lambdaSecretAccessKey = _a.lambdaSecretAccessKey;
    return __awaiter(this, void 0, void 0, function () {
        function add_policy(fn_name, role_arn) {
            return __awaiter(this, void 0, void 0, function () {
                var fn, roles, role_name;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get_lambda(lambda, fn_name)
                            // lambda.getFunction({
                            //   FunctionName: fn_name
                            // }).promise()
                        ];
                        case 1:
                            fn = _a.sent();
                            return [4 /*yield*/, iam.listRoles().promise()];
                        case 2:
                            roles = _a.sent();
                            role_name = roles.Roles.find(function (r) { return r.Arn == fn.Configuration.Role; }).RoleName;
                            return [2 /*return*/, iam.attachRolePolicy({
                                    RoleName: role_name,
                                    PolicyArn: role_arn
                                }).promise()];
                    }
                });
            });
        }
        var _b, iam, lambda, p1, p2;
        return __generator(this, function (_c) {
            _b = get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region), iam = _b.iam, lambda = _b.lambda;
            p1 = iam.listPolicies().promise().then(function (policies) {
                if (policies.Policies) {
                    var p = policies.Policies.find(function (p) {
                        return p.PolicyName == 'SegmentCSVS3Source';
                    });
                    if (p && p.Arn) {
                        return p.Arn;
                    }
                }
                return iam.createPolicy({
                    PolicyDocument: JSON.stringify({
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Effect: "Allow",
                                Action: [
                                    "s3:GetObject",
                                    "s3:PutObject",
                                    "s3:PutObjectAcl"
                                ],
                                Resource: "arn:aws:s3:::" + s3BucketName + "/*"
                            }
                        ]
                    }),
                    PolicyName: 'SegmentCSVS3Source'
                }).promise().then(function (policy) { return policy.Policy.Arn; });
            }).then(function (arn) {
                if (!arn) {
                    throw new Error('ARN Missing from Created Policy');
                }
                var p1 = add_policy('segment-csv-service', arn);
                var p2 = add_policy('segment-csv-config', arn);
                var p3 = add_policy('segment-csv-test', arn);
                var p4 = add_policy('segment-csv-fetch-config', arn);
                return Promise.all([p1, p2, p3, p4]);
            }).catch(function (e) {
                console.error(e);
                throw e;
            });
            p2 = lambda.addPermission({
                FunctionName: 'segment-csv-service',
                Action: 'lambda:InvokeFunction',
                SourceArn: "arn:aws:s3:::" + s3BucketName,
                SourceAccount: s3AccountId,
                Principal: 's3.amazonaws.com',
                StatementId: 's3_invoke_on_csv',
            }).promise().catch(function (e) {
                if (e.code !== 'ResourceConflictException') {
                    console.error(e);
                    throw e;
                }
            });
            return [2 /*return*/, Promise.all([p1, p2])];
        });
    });
}
exports.setup = setup;
