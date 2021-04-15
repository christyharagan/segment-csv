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
exports.deploy = void 0;
var child_process_1 = require("child_process");
var aws_setup_1 = require("./aws_setup");
var build_ui_1 = require("./build_ui");
var AWS = __importStar(require("aws-sdk"));
var path = __importStar(require("path"));
var CWD = path.join(__dirname, '..');
function sam_deploy(lambdaS3Bucket, cwd) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var sam = child_process_1.spawn('sam', ['deploy', '--no-confirm-changeset', '--force-upload', '--stack-name=segment-csv', '--s3-bucket=' + lambdaS3Bucket, '--capabilities=CAPABILITY_NAMED_IAM'], { cwd: cwd });
                        sam.stdout.on('data', function (data) {
                            console.log(data.toString());
                        });
                        sam.stderr.on('data', function (data) {
                            console.error(data.toString());
                        });
                        sam.on('exit', function (code) {
                            if (code == 0 || code == 1) { // 1 means: Stack up-to-date
                                resolve(undefined);
                            }
                            else {
                                reject('"sam deploy" exited with code ' + code.toString());
                            }
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deploy(config) {
    return __awaiter(this, void 0, void 0, function () {
        var tmp_dir, built_dir, base_url, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, aws_setup_1.prepare_aws()];
                case 1:
                    tmp_dir = _a.sent();
                    built_dir = path.join(tmp_dir, 'built');
                    return [4 /*yield*/, sam_deploy(config.lambdaS3Bucket, tmp_dir)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, aws_setup_1.setup(config)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, build_ui_1.write_to_aws(config.lambdaAccessKeyId, config.lambdaSecretAccessKey, config.region, built_dir)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sam_deploy(config.lambdaS3Bucket, tmp_dir)];
                case 5:
                    _a.sent();
                    console.log('-------------- WHAT FOLLOWS ARE THE DETAILS TO MANUALLY CONFIGURE THE s3 BUCKET --------------');
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 9, , 10]);
                    return [4 /*yield*/, build_ui_1.lambda_base_url(new AWS.Credentials({
                            accessKeyId: config.lambdaAccessKeyId,
                            secretAccessKey: config.lambdaSecretAccessKey,
                        }), config.region)];
                case 7:
                    base_url = _a.sent();
                    console.log('UI URL: ' + base_url + 'ui');
                    console.log('');
                    return [4 /*yield*/, aws_setup_1.config_for_s3(config)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_1 = _a.sent();
                    console.error(e_1);
                    throw e_1;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.deploy = deploy;
