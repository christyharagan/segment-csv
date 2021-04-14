#!/usr/bin/env node
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
const yargs_1 = __importDefault(require("yargs"));
const _1 = require(".");
const build_1 = require("./build");
const fs = __importStar(require("fs"));
let env = ['browser', 'custom-src', 'custom-dest'];
let cmdline_args = yargs_1.default
    .choices('env', env)
    .number('port')
    .string('access_token')
    .string('workspace_id')
    .array('ts_libs')
    .string('in')
    .string('out')
    .help()
    .parse();
let args = cmdline_args && cmdline_args.env ? cmdline_args : _1.load_settings_env(process.cwd());
if (args === undefined) {
    console.error('Either provide command line arguments, or ensure a settings.env file exists in the current working directory');
}
else if (Array.isArray(args)) {
    console.error(`The setting.env file has syntax errors on lines: ${args.splice(0, 1)[0]}, ${args.reduce((s, l) => `${s}${l}`, '')}`);
}
else if (!args.env || (args.env !== 'browser' && args.env !== 'custom-src' && args.env !== 'custom-dest')) {
    console.error(`The settings.env file should contain an "env" entry with a value of either "browser", "custom-src", or "custom-dest"`);
}
else {
    let _args = args;
    let server_init = _args.env == 'browser' ? _1.browser_server : _args.env == 'custom-src' ? _1.custom_src_server : _1.custom_dest_server;
    let server = server_init({
        init_code: _args.in ? fs.readFileSync(_args.in, 'utf8') : undefined,
        port: _args.port,
        workspace_id: _args.workspace_id,
        access_token: _args.access_token,
        on_code_change: _args.out ? build_1.build_editor_content(_args.out) : undefined
    });
    if (_args.ts_libs) {
        server.addLibs(_args.ts_libs);
    }
    server.run();
}
//# sourceMappingURL=bin.js.map