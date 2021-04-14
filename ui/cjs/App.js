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
const react_1 = require("react");
const React = __importStar(require("react"));
const Container_1 = __importDefault(require("react-bootstrap/Container"));
const Monaco_1 = __importDefault(require("./Monaco"));
const Button_1 = __importDefault(require("react-bootstrap/Button"));
const Form_1 = __importDefault(require("react-bootstrap/Form"));
const Row_1 = __importDefault(require("react-bootstrap/Row"));
const Col_1 = __importDefault(require("react-bootstrap/Col"));
const SEGMENT_CSV_BASE_URL = '';
class App extends react_1.Component {
    constructor(props) {
        super(props);
        this.test = this.test.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
        this.on_form_change = this.on_form_change.bind(this);
        this.set_set_value = this.set_set_value.bind(this);
        this.on_change = this.on_change.bind(this);
    }
    set_set_value(set_value) {
        this.setState({
            set_value
        });
    }
    on_change(code) {
        this.setState({ code });
    }
    async test() {
        const t = await fetch(`${SEGMENT_CSV_BASE_URL}test?key=${this.state.test}`, {
            body: JSON.stringify(Object.assign({ bucket: this.state.bucket, type: this.state.type }, JSON.parse(this.state.code))),
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let j = (await t.json());
        j.forEach(e => {
            console.log(e[0]);
            console.log(e[1]);
        });
    }
    async load() {
        const t = await fetch(`${SEGMENT_CSV_BASE_URL}fetch?type=${this.state.type}&bucket=${this.state.bucket}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let config = await t.text();
        if (config == '') {
            config = `{
    "segmentWriteKey": "",
    "csvParseOptions": {},
    "fieldMappings": {
      "kind": "",
      "userId": "",
      "properties": {}
    }
  }`;
        }
        else {
            config = JSON.stringify(JSON.parse(config), undefined, 2);
        }
        // Allow for a race conditionin which we've loaded the type JSON but still waiting on the monaco editor to load
        let r = this.state.set_value(config);
        while (!r) {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            r = this.state.set_value(config);
        }
    }
    async save() {
        if (this.state.type && this.state.bucket) {
            await fetch(`${SEGMENT_CSV_BASE_URL}config`, {
                body: JSON.stringify(Object.assign({ bucket: this.state.bucket, type: this.state.type }, JSON.parse(this.state.code))),
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
    async componentDidMount() {
        this.setState({ set_value: () => false });
    }
    on_form_change(evt) {
        switch (evt.target.name) {
            case 's3_bucket': {
                this.setState({
                    bucket: evt.target.value
                });
                break;
            }
            case 'csv_type': {
                this.setState({
                    type: evt.target.value
                });
                break;
            }
            case 'test_file': {
                this.setState({
                    test: evt.target.value
                });
                break;
            }
            default: {
                throw new Error('Unexpected form name: ' + evt.target.name);
            }
        }
    }
    render() {
        return (React.createElement("div", { className: "App" },
            React.createElement(Container_1.default, { fluid: true },
                React.createElement(Row_1.default, null,
                    React.createElement(Col_1.default, null,
                        React.createElement(Form_1.default.Row, null,
                            React.createElement(Col_1.default, null,
                                React.createElement(Form_1.default.Control, { size: 'sm', name: 's3_bucket', placeholder: "Enter name S3 bucket", onChange: this.on_form_change })),
                            React.createElement(Col_1.default, null,
                                React.createElement(Form_1.default.Control, { size: 'sm', name: 'csv_type', placeholder: "Enter name for CSV type", onChange: this.on_form_change })),
                            React.createElement(Col_1.default, null,
                                React.createElement(Button_1.default, { size: 'sm', variant: 'primary', onClick: this.load }, "Load"))))),
                React.createElement(Row_1.default, null,
                    React.createElement(Col_1.default, { style: { height: '20px' } })),
                React.createElement(Row_1.default, null,
                    React.createElement(Col_1.default, null,
                        React.createElement(Form_1.default.Row, null,
                            React.createElement(Col_1.default, null,
                                React.createElement(Form_1.default.Control, { size: 'sm', name: 'test_file', placeholder: "Enter name of test csv file", onChange: this.on_form_change })),
                            React.createElement(Col_1.default, null,
                                React.createElement(Button_1.default, { size: 'sm', variant: 'primary', onClick: this.test }, "Test")))),
                    React.createElement(Col_1.default, null,
                        React.createElement(Button_1.default, { size: 'sm', variant: 'primary', onClick: this.save }, "Save"))),
                React.createElement(Row_1.default, { style: { height: '20px' } },
                    React.createElement(Col_1.default, null)),
                React.createElement(Row_1.default, null,
                    React.createElement(Col_1.default, null,
                        React.createElement(Monaco_1.default, { setContent: this.set_set_value, height: '500px', value: '', onChange: this.on_change, json: {
                                schema: {
                                    "properties": {
                                        "csvParseOptions": {
                                            "properties": {
                                                "escape": {
                                                    "type": "string",
                                                    "description": "The character to escape quotes or delimiters. Defaults to none"
                                                },
                                                "newline": {
                                                    "type": "string",
                                                    "description": "The character defining end-of-line. Defaults to \\n"
                                                },
                                                "quote": {
                                                    "type": "string",
                                                    "description": "The character used to denote a string. Defaults to \""
                                                },
                                                "separator": {
                                                    "type": "string",
                                                    "description": "The character used to separate each column. Defaults to ,"
                                                },
                                                "skipComments": {
                                                    "type": "string",
                                                    "description": "Ignore lines beginning with #. Defaults to false"
                                                },
                                                "skipLines": {
                                                    "type": "number",
                                                    "description": "Number of lines to skip over at the start of the file. Defaults to 0"
                                                }
                                            },
                                            "type": "object",
                                            "description": "Options for configuring how to parse the CSV files for this type."
                                        },
                                        "eventName": {
                                            "type": "string",
                                            "description": "Provides the event name to use for this type of CSV file. If left blank, and the kind is 'track', then a column will need to be specified as defining the event name. Ignored if the kind is 'identify'"
                                        },
                                        "verboseErrors": {
                                            "type": "boolean",
                                            "description": "Whether to produce an error for every row that fails. Defaults to true (a summary error will still be produced if set to false)"
                                        },
                                        "fieldMappings": {
                                            "properties": {
                                                "anonymousId": {
                                                    "type": [
                                                        "string",
                                                        "number"
                                                    ],
                                                    "description": "The name (or column index if no header line provided) to use for anonymous IDs"
                                                },
                                                "event": {
                                                    "type": [
                                                        "string",
                                                        "number"
                                                    ],
                                                    "description": "The name (or column index if no header line provided) to use to define the event name for this row. If blank, and the kind is 'track', then a default eventName must be provided. Ignored if the kind is 'identify'"
                                                },
                                                "kind": {
                                                    "enum": [
                                                        "identify",
                                                        "track"
                                                    ],
                                                    "type": "string",
                                                    "description": "Whether this type of CSV file generates track events or identify events."
                                                },
                                                "properties": {
                                                    "additionalProperties": {
                                                        "properties": {
                                                            "name": {
                                                                "type": "string",
                                                                "description": "What to rename this column to"
                                                            },
                                                            "type": {
                                                                "enum": [
                                                                    "bool",
                                                                    "date",
                                                                    "float",
                                                                    "int"
                                                                ],
                                                                "type": "string",
                                                                "description": "What to interpret the types of this column as"
                                                            }
                                                        },
                                                        "type": "object"
                                                    },
                                                    "type": "object",
                                                    "description": "Specifies specific column renames or type conversions. Is a key-value map, where the key is the name of the column as defined by the CSV header line, or the index of the column if no header line provided."
                                                },
                                                "userId": {
                                                    "type": [
                                                        "string",
                                                        "number"
                                                    ],
                                                    "description": "The name (or column index if no header line provided) to use for anonymous IDs"
                                                }
                                            },
                                            "type": "object",
                                            "description": "Defines how to interpret certain columns (e.g. which column provides user IDs)"
                                        },
                                        "segmentWriteKey": {
                                            "type": "string",
                                            "description": "The write key of the Segment source to fire the events into."
                                        },
                                        "type": {
                                            "type": "string",
                                            "description": "The name of the CSV type. Any CSV file that begins with this prefix inside the S3 bucket, will trigger parsing using these configuration settings."
                                        }
                                    },
                                    "type": "object"
                                }
                            } }))))));
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map