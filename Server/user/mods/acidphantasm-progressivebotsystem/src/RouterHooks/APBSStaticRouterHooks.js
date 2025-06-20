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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSStaticRouterHooks = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const StaticRouterModService_1 = require("C:/snapshot/project/obj/services/mod/staticRouter/StaticRouterModService");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const RaidInformation_1 = require("../Globals/RaidInformation");
const ModInformation_1 = require("../Globals/ModInformation");
const APBSTester_1 = require("../Utils/APBSTester");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const BotLogHelper_1 = require("../Helpers/BotLogHelper");
let APBSStaticRouterHooks = class APBSStaticRouterHooks {
    staticRouterService;
    apbsLogger;
    raidInformation;
    modInformation;
    databaseService;
    apbsTester;
    profileHelper;
    botLogHelper;
    constructor(staticRouterService, apbsLogger, raidInformation, modInformation, databaseService, apbsTester, profileHelper, botLogHelper) {
        this.staticRouterService = staticRouterService;
        this.apbsLogger = apbsLogger;
        this.raidInformation = raidInformation;
        this.modInformation = modInformation;
        this.databaseService = databaseService;
        this.apbsTester = apbsTester;
        this.profileHelper = profileHelper;
        this.botLogHelper = botLogHelper;
    }
    registerRouterHooks() {
        this.staticRouterService.registerStaticRouter("APBS-BotGenerationRouter", [
            {
                url: "/client/game/bot/generate",
                action: async (url, info, sessionId, output) => {
                    try {
                        const outputJSON = JSON.parse(output);
                        if (outputJSON.data?.length) {
                            this.botLogHelper.logBotGeneration(outputJSON);
                        }
                    }
                    catch (err) {
                        this.apbsLogger.log(Logging_1.Logging.ERR, "Bot Router hook failed.\n", `${err.stack}`);
                    }
                    return output;
                }
            }
        ], "APBS");
        this.apbsLogger.log(Logging_1.Logging.DEBUG, "Bot Generation Router registered");
        this.staticRouterService.registerStaticRouter("APBS-StartMatchRouter", [
            {
                url: "/client/match/local/start",
                action: async (url, info, sessionId, output) => {
                    this.raidInformation.sessionId = sessionId;
                    try {
                        this.botLogHelper.logLocation(info);
                        if (this.modInformation.testMode && this.modInformation.clearAssortPreRaid) {
                            const tables = this.databaseService.getTables();
                            this.apbsTester.clearAssort(tables.traders[this.modInformation.testTrader]);
                        }
                    }
                    catch (err) {
                        this.apbsLogger.log(Logging_1.Logging.ERR, "Match Start Router hook failed.\n", `${err.stack}`);
                    }
                    return output;
                }
            }
        ], "APBS");
        this.apbsLogger.log(Logging_1.Logging.DEBUG, "Match Start Router registered");
        this.staticRouterService.registerStaticRouter("APBS-GameStartRouter", [
            {
                url: "/client/game/start",
                action: async (url, info, sessionId, output) => {
                    try {
                        const fullProfile = this.profileHelper.getFullProfile(sessionId);
                        this.raidInformation.freshProfile = (fullProfile.info.wipe === true) ? true : false;
                    }
                    catch (err) {
                        this.apbsLogger.log(Logging_1.Logging.ERR, "Game Start Router hook failed.\n", `${err.stack}`);
                    }
                    return output;
                }
            }
        ], "APBS");
        this.apbsLogger.log(Logging_1.Logging.DEBUG, "Game Start Router registered");
        this.staticRouterService.registerStaticRouter("APBS-ProfileStatusChecker", [
            {
                url: "/client/profile/status",
                action: async (url, info, sessionId, output) => {
                    try {
                        const fullProfile = this.profileHelper.getFullProfile(sessionId);
                        this.raidInformation.freshProfile = (fullProfile.info.wipe === true) ? true : false;
                    }
                    catch (err) {
                        this.apbsLogger.log(Logging_1.Logging.ERR, "Profile Status Router hook failed.\n", `${err.stack}`);
                    }
                    return output;
                }
            }
        ], "APBS");
        this.apbsLogger.log(Logging_1.Logging.DEBUG, "Profile Status Router registered");
    }
};
exports.APBSStaticRouterHooks = APBSStaticRouterHooks;
exports.APBSStaticRouterHooks = APBSStaticRouterHooks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("StaticRouterModService")),
    __param(1, (0, tsyringe_1.inject)("APBSLogger")),
    __param(2, (0, tsyringe_1.inject)("RaidInformation")),
    __param(3, (0, tsyringe_1.inject)("ModInformation")),
    __param(4, (0, tsyringe_1.inject)("DatabaseService")),
    __param(5, (0, tsyringe_1.inject)("APBSTester")),
    __param(6, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(7, (0, tsyringe_1.inject)("BotLogHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof StaticRouterModService_1.StaticRouterModService !== "undefined" && StaticRouterModService_1.StaticRouterModService) === "function" ? _a : Object, typeof (_b = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _b : Object, typeof (_c = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _c : Object, typeof (_d = typeof ModInformation_1.ModInformation !== "undefined" && ModInformation_1.ModInformation) === "function" ? _d : Object, typeof (_e = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _e : Object, typeof (_f = typeof APBSTester_1.APBSTester !== "undefined" && APBSTester_1.APBSTester) === "function" ? _f : Object, typeof (_g = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _g : Object, typeof (_h = typeof BotLogHelper_1.BotLogHelper !== "undefined" && BotLogHelper_1.BotLogHelper) === "function" ? _h : Object])
], APBSStaticRouterHooks);
//# sourceMappingURL=APBSStaticRouterHooks.js.map