#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("./setup");
const lambdaAccessKeyId = process.argv[2];
const lambdaSecretAccessKey = process.argv[3];
const region = process.argv[4];
const s3BucketName = process.argv[5];
const s3AccountId = process.argv[6];
if (!s3AccountId) {
    setup_1.config_for_s3({
        lambdaAccessKeyId, lambdaSecretAccessKey, region, s3BucketName
    });
}
else {
    setup_1.setup({
        s3AccountId, lambdaAccessKeyId, lambdaSecretAccessKey, region, s3BucketName
    }).catch(err => {
        console.error(err);
    }).then(() => {
        console.log('All good to go!');
    });
}
//# sourceMappingURL=cli.js.map