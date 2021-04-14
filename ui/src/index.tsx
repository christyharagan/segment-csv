import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'

export function start() {
  var mountNode = document.getElementById('container')
  ReactDOM.render(<App />, mountNode)
}

self.init = start
