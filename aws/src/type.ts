export type Config = {
  segmentWriteKey: string
  csvParseOptions: CSVParseOptions
  fieldMappings: EventMappings
  verboseErrors?: boolean
  eventName?: string
}

export type EventMappings = {
  userId?: number | string
  anonymousId?: number | string
  properties: { [orig: string]: { name?: string, type?: 'date' | 'int' | 'float' | 'bool' } }
} & ({
  kind: 'track'
  event?: number | string
} | {
  kind: 'identify'
})

export type CSVParseOptions = {
  newline?: string
  escape?: string
  separator?: string
  quote?: string
  skipComments?: string
  skipLines?: number
}
