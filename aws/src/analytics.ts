import Analytics from 'analytics-node'
import { Config } from './type'

export async function load_analytics(config: Config) {
  const write_key = config.segmentWriteKey
  if (!write_key) {
    throw new Error('Invalid config file: missing "segmentWriteKey" property')
  }
  return new Analytics(config.segmentWriteKey, { flushAt: 10 })
}

export type AnalyticsCB = (err?: Error) => void

export type NodeAnalyticsJS = {
  identify(_: SegmentIdentify & SegmentOptions, cb?: AnalyticsCB): void
  group(_: SegmentGroup & SegmentOptions, cb?: AnalyticsCB): void
  track(_: SegmentTrackObject<string> & SegmentOptions, cb?: AnalyticsCB): void
  alias(_: SegmentAlias & SegmentOptions, cb?: AnalyticsCB): void
  flush(cb: AnalyticsCB): void
}
