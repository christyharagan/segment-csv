import { Config } from './type'
import { parse } from './parser'
import { AnalyticsCB, NodeAnalyticsJS } from './analytics'

export async function lambda(event: { body: string, queryStringParameters: { key: string } }) {
  if (!event.queryStringParameters) {
    return {
      statusCode: 500,
      headers: {},
      body: 'No query parameters provided. Requires "key"'
    }
  } else if (!event.queryStringParameters.key) {
    return {
      statusCode: 500,
      headers: {},
      body: '"key" query parameter not provided'
    }
  }
  const key = event.queryStringParameters.key

  const { bucket, type, ...config } = JSON.parse(event.body) as Config & { bucket: string, type: string }

  let output = '['

  const analytics = test_analytics(msg => {
    output += `${msg}`
  })

  try {
    await parse(bucket, key, analytics, config.csvParseOptions, config.fieldMappings, config.eventName)
  } catch (e) {
    analytics.track({
      event: 'CSV Import Error',
      anonymousId: '$error',
      properties: {
        config,
        key,
        bucket,
        message: JSON.stringify(e)
      }
    })
  }

  return {
    statusCode: 200,
    headers: {},
    body: output.substring(0, output.length - 1) + ']'
  }
}

export function test_analytics(output: (msg: string) => void): NodeAnalyticsJS {
  return {
    alias(_) {
      output(`["alias",${JSON.stringify(_)}],`)
    },
    group(_) {
      output(`["group",${JSON.stringify(_)}],`)
    },
    identify(_) {
      output(`["identify",${JSON.stringify(_)}],`)
    },
    track(_) {
      output(`["track",${JSON.stringify(_)}],`)
    },
    flush(cb: AnalyticsCB) {
      cb()
    }
  }
}