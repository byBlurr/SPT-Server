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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotLootGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotWeaponGenerator_1 = require("C:/snapshot/project/obj/generators/BotWeaponGenerator");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const HandbookHelper_1 = require("C:/snapshot/project/obj/helpers/HandbookHelper");
const InventoryHelper_1 = require("C:/snapshot/project/obj/helpers/InventoryHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const IBotLootCache_1 = require("C:/snapshot/project/obj/models/spt/bots/IBotLootCache");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const BotLootCacheService_1 = require("C:/snapshot/project/obj/services/BotLootCacheService");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const BotLootGenerator_1 = require("C:/snapshot/project/obj/generators/BotLootGenerator");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const APBSBotLootCacheService_1 = require("./APBSBotLootCacheService");
const RaidInformation_1 = require("../Globals/RaidInformation");
const APBSLogger_1 = require("../Utils/APBSLogger");
/** Handle profile related client events */
let APBSBotLootGenerator = class APBSBotLootGenerator extends BotLootGenerator_1.BotLootGenerator {
    logger;
    hashUtil;
    randomUtil;
    itemHelper;
    inventoryHelper;
    databaseService;
    handbookHelper;
    botGeneratorHelper;
    botWeaponGenerator;
    weightedRandomHelper;
    botHelper;
    botLootCacheService;
    localisationService;
    configServer;
    cloner;
    apbsEquipmentGetter;
    apbsTierGetter;
    raidInformation;
    apbsBotLootCacheService;
    apbsLogger;
    constructor(logger, hashUtil, randomUtil, itemHelper, inventoryHelper, databaseService, handbookHelper, botGeneratorHelper, botWeaponGenerator, weightedRandomHelper, botHelper, botLootCacheService, localisationService, configServer, cloner, apbsEquipmentGetter, apbsTierGetter, raidInformation, apbsBotLootCacheService, apbsLogger) {
        super(logger, hashUtil, randomUtil, itemHelper, inventoryHelper, databaseService, handbookHelper, botGeneratorHelper, botWeaponGenerator, weightedRandomHelper, botHelper, botLootCacheService, localisationService, configServer, cloner);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.itemHelper = itemHelper;
        this.inventoryHelper = inventoryHelper;
        this.databaseService = databaseService;
        this.handbookHelper = handbookHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.botWeaponGenerator = botWeaponGenerator;
        this.weightedRandomHelper = weightedRandomHelper;
        this.botHelper = botHelper;
        this.botLootCacheService = botLootCacheService;
        this.localisationService = localisationService;
        this.configServer = configServer;
        this.cloner = cloner;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
        this.raidInformation = raidInformation;
        this.apbsBotLootCacheService = apbsBotLootCacheService;
        this.apbsLogger = apbsLogger;
    }
    apbsGenerateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel, tier) {
        // Limits on item types to be added as loot
        const chances = this.apbsEquipmentGetter.getSpawnChancesByBotRole(botRole, tier);
        const itemCounts = chances.generation.items;
        if (!itemCounts.backpackLoot.weights
            || !itemCounts.pocketLoot.weights
            || !itemCounts.vestLoot.weights
            || !itemCounts.specialItems.weights
            || !itemCounts.healing.weights
            || !itemCounts.drugs.weights
            || !itemCounts.food.weights
            || !itemCounts.drink.weights
            || !itemCounts.currency.weights
            || !itemCounts.stims.weights
            || !itemCounts.grenades.weights) {
            this.logger.warning(this.localisationService.getText("bot-unable_to_generate_bot_loot", botRole));
            return;
        }
        let backpackLootCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.backpackLoot.weights));
        let pocketLootCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.pocketLoot.weights));
        let vestLootCount = this.weightedRandomHelper.getWeightedValue(itemCounts.vestLoot.weights);
        const specialLootItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.specialItems.weights));
        const healingItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.healing.weights));
        const drugItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.drugs.weights));
        const foodItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.food.weights));
        const drinkItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.drink.weights));
        let currencyItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.currency.weights));
        const stimItemCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.stims.weights));
        const grenadeCount = Number(this.weightedRandomHelper.getWeightedValue(itemCounts.grenades.weights));
        // If bot has been flagged as not having loot, set below counts to 0
        if (this.botConfig.disableLootOnBotTypes?.includes(botRole.toLowerCase())) {
            backpackLootCount = 0;
            pocketLootCount = 0;
            vestLootCount = 0;
            currencyItemCount = 0;
        }
        // Forced pmc healing loot into secure container
        if (isPmc && this.pmcConfig.forceHealingItemsIntoSecure) {
            this.addForcedMedicalItemsToPmcSecure(botInventory, botRole);
        }
        const botItemLimits = this.getItemSpawnLimitsForBot(botRole);
        const containersBotHasAvailable = this.getAvailableContainersBotCanStoreItemsIn(botInventory);
        // This set is passed as a reference to fill up the containers that are already full, this aliviates
        // generation of the bots by avoiding checking the slots of containers we already know are full
        const containersIdFull = new Set();
        // Special items
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.SPECIAL, botJsonTemplate, botLevel, tier), containersBotHasAvailable, specialLootItemCount, botInventory, botRole, botItemLimits, undefined, undefined, containersIdFull);
        // Healing items / Meds
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.HEALING_ITEMS, botJsonTemplate, botLevel, tier), containersBotHasAvailable, healingItemCount, botInventory, botRole, botItemLimits, 0, isPmc, containersIdFull);
        // Drugs
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.DRUG_ITEMS, botJsonTemplate, botLevel, tier), containersBotHasAvailable, drugItemCount, botInventory, botRole, botItemLimits, 0, isPmc, containersIdFull);
        // Food
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.FOOD_ITEMS, botJsonTemplate, botLevel, tier), containersBotHasAvailable, foodItemCount, botInventory, botRole, botItemLimits, 0, isPmc, containersIdFull);
        // Drink
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.DRINK_ITEMS, botJsonTemplate, botLevel, tier), containersBotHasAvailable, drinkItemCount, botInventory, botRole, botItemLimits, 0, isPmc, containersIdFull);
        // Currency
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.CURRENCY_ITEMS, botJsonTemplate, botLevel, tier), containersBotHasAvailable, currencyItemCount, botInventory, botRole, botItemLimits, 0, isPmc, containersIdFull);
        // Stims
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.STIM_ITEMS, botJsonTemplate, botLevel, tier), containersBotHasAvailable, stimItemCount, botInventory, botRole, botItemLimits, 0, isPmc, containersIdFull);
        // Grenades
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.GRENADE_ITEMS, botJsonTemplate, botLevel, tier), [EquipmentSlots_1.EquipmentSlots.POCKETS, EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST], // Can't use containersBotHasEquipped as we dont want grenades added to backpack
        grenadeCount, botInventory, botRole, botItemLimits, 0, isPmc, containersIdFull);
        // Backpack - generate loot if they have one
        if (containersBotHasAvailable.includes(EquipmentSlots_1.EquipmentSlots.BACKPACK)) {
            // Add randomly generated weapon to PMC backpacks
            if (isPmc && this.randomUtil.getChance100(this.pmcConfig.looseWeaponInBackpackChancePercent)) {
                this.addLooseWeaponsToInventorySlot(sessionId, botInventory, EquipmentSlots_1.EquipmentSlots.BACKPACK, botJsonTemplate.inventory, botJsonTemplate.chances.weaponMods, botRole, isPmc, botLevel, containersIdFull);
            }
            const backpackLootRoubleTotal = this.getBackpackRoubleTotalByLevel(botLevel, isPmc);
            this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.BACKPACK, botJsonTemplate, botLevel, tier), [EquipmentSlots_1.EquipmentSlots.BACKPACK], backpackLootCount, botInventory, botRole, botItemLimits, backpackLootRoubleTotal, isPmc, containersIdFull);
        }
        // TacticalVest - generate loot if they have one
        if (containersBotHasAvailable.includes(EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST)) {
            // Vest
            this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.VEST, botJsonTemplate, botLevel, tier), [EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST], vestLootCount, botInventory, botRole, botItemLimits, this.pmcConfig.maxVestLootTotalRub, isPmc, containersIdFull);
        }
        // Pockets
        this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.POCKET, botJsonTemplate, botLevel, tier), [EquipmentSlots_1.EquipmentSlots.POCKETS], pocketLootCount, botInventory, botRole, botItemLimits, this.pmcConfig.maxPocketLootTotalRub, isPmc, containersIdFull);
        // Secure
        // only add if not a pmc or is pmc and flag is true
        if (!isPmc || (isPmc && this.pmcConfig.addSecureContainerLootFromBotConfig)) {
            this.addLootFromPool(this.apbsBotLootCacheService.apbsGetLootFromCache(botRole, isPmc, IBotLootCache_1.LootCacheType.SECURE, botJsonTemplate, botLevel, tier), [EquipmentSlots_1.EquipmentSlots.SECURED_CONTAINER], 50, botInventory, botRole, undefined, -1, isPmc, containersIdFull);
        }
    }
    itemHasReachedSpawnLimit(itemTemplate, botRole, itemSpawnLimits) {
        // PMCs and scavs have different sections of bot config for spawn limits
        if (!!itemSpawnLimits && Object.keys(itemSpawnLimits.globalLimits).length === 0) {
            // No items found in spawn limit, drop out
            return false;
        }
        // No spawn limits, skipping
        if (!itemSpawnLimits) {
            return false;
        }
        const idToCheckFor = this.getMatchingIdFromSpawnLimits(itemTemplate, itemSpawnLimits.globalLimits);
        if (!idToCheckFor) {
            // ParentId or tplid not found in spawnLimits, not a spawn limited item, skip
            return false;
        }
        // Increment item count with this bot type
        itemSpawnLimits.currentLimits[idToCheckFor]++;
        // Check if over limit
        if (itemSpawnLimits.currentLimits[idToCheckFor] > itemSpawnLimits.globalLimits[idToCheckFor]) {
            // Prevent edge-case of small loot pools + code trying to add limited item over and over infinitely
            if (itemSpawnLimits.currentLimits[idToCheckFor] > itemSpawnLimits.globalLimits[idToCheckFor] * 10) {
                this.logger.debug(this.localisationService.getText("bot-item_spawn_limit_reached_skipping_item", {
                    botRole: botRole,
                    itemName: itemTemplate._name,
                    attempts: itemSpawnLimits.currentLimits[idToCheckFor]
                }));
                return false;
            }
            return true;
        }
        return false;
    }
};
exports.APBSBotLootGenerator = APBSBotLootGenerator;
exports.APBSBotLootGenerator = APBSBotLootGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("InventoryHelper")),
    __param(5, (0, tsyringe_1.inject)("DatabaseService")),
    __param(6, (0, tsyringe_1.inject)("HandbookHelper")),
    __param(7, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(8, (0, tsyringe_1.inject)("BotWeaponGenerator")),
    __param(9, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(10, (0, tsyringe_1.inject)("BotHelper")),
    __param(11, (0, tsyringe_1.inject)("BotLootCacheService")),
    __param(12, (0, tsyringe_1.inject)("LocalisationService")),
    __param(13, (0, tsyringe_1.inject)("ConfigServer")),
    __param(14, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(15, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(16, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(17, (0, tsyringe_1.inject)("RaidInformation")),
    __param(18, (0, tsyringe_1.inject)("APBSBotLootCacheService")),
    __param(19, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof InventoryHelper_1.InventoryHelper !== "undefined" && InventoryHelper_1.InventoryHelper) === "function" ? _e : Object, typeof (_f = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _f : Object, typeof (_g = typeof HandbookHelper_1.HandbookHelper !== "undefined" && HandbookHelper_1.HandbookHelper) === "function" ? _g : Object, typeof (_h = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _h : Object, typeof (_j = typeof BotWeaponGenerator_1.BotWeaponGenerator !== "undefined" && BotWeaponGenerator_1.BotWeaponGenerator) === "function" ? _j : Object, typeof (_k = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _k : Object, typeof (_l = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _l : Object, typeof (_m = typeof BotLootCacheService_1.BotLootCacheService !== "undefined" && BotLootCacheService_1.BotLootCacheService) === "function" ? _m : Object, typeof (_o = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _o : Object, typeof (_p = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _p : Object, typeof (_q = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _q : Object, typeof (_r = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _r : Object, typeof (_s = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _s : Object, typeof (_t = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _t : Object, typeof (_u = typeof APBSBotLootCacheService_1.APBSBotLootCacheService !== "undefined" && APBSBotLootCacheService_1.APBSBotLootCacheService) === "function" ? _u : Object, typeof (_v = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _v : Object])
], APBSBotLootGenerator);
//# sourceMappingURL=APBSBotLootGenerator.js.map