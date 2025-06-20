"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSEquipmentGetter = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const RaidInformation_1 = require("../Globals/RaidInformation");
const Logging_1 = require("../Enums/Logging");
const APBSLogger_1 = require("./APBSLogger");
const TierInformation_1 = require("../Globals/TierInformation");
const ModConfig_1 = require("../Globals/ModConfig");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const Season_1 = require("C:/snapshot/project/obj/models/enums/Season");
const SeasonalEventService_1 = require("C:/snapshot/project/obj/services/SeasonalEventService");
let APBSEquipmentGetter = class APBSEquipmentGetter {
    raidInformation;
    tierInformation;
    weightedRandomHelper;
    apbsLogger;
    randomUtil;
    seasonalEventService;
    constructor(raidInformation, tierInformation, weightedRandomHelper, apbsLogger, randomUtil, seasonalEventService) {
        this.raidInformation = raidInformation;
        this.tierInformation = tierInformation;
        this.weightedRandomHelper = weightedRandomHelper;
        this.apbsLogger = apbsLogger;
        this.randomUtil = randomUtil;
        this.seasonalEventService = seasonalEventService;
    }
    chadOrChill(tierInfo) {
        if (ModConfig_1.ModConfig.config.generalConfig.onlyChads && ModConfig_1.ModConfig.config.generalConfig.tarkovAndChill) {
            return this.randomUtil.getInt(1, 7);
        }
        if (ModConfig_1.ModConfig.config.generalConfig.onlyChads)
            return 7;
        if (ModConfig_1.ModConfig.config.generalConfig.tarkovAndChill)
            return 1;
        if (ModConfig_1.ModConfig.config.generalConfig.blickyMode)
            return 0;
        return tierInfo;
    }
    getTierJson(tierInfo, ignoreCheck) {
        if (!ignoreCheck)
            tierInfo = this.chadOrChill(tierInfo);
        switch (tierInfo) {
            case 0:
                return this.tierInformation.tier0;
            case 1:
                return this.tierInformation.tier1;
            case 2:
                return this.tierInformation.tier2;
            case 3:
                return this.tierInformation.tier3;
            case 4:
                return this.tierInformation.tier4;
            case 5:
                return this.tierInformation.tier5;
            case 6:
                return this.tierInformation.tier6;
            case 7:
                return this.tierInformation.tier7;
            default:
                this.apbsLogger.log(Logging_1.Logging.WARN, "Bot Level and Tier Information missing, your load order is probably incorrect. Defaulting to Tier1 loadout.");
                return this.tierInformation.tier1;
        }
    }
    getTierModsJson(tierInfo, ignoreCheck) {
        if (!ignoreCheck)
            tierInfo = this.chadOrChill(tierInfo);
        switch (tierInfo) {
            case 0:
                return this.tierInformation.tier0mods;
            case 1:
                return this.tierInformation.tier1mods;
            case 2:
                return this.tierInformation.tier2mods;
            case 3:
                return this.tierInformation.tier3mods;
            case 4:
                return this.tierInformation.tier4mods;
            case 5:
                return this.tierInformation.tier5mods;
            case 6:
                return this.tierInformation.tier6mods;
            case 7:
                return this.tierInformation.tier7mods;
            default:
                this.apbsLogger.log(Logging_1.Logging.WARN, "Bot Level and Tier Information missing, your load order is probably incorrect. Defaulting to Tier1 mods.");
                return this.tierInformation.tier1mods;
        }
    }
    getTierChancesJson(tierInfo) {
        tierInfo = this.chadOrChill(tierInfo);
        switch (tierInfo) {
            case 0:
                return this.tierInformation.tier0chances;
            case 1:
                return this.tierInformation.tier1chances;
            case 2:
                return this.tierInformation.tier2chances;
            case 3:
                return this.tierInformation.tier3chances;
            case 4:
                return this.tierInformation.tier4chances;
            case 5:
                return this.tierInformation.tier5chances;
            case 6:
                return this.tierInformation.tier6chances;
            case 7:
                return this.tierInformation.tier7chances;
            default:
                this.apbsLogger.log(Logging_1.Logging.WARN, "Bot Level and Tier Information missing, your load order is probably incorrect. Defaulting to Tier1 chances.");
                return this.tierInformation.tier1chances;
        }
    }
    getTierAmmoJson(tierInfo, ignoreCheck) {
        if (!ignoreCheck)
            tierInfo = this.chadOrChill(tierInfo);
        switch (tierInfo) {
            case 0:
                return this.tierInformation.tier0ammo;
            case 1:
                return this.tierInformation.tier1ammo;
            case 2:
                return this.tierInformation.tier2ammo;
            case 3:
                return this.tierInformation.tier3ammo;
            case 4:
                return this.tierInformation.tier4ammo;
            case 5:
                return this.tierInformation.tier5ammo;
            case 6:
                return this.tierInformation.tier6ammo;
            case 7:
                return this.tierInformation.tier7ammo;
            default:
                this.apbsLogger.log(Logging_1.Logging.WARN, "Bot Level and Tier Information missing, your load order is probably incorrect. Defaulting to Tier1 ammo.");
                return this.tierInformation.tier1ammo;
        }
    }
    getAppearanceJson(tierInfo, ignoreCheck) {
        if (!ignoreCheck)
            tierInfo = this.chadOrChill(tierInfo);
        switch (tierInfo) {
            case 0:
                return this.tierInformation.tier0appearance;
            case 1:
                return this.tierInformation.tier1appearance;
            case 2:
                return this.tierInformation.tier2appearance;
            case 3:
                return this.tierInformation.tier3appearance;
            case 4:
                return this.tierInformation.tier4appearance;
            case 5:
                return this.tierInformation.tier5appearance;
            case 6:
                return this.tierInformation.tier6appearance;
            case 7:
                return this.tierInformation.tier7appearance;
            default:
                this.apbsLogger.log(Logging_1.Logging.WARN, "Bot Level and Tier Information missing, your load order is probably incorrect. Defaulting to Tier1 appearance.");
                return this.tierInformation.tier1appearance;
        }
    }
    getModsByBotRole(botRole, tierInfo) {
        const tierJson = this.getTierModsJson(tierInfo);
        switch (botRole) {
            case "bossboar":
            case "bossboarsniper":
            case "bossbully":
            case "bossgluhar":
            case "bosskilla":
            case "bosskojaniy":
            case "bosskolontay":
            case "bosssanitar":
            case "bosstagilla":
            case "bosspartisan":
            case "bossknight":
            case "followerbigpipe":
            case "followerbirdeye":
            case "sectantpriest":
            case "sectantwarrior":
            case "exusec":
            case "arenafighterevent":
            case "arenafighter":
            case "pmcbot":
                if (tierInfo < 4)
                    return this.tierInformation.tier4mods;
                else
                    return tierJson;
            case "marksman":
            case "cursedassault":
            case "assault":
                if (ModConfig_1.ModConfig.config.generalConfig.blickyMode || ModConfig_1.ModConfig.config.generalConfig.onlyChads || ModConfig_1.ModConfig.config.scavBots.additionalOptions.enableScavAttachmentTiering)
                    return tierJson;
                else
                    return this.tierInformation.tier1mods;
            default:
                return tierJson;
        }
    }
    getEquipmentByBotRole(botRole, tierInfo) {
        const tierJson = this.getTierJson(tierInfo);
        switch (botRole) {
            case "pmcusec":
                return tierJson.pmcUSEC.equipment;
            case "pmcbear":
                return tierJson.pmcBEAR.equipment;
            case "marksman":
                return tierJson.scav.equipment;
            case "cursedassault":
            case "assault":
                return tierJson.scav.equipment;
            case "bossboar":
                return tierJson.bossboar.equipment;
            case "bossboarsniper":
                return tierJson.bossboarsniper.equipment;
            case "bossbully":
                return tierJson.bossbully.equipment;
            case "bossgluhar":
                return tierJson.bossgluhar.equipment;
            case "bosskilla":
                return tierJson.bosskilla.equipment;
            case "bosskojaniy":
                return tierJson.bosskojaniy.equipment;
            case "bosskolontay":
                return tierJson.bosskolontay.equipment;
            case "bosssanitar":
                return tierJson.bosssanitar.equipment;
            case "bosstagilla":
                return tierJson.bosstagilla.equipment;
            case "bosspartisan":
                return tierJson.bosspartisan.equipment;
            case "bossknight":
                return tierJson.bossknight.equipment;
            case "followerbigpipe":
                return tierJson.followerbigpipe.equipment;
            case "followerbirdeye":
                return tierJson.followerbirdeye.equipment;
            case "sectantpriest":
                return tierJson.sectantpriest.equipment;
            case "sectantwarrior":
                return tierJson.sectantwarrior.equipment;
            case "exusec":
            case "arenafighterevent":
            case "arenafighter":
                return tierJson.exUSEC.equipment;
            case "pmcbot":
                return tierJson.pmcbot.equipment;
            default:
                return tierJson.default.equipment;
        }
    }
    getEquipmentByBotRoleAndSlot(botRole, tierInfo, slot, range) {
        const tierJson = this.getTierJson(tierInfo);
        switch (botRole) {
            case "pmcusec":
                return (range == undefined) ? tierJson.pmcUSEC.equipment[slot] : tierJson.pmcUSEC.equipment[slot][range];
            case "pmcbear":
                return (range == undefined) ? tierJson.pmcBEAR.equipment[slot] : tierJson.pmcBEAR.equipment[slot][range];
            case "marksman":
                return (range == undefined) ? tierJson.scav.equipment[slot] : tierJson.scav.equipment[slot].LongRange;
            case "cursedassault":
            case "assault":
                return (range == undefined) ? tierJson.scav.equipment[slot] : tierJson.scav.equipment[slot].ShortRange;
            case "bossboar":
                return (range == undefined) ? tierJson.bossboar.equipment[slot] : tierJson.bossboar.equipment[slot][range];
            case "bossboarsniper":
                return (range == undefined) ? tierJson.bossboarsniper.equipment[slot] : tierJson.bossboarsniper.equipment[slot][range];
            case "bossbully":
                return (range == undefined) ? tierJson.bossbully.equipment[slot] : tierJson.bossbully.equipment[slot][range];
            case "bossgluhar":
                return (range == undefined) ? tierJson.bossgluhar.equipment[slot] : tierJson.bossgluhar.equipment[slot][range];
            case "bosskilla":
                return (range == undefined) ? tierJson.bosskilla.equipment[slot] : tierJson.bosskilla.equipment[slot][range];
            case "bosskojaniy":
                return (range == undefined) ? tierJson.bosskojaniy.equipment[slot] : tierJson.bosskojaniy.equipment[slot][range];
            case "bosskolontay":
                return (range == undefined) ? tierJson.bosskolontay.equipment[slot] : tierJson.bosskolontay.equipment[slot][range];
            case "bosssanitar":
                return (range == undefined) ? tierJson.bosssanitar.equipment[slot] : tierJson.bosssanitar.equipment[slot][range];
            case "bosstagilla":
                return (range == undefined) ? tierJson.bosstagilla.equipment[slot] : tierJson.bosstagilla.equipment[slot][range];
            case "bosspartisan":
                return (range == undefined) ? tierJson.bosspartisan.equipment[slot] : tierJson.bosspartisan.equipment[slot][range];
            case "bossknight":
                return (range == undefined) ? tierJson.bossknight.equipment[slot] : tierJson.bossknight.equipment[slot][range];
            case "followerbigpipe":
                return (range == undefined) ? tierJson.followerbigpipe.equipment[slot] : tierJson.followerbigpipe.equipment[slot][range];
            case "followerbirdeye":
                return (range == undefined) ? tierJson.followerbirdeye.equipment[slot] : tierJson.followerbirdeye.equipment[slot][range];
            case "sectantpriest":
                return (range == undefined) ? tierJson.sectantpriest.equipment[slot] : tierJson.sectantpriest.equipment[slot][range];
            case "sectantwarrior":
                return (range == undefined) ? tierJson.sectantwarrior.equipment[slot] : tierJson.sectantwarrior.equipment[slot][range];
            case "exusec":
            case "arenafighterevent":
            case "arenafighter":
                return (range == undefined) ? tierJson.exUSEC.equipment[slot] : tierJson.exUSEC.equipment[slot][range];
            case "pmcbot":
                return (range == undefined) ? tierJson.pmcbot.equipment[slot] : tierJson.pmcbot.equipment[slot][range];
            default:
                return (range == undefined) ? tierJson.default.equipment[slot] : tierJson.default.equipment[slot][range];
        }
    }
    getSpawnChancesByBotRole(botRole, tierInfo) {
        const tierJson = this.getTierChancesJson(tierInfo);
        switch (botRole) {
            case "pmcbear":
                return tierJson.pmcBEAR.chances;
            case "pmcusec":
                return tierJson.pmcUSEC.chances;
            case "marksman":
            case "cursedassault":
            case "assault":
                return tierJson.scav.chances;
            case "bossboar":
                return tierJson.bossboar.chances;
            case "bossboarsniper":
                return tierJson.bossboarsniper.chances;
            case "bossbully":
                return tierJson.bossbully.chances;
            case "bossgluhar":
                return tierJson.bossgluhar.chances;
            case "bosskilla":
                return tierJson.bosskilla.chances;
            case "bossknight":
                return tierJson.bossknight.chances;
            case "bosskojaniy":
                return tierJson.bosskojaniy.chances;
            case "bosskolontay":
                return tierJson.bosskolontay.chances;
            case "bosssanitar":
                return tierJson.bosssanitar.chances;
            case "bosstagilla":
                return tierJson.bosstagilla.chances;
            case "bosspartisan":
                return tierJson.bosspartisan.chances;
            case "bosszryachiy":
                return tierJson.bosszryachiy.chances;
            case "followerbigpipe":
                return tierJson.followerbigpipe.chances;
            case "followerbirdeye":
                return tierJson.followerbirdeye.chances;
            case "sectantpriest":
                return tierJson.sectantpriest.chances;
            case "sectantwarrior":
                return tierJson.sectantwarrior.chances;
            case "exusec":
            case "arenafighterevent":
            case "arenafighter":
                return tierJson.exusec.chances;
            case "pmcbot":
                return tierJson.pmcbot.chances;
            default:
                return tierJson.default.chances;
        }
    }
    getAmmoByBotRole(botRole, tierInfo) {
        if ((botRole == "pmcusec" || botRole == "pmcbear") && ModConfig_1.ModConfig.config.pmcBots.additionalOptions.ammoTierSliding.enable) {
            if (this.randomUtil.getChance100(ModConfig_1.ModConfig.config.pmcBots.additionalOptions.ammoTierSliding.slideChance)) {
                const slideAmount = ModConfig_1.ModConfig.config.pmcBots.additionalOptions.ammoTierSliding.slideAmount;
                const minTier = (tierInfo - slideAmount) <= 0 ? 1 : tierInfo - slideAmount;
                const maxTier = tierInfo - 1;
                tierInfo = this.newTierCalc(tierInfo, minTier, maxTier);
            }
        }
        const tierJson = this.getTierAmmoJson(tierInfo);
        switch (botRole) {
            case "marksman":
            case "cursedassault":
            case "assault":
                return tierJson.scavAmmo;
            case "pmcusec":
            case "pmcbear":
                return tierJson.pmcAmmo;
            default:
                return tierJson.bossAmmo;
        }
    }
    getPmcAppearance(botRole, tierInfo, getSeason) {
        const tierJson = this.getAppearanceJson(tierInfo);
        switch (botRole) {
            case "pmcUSEC":
                if (getSeason && tierInfo != 0) {
                    const activeSeason = this.seasonalEventService.getActiveWeatherSeason();
                    switch (activeSeason) {
                        case Season_1.Season.SPRING_EARLY:
                            return tierJson.springEarly.pmcUSEC.appearance;
                        case Season_1.Season.SPRING:
                            return tierJson.spring.pmcUSEC.appearance;
                        case Season_1.Season.SUMMER:
                        case Season_1.Season.STORM:
                            return tierJson.summer.pmcUSEC.appearance;
                        case Season_1.Season.AUTUMN:
                        case Season_1.Season.AUTUMN_LATE:
                            return tierJson.autumn.pmcUSEC.appearance;
                        case Season_1.Season.WINTER:
                            return tierJson.winter.pmcUSEC.appearance;
                        default:
                            return tierJson.summer.pmcUSEC.appearance;
                    }
                }
                return tierJson.pmcUSEC.appearance;
            case "pmcBEAR":
                if (getSeason && tierInfo != 0) {
                    const activeSeason = this.seasonalEventService.getActiveWeatherSeason();
                    switch (activeSeason) {
                        case Season_1.Season.SPRING_EARLY:
                            return tierJson.springEarly.pmcBEAR.appearance;
                        case Season_1.Season.SPRING:
                            return tierJson.spring.pmcBEAR.appearance;
                        case Season_1.Season.SUMMER:
                        case Season_1.Season.STORM:
                            return tierJson.summer.pmcBEAR.appearance;
                        case Season_1.Season.AUTUMN:
                        case Season_1.Season.AUTUMN_LATE:
                            return tierJson.autumn.pmcBEAR.appearance;
                        case Season_1.Season.WINTER:
                            return tierJson.winter.pmcBEAR.appearance;
                        default:
                            return tierJson.summer.pmcBEAR.appearance;
                    }
                }
                return tierJson.pmcBEAR.appearance;
        }
    }
    newTierCalc(tierInfo, minTier, maxTier) {
        const newTier = (Math.floor(Math.random() * (maxTier - minTier + 1) + minTier)) >= tierInfo ? (tierInfo - 1) : (Math.floor(Math.random() * (maxTier - minTier + 1) + minTier));
        return newTier;
    }
};
exports.APBSEquipmentGetter = APBSEquipmentGetter;
exports.APBSEquipmentGetter = APBSEquipmentGetter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("RaidInformation")),
    __param(1, (0, tsyringe_1.inject)("TierInformation")),
    __param(2, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(3, (0, tsyringe_1.inject)("APBSLogger")),
    __param(4, (0, tsyringe_1.inject)("RandomUtil")),
    __param(5, (0, tsyringe_1.inject)("SeasonalEventService")),
    __metadata("design:paramtypes", [typeof (_a = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _a : Object, typeof (_b = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _b : Object, typeof (_c = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _c : Object, typeof (_d = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _d : Object, typeof (_e = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _e : Object, typeof (_f = typeof SeasonalEventService_1.SeasonalEventService !== "undefined" && SeasonalEventService_1.SeasonalEventService) === "function" ? _f : Object])
], APBSEquipmentGetter);
//# sourceMappingURL=APBSEquipmentGetter.js.map