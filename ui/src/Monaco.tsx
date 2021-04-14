import { Component } from 'react'
import * as React from 'react'

import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/language/json/languageFeatures'
import 'monaco-editor/esm/vs/language/json/jsonMode'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

self.MonacoEnvironment = {
  getWorker: function () {
    var blob = new Blob([
      document.querySelector('#worker')?.textContent as BlobPart
    ], { type: "text/javascript" })

    return new Worker(window.URL.createObjectURL(blob));
  }
}

export async function init_json(init_json: string, schema: any) {
  var modelUri = monaco.Uri.parse('file://edit.json')
  var model = monaco.editor.createModel(init_json, 'json', modelUri)

  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [{
      uri: "http://ch/schema.json",
      fileMatch: [modelUri.toString()],
      schema
    }]
  })

  return model
}

export async function init(model: monaco.editor.ITextModel, container: HTMLElement, on_content_change?: (code: string) => void) {
  const editor = monaco.editor.create(container, { model })
  if (on_content_change) {
    editor.onDidChangeModelContent(() => {
      let model = editor.getModel()
      if (model) {
        on_content_change(model.getLinesContent().join('\n'))
      }
    })
  }
}

export type Monaco = {
  width?: string,
  height?: string,
  value: string,
  json?: {
    schema: any
  }
  onChange: (value: string) => void,
  setContent: (setter: (value: string) => boolean) => void
}

export default class MonacoEditor extends Component<Monaco> {

  async componentDidMount() {
    if (this.containerElement) {
      if (this.props.json) {
        const model = await init_json(this.props.value, this.props.json.schema)
        init(model, this.containerElement, this.props.onChange)
        this.props.setContent(value => {
          model.setValue(value)
          return true
        })
      }
    } else {
      throw 'Something went wrong!'
    }
  }

  containerElement: HTMLDivElement | undefined = undefined

  assignRef = (component: HTMLDivElement) => {
    this.containerElement = component;
  }

  render() {
    const style = {
      width: '100%',
      height: this.props.height || '100%',
    };

    return <div
      ref={this.assignRef}
      style={style}
    />
  }
}