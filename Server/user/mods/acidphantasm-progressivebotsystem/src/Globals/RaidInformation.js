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
exports.RaidInformation = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotEnablementHelper_1 = require("../Helpers/BotEnablementHelper");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
let RaidInformation = class RaidInformation {
    databaseService;
    botEnablementHelper;
    apbsLogger;
    constructor(databaseService, botEnablementHelper, apbsLogger) {
        this.databaseService = databaseService;
        this.botEnablementHelper = botEnablementHelper;
        this.apbsLogger = apbsLogger;
    }
    freshProfile;
    location;
    currentTime;
    timeVariant;
    nightTime;
    sessionId;
    usingDefaultDB;
    mapWeights = {
        "bigmap": {
            "LongRange": 20,
            "ShortRange": 80
        },
        "RezervBase": {
            "LongRange": 20,
            "ShortRange": 80
        },
        "laboratory": {
            "LongRange": 10,
            "ShortRange": 90
        },
        "factory4_night": {
            "LongRange": 5,
            "ShortRange": 95
        },
        "factory4_day": {
            "LongRange": 5,
            "ShortRange": 95
        },
        "Interchange": {
            "LongRange": 20,
            "ShortRange": 80
        },
        "Sandbox": {
            "LongRange": 15,
            "ShortRange": 85
        },
        "Sandbox_high": {
            "LongRange": 15,
            "ShortRange": 85
        },
        "Woods": {
            "LongRange": 60,
            "ShortRange": 40
        },
        "Shoreline": {
            "LongRange": 50,
            "ShortRange": 50
        },
        "Lighthouse": {
            "LongRange": 30,
            "ShortRange": 70
        },
        "TarkovStreets": {
            "LongRange": 20,
            "ShortRange": 80
        }
    };
    checkAllBotsInDB() {
        const botTable = this.databaseService.getTables().bots.types;
        for (const botType in botTable) {
            if (this.botEnablementHelper.doesBotExist(botType.toLowerCase())) {
                if (this.botEnablementHelper.botDisabled(botType.toLowerCase())) {
                    this.apbsLogger.log(Logging_1.Logging.DEBUG, `Bot: ${botType.toLowerCase()} is disabled.`);
                    continue;
                }
                continue;
            }
            this.apbsLogger.log(Logging_1.Logging.ERR, `Bot: ${botType.toLowerCase()} configuration is missing. Bot is defaulting to vanilla. Report this to acidphantasm.`);
        }
    }
    isBotEnabled(botType) {
        botType = botType.toLowerCase();
        if (["usec", "bear", "pmc"].includes(botType))
            botType = "pmcusec";
        if (this.botEnablementHelper.doesBotExist(botType) && !this.botEnablementHelper.botDisabled(botType)) {
            return true;
        }
        return false;
    }
};
exports.RaidInformation = RaidInformation;
exports.RaidInformation = RaidInformation = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseService")),
    __param(1, (0, tsyringe_1.inject)("BotEnablementHelper")),
    __param(2, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof BotEnablementHelper_1.BotEnablementHelper !== "undefined" && BotEnablementHelper_1.BotEnablementHelper) === "function" ? _b : Object, typeof (_c = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _c : Object])
], RaidInformation);
//# sourceMappingURL=RaidInformation.js.map