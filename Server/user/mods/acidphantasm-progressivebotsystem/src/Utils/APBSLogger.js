"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSLogger = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const Logging_1 = require("../Enums/Logging");
const ModInformation_1 = require("../Globals/ModInformation");
const node_fs_1 = __importDefault(require("node:fs"));
const ModConfig_1 = require("../Globals/ModConfig");
let APBSLogger = class APBSLogger {
    logger;
    modInformation;
    hasNotLoggedDebugDisabledYet;
    constructor(logger, modInformation) {
        this.logger = logger;
        this.modInformation = modInformation;
        this.hasNotLoggedDebugDisabledYet = false;
    }
    createLogFiles() {
        for (const value in Logging_1.LoggingFolders) {
            node_fs_1.default.writeFileSync(`${this.modInformation.logPath}/${Logging_1.LoggingFolders[value]}.log`, `${new Date().toLocaleString()} - Log File Created - APBS Version: ${this.modInformation.versionNumber}\n`);
        }
    }
    log(logcation, message, message2, message3, message4, message5, message6, message7, message8) {
        if (!ModConfig_1.ModConfig.config.enableDebugLog && logcation == Logging_1.Logging.DEBUG) {
            if (!this.hasNotLoggedDebugDisabledYet) {
                this.hasNotLoggedDebugDisabledYet = true;
                message = "================================================================================";
                message2 = "enableDebugLog is disabled. If you want debug logging, enable it in the config.";
                message3 = "This log will only show WARNINGs and ERRORs while enableDebugLog is disabled.";
                message4 = "================================================================================";
            }
            else
                return;
        }
        const messagesArray = {
            message,
            message2,
            message3,
            message4,
            message5,
            message6,
            message7,
            message8
        };
        let messages = "";
        let textFlag;
        let logType;
        let showInConsole;
        let consoleMessage = "";
        for (const line in messagesArray) {
            if (messagesArray[line] !== undefined) {
                switch (logcation) {
                    case Logging_1.Logging.DEBUG:
                        logType = Logging_1.Logging.DEBUG;
                        textFlag = " DEBUG - ";
                        showInConsole = false;
                        break;
                    case Logging_1.Logging.WARN:
                        logType = Logging_1.Logging.DEBUG;
                        textFlag = " WARNING - ";
                        showInConsole = true;
                        break;
                    case Logging_1.Logging.ERR:
                        logType = Logging_1.Logging.DEBUG;
                        textFlag = " ERROR - ";
                        showInConsole = true;
                        break;
                    default:
                        logType = logcation;
                        textFlag = " - ";
                        showInConsole = false;
                        break;
                }
                if (showInConsole) {
                    consoleMessage += `${messagesArray[line]}`;
                    messages += `${new Date().toLocaleString()}${textFlag}${messagesArray[line]}\n`;
                    continue;
                }
                messages += `${new Date().toLocaleString()}${textFlag}${messagesArray[line]}\n`;
            }
        }
        node_fs_1.default.appendFileSync(`${this.modInformation.logPath}/${logType}.log`, `${messages}`);
        if (showInConsole) {
            if (logcation == Logging_1.Logging.WARN) {
                this.logger.warning(`[APBS] ${consoleMessage}`);
            }
            if (logcation == Logging_1.Logging.ERR) {
                this.logger.error(`[APBS] ${consoleMessage}`);
            }
        }
    }
};
exports.APBSLogger = APBSLogger;
exports.APBSLogger = APBSLogger = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("ModInformation")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof ModInformation_1.ModInformation !== "undefined" && ModInformation_1.ModInformation) === "function" ? _b : Object])
], APBSLogger);
//# sourceMappingURL=APBSLogger.js.map