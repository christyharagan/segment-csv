import MemoryFS from 'memory-fs'
import webpack, { Compiler, Plugin } from 'webpack'
import * as path from 'path'
import * as fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin'
const BASE = path.join(__dirname, '..')
const EDITOR_SRC = path.join(BASE, 'web', 'editor.html')
const EDITOR = path.join(BASE, 'cjs', 'index.js')
const OUTPUT = path.join(BASE, 'dist', 'index.html')
const SETUP_OUTPUT = path.join(__dirname, '..', '..', 'setup', 'out', 'index.html')

const mem_fs = new MemoryFS();

function module_to_path(lib: [string] | [string, string]) {
  let pkg_root = path.join(require.resolve(path.join(lib[0], 'package.json')), '..')
  return lib.length == 2 ? path.join(pkg_root, lib[1]) : pkg_root
}

class AppendWorker {
  constructor(private worker_script: string) { }
  apply(compiler: Compiler) {
    var self = this;

    (compiler.hooks
      ? compiler.hooks.compilation.tap.bind(compiler.hooks.compilation, 'html-webpack-inline-source-plugin')
      : compiler.plugin.bind(compiler, ['compilation']))(function (compilation) {
        (compilation.hooks
          ? compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync.bind(compilation.hooks.htmlWebpackPluginAlterAssetTags, 'html-webpack-inline-source-plugin')
          : compilation.plugin.bind(compilation, 'html-webpack-plugin-after-html-processing'))(function (pluginData: any, callback: any) {

            var body: any[] = [...pluginData.body];
            var head: any[] = [...pluginData.head];
            body.push({
              tagName: 'script',
              innerHTML: self.worker_script,
              closeTag: true,
              attributes: {
                id: 'worker',
                type: 'javascript/worker'
              }
            })

            let result = { head: head, body: body, plugin: pluginData.plugin, chunks: pluginData.chunks, outputName: pluginData.outputName };

            callback(null, result);
          });
      });
  }
}

const webworker = module_to_path(['monaco-editor', 'esm/vs/language/json/json.worker.js'])

// Builds a single .html output for easy consumption
export function build_editor() {
  return new Promise((resolve, reject) => {
    webpack_build(webworker, [], '/', './out.js')
      .run((err, stats) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          // console.log(stats)
          let worker_script = mem_fs.readFileSync('/out.js', 'utf8')

          webpack_build(EDITOR, [
            new HtmlWebpackPlugin({
              template: EDITOR_SRC,
              inlineSource: '.(js|css)$'
            }),
            new HtmlWebpackInlineSourcePlugin(),
            new AppendWorker(worker_script)
          ])
            .run((err, stats) => {
              if (err) {
                console.error(err)
                reject(err)
              } else {
                fs.copyFileSync(OUTPUT, SETUP_OUTPUT)
                // console.log(stats)
                resolve(undefined)
              }
            })
        }
      })
  })
}

function webpack_build(app: string, plugins?: Plugin[], path?: string, filename?: string): Compiler {
  let compiler = webpack({
    mode: 'development',
    entry: {
      app
    },
    output: {
      globalObject: 'this',
      libraryTarget: 'umd',
      library: 'monaco',
      path,
      filename
    },
    module: {
      rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'source-map-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }]
    },
    plugins
  })

  if (filename) {
    compiler.outputFileSystem = mem_fs
  }

  return compiler
}