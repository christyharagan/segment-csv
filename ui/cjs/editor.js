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
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_ts = exports.init = exports.init_json = void 0;
const monaco = __importStar(require("monaco-editor"));
// import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js'
// import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
// import 'monaco-editor/esm/vs/language/typescript/languageFeatures'
// import 'monaco-editor/esm/vs/basic-languages/typescript/typescript'
// import 'monaco-editor/esm/vs/language/typescript/tsMode'
require("monaco-editor/esm/vs/language/json/languageFeatures");
// import 'monaco-editor/esm/vs/basic-languages/typescript/typescript'
require("monaco-editor/esm/vs/language/json/jsonMode");
require("monaco-editor/esm/vs/language/json/monaco.contribution");
const typescript_1 = require("typescript");
self.MonacoEnvironment = {
    getWorker: function () {
        var _a;
        var blob = new Blob([
            (_a = document.querySelector('#worker')) === null || _a === void 0 ? void 0 : _a.textContent
        ], { type: "text/javascript" });
        return new Worker(window.URL.createObjectURL(blob));
    }
};
async function init_json(init_json, schema) {
    var modelUri = monaco.Uri.parse('file://edit.json');
    var model = monaco.editor.createModel(init_json, 'json', modelUri);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
                uri: "http://ch/schema.json",
                fileMatch: [modelUri.toString()],
                schema
            }]
    });
    return model;
}
exports.init_json = init_json;
async function init(model, container, on_content_change) {
    // let container = document.getElementById('container')
    // if (container) {
    const editor = monaco.editor.create(container, { model });
    if (on_content_change) {
        editor.onDidChangeModelContent(() => {
            let model = editor.getModel();
            if (model) {
                on_content_change(model.getLinesContent().join('\n'));
            }
        });
    }
    // }
}
exports.init = init;
async function init_ts(init_code, ts_libs) {
    ts_libs.forEach(async ({ path, code }) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(code, path);
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: typescript_1.ScriptTarget.ES2017,
        strict: true,
        suppressExcessPropertyErrors: false,
        moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
        esModuleInterop: true
    });
    return monaco.editor.createModel(init_code, 'typescript', monaco.Uri.parse('file:///edit.tsx'));
}
exports.init_ts = init_ts;
//# sourceMappingURL=editor.js.map