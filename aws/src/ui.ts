const UI = ''

export async function lambda() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      "Content-Encoding": "gzip"
    },
    "isBase64Encoded": true,
    body: UI
  }
}