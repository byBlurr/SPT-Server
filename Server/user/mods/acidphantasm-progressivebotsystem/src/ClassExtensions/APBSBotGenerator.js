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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const BotEquipmentFilterService_1 = require("C:/snapshot/project/obj/services/BotEquipmentFilterService");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const ItemFilterService_1 = require("C:/snapshot/project/obj/services/ItemFilterService");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const BotGenerator_1 = require("C:/snapshot/project/obj/generators/BotGenerator");
const BotInventoryGenerator_1 = require("C:/snapshot/project/obj/generators/BotInventoryGenerator");
const BotLevelGenerator_1 = require("C:/snapshot/project/obj/generators/BotLevelGenerator");
const SeasonalEventService_1 = require("C:/snapshot/project/obj/services/SeasonalEventService");
const TimeUtil_1 = require("C:/snapshot/project/obj/utils/TimeUtil");
const BotNameService_1 = require("C:/snapshot/project/obj/services/BotNameService");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const ModConfig_1 = require("../Globals/ModConfig");
const GameEditions_1 = require("C:/snapshot/project/obj/models/enums/GameEditions");
const MemberCategory_1 = require("C:/snapshot/project/obj/models/enums/MemberCategory");
const ItemTpl_1 = require("C:/snapshot/project/obj/models/enums/ItemTpl");
/** Handle profile related client events */
let APBSBotGenerator = class APBSBotGenerator extends BotGenerator_1.BotGenerator {
    logger;
    hashUtil;
    randomUtil;
    timeUtil;
    profileHelper;
    databaseService;
    botInventoryGenerator;
    botLevelGenerator;
    botEquipmentFilterService;
    weightedRandomHelper;
    botHelper;
    botGeneratorHelper;
    seasonalEventService;
    itemFilterService;
    botNameService;
    configServer;
    cloner;
    apbsEquipmentGetter;
    apbsTierGetter;
    constructor(logger, hashUtil, randomUtil, timeUtil, profileHelper, databaseService, botInventoryGenerator, botLevelGenerator, botEquipmentFilterService, weightedRandomHelper, botHelper, botGeneratorHelper, seasonalEventService, itemFilterService, botNameService, configServer, cloner, apbsEquipmentGetter, apbsTierGetter) {
        super(logger, hashUtil, randomUtil, timeUtil, profileHelper, databaseService, botInventoryGenerator, botLevelGenerator, botEquipmentFilterService, weightedRandomHelper, botHelper, botGeneratorHelper, seasonalEventService, itemFilterService, botNameService, configServer, cloner);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.timeUtil = timeUtil;
        this.profileHelper = profileHelper;
        this.databaseService = databaseService;
        this.botInventoryGenerator = botInventoryGenerator;
        this.botLevelGenerator = botLevelGenerator;
        this.botEquipmentFilterService = botEquipmentFilterService;
        this.weightedRandomHelper = weightedRandomHelper;
        this.botHelper = botHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.seasonalEventService = seasonalEventService;
        this.itemFilterService = itemFilterService;
        this.botNameService = botNameService;
        this.configServer = configServer;
        this.cloner = cloner;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
    }
    setBotAppearance(bot, appearance, botGenerationDetails) {
        if (botGenerationDetails.isPmc) {
            const tier = this.apbsTierGetter.getTierByLevel(bot.Info.Level);
            const role = bot.Info.Settings.Role;
            const getSeasonalAppearance = ModConfig_1.ModConfig.config.pmcBots.additionalOptions.seasonalPmcAppearance ? true : false;
            const appearanceJson = this.apbsEquipmentGetter.getPmcAppearance(role, tier, getSeasonalAppearance);
            bot.Customization.Head = this.weightedRandomHelper.getWeightedValue(appearanceJson.head);
            bot.Customization.Hands = this.weightedRandomHelper.getWeightedValue(appearanceJson.hands);
            bot.Customization.Body = this.weightedRandomHelper.getWeightedValue(appearanceJson.body);
            bot.Customization.Feet = this.weightedRandomHelper.getWeightedValue(appearanceJson.feet);
            const bodyGlobalDict = this.databaseService.getGlobals().config.Customization.SavageBody;
            const chosenBodyTemplate = this.databaseService.getCustomization()[bot.Customization.Body];
            // Find the body/hands mapping
            const matchingBody = bodyGlobalDict[chosenBodyTemplate?._name];
            if (matchingBody?.isNotRandom) {
                // Has fixed hands for this body, set them
                bot.Customization.Hands = matchingBody.hands;
            }
            return;
        }
        bot.Customization.Head = this.weightedRandomHelper.getWeightedValue(appearance.head);
        bot.Customization.Body = this.weightedRandomHelper.getWeightedValue(appearance.body);
        bot.Customization.Feet = this.weightedRandomHelper.getWeightedValue(appearance.feet);
        bot.Customization.Hands = this.weightedRandomHelper.getWeightedValue(appearance.hands);
        const bodyGlobalDict = this.databaseService.getGlobals().config.Customization.SavageBody;
        const chosenBodyTemplate = this.databaseService.getCustomization()[bot.Customization.Body];
        // Find the body/hands mapping
        const matchingBody = bodyGlobalDict[chosenBodyTemplate?._name];
        if (matchingBody?.isNotRandom) {
            // Has fixed hands for this body, set them
            bot.Customization.Hands = matchingBody.hands;
        }
    }
    setRandomisedGameVersionAndCategory(botInfo) {
        // Special case
        if (botInfo.Nickname?.toLowerCase() === "nikita") {
            botInfo.GameVersion = GameEditions_1.GameEditions.UNHEARD;
            botInfo.MemberCategory = MemberCategory_1.MemberCategory.DEVELOPER;
            botInfo.SelectedMemberCategory = botInfo.MemberCategory;
            return botInfo.GameVersion;
        }
        if (ModConfig_1.ModConfig.config.pmcBots.secrets.developerSettings.devNames.enable) {
            if (ModConfig_1.ModConfig.config.pmcBots.secrets.developerSettings.devNames.nameList.includes(botInfo.Nickname)) {
                botInfo.GameVersion = GameEditions_1.GameEditions.UNHEARD;
                botInfo.MemberCategory = MemberCategory_1.MemberCategory.DEVELOPER;
                if (ModConfig_1.ModConfig.config.pmcBots.secrets.developerSettings.devLevels.enable) {
                    const min = ModConfig_1.ModConfig.config.pmcBots.secrets.developerSettings.devLevels.min;
                    const max = ModConfig_1.ModConfig.config.pmcBots.secrets.developerSettings.devLevels.max;
                    const level = this.randomUtil.getInt(min, max);
                    const exp = this.profileHelper.getExperience(level);
                    botInfo.Experience = exp;
                    botInfo.Level = level;
                    botInfo.Tier = this.apbsTierGetter.getTierByLevel(level).toString();
                }
                botInfo.SelectedMemberCategory = botInfo.MemberCategory;
                return botInfo.GameVersion;
            }
        }
        // Choose random weighted game version for bot
        botInfo.GameVersion = this.weightedRandomHelper.getWeightedValue(this.pmcConfig.gameVersionWeight);
        // Choose appropriate member category value
        switch (botInfo.GameVersion) {
            case GameEditions_1.GameEditions.EDGE_OF_DARKNESS:
                botInfo.MemberCategory = MemberCategory_1.MemberCategory.UNIQUE_ID;
                break;
            case GameEditions_1.GameEditions.UNHEARD:
                botInfo.MemberCategory = MemberCategory_1.MemberCategory.UNHEARD;
                break;
            default:
                // Everyone else gets a weighted randomised category
                botInfo.MemberCategory = Number.parseInt(this.weightedRandomHelper.getWeightedValue(this.pmcConfig.accountTypeWeight), 10);
        }
        // Ensure selected category matches
        botInfo.SelectedMemberCategory = botInfo.MemberCategory;
        return botInfo.GameVersion;
    }
    addDogtagToBot(bot) {
        const inventoryItem = {
            _id: this.hashUtil.generate(),
            _tpl: this.apbsGetDogtagTplByGameVersionAndSide(bot.Info.Side, bot.Info.GameVersion, bot.Info.PrestigeLevel),
            parentId: bot.Inventory.equipment,
            slotId: "Dogtag",
            upd: {
                SpawnedInSession: true
            }
        };
        bot.Inventory.items.push(inventoryItem);
    }
    apbsGetDogtagTplByGameVersionAndSide(side, gameVersion, prestigeLevel) {
        if (side.toLowerCase() === "usec") {
            switch (prestigeLevel) {
                case 0:
                    switch (gameVersion) {
                        case GameEditions_1.GameEditions.EDGE_OF_DARKNESS:
                            return ItemTpl_1.ItemTpl.BARTER_DOGTAG_USEC_EOD;
                        case GameEditions_1.GameEditions.UNHEARD:
                            return ItemTpl_1.ItemTpl.BARTER_DOGTAG_USEC_TUE;
                        default:
                            return ItemTpl_1.ItemTpl.BARTER_DOGTAG_USEC;
                    }
                case 1:
                    return ItemTpl_1.ItemTpl.BARTER_DOGTAG_USEC_PRESTIGE_1;
                case 2:
                    return ItemTpl_1.ItemTpl.BARTER_DOGTAG_USEC_PRESTIGE_2;
                default:
                    return ItemTpl_1.ItemTpl.BARTER_DOGTAG_USEC;
            }
        }
        switch (prestigeLevel) {
            case 0:
                switch (gameVersion) {
                    case GameEditions_1.GameEditions.EDGE_OF_DARKNESS:
                        return ItemTpl_1.ItemTpl.BARTER_DOGTAG_BEAR_EOD;
                    case GameEditions_1.GameEditions.UNHEARD:
                        return ItemTpl_1.ItemTpl.BARTER_DOGTAG_BEAR_TUE;
                    default:
                        return ItemTpl_1.ItemTpl.BARTER_DOGTAG_BEAR;
                }
            case 1:
                return ItemTpl_1.ItemTpl.BARTER_DOGTAG_BEAR_PRESTIGE_1;
            case 2:
                return ItemTpl_1.ItemTpl.BARTER_DOGTAG_BEAR_PRESTIGE_2;
            default:
                return ItemTpl_1.ItemTpl.BARTER_DOGTAG_BEAR;
        }
    }
};
exports.APBSBotGenerator = APBSBotGenerator;
exports.APBSBotGenerator = APBSBotGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("TimeUtil")),
    __param(4, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(5, (0, tsyringe_1.inject)("DatabaseService")),
    __param(6, (0, tsyringe_1.inject)("BotInventoryGenerator")),
    __param(7, (0, tsyringe_1.inject)("BotLevelGenerator")),
    __param(8, (0, tsyringe_1.inject)("BotEquipmentFilterService")),
    __param(9, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(10, (0, tsyringe_1.inject)("BotHelper")),
    __param(11, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(12, (0, tsyringe_1.inject)("SeasonalEventService")),
    __param(13, (0, tsyringe_1.inject)("ItemFilterService")),
    __param(14, (0, tsyringe_1.inject)("BotNameService")),
    __param(15, (0, tsyringe_1.inject)("ConfigServer")),
    __param(16, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(17, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(18, (0, tsyringe_1.inject)("APBSTierGetter")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _d : Object, typeof (_e = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _e : Object, typeof (_f = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _f : Object, typeof (_g = typeof BotInventoryGenerator_1.BotInventoryGenerator !== "undefined" && BotInventoryGenerator_1.BotInventoryGenerator) === "function" ? _g : Object, typeof (_h = typeof BotLevelGenerator_1.BotLevelGenerator !== "undefined" && BotLevelGenerator_1.BotLevelGenerator) === "function" ? _h : Object, typeof (_j = typeof BotEquipmentFilterService_1.BotEquipmentFilterService !== "undefined" && BotEquipmentFilterService_1.BotEquipmentFilterService) === "function" ? _j : Object, typeof (_k = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _k : Object, typeof (_l = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _l : Object, typeof (_m = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _m : Object, typeof (_o = typeof SeasonalEventService_1.SeasonalEventService !== "undefined" && SeasonalEventService_1.SeasonalEventService) === "function" ? _o : Object, typeof (_p = typeof ItemFilterService_1.ItemFilterService !== "undefined" && ItemFilterService_1.ItemFilterService) === "function" ? _p : Object, typeof (_q = typeof BotNameService_1.BotNameService !== "undefined" && BotNameService_1.BotNameService) === "function" ? _q : Object, typeof (_r = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _r : Object, typeof (_s = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _s : Object, typeof (_t = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _t : Object, typeof (_u = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _u : Object])
], APBSBotGenerator);
//# sourceMappingURL=APBSBotGenerator.js.map