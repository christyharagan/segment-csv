"use strict";
// import * as fs from 'fs'
// import * as path from 'path'
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambda = void 0;
//event: { body: string, queryStringParameters: { type: string, bucket: string, region: string } }
async function lambda() {
    // if (!event.queryStringParameters) {
    //   return {
    //     statusCode: 500,
    //     headers: {},
    //     body: 'No query parameters provided. Requires "type"'
    //   }
    // } else if (!event.queryStringParameters.type) {
    //   return {
    //     statusCode: 500,
    //     headers: {},
    //     body: '"type" query parameter not provided'
    //   }
    // } else if (!event.queryStringParameters.bucket) {
    //   return {
    //     statusCode: 500,
    //     headers: {},
    //     body: '"bucket" query parameter not provided'
    //   }
    // } else if (!event.queryStringParameters.region) {
    //   return {
    //     statusCode: 500,
    //     headers: {},
    //     body: '"region" query parameter not provided'
    //   }
    // }
    // const ui = path.join(__dirname, 'uiz.html')
    // const body = fs.readFileSync(ui, 'utf8')
    // return new Promise((resolve, reject) => {
    //   zlib.gzip(body, function (error, gzippedResponse) {
    //     if (error) {
    //       resolve({
    //         statusCode: 500,
    //         headers: {},
    //         body: JSON.stringify(error)
    //       })
    //     }
    //     else {
    //       resolve({
    //         statusCode: 200,
    //         headers: {
    //           'Content-Type': 'text/html',
    //           "Content-Encoding": "gzip"
    //         },
    //         "body": gzippedResponse.toString("base64"),
    //         "isBase64Encoded": true,
    //       })
    //     }
    //     // callback(null, {
    //     //   "body": gzippedResponse.toString("base64"),
    //     //   "isBase64Encoded": true,
    //     //   "statusCode": 200,
    //     //   "headers": {
    //     //     "Content-Encoding": "gzip"
    //     //   }
    //     // });
    //   })
    // })
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
            "Content-Encoding": "gzip"
        },
        "isBase64Encoded": true,
        body: UI
    };
}
exports.lambda = lambda;
//# sourceMappingURL=ui.js.map