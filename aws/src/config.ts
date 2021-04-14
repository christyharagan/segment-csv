import * as AWS from 'aws-sdk'
import { Config } from './type'

const s3 = new AWS.S3()

export async function lambda(config_and_bucket: { body: string }) {
  const { type, bucket, ...config } = JSON.parse(config_and_bucket.body) as Config & { bucket: string, type: string }

  try {
    await s3.putObject({
      Bucket: bucket,
      Key: type + '.json',
      Body: JSON.stringify(config)
    }).promise()
  } catch (err) {
    return {
      statusCode: 500,
      headers: {},
      body: JSON.stringify(err)
    }
  }

  return {
    statusCode: 200,
    headers: {},
    body: '{}'
  }
}