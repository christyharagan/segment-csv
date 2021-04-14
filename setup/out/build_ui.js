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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write_to_aws = exports.lambda_base_url = void 0;
var path = __importStar(require("path"));
var AWS = __importStar(require("aws-sdk"));
var fs = __importStar(require("fs"));
var zlib = __importStar(require("zlib"));
var BASE = path.join(__dirname, '..');
var OUTPUT = path.join(BASE, 'out', 'index.html');
var UI_AWS = path.join(BASE, 'built', 'ui.js');
function lambda_base_url(credentials, region) {
    return __awaiter(this, void 0, void 0, function () {
        var A, ras, ra;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    A = new AWS.APIGateway({
                        region: region,
                        credentials: credentials
                    });
                    return [4 /*yield*/, A.getRestApis().promise()];
                case 1:
                    ras = _a.sent();
                    ra = ras.items.find(function (r) { return r.name == 'segment-csv'; });
                    return [2 /*return*/, "https://" + ra.id + ".execute-api." + region + ".amazonaws.com/Prod/"];
            }
        });
    });
}
exports.lambda_base_url = lambda_base_url;
var HTML_SEARCH = "const SEGMENT_CSV_BASE_URL = '";
var AWS_SEARCH = "const UI = '";
function write_to_aws(lambda_access_key, lambda_secret_key, region) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, base_url, s, i, ss, j, ui_output_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    credentials = new AWS.Credentials({
                        accessKeyId: lambda_access_key,
                        secretAccessKey: lambda_secret_key
                    });
                    return [4 /*yield*/, lambda_base_url(credentials, region)];
                case 1:
                    base_url = _a.sent();
                    s = fs.readFileSync(OUTPUT, 'utf8');
                    i = s.indexOf(HTML_SEARCH) + HTML_SEARCH.length;
                    ss = s.substring(i);
                    j = ss.indexOf('\'');
                    ui_output_1 = s.substring(0, i) + base_url + ss.substring(j);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            zlib.gzip(ui_output_1, function (error, gzipped_ui_output) {
                                if (error) {
                                    reject(error);
                                }
                                else {
                                    var aws_ui = fs.readFileSync(UI_AWS, 'utf8');
                                    var i_1 = aws_ui.indexOf(AWS_SEARCH) + AWS_SEARCH.length;
                                    var ss_1 = aws_ui.substring(i_1);
                                    var j_1 = ss_1.indexOf('\'');
                                    console.log(i_1);
                                    console.log(j_1);
                                    var aws_ui_output = aws_ui.substring(0, i_1) + gzipped_ui_output.toString('base64') + ss_1.substring(j_1);
                                    fs.writeFileSync(UI_AWS, aws_ui_output, 'utf8');
                                    resolve(undefined);
                                }
                            });
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.write_to_aws = write_to_aws;
