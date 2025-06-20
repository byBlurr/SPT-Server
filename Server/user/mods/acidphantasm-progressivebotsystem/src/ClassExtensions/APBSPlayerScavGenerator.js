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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSPlayerScavGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotGenerator_1 = require("C:/snapshot/project/obj/generators/BotGenerator");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const MemberCategory_1 = require("C:/snapshot/project/obj/models/enums/MemberCategory");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const BotLootCacheService_1 = require("C:/snapshot/project/obj/services/BotLootCacheService");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const FenceService_1 = require("C:/snapshot/project/obj/services/FenceService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const PlayerScavGenerator_1 = require("C:/snapshot/project/obj/generators/PlayerScavGenerator");
const APBSBotLootCacheService_1 = require("./APBSBotLootCacheService");
let APBSPlayerScavGenerator = class APBSPlayerScavGenerator extends PlayerScavGenerator_1.PlayerScavGenerator {
    logger;
    randomUtil;
    databaseService;
    hashUtil;
    itemHelper;
    botGeneratorHelper;
    saveServer;
    profileHelper;
    botHelper;
    fenceService;
    botLootCacheService;
    localisationService;
    botGenerator;
    configServer;
    cloner;
    apbsBotLootCacheService;
    constructor(logger, randomUtil, databaseService, hashUtil, itemHelper, botGeneratorHelper, saveServer, profileHelper, botHelper, fenceService, botLootCacheService, localisationService, botGenerator, configServer, cloner, apbsBotLootCacheService) {
        super(logger, randomUtil, databaseService, hashUtil, itemHelper, botGeneratorHelper, saveServer, profileHelper, botHelper, fenceService, botLootCacheService, localisationService, botGenerator, configServer, cloner);
        this.logger = logger;
        this.randomUtil = randomUtil;
        this.databaseService = databaseService;
        this.hashUtil = hashUtil;
        this.itemHelper = itemHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.saveServer = saveServer;
        this.profileHelper = profileHelper;
        this.botHelper = botHelper;
        this.fenceService = fenceService;
        this.botLootCacheService = botLootCacheService;
        this.localisationService = localisationService;
        this.botGenerator = botGenerator;
        this.configServer = configServer;
        this.cloner = cloner;
        this.apbsBotLootCacheService = apbsBotLootCacheService;
    }
    generate(sessionID) {
        // get karma level from profile
        const profile = this.saveServer.getProfile(sessionID);
        const profileCharactersClone = this.cloner.clone(profile.characters);
        const pmcDataClone = profileCharactersClone.pmc;
        const existingScavDataClone = profileCharactersClone.scav;
        const scavKarmaLevel = this.getScavKarmaLevel(pmcDataClone);
        // use karma level to get correct karmaSettings
        const playerScavKarmaSettings = this.playerScavConfig.karmaLevel[scavKarmaLevel];
        if (!playerScavKarmaSettings) {
            this.logger.error(this.localisationService.getText("scav-missing_karma_settings", scavKarmaLevel));
        }
        this.logger.debug(`generated player scav loadout with karma level ${scavKarmaLevel}`);
        // Edit baseBotNode values
        const baseBotNode = this.constructBotBaseTemplate(playerScavKarmaSettings.botTypeForLoot);
        this.adjustBotTemplateWithKarmaSpecificSettings(playerScavKarmaSettings, baseBotNode);
        let scavData = this.botGenerator.generatePlayerScav(sessionID, playerScavKarmaSettings.botTypeForLoot.toLowerCase(), "easy", baseBotNode, pmcDataClone);
        // Remove cached bot data after scav was generated
        this.botLootCacheService.clearCache();
        this.apbsBotLootCacheService.apbsClearCache();
        // Add scav metadata
        scavData.savage = undefined;
        scavData.aid = pmcDataClone.aid;
        scavData.TradersInfo = pmcDataClone.TradersInfo;
        scavData.Info.Settings = {};
        scavData.Info.Bans = [];
        scavData.Info.RegistrationDate = pmcDataClone.Info.RegistrationDate;
        scavData.Info.GameVersion = pmcDataClone.Info.GameVersion;
        scavData.Info.MemberCategory = MemberCategory_1.MemberCategory.UNIQUE_ID;
        scavData.Info.lockedMoveCommands = true;
        scavData.RagfairInfo = pmcDataClone.RagfairInfo;
        scavData.UnlockedInfo = pmcDataClone.UnlockedInfo;
        // Persist previous scav data into new scav
        scavData._id = existingScavDataClone._id ?? pmcDataClone.savage;
        scavData.sessionId = existingScavDataClone.sessionId ?? pmcDataClone.sessionId;
        scavData.Skills = this.getScavSkills(existingScavDataClone);
        scavData.Stats = this.getScavStats(existingScavDataClone);
        scavData.Info.Level = this.getScavLevel(existingScavDataClone);
        scavData.Info.Experience = this.getScavExperience(existingScavDataClone);
        scavData.Quests = existingScavDataClone.Quests ?? [];
        scavData.TaskConditionCounters = existingScavDataClone.TaskConditionCounters ?? {};
        scavData.Notes = existingScavDataClone.Notes ?? { Notes: [] };
        scavData.WishList = existingScavDataClone.WishList ?? {};
        scavData.Encyclopedia = pmcDataClone.Encyclopedia ?? {};
        // Add additional items to player scav as loot
        this.addAdditionalLootToPlayerScavContainers(playerScavKarmaSettings.lootItemsToAddChancePercent, scavData, [
            "TacticalVest",
            "Pockets",
            "Backpack"
        ]);
        // Remove secure container
        scavData = this.profileHelper.removeSecureContainer(scavData);
        // Set cooldown timer
        scavData = this.setScavCooldownTimer(scavData, pmcDataClone);
        // Add scav to the profile
        this.saveServer.getProfile(sessionID).characters.scav = scavData;
        return scavData;
    }
};
exports.APBSPlayerScavGenerator = APBSPlayerScavGenerator;
exports.APBSPlayerScavGenerator = APBSPlayerScavGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("RandomUtil")),
    __param(2, (0, tsyringe_1.inject)("DatabaseService")),
    __param(3, (0, tsyringe_1.inject)("HashUtil")),
    __param(4, (0, tsyringe_1.inject)("ItemHelper")),
    __param(5, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(6, (0, tsyringe_1.inject)("SaveServer")),
    __param(7, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(8, (0, tsyringe_1.inject)("BotHelper")),
    __param(9, (0, tsyringe_1.inject)("FenceService")),
    __param(10, (0, tsyringe_1.inject)("BotLootCacheService")),
    __param(11, (0, tsyringe_1.inject)("LocalisationService")),
    __param(12, (0, tsyringe_1.inject)("BotGenerator")),
    __param(13, (0, tsyringe_1.inject)("ConfigServer")),
    __param(14, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(15, (0, tsyringe_1.inject)("APBSBotLootCacheService")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _b : Object, typeof (_c = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _c : Object, typeof (_d = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _d : Object, typeof (_e = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _e : Object, typeof (_f = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _f : Object, typeof (_g = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _g : Object, typeof (_h = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _h : Object, typeof (_j = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _j : Object, typeof (_k = typeof FenceService_1.FenceService !== "undefined" && FenceService_1.FenceService) === "function" ? _k : Object, typeof (_l = typeof BotLootCacheService_1.BotLootCacheService !== "undefined" && BotLootCacheService_1.BotLootCacheService) === "function" ? _l : Object, typeof (_m = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _m : Object, typeof (_o = typeof BotGenerator_1.BotGenerator !== "undefined" && BotGenerator_1.BotGenerator) === "function" ? _o : Object, typeof (_p = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _p : Object, typeof (_q = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _q : Object, typeof (_r = typeof APBSBotLootCacheService_1.APBSBotLootCacheService !== "undefined" && APBSBotLootCacheService_1.APBSBotLootCacheService) === "function" ? _r : Object])
], APBSPlayerScavGenerator);
//# sourceMappingURL=APBSPlayerScavGenerator.js.map