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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotLevelGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const BotLevelGenerator_1 = require("C:/snapshot/project/obj/generators/BotLevelGenerator");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const RaidInformation_1 = require("../Globals/RaidInformation");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const ModConfig_1 = require("../Globals/ModConfig");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const ModInformation_1 = require("../Globals/ModInformation");
/** Handle profile related client events */
let APBSBotLevelGenerator = class APBSBotLevelGenerator {
    randomUtil;
    databaseService;
    botLevelGenerator;
    apbsLogger;
    profileHelper;
    apbsTierGetter;
    raidInformation;
    modInformation;
    apbsEquipmentGetter;
    constructor(randomUtil, databaseService, botLevelGenerator, apbsLogger, profileHelper, apbsTierGetter, raidInformation, modInformation, apbsEquipmentGetter) {
        this.randomUtil = randomUtil;
        this.databaseService = databaseService;
        this.botLevelGenerator = botLevelGenerator;
        this.apbsLogger = apbsLogger;
        this.profileHelper = profileHelper;
        this.apbsTierGetter = apbsTierGetter;
        this.raidInformation = raidInformation;
        this.modInformation = modInformation;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
    }
    registerBotLevelGenerator(container) {
        container.afterResolution("BotLevelGenerator", (_t, result) => {
            result.generateBotLevel = (levelDetails, botGenerationDetails, bot) => {
                if (this.modInformation.testMode && (this.modInformation.testLevelLock || this.modInformation.testLevelLockToPlayer) && this.modInformation.testBotRole.includes(botGenerationDetails.role.toLowerCase())) {
                    let level = this.profileHelper.getPmcProfile(this.raidInformation.sessionId)?.Info?.Level;
                    if (this.modInformation.testLevelLock)
                        level = this.modInformation.levelLockLevel;
                    const exp = this.profileHelper.getExperience(level);
                    const tier = this.apbsTierGetter.getTierByLevel(level);
                    bot.Info.Tier = this.chadOrChill(tier.toString());
                    bot.Info.PrestigeLevel = this.setBotPrestigeInfo(level, botGenerationDetails);
                    const result = {
                        level,
                        exp
                    };
                    return result;
                }
                if (botGenerationDetails.isPlayerScav) {
                    let level = this.raidInformation.freshProfile == true ? 1 : this.profileHelper.getPmcProfile(this.raidInformation.sessionId)?.Info?.Level;
                    // Level only stays undefined when a Fika dedicated profile is created due to this.raidInformation.freshProfile never being set.
                    // As Fika never calls /client/profile/status
                    if (level === undefined) {
                        this.raidInformation.freshProfile = true;
                        level = 1;
                    }
                    const exp = this.profileHelper.getExperience(level);
                    const tier = this.apbsTierGetter.getTierByLevel(level);
                    bot.Info.Tier = this.chadOrChill(tier.toString());
                    const result = {
                        level,
                        exp
                    };
                    return result;
                }
                const expTable = this.databaseService.getGlobals().config.exp.level.exp_table;
                const botLevelRange = this.apbsGetRelativeBotLevelRange(botGenerationDetails, levelDetails, expTable.length);
                const min = botLevelRange.min <= 0 ? 1 : botLevelRange.min;
                const max = botLevelRange.max >= 79 ? 79 : botLevelRange.max;
                const level = this.randomUtil.getInt(min, max);
                const exp = this.profileHelper.getExperience(level);
                const tier = this.apbsTierGetter.getTierByLevel(level);
                bot.Info.Tier = this.chadOrChill(tier.toString());
                bot.Info.PrestigeLevel = this.setBotPrestigeInfo(level, botGenerationDetails);
                const result = {
                    level,
                    exp
                };
                return result;
            };
        }, { frequency: "Always" });
        this.apbsLogger.log(Logging_1.Logging.DEBUG, "Bot Level Generator registered");
    }
    chadOrChill(tierInfo) {
        if (ModConfig_1.ModConfig.config.generalConfig.onlyChads && ModConfig_1.ModConfig.config.generalConfig.tarkovAndChill) {
            return "?";
        }
        if (ModConfig_1.ModConfig.config.generalConfig.onlyChads)
            return "7";
        if (ModConfig_1.ModConfig.config.generalConfig.tarkovAndChill)
            return "1";
        if (ModConfig_1.ModConfig.config.generalConfig.blickyMode)
            return "0";
        return tierInfo;
    }
    apbsGetRelativeBotLevelRange(botGenerationDetails, levelDetails, maxAvailableLevel) {
        const minPossibleLevel = botGenerationDetails.isPmc && botGenerationDetails.locationSpecificPmcLevelOverride
            ? Math.min(Math.max(levelDetails.min, botGenerationDetails.locationSpecificPmcLevelOverride.min), // Biggest between json min and the botgen min
            maxAvailableLevel // Fallback if value above is crazy (default is 79)
            )
            : Math.min(levelDetails.min, maxAvailableLevel); // Not pmc with override or non-pmc
        const maxPossibleLevel = botGenerationDetails.isPmc && botGenerationDetails.locationSpecificPmcLevelOverride
            ? Math.min(botGenerationDetails.locationSpecificPmcLevelOverride.max, maxAvailableLevel) // Was a PMC and they have a level override
            : Math.min(levelDetails.max, maxAvailableLevel); // Not pmc with override or non-pmc
        let minLevel = botGenerationDetails.playerLevel - this.apbsTierGetter.getTierLowerLevelDeviation(botGenerationDetails.playerLevel);
        let maxLevel = botGenerationDetails.playerLevel + this.apbsTierGetter.getTierUpperLevelDeviation(botGenerationDetails.playerLevel);
        if (ModConfig_1.ModConfig.config.customScavLevelDeltas.enable && !botGenerationDetails.isPmc && !botGenerationDetails.isPlayerScav && (botGenerationDetails.role.includes("assault") || botGenerationDetails.role == "marksman")) {
            minLevel = botGenerationDetails.playerLevel - this.apbsTierGetter.getScavTierLowerLevelDeviation(botGenerationDetails.playerLevel);
            maxLevel = botGenerationDetails.playerLevel + this.apbsTierGetter.getScavTierUpperLevelDeviation(botGenerationDetails.playerLevel);
        }
        if (ModConfig_1.ModConfig.config.pmcBots.additionalOptions.enablePrestiging) {
            const pmcProfile = this.profileHelper.getPmcProfile(this.raidInformation.sessionId);
            if (pmcProfile.Info.PrestigeLevel > 0) {
                maxLevel = 79;
                minLevel = 1;
            }
        }
        // Bound the level to the min/max possible
        maxLevel = Math.min(Math.max(maxLevel, minPossibleLevel), maxPossibleLevel);
        minLevel = Math.min(Math.max(minLevel, minPossibleLevel), maxPossibleLevel);
        return {
            min: minLevel,
            max: maxLevel
        };
    }
    setBotPrestigeInfo(level, botGenerationDetails) {
        if (!ModConfig_1.ModConfig.config.pmcBots.additionalOptions.enablePrestiging)
            return 0;
        if (!botGenerationDetails.isPmc)
            return 0;
        const pmcProfile = this.profileHelper.getPmcProfile(this.raidInformation.sessionId);
        const isPlayerPrestiged = pmcProfile.Info.PrestigeLevel > 0 ? true : false;
        const playerPrestigeLevel = pmcProfile.Info.PrestigeLevel;
        const minPlayerLevelForBotsToPrestige = 61;
        const maxPrestige = 2;
        const canBotPrestige = botGenerationDetails.playerLevel >= minPlayerLevelForBotsToPrestige ||
            botGenerationDetails.playerLevel >= (level - 15) && isPlayerPrestiged ||
            isPlayerPrestiged
            ? true : false;
        if (canBotPrestige) {
            let botPrestigeLevel = 0;
            let hasBotTriedPrestige = false;
            if (botGenerationDetails.playerLevel >= (level - 15) && isPlayerPrestiged) {
                botPrestigeLevel = playerPrestigeLevel >= maxPrestige ? this.randomUtil.getInt(0, maxPrestige) : this.randomUtil.getInt(0, playerPrestigeLevel);
                hasBotTriedPrestige = true;
            }
            if (level <= (20 - Math.abs((botGenerationDetails.playerLevel - 79)))) {
                botPrestigeLevel = playerPrestigeLevel >= maxPrestige ? this.randomUtil.getInt(0, maxPrestige) : this.randomUtil.getInt(botPrestigeLevel, playerPrestigeLevel + 1);
                hasBotTriedPrestige = true;
            }
            if (isPlayerPrestiged && !hasBotTriedPrestige) {
                botPrestigeLevel = this.randomUtil.getInt(0, playerPrestigeLevel - 1);
            }
            return botPrestigeLevel;
        }
        return 0;
    }
};
exports.APBSBotLevelGenerator = APBSBotLevelGenerator;
exports.APBSBotLevelGenerator = APBSBotLevelGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("RandomUtil")),
    __param(1, (0, tsyringe_1.inject)("DatabaseService")),
    __param(2, (0, tsyringe_1.inject)("BotLevelGenerator")),
    __param(3, (0, tsyringe_1.inject)("APBSLogger")),
    __param(4, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(5, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(6, (0, tsyringe_1.inject)("RaidInformation")),
    __param(7, (0, tsyringe_1.inject)("ModInformation")),
    __param(8, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __metadata("design:paramtypes", [typeof (_a = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _a : Object, typeof (_b = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof BotLevelGenerator_1.BotLevelGenerator !== "undefined" && BotLevelGenerator_1.BotLevelGenerator) === "function" ? _c : Object, typeof (_d = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _d : Object, typeof (_e = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _e : Object, typeof (_f = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _f : Object, typeof (_g = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _g : Object, typeof (_h = typeof ModInformation_1.ModInformation !== "undefined" && ModInformation_1.ModInformation) === "function" ? _h : Object, typeof (_j = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _j : Object])
], APBSBotLevelGenerator);
//# sourceMappingURL=ABPSBotLevelGenerator.js.map