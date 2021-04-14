import * as AWS from 'aws-sdk'
import { parse } from './parser'
import { load_analytics } from './analytics'
import { Config } from './type'
import { error } from './error'

const s3 = new AWS.S3()

const SEPARATOR = '-'

type Event = {
  Records: {
    s3: {
      bucket: {
        name: string
      }
      object: {
        key: string
      }
    }
  }[]
}

function get_file_type(key: string): string | undefined {
  const i = key.indexOf(SEPARATOR)
  const j = key.toLowerCase().indexOf('.csv')
  if (i == -1 || j == -1) {
    console.log('Ignoring file: ' + key)
    return
  }
  return key.substring(0, i)
}
export async function lambda(event: Event) {
  // Object key may have spaces or unicode non-ASCII characters.
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "))
  const bucket = event.Records[0].s3.bucket.name
  const type = get_file_type(key)

  if (!type) {
    console.log('File ignored: ' + key)
    return // This isn't a file we're interested in
  }

  const config_obj = await s3.getObject({
    Bucket: bucket,
    Key: type + '.json'
  }).promise()
  const config_str = config_obj.Body?.toString()
  if (!config_str) {
    throw new Error('Unable to read config file')
  }
  const config = JSON.parse(config_str) as Config

  const analytics = await load_analytics(config)

  try {
    await parse(bucket, key, analytics, config.csvParseOptions, config.fieldMappings, config.eventName)
  } catch (e) {
    error(analytics, config, key, bucket, e)
  }
}