import * as AWS from 'aws-sdk'
// import archiver from 'archiver'
import temp from 'temp'
import { spawn } from 'child_process'
import * as path from 'path'
// import * as fs from 'fs'
import * as fs from 'fs-extra'

export type Setup = SetupBasic & {
  // Details of S3 bucket
  s3AccountId: string
}

export type SetupBasic = {
  // Details of S3 bucket
  s3BucketName: string

  // S3 and Lambda must sit in the same region
  region: string

  // Details for account hosting lambdas
  lambdaAccessKeyId: string
  lambdaSecretAccessKey: string
}

const BASE = path.join(__dirname, '..')
const AWS_DEPS_PKG = path.join(BASE, 'aws-deps', 'package.json')
const AWS_DEPS_PKG_LOCK = path.join(BASE, 'aws-deps', 'package-lock.json')
const AWS_CODE = path.join(BASE, 'built')
// const AWS_TESTS = path.join(BASE, '__tests__')
const SPEC = path.join(BASE, 'template.yaml')
// const BUILD_SPEC = path.join(BASE, 'buildspec.yml')

function get_aws(lambdaAccessKeyId: string, lambdaSecretAccessKey: string, region: string) {
  const credentials = new AWS.Credentials({
    accessKeyId: lambdaAccessKeyId,
    secretAccessKey: lambdaSecretAccessKey
  })

  return {
    iam: new AWS.IAM({
      region,
      credentials
    }),
    lambda: new AWS.Lambda({
      region,
      credentials
    })
  }
}

export function prepare_aws() {
  return new Promise<string>((resolve, reject) => {
    // temp.track()
    temp.mkdir('segment-csv', function (err, dirPath) {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        fs.copyFileSync(SPEC, path.join(dirPath, 'template.yaml'))
        // fs.copyFileSync(BUILD_SPEC, path.join(dirPath, 'buildspec.yml'))
        fs.copySync(AWS_CODE, path.join(dirPath, 'built'))
        fs.copyFileSync(AWS_DEPS_PKG, path.join(dirPath, 'built', 'package.json'))
        fs.copyFileSync(AWS_DEPS_PKG_LOCK, path.join(dirPath, 'built', 'package-lock.json'))
        // fs.copySync(AWS_TESTS, path.join(dirPath, '__tests__'))
        const sam = spawn('npm', ['i'], { cwd: path.join(dirPath, 'built') })

        console.log(dirPath)
        sam.stdout.on('data', function (data) {
          console.log(data.toString())
        });

        sam.stderr.on('data', function (data) {
          console.error(data.toString())
        });

        sam.on('exit', function (code) {
          if (code == 0) {
            resolve(undefined)
          } else {
            reject('"npm i" exited with code ' + code.toString())
          }
        })
        resolve(dirPath)
      }
    })
  })
}

export function get_lambda(lambda: AWS.Lambda, fn_name: string) {
  return lambda.getFunction({
    FunctionName: fn_name
  }).promise()
}

async function get_lambda_role(lambda: AWS.Lambda, fn_name: string) {
  const fn = await get_lambda(lambda, fn_name)
  return fn.Configuration.Role
}

export async function config_for_s3({ lambdaAccessKeyId, lambdaSecretAccessKey, s3BucketName, region }: SetupBasic) {
  const { lambda } = get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region)

  const [service_fn, service_arn, config_arn, test_arn] = await Promise.all([
    get_lambda(lambda, 'segment-csv-service'),
    get_lambda_role(lambda, 'segment-csv-service'),
    get_lambda_role(lambda, 'segment-csv-config'),
    get_lambda_role(lambda, 'segment-csv-test')
  ])

  function policy(role_arn: string) {
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
}`
  }

  console.log('Service Lambda ARN: ' + service_fn.Configuration.FunctionArn)
  console.log('')
  console.log('S3 Policy:')
  console.log(`${policy(service_arn)},
${policy(config_arn)},
${policy(test_arn)}`)
}



export async function setup({ s3BucketName, s3AccountId, region, lambdaAccessKeyId, lambdaSecretAccessKey }: Setup) {
  async function add_policy(fn_name: string, role_arn: string) {
    const fn = await get_lambda(lambda, fn_name)
    const roles = await iam.listRoles().promise()
    const role_name = roles.Roles.find(r => r.Arn == fn.Configuration.Role).RoleName

    return iam.attachRolePolicy({
      RoleName: role_name,
      PolicyArn: role_arn
    }).promise()
  }

  const { iam, lambda } = get_aws(lambdaAccessKeyId, lambdaSecretAccessKey, region)

  const p1 = iam.listPolicies().promise().then(policies => {
    if (policies.Policies) {
      const p = policies.Policies.find(p => {
        return p.PolicyName == 'SegmentCSVS3Source'
      })
      if (p && p.Arn) {
        return p.Arn
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
    }).promise().then(policy => policy.Policy.Arn)
  }).then(arn => {
    if (!arn) {
      throw new Error('ARN Missing from Created Policy')
    }

    const p1 = add_policy('segment-csv-service', arn)
    const p2 = add_policy('segment-csv-config', arn)
    const p3 = add_policy('segment-csv-test', arn)
    const p4 = add_policy('segment-csv-fetch-config', arn)

    return Promise.all([p1, p2, p3, p4])
  }).catch(e => {
    console.error(e)
    throw e
  })

  const p2 = lambda.addPermission({
    FunctionName: 'segment-csv-service',
    Action: 'lambda:InvokeFunction',
    SourceArn: `arn:aws:s3:::${s3BucketName}`,
    SourceAccount: s3AccountId,
    Principal: 's3.amazonaws.com',
    StatementId: 's3_invoke_on_csv-' + s3BucketName,
  }).promise().catch(e => {
    if (e.code !== 'ResourceConflictException') {
      console.error(e)
      throw e
    }
  })

  return Promise.all([p1, p2])
}
