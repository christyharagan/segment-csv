import * as AWS from 'aws-sdk'

const s3 = new AWS.S3()

export async function lambda(event: { queryStringParameters: {type:string, bucket:string} }) {
  if (!event.queryStringParameters) {
    return {
      statusCode: 500,
      headers: {},
      body: 'No query parameters provided. Requires "type" and "bucket"'
    }
  } else if (!event.queryStringParameters.type) {
    return {
      statusCode: 500,
      headers: {},
      body: '"type" query parameter not provided'
    }
  }
  else if (!event.queryStringParameters.bucket) {
    return {
      statusCode: 500,
      headers: {},
      body: '"bucket" query parameter not provided'
    }
  }
  const type = event.queryStringParameters.type
  const bucket = event.queryStringParameters.bucket

  try {
    const body = await s3.getObject({
      Bucket: bucket,
      Key: type + '.json'
    }).promise()
    return {
      statusCode: 200,
      headers: {},
      body: body.Body.toString()
    }
  } catch (err) {
    if (err.code === 'NotFound' || err.code == 'AccessDenied') {
      return {
        statusCode: 200,
        headers: {},
        body: ''
      }
    }
    return {
      statusCode: 500,
      headers: {},
      body: JSON.stringify(err)
    }
  }
}