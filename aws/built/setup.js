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
exports.setup = exports.config_for_s3 = void 0;
const AWS = __importStar(require("aws-sdk"));
function get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region) {
    const credentials = new AWS.Credentials({
        accessKeyId: lambdaAccessKeyId,
        secretAccessKey: lambdaSecretAccessKey
    });
    return {
        iam: new AWS.IAM({
            region,
            credentials
        }),
        lambda: new AWS.Lambda({
            region,
            credentials
        })
    };
}
async function get_lambda_role(lambda, fn_name) {
    const fn = await lambda.getFunction({
        FunctionName: fn_name
    }).promise();
    return fn.Configuration.Role;
}
async function config_for_s3({ lambdaAccessKeyId, lambdaSecretAccessKey, s3BucketName, region }) {
    const { lambda } = get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region);
    const [service_fn, service_arn, config_arn, test_arn] = await Promise.all([
        lambda.getFunction({
            FunctionName: 'segment-csv-service'
        }).promise(),
        get_lambda_role(lambda, 'segment-csv-service'),
        get_lambda_role(lambda, 'segment-csv-config'),
        get_lambda_role(lambda, 'segment-csv-test')
    ]);
    function policy(role_arn) {
        return `{
    "Effect": "Allow",
    "Principal": {
        "AWS": "${role_arn}"
    },
    "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:PutObjectAcl"
    ],
    "Resource": "arn:aws:s3:::${s3BucketName}/*"
}`;
    }
    console.log('Service Lambda ARN: ' + service_fn.Configuration.FunctionArn);
    console.log('');
    console.log(`${policy(service_arn)},
${policy(config_arn)},
${policy(test_arn)}`);
}
exports.config_for_s3 = config_for_s3;
async function setup({ s3BucketName, s3AccountId, region, lambdaAccessKeyId, lambdaSecretAccessKey }) {
    async function add_policy(fn_name, role_arn) {
        // const fn_role = await get_lambda_role(lambda, fn_name)
        const fn = await lambda.getFunction({
            FunctionName: fn_name
        }).promise();
        const roles = await iam.listRoles().promise();
        const role_name = roles.Roles.find(r => r.Arn == fn.Configuration.Role).RoleName;
        return iam.attachRolePolicy({
            RoleName: role_name,
            PolicyArn: role_arn
        }).promise();
    }
    const { iam, lambda } = get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region);
    const p1 = iam.listPolicies().promise().then(policies => {
        if (policies.Policies) {
            const p = policies.Policies.find(p => {
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
                        Resource: `arn:aws:s3:::${s3BucketName}/*`
                    }
                ]
            }),
            PolicyName: 'SegmentCSVS3Source'
        }).promise().then(policy => policy.Policy.Arn);
    }).then(arn => {
        if (!arn) {
            throw new Error('ARN Missing from Created Policy');
        }
        const p1 = add_policy('segment-csv-service', arn);
        const p2 = add_policy('segment-csv-config', arn);
        const p3 = add_policy('segment-csv-test', arn);
        const p4 = add_policy('segment-csv-fetch', arn);
        return Promise.all([p1, p2, p3, p4]);
    });
    const p2 = lambda.addPermission({
        FunctionName: 'segment-csv-service',
        Action: 'lambda:InvokeFunction',
        SourceArn: `arn:aws:s3:::${s3BucketName}`,
        SourceAccount: s3AccountId,
        Principal: 's3.amazonaws.com',
        StatementId: '1',
    }).promise();
    return Promise.all([p1, p2]);
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map