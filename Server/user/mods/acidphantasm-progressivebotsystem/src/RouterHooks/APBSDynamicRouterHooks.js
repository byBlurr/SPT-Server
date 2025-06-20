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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSDynamicRouterHooks = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DynamicRouterModService_1 = require("C:/snapshot/project/obj/services/mod/dynamicRouter/DynamicRouterModService");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const BotLogHelper_1 = require("../Helpers/BotLogHelper");
let APBSDynamicRouterHooks = class APBSDynamicRouterHooks {
    dynamicRouterModService;
    apbsLogger;
    botLogHelper;
    constructor(dynamicRouterModService, apbsLogger, botLogHelper) {
        this.dynamicRouterModService = dynamicRouterModService;
        this.apbsLogger = apbsLogger;
        this.botLogHelper = botLogHelper;
    }
    registerQBRouterHooks() {
        this.dynamicRouterModService.registerDynamicRouter("APBS-QBBotGenerationRouter", [
            {
                url: "/QuestingBots/GenerateBot/",
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
        this.apbsLogger.log(Logging_1.Logging.DEBUG, "QB Compatibility Router registered");
    }
};
exports.APBSDynamicRouterHooks = APBSDynamicRouterHooks;
exports.APBSDynamicRouterHooks = APBSDynamicRouterHooks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DynamicRouterModService")),
    __param(1, (0, tsyringe_1.inject)("APBSLogger")),
    __param(2, (0, tsyringe_1.inject)("BotLogHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof DynamicRouterModService_1.DynamicRouterModService !== "undefined" && DynamicRouterModService_1.DynamicRouterModService) === "function" ? _a : Object, typeof (_b = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _b : Object, typeof (_c = typeof BotLogHelper_1.BotLogHelper !== "undefined" && BotLogHelper_1.BotLogHelper) === "function" ? _c : Object])
], APBSDynamicRouterHooks);
//# sourceMappingURL=APBSDynamicRouterHooks.js.map