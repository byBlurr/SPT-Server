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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotLootCacheService = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const RagfairPriceService_1 = require("C:/snapshot/project/obj/services/RagfairPriceService");
const PMCLootGenerator_1 = require("C:/snapshot/project/obj/generators/PMCLootGenerator");
const BotLootCacheService_1 = require("C:/snapshot/project/obj/services/BotLootCacheService");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const IBotLootCache_1 = require("C:/snapshot/project/obj/models/spt/bots/IBotLootCache");
const RaidInformation_1 = require("../Globals/RaidInformation");
const APBSLogger_1 = require("../Utils/APBSLogger");
let APBSBotLootCacheService = class APBSBotLootCacheService extends BotLootCacheService_1.BotLootCacheService {
    logger;
    itemHelper;
    pmcLootGenerator;
    localisationService;
    ragfairPriceService;
    cloner;
    apbsEquipmentGetter;
    apbsTierGetter;
    raidInformation;
    apbsLogger;
    apbsLootCache;
    constructor(logger, itemHelper, pmcLootGenerator, localisationService, ragfairPriceService, cloner, apbsEquipmentGetter, apbsTierGetter, raidInformation, apbsLogger) {
        super(logger, itemHelper, pmcLootGenerator, localisationService, ragfairPriceService, cloner);
        this.logger = logger;
        this.itemHelper = itemHelper;
        this.pmcLootGenerator = pmcLootGenerator;
        this.localisationService = localisationService;
        this.ragfairPriceService = ragfairPriceService;
        this.cloner = cloner;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
        this.raidInformation = raidInformation;
        this.apbsLogger = apbsLogger;
        this.apbsClearCache();
        this.clearCache();
    }
    apbsClearCache() {
        this.apbsLootCache = {};
    }
    apbsBotRoleExistsInCache(combinedBotRoleTier) {
        return !!this.apbsLootCache[combinedBotRoleTier];
    }
    apbsInitCacheForBotRole(combinedBotRoleTier) {
        this.apbsLootCache[combinedBotRoleTier] = {
            backpackLoot: {},
            pocketLoot: {},
            vestLoot: {},
            secureLoot: {},
            combinedPoolLoot: {},
            specialItems: {},
            grenadeItems: {},
            drugItems: {},
            foodItems: {},
            drinkItems: {},
            currencyItems: {},
            healingItems: {},
            stimItems: {}
        };
    }
    apbsGetLootFromCache(botRole, isPmc, lootType, botJsonTemplate, botLevel, tier) {
        const tierInfo = tier.toString();
        const combinedBotRoleTier = botRole + tierInfo;
        if (!this.apbsBotRoleExistsInCache(combinedBotRoleTier)) {
            this.apbsInitCacheForBotRole(combinedBotRoleTier);
            this.apbsAddLootToCache(botRole, isPmc, botJsonTemplate, botLevel, tier);
        }
        let result = undefined;
        switch (lootType) {
            case IBotLootCache_1.LootCacheType.SPECIAL:
                result = this.apbsLootCache[combinedBotRoleTier].specialItems;
                break;
            case IBotLootCache_1.LootCacheType.BACKPACK:
                result = this.apbsLootCache[combinedBotRoleTier].backpackLoot;
                break;
            case IBotLootCache_1.LootCacheType.POCKET:
                result = this.apbsLootCache[combinedBotRoleTier].pocketLoot;
                break;
            case IBotLootCache_1.LootCacheType.VEST:
                result = this.apbsLootCache[combinedBotRoleTier].vestLoot;
                break;
            case IBotLootCache_1.LootCacheType.SECURE:
                result = this.apbsLootCache[combinedBotRoleTier].secureLoot;
                break;
            case IBotLootCache_1.LootCacheType.COMBINED:
                result = this.apbsLootCache[combinedBotRoleTier].combinedPoolLoot;
                break;
            case IBotLootCache_1.LootCacheType.HEALING_ITEMS:
                result = this.apbsLootCache[combinedBotRoleTier].healingItems;
                break;
            case IBotLootCache_1.LootCacheType.GRENADE_ITEMS:
                result = this.apbsLootCache[combinedBotRoleTier].grenadeItems;
                break;
            case IBotLootCache_1.LootCacheType.DRUG_ITEMS:
                result = this.apbsLootCache[combinedBotRoleTier].drugItems;
                break;
            case IBotLootCache_1.LootCacheType.FOOD_ITEMS:
                result = this.apbsLootCache[combinedBotRoleTier].foodItems;
                break;
            case IBotLootCache_1.LootCacheType.DRINK_ITEMS:
                result = this.apbsLootCache[combinedBotRoleTier].drinkItems;
                break;
            case IBotLootCache_1.LootCacheType.CURRENCY_ITEMS:
                result = this.apbsLootCache[combinedBotRoleTier].currencyItems;
                break;
            case IBotLootCache_1.LootCacheType.STIM_ITEMS:
                result = this.apbsLootCache[combinedBotRoleTier].stimItems;
                break;
            default:
                this.logger.error(this.localisationService.getText("bot-loot_type_not_found", {
                    lootType: lootType,
                    botRole: botRole,
                    isPmc: isPmc
                }));
                break;
        }
        return this.cloner.clone(result);
    }
    apbsAddLootToCache(botRole, isPmc, botJsonTemplate, botLevel, tier) {
        const tierInfo = tier.toString();
        const combinedBotRoleTier = botRole + tierInfo;
        const chances = this.apbsEquipmentGetter.getSpawnChancesByBotRole(botRole, tier);
        let realWhitelist = chances.generation.items;
        if (!this.raidInformation.isBotEnabled(botRole)) {
            realWhitelist = botJsonTemplate.generation.items;
        }
        // the full pool of loot we use to create the various sub-categories with
        const lootPool = botJsonTemplate.inventory.items;
        // Flatten all individual slot loot pools into one big pool, while filtering out potentially missing templates
        const specialLootPool = {};
        const backpackLootPool = {};
        const pocketLootPool = {};
        const vestLootPool = {};
        const secureLootTPool = {};
        const combinedLootPool = {};
        if (isPmc) {
            // Replace lootPool from bot json with our own generated list for PMCs
            lootPool.Backpack = this.cloner.clone(this.pmcLootGenerator.generatePMCBackpackLootPool(botRole));
            lootPool.Pockets = this.cloner.clone(this.pmcLootGenerator.generatePMCPocketLootPool(botRole));
            lootPool.TacticalVest = this.cloner.clone(this.pmcLootGenerator.generatePMCVestLootPool(botRole));
        }
        // Backpack/Pockets etc
        for (const [slot, pool] of Object.entries(lootPool)) {
            // No items to add, skip
            if (Object.keys(pool).length === 0) {
                continue;
            }
            // Sort loot pool into separate buckets
            switch (slot.toLowerCase()) {
                case "specialloot":
                    this.addItemsToPool(specialLootPool, pool);
                    break;
                case "pockets":
                    this.addItemsToPool(pocketLootPool, pool);
                    break;
                case "tacticalvest":
                    this.addItemsToPool(vestLootPool, pool);
                    break;
                case "securedcontainer":
                    this.addItemsToPool(secureLootTPool, pool);
                    break;
                case "backpack":
                    this.addItemsToPool(backpackLootPool, pool);
                    break;
                default:
                    this.logger.warning(`How did you get here ${slot}`);
            }
            // Add all items (if any) to combined pool (excluding secure)
            if (Object.keys(pool).length > 0 && slot.toLowerCase() !== "securedcontainer") {
                this.addItemsToPool(combinedLootPool, pool);
            }
        }
        // Assign whitelisted special items to bot if any exist
        const specialLootItems = Object.keys(realWhitelist.specialItems.whitelist)?.length > 0
            ? realWhitelist.specialItems.whitelist
            : {};
        // no whitelist, find and assign from combined item pool
        if (Object.keys(specialLootItems).length === 0) {
            for (const [tpl, weight] of Object.entries(specialLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (!(this.isBulletOrGrenade(itemTemplate._props) || this.isMagazine(itemTemplate._props))) {
                    specialLootItems[tpl] = weight;
                }
            }
        }
        // Assign whitelisted healing items to bot if any exist
        const healingItems = Object.keys(realWhitelist.healing.whitelist)?.length > 0
            ? realWhitelist.healing.whitelist
            : {};
        // No whitelist, find and assign from combined item pool
        if (Object.keys(healingItems).length === 0) {
            for (const [tpl, weight] of Object.entries(combinedLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (this.isMedicalItem(itemTemplate._props) &&
                    itemTemplate._parent !== BaseClasses_1.BaseClasses.STIMULATOR &&
                    itemTemplate._parent !== BaseClasses_1.BaseClasses.DRUGS) {
                    healingItems[tpl] = weight;
                }
            }
        }
        // Assign whitelisted drugs to bot if any exist
        const drugItems = Object.keys(realWhitelist.drugs.whitelist)?.length > 0
            ? realWhitelist.drugs.whitelist
            : {};
        // no drugs whitelist, find and assign from combined item pool
        if (Object.keys(drugItems).length === 0) {
            for (const [tpl, weight] of Object.entries(combinedLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (this.isMedicalItem(itemTemplate._props) && itemTemplate._parent === BaseClasses_1.BaseClasses.DRUGS) {
                    drugItems[tpl] = weight;
                }
            }
        }
        // Assign whitelisted food to bot if any exist
        const foodItems = Object.keys(realWhitelist.food.whitelist)?.length > 0
            ? realWhitelist.food.whitelist
            : {};
        // No food whitelist, find and assign from combined item pool
        if (Object.keys(foodItems).length === 0) {
            for (const [tpl, weight] of Object.entries(combinedLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (this.itemHelper.isOfBaseclass(itemTemplate._id, BaseClasses_1.BaseClasses.FOOD)) {
                    foodItems[tpl] = weight;
                }
            }
        }
        // Assign whitelisted drink to bot if any exist
        const drinkItems = Object.keys(realWhitelist.food.whitelist)?.length > 0
            ? realWhitelist.food.whitelist
            : {};
        // No drink whitelist, find and assign from combined item pool
        if (Object.keys(drinkItems).length === 0) {
            for (const [tpl, weight] of Object.entries(combinedLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (this.itemHelper.isOfBaseclass(itemTemplate._id, BaseClasses_1.BaseClasses.DRINK)) {
                    drinkItems[tpl] = weight;
                }
            }
        }
        // Assign whitelisted currency to bot if any exist
        const currencyItems = Object.keys(realWhitelist.currency.whitelist)?.length > 0
            ? realWhitelist.currency.whitelist
            : {};
        // No currency whitelist, find and assign from combined item pool
        if (Object.keys(currencyItems).length === 0) {
            for (const [tpl, weight] of Object.entries(combinedLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (this.itemHelper.isOfBaseclass(itemTemplate._id, BaseClasses_1.BaseClasses.MONEY)) {
                    currencyItems[tpl] = weight;
                }
            }
        }
        // Assign whitelisted stims to bot if any exist
        const stimItems = Object.keys(realWhitelist.stims.whitelist)?.length > 0
            ? realWhitelist.stims.whitelist
            : {};
        // No whitelist, find and assign from combined item pool
        if (Object.keys(stimItems).length === 0) {
            for (const [tpl, weight] of Object.entries(combinedLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (this.isMedicalItem(itemTemplate._props) && itemTemplate._parent === BaseClasses_1.BaseClasses.STIMULATOR) {
                    stimItems[tpl] = weight;
                }
            }
        }
        // Assign whitelisted grenades to bot if any exist
        const grenadeItems = Object.keys(realWhitelist.grenades.whitelist)?.length > 0
            ? realWhitelist.grenades.whitelist
            : {};
        // no whitelist, find and assign from combined item pool
        if (Object.keys(grenadeItems).length === 0) {
            for (const [tpl, weight] of Object.entries(combinedLootPool)) {
                const itemTemplate = this.itemHelper.getItem(tpl)[1];
                if (this.isGrenade(itemTemplate._props)) {
                    grenadeItems[tpl] = weight;
                }
            }
        }
        // Get backpack loot (excluding magazines, bullets, grenades, drink, food and healing/stim items)
        const filteredBackpackItems = {};
        const secondFilteredBackpackItems = {};
        let useInitialFilter = true;
        for (const itemKey of Object.keys(backpackLootPool)) {
            const itemResult = this.itemHelper.getItem(itemKey);
            if (!itemResult[0]) {
                continue;
            }
            const itemTemplate = itemResult[1];
            if (this.isBulletOrGrenade(itemTemplate._props) ||
                this.isMagazine(itemTemplate._props) ||
                this.isMedicalItem(itemTemplate._props) ||
                this.isGrenade(itemTemplate._props) ||
                this.isFood(itemTemplate._id) ||
                this.isDrink(itemTemplate._id) ||
                this.isAmmoBox(itemTemplate._id) ||
                this.isCurrency(itemTemplate._id)) {
                // Is type we dont want as backpack loot, skip
                continue;
            }
            filteredBackpackItems[itemKey] = backpackLootPool[itemKey];
        }
        // If filtered pool gets too small, hydrate with combined loot pool and then filter again
        if (!isPmc && Object.keys(filteredBackpackItems).length < 5) {
            useInitialFilter = false;
            const pmcType = Math.round(Math.random()) == 1 ? "pmcBEAR" : "pmcUSEC";
            const newItemPool = this.cloner.clone(this.pmcLootGenerator.generatePMCBackpackLootPool(pmcType));
            for (const tpl in newItemPool) {
                // Skip adding items that already exist
                if (filteredBackpackItems[tpl]) {
                    continue;
                }
                filteredBackpackItems[tpl] = newItemPool[tpl];
            }
            //Refilter them
            for (const itemKey of Object.keys(filteredBackpackItems)) {
                const itemResult = this.itemHelper.getItem(itemKey);
                if (!itemResult[0]) {
                    continue;
                }
                const itemTemplate = itemResult[1];
                if (this.isBulletOrGrenade(itemTemplate._props) ||
                    this.isMagazine(itemTemplate._props) ||
                    this.isMedicalItem(itemTemplate._props) ||
                    this.isGrenade(itemTemplate._props) ||
                    this.isFood(itemTemplate._id) ||
                    this.isDrink(itemTemplate._id) ||
                    this.isAmmoBox(itemTemplate._id) ||
                    this.isArmour(itemTemplate._id) ||
                    this.isCurrency(itemTemplate._id) ||
                    itemTemplate._id == "6711039f9e648049e50b3307" ||
                    itemTemplate._id == "593962ca86f774068014d9af") {
                    // Is type we dont want as backpack loot, skip
                    continue;
                }
                secondFilteredBackpackItems[itemKey] = filteredBackpackItems[itemKey];
            }
        }
        const finalFilteredBackpackItems = useInitialFilter ? filteredBackpackItems : secondFilteredBackpackItems;
        // Get pocket loot (excluding magazines, bullets, grenades, drink, food medical and healing/stim items)
        const filteredPocketItems = {};
        for (const itemKey of Object.keys(pocketLootPool)) {
            const itemResult = this.itemHelper.getItem(itemKey);
            if (!itemResult[0]) {
                continue;
            }
            const itemTemplate = itemResult[1];
            if (this.isBulletOrGrenade(itemTemplate._props) ||
                this.isMagazine(itemTemplate._props) ||
                this.isMedicalItem(itemTemplate._props) ||
                this.isGrenade(itemTemplate._props) ||
                this.isFood(itemTemplate._id) ||
                this.isDrink(itemTemplate._id) ||
                this.isCurrency(itemTemplate._id) ||
                !("Height" in itemTemplate._props) || // lacks height
                !("Width" in itemTemplate._props) // lacks width
            ) {
                continue;
            }
            filteredPocketItems[itemKey] = pocketLootPool[itemKey];
        }
        // Get vest loot (excluding magazines, bullets, grenades, medical and healing/stim items)
        const filteredVestItems = {};
        for (const itemKey of Object.keys(vestLootPool)) {
            const itemResult = this.itemHelper.getItem(itemKey);
            if (!itemResult[0]) {
                continue;
            }
            const itemTemplate = itemResult[1];
            if (this.isBulletOrGrenade(itemTemplate._props) ||
                this.isMagazine(itemTemplate._props) ||
                this.isMedicalItem(itemTemplate._props) ||
                this.isGrenade(itemTemplate._props) ||
                this.isFood(itemTemplate._id) ||
                this.isDrink(itemTemplate._id) ||
                this.isCurrency(itemTemplate._id)) {
                continue;
            }
            filteredVestItems[itemKey] = vestLootPool[itemKey];
        }
        this.apbsLootCache[combinedBotRoleTier].healingItems = healingItems;
        this.apbsLootCache[combinedBotRoleTier].drugItems = drugItems;
        this.apbsLootCache[combinedBotRoleTier].foodItems = foodItems;
        this.apbsLootCache[combinedBotRoleTier].drinkItems = drinkItems;
        this.apbsLootCache[combinedBotRoleTier].currencyItems = currencyItems;
        this.apbsLootCache[combinedBotRoleTier].stimItems = stimItems;
        this.apbsLootCache[combinedBotRoleTier].grenadeItems = grenadeItems;
        this.apbsLootCache[combinedBotRoleTier].specialItems = specialLootItems;
        this.apbsLootCache[combinedBotRoleTier].backpackLoot = finalFilteredBackpackItems;
        this.apbsLootCache[combinedBotRoleTier].pocketLoot = filteredPocketItems;
        this.apbsLootCache[combinedBotRoleTier].vestLoot = filteredVestItems;
        this.apbsLootCache[combinedBotRoleTier].secureLoot = secureLootTPool;
    }
    isAmmoBox(tpl) {
        return this.itemHelper.isOfBaseclass(tpl, BaseClasses_1.BaseClasses.AMMO_BOX);
    }
    isArmour(tpl) {
        return this.itemHelper.isOfBaseclass(tpl, BaseClasses_1.BaseClasses.EQUIPMENT);
    }
};
exports.APBSBotLootCacheService = APBSBotLootCacheService;
exports.APBSBotLootCacheService = APBSBotLootCacheService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("ItemHelper")),
    __param(2, (0, tsyringe_1.inject)("PMCLootGenerator")),
    __param(3, (0, tsyringe_1.inject)("LocalisationService")),
    __param(4, (0, tsyringe_1.inject)("RagfairPriceService")),
    __param(5, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(6, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(7, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(8, (0, tsyringe_1.inject)("RaidInformation")),
    __param(9, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _b : Object, typeof (_c = typeof PMCLootGenerator_1.PMCLootGenerator !== "undefined" && PMCLootGenerator_1.PMCLootGenerator) === "function" ? _c : Object, typeof (_d = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _d : Object, typeof (_e = typeof RagfairPriceService_1.RagfairPriceService !== "undefined" && RagfairPriceService_1.RagfairPriceService) === "function" ? _e : Object, typeof (_f = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _f : Object, typeof (_g = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _g : Object, typeof (_h = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _h : Object, typeof (_j = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _j : Object, typeof (_k = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _k : Object])
], APBSBotLootCacheService);
//# sourceMappingURL=APBSBotLootCacheService.js.map