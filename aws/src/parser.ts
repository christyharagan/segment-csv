import csv from 'csv-parser'
import * as AWS from 'aws-sdk'
import 'segment-typescript-definitions/common'
import { CSVParseOptions, EventMappings } from './type'
import { agg_error, error } from './error'
import { NodeAnalyticsJS } from './analytics'
import { v4 as uuid } from 'uuid'

const s3 = new AWS.S3()

export async function parse(s3_bucket: string, s3_key: string, analytics: NodeAnalyticsJS, options: CSVParseOptions, mapping: EventMappings, event_name?: string) {
  const c = csv({
    mapHeaders: ({ header, index }) => {
      if (header === mapping.userId || index === mapping.userId) {
        return 'userId'
      } else if (header === mapping.anonymousId || index === mapping.anonymousId) {
        return 'anonymousId'
      } else if (mapping.kind == 'track' && (header === mapping.event || index === mapping.event)) {
        return 'event'
      } else {
        const m = mapping.properties[header] || mapping.properties[index]
        if (m) {
          return m.name || header
        } else {
          return header
        }
      }
    },
    ...options
  })

  let row = 1
  const error_rows: number[] = []

  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: s3_bucket,
      Key: s3_key
    })
      .createReadStream()
      .pipe(c)
      .on('data', (data) => {
        if (!data.userId && !data.anonymousId) {
          data.anonymousId = uuid()
        }

        let has_errors = false

        Object.keys(mapping.properties).forEach(n => {
          const m = mapping.properties[n]
          if (m.type) {
            const v = data[m.name || n]
            if (v !== undefined && v !== null && v !== '') {
              switch (m.type) {
                case 'bool': {
                  if (v.toString().toLowerCase() == 'true' || v.toString() == '1') {
                    data[m.name || n] = true
                  } else if (v.toString().toLowerCase() == 'false' || v.toString() == '0') {
                    data[m.name || n] = false
                  } else {
                    error_rows.push(row)
                    error(analytics, data, s3_key, s3_bucket, `Header "n" should be a boolean value, but instead is ${v}`)
                    has_errors = true
                  }
                  return
                }
                case 'date': {
                  const nv = Date.parse(v)
                  if (isNaN(nv)) {
                    error_rows.push(row)
                    error(analytics, data, s3_key, s3_bucket, `Header "n" should be a date value, but instead is ${v}`)
                    has_errors = true
                  } else {
                    data[m.name || n] = new Date(nv)
                  }
                  return
                }
                case 'int': {
                  const nv = parseInt(v)
                  if (isNaN(nv)) {
                    error_rows.push(row)
                    error(analytics, data, s3_key, s3_bucket, `Header "n" should be an integer value, but instead is ${v}`)
                    has_errors = true
                  } else {
                    data[m.name || n] = nv
                  }
                  return
                }
                case 'float': {
                  const nv = parseFloat(v)
                  if (isNaN(nv)) {
                    error_rows.push(row)
                    error(analytics, data, s3_key, s3_bucket, `Header "n" should be a float value, but instead is ${v}`)
                    has_errors = true
                  } else {
                    data[m.name || n] = nv
                  }
                  return
                }
              }
            }
          }
        })

        if (!has_errors) {
          switch (mapping.kind) {
            case 'identify': {
              const { userId, anonymousId, ...traits } = data
              analytics.identify({
                userId,
                anonymousId,
                traits
              })
              break
            }
            case 'track': {
              const { userId, anonymousId, event, ...properties } = data
              if (!event && !event_name) {
                error_rows.push(row)
                error(analytics, data, s3_key, s3_bucket, 'Row event column is blank, and the type does not specify an event name')
                return
              }
              analytics.track({
                userId,
                anonymousId,
                event: event || event_name,
                properties
              })
              break
            }
          }
        }
        row++
      })
      .on('error', err => {
        error(analytics, {}, s3_key, s3_bucket, err)
        agg_error(analytics, error_rows, s3_key, s3_bucket)
        analytics.flush(function (_err) {
          if (_err) {
            console.error(_err)
          }
          reject(err)
        })
      })
      .on('end', () => {
        agg_error(analytics, error_rows, s3_key, s3_bucket)
        analytics.flush(function (err) {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(undefined)
          }
        })
      })
  })
}

