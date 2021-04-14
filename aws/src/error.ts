import { NodeAnalyticsJS } from './analytics'

export function error(analytics: NodeAnalyticsJS, data: any, key: string, bucket: string, e: any) {
  analytics.track({
    event: 'CSV Import Error',
    anonymousId: '$error',
    properties: {
      data,
      key,
      bucket,
      message: JSON.stringify(e)
    }
  })
}

export function agg_error(analytics: NodeAnalyticsJS, lines: number[], key: string, bucket: string) {
  if (lines.length > 0) {
    analytics.track({
      event: 'CSV Aggregate Import Error',
      anonymousId: '$error',
      properties: {
        lines,
        key,
        bucket
      }
    })
  }
}