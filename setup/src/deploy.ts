import { spawn } from 'child_process'
import { config_for_s3, prepare_aws, setup, Setup } from './aws_setup'
import { lambda_base_url, write_to_aws } from './build_ui'
import * as AWS from 'aws-sdk'
import * as path from 'path'

const CWD = path.join(__dirname, '..')

async function sam_deploy(lambdaS3Bucket: string, cwd: string) {
  await new Promise((resolve, reject) => {
    const sam = spawn('sam', ['deploy', '--no-confirm-changeset', '--force-upload', '--stack-name=segment-csv', '--s3-bucket=' + lambdaS3Bucket, '--capabilities=CAPABILITY_NAMED_IAM'], { cwd })

    sam.stdout.on('data', function (data) {
      console.log(data.toString())
    });

    sam.stderr.on('data', function (data) {
      console.error(data.toString())
    });

    sam.on('exit', function (code) {
      if (code == 0 || code == 1) { // 1 means: Stack up-to-date
        resolve(undefined)
      } else {
        reject('"sam deploy" exited with code ' + code.toString())
      }
    })
  })
}

export async function deploy(config: Setup & { lambdaS3Bucket: string }) {
  const tmp_dir = await prepare_aws()
  const built_dir = path.join(tmp_dir, 'built')

  await sam_deploy(config.lambdaS3Bucket, tmp_dir)

  await setup(config)

  await write_to_aws(config.lambdaAccessKeyId, config.lambdaSecretAccessKey, config.region, built_dir)

  await sam_deploy(config.lambdaS3Bucket, tmp_dir)

  console.log('-------------- WHAT FOLLOWS ARE THE DETAILS TO MANUALLY CONFIGURE THE s3 BUCKET --------------')
  try {
    const base_url = await lambda_base_url(new AWS.Credentials({
      accessKeyId: config.lambdaAccessKeyId,
      secretAccessKey: config.lambdaSecretAccessKey,
    }), config.region)
    console.log('UI URL: ' + base_url + 'ui')
    console.log('')
    await config_for_s3(config)
  } catch (e) {
    console.error(e)
    throw e
  }
}