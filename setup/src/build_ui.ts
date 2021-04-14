import * as path from 'path'
import * as AWS from 'aws-sdk'
import * as fs from 'fs'
import * as zlib from 'zlib'

const BASE = path.join(__dirname, '..', '..')
const OUTPUT = path.join(BASE, 'ui', 'dist', 'index.html')
const UI_AWS = path.join(BASE, 'aws', 'built', 'ui.js')

export async function lambda_base_url(credentials: AWS.Credentials, region: string) {
  const A = new AWS.APIGateway({
    region,
    credentials
  })
  const ras = await A.getRestApis().promise()
  const ra = ras.items.find(r => r.name == 'segment-csv')

  return `https://${ra.id}.execute-api.${region}.amazonaws.com/Prod/`
}

const HTML_SEARCH = `const SEGMENT_CSV_BASE_URL = '`
const AWS_SEARCH = `const UI = '`

export async function write_to_aws(lambda_access_key: string, lambda_secret_key: string, region: string) {
  try {
    const credentials = new AWS.Credentials({
      accessKeyId: lambda_access_key,
      secretAccessKey: lambda_secret_key
    })

    const base_url = await lambda_base_url(credentials, region)

    const s = fs.readFileSync(OUTPUT, 'utf8')
    const i = s.indexOf(HTML_SEARCH) + HTML_SEARCH.length
    const ss = s.substring(i)
    const j = ss.indexOf('\'')

    const ui_output = s.substring(0, i) + base_url + ss.substring(j)

    await new Promise((resolve, reject) => {
      zlib.gzip(ui_output, function (error, gzipped_ui_output) {
        if (error) {
          reject(error)
        } else {
          const aws_ui = fs.readFileSync(UI_AWS, 'utf8')
          const i = aws_ui.indexOf(AWS_SEARCH) + AWS_SEARCH.length
          const ss = aws_ui.substring(i)
          const j = ss.indexOf('\'')
          console.log(i)
          console.log(j)
          const aws_ui_output = aws_ui.substring(0, i) + gzipped_ui_output.toString('base64') + ss.substring(j)
          fs.writeFileSync(UI_AWS, aws_ui_output, 'utf8')
          resolve(undefined)
        }
      })

    })
  } catch (e) {
    console.error(e)
    throw e
  }
}