"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build_editor = void 0;
const memory_fs_1 = __importDefault(require("memory-fs"));
const webpack_1 = __importDefault(require("webpack"));
const path = __importStar(require("path"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const html_webpack_inline_source_plugin_1 = __importDefault(require("html-webpack-inline-source-plugin"));
const BASE = path.join(__dirname, '..');
const EDITOR_SRC = path.join(BASE, 'web', 'editor.html');
const EDITOR = path.join(BASE, 'cjs', 'index.js');
const mem_fs = new memory_fs_1.default();
function module_to_path(lib) {
    let pkg_root = path.join(require.resolve(path.join(lib[0], 'package.json')), '..');
    return lib.length == 2 ? path.join(pkg_root, lib[1]) : pkg_root;
}
class AppendWorker {
    constructor(worker_script) {
        this.worker_script = worker_script;
    }
    apply(compiler) {
        var self = this;
        (compiler.hooks
            ? compiler.hooks.compilation.tap.bind(compiler.hooks.compilation, 'html-webpack-inline-source-plugin')
            : compiler.plugin.bind(compiler, ['compilation']))(function (compilation) {
            (compilation.hooks
                ? compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync.bind(compilation.hooks.htmlWebpackPluginAlterAssetTags, 'html-webpack-inline-source-plugin')
                : compilation.plugin.bind(compilation, 'html-webpack-plugin-after-html-processing'))(function (pluginData, callback) {
                var body = [...pluginData.body];
                var head = [...pluginData.head];
                body.push({
                    tagName: 'script',
                    innerHTML: self.worker_script,
                    closeTag: true,
                    attributes: {
                        id: 'worker',
                        type: 'javascript/worker'
                    }
                });
                let result = { head: head, body: body, plugin: pluginData.plugin, chunks: pluginData.chunks, outputName: pluginData.outputName };
                callback(null, result);
            });
        });
    }
}
const webworker = module_to_path(['monaco-editor', 'esm/vs/language/json/json.worker.js']);
// Builds a single .html output for easy consumption
function build_editor() {
    return new Promise((resolve, reject) => {
        webpack_build(webworker, [], '/', './out.js')
            .run((err, stats) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                // console.log(stats)
                let worker_script = mem_fs.readFileSync('/out.js', 'utf8');
                webpack_build(EDITOR, [
                    new html_webpack_plugin_1.default({
                        template: EDITOR_SRC,
                        inlineSource: '.(js|css)$'
                    }),
                    new html_webpack_inline_source_plugin_1.default(),
                    new AppendWorker(worker_script)
                ])
                    .run((err, stats) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        // console.log(stats)
                        resolve(undefined);
                    }
                });
            }
        });
    });
}
exports.build_editor = build_editor;
function webpack_build(app, plugins, path, filename) {
    let compiler = webpack_1.default({
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
    });
    if (filename) {
        compiler.outputFileSystem = mem_fs;
    }
    return compiler;
}
//# sourceMappingURL=build.js.map