interface Window {
  init: any
  MonacoEnvironment: {
    getWorkerUrl?: (moduleId: string, label: string) => string
    getWorker?: (workerId: string, label: string) => Worker | Promise<Worker>
    baseUrl?: string
  }
}
declare module 'monaco-editor-core/esm/vs/editor/editor.worker'{}

declare module 'html-webpack-inline-source-plugin' {
  import {Plugin} from 'webpack'
  export default class extends Plugin {
    constructor()
  }
}

declare module 'monaco-editor-core'{}