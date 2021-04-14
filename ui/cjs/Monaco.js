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
exports.init = exports.init_json = void 0;
const react_1 = require("react");
const React = __importStar(require("react"));
const monaco = __importStar(require("monaco-editor"));
require("monaco-editor/esm/vs/language/json/languageFeatures");
require("monaco-editor/esm/vs/language/json/jsonMode");
require("monaco-editor/esm/vs/language/json/monaco.contribution");
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
    const editor = monaco.editor.create(container, { model });
    if (on_content_change) {
        editor.onDidChangeModelContent(() => {
            let model = editor.getModel();
            if (model) {
                on_content_change(model.getLinesContent().join('\n'));
            }
        });
    }
}
exports.init = init;
class MonacoEditor extends react_1.Component {
    constructor() {
        super(...arguments);
        this.containerElement = undefined;
        this.assignRef = (component) => {
            this.containerElement = component;
        };
    }
    async componentDidMount() {
        if (this.containerElement) {
            if (this.props.json) {
                const model = await init_json(this.props.value, this.props.json.schema);
                init(model, this.containerElement, this.props.onChange);
                this.props.setContent(value => {
                    model.setValue(value);
                    return true;
                });
            }
        }
        else {
            throw 'Something went wrong!';
        }
    }
    render() {
        const style = {
            width: '100%',
            height: this.props.height || '100%',
        };
        return React.createElement("div", { ref: this.assignRef, style: style });
    }
}
exports.default = MonacoEditor;
//# sourceMappingURL=Monaco.js.map