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
exports.APBSExternalInventoryMagGen = void 0;
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotWeaponGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotWeaponGeneratorHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const ItemAddedResult_1 = require("C:/snapshot/project/obj/models/enums/ItemAddedResult");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const APBSMethodHolder_1 = require("./APBSMethodHolder");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const ModConfig_1 = require("../Globals/ModConfig");
let APBSExternalInventoryMagGen = class APBSExternalInventoryMagGen {
    logger;
    itemHelper;
    localisationService;
    botWeaponGeneratorHelper;
    botGeneratorHelper;
    randomUtil;
    apbsEquipmentGetter;
    apbsTierGetter;
    apbsMethodHolder;
    constructor(logger, itemHelper, localisationService, botWeaponGeneratorHelper, botGeneratorHelper, randomUtil, apbsEquipmentGetter, apbsTierGetter, apbsMethodHolder) {
        this.logger = logger;
        this.itemHelper = itemHelper;
        this.localisationService = localisationService;
        this.botWeaponGeneratorHelper = botWeaponGeneratorHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.randomUtil = randomUtil;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
        this.apbsMethodHolder = apbsMethodHolder;
    }
    getPriority() {
        return 99;
    }
    canHandleInventoryMagGen(inventoryMagGen) {
        if (inventoryMagGen.getWeaponTemplate()._props.ReloadMode === "OnlyBarrel")
            return false;
        if (inventoryMagGen.getMagazineTemplate()._props.ReloadMagType === "InternalMagazine")
            return false;
        if (inventoryMagGen.getWeaponTemplate()._parent === BaseClasses_1.BaseClasses.UBGL)
            return false;
        return true; // Fallback, if code reaches here it means no other implementation can handle this type of magazine
    }
    process(inventoryMagGen) {
        // Cout of attempts to fit a magazine into bot inventory
        let fitAttempts = 0;
        // Magazine Db template
        let magTemplate = inventoryMagGen.getMagazineTemplate();
        let magazineTpl = magTemplate._id;
        const weapon = inventoryMagGen.getWeaponTemplate();
        const ammoCaliber = inventoryMagGen.getAmmoTemplate()._props.Caliber;
        const attemptedMagBlacklist = [];
        const defaultMagazineTpl = this.botWeaponGeneratorHelper.getWeaponsDefaultMagazineTpl(weapon);
        let randomizedMagazineCount = Number(this.botWeaponGeneratorHelper.getRandomizedMagazineCount(inventoryMagGen.getMagCount()));
        const ammoTable = this.apbsEquipmentGetter.getAmmoByBotRole(inventoryMagGen.getBotRole(), inventoryMagGen.getTierNumber());
        const rerollConfig = inventoryMagGen.getRerollDetails();
        const toploadConfig = inventoryMagGen.getToploadDetails();
        let hasSwitchedToSmallerMags = false;
        let isTryingSmallerMags = false;
        const shouldBotRerollAmmo = (rerollConfig.enable && !toploadConfig.enable) ? this.randomUtil.getChance100(rerollConfig.chance) : false;
        const shouldBotTopload = (toploadConfig.enable && !rerollConfig.enable) ? this.randomUtil.getChance100(toploadConfig.chance) : false;
        for (let i = 0; i < randomizedMagazineCount; i++) {
            if (this.itemHelper.isOfBaseclass(weapon._id, BaseClasses_1.BaseClasses.PISTOL)) {
                randomizedMagazineCount = this.randomUtil.getInt(1, 2);
            }
            // Large capacity mag limited
            if (ModConfig_1.ModConfig.config.generalConfig.enableLargeCapacityMagazineLimit && !hasSwitchedToSmallerMags && !this.apbsMethodHolder.weaponsWithNoSmallMagazines.includes(weapon._id)) {
                const apbsModPool = this.apbsEquipmentGetter.getModsByBotRole(inventoryMagGen.getBotRole(), inventoryMagGen.getTierNumber());
                const apbsModsForWeapon = apbsModPool[weapon._id];
                const apbsMagazineModPool = apbsModsForWeapon["mod_magazine"];
                const currentMagazineCountSize = magTemplate?._props?.Cartridges[0]?._max_count;
                if (currentMagazineCountSize && apbsMagazineModPool.length) {
                    if (currentMagazineCountSize > 35 && i >= (ModConfig_1.ModConfig.config.generalConfig.largeCapacityMagazineCount - 1)) {
                        isTryingSmallerMags = true;
                        const smallerMagazines = this.apbsMethodHolder.getFilteredMagazinePoolByCapacity(inventoryMagGen.getTierNumber(), weapon, ammoCaliber, apbsMagazineModPool);
                        if (smallerMagazines.length) {
                            magazineTpl = this.randomUtil.getStringArrayValue(smallerMagazines);
                            magTemplate = this.itemHelper.getItem(magazineTpl)[1];
                        }
                    }
                }
            }
            // Ammo reselection
            let selectedAmmoForMag = inventoryMagGen.getAmmoTemplate()._id;
            if (shouldBotRerollAmmo) {
                selectedAmmoForMag = this.apbsMethodHolder.apbsGetWeightedCompatibleAmmo(ammoTable, ammoCaliber, weapon);
            }
            let magazineWithAmmo;
            if (shouldBotTopload) {
                magazineWithAmmo = this.apbsMethodHolder.createMagazineWithAmmo(magazineTpl, selectedAmmoForMag, ammoTable, ammoCaliber, magTemplate, toploadConfig.percent);
            }
            else {
                magazineWithAmmo = this.botWeaponGeneratorHelper.createMagazineWithAmmo(magazineTpl, selectedAmmoForMag, magTemplate);
            }
            const fitsIntoInventory = this.botGeneratorHelper.addItemWithChildrenToEquipmentSlot([EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST, EquipmentSlots_1.EquipmentSlots.POCKETS], magazineWithAmmo[0]._id, magazineTpl, magazineWithAmmo, inventoryMagGen.getPmcInventory());
            if (fitsIntoInventory === ItemAddedResult_1.ItemAddedResult.NO_CONTAINERS) {
                // No containers to fit magazines, stop trying
                break;
            }
            // No space for magazine and we haven't reached desired magazine count
            if (fitsIntoInventory === ItemAddedResult_1.ItemAddedResult.NO_SPACE && i < randomizedMagazineCount) {
                // Prevent infinite loop by only allowing 5 attempts at fitting a magazine into inventory
                if (fitAttempts > 5) {
                    this.logger.debug(`Failed ${fitAttempts} times to add magazine ${magazineTpl} to bot inventory, stopping`);
                    break;
                }
                /* We were unable to fit at least the minimum amount of magazines,
                 * so we fallback to default magazine and try again.
                 * Temporary workaround to Killa spawning with no extra mags if he spawns with a drum mag */
                if (magazineTpl === defaultMagazineTpl) {
                    // We were already on default - stop here to prevent infinite looping
                    break;
                }
                // Add failed magazine tpl to blacklist
                attemptedMagBlacklist.push(magazineTpl);
                // Set chosen magazine tpl to the weapons default magazine tpl and try to fit into inventory next loop
                magazineTpl = defaultMagazineTpl;
                magTemplate = this.itemHelper.getItem(magazineTpl)[1];
                if (!magTemplate) {
                    this.logger.error(this.localisationService.getText("bot-unable_to_find_default_magazine_item", magazineTpl));
                    break;
                }
                // Edge case - some weapons (SKS) have an internal magazine as default, choose random non-internal magazine to add to bot instead
                if (magTemplate._props.ReloadMagType === "InternalMagazine") {
                    const result = this.getRandomExternalMagazineForInternalMagazineGun(inventoryMagGen.getWeaponTemplate()._id, attemptedMagBlacklist);
                    if (!result?._id) {
                        this.logger.debug(`Unable to add additional magazine into bot inventory for weapon: ${weapon._name}, attempted: ${fitAttempts} times`);
                        break;
                    }
                    magazineTpl = result._id;
                    magTemplate = result;
                    fitAttempts++;
                }
                // Reduce loop counter by 1 to ensure we get full cout of desired magazines
                i--;
            }
            if (fitsIntoInventory === ItemAddedResult_1.ItemAddedResult.SUCCESS) {
                // Reset fit counter now it succeeded
                fitAttempts = 0;
                if (isTryingSmallerMags)
                    hasSwitchedToSmallerMags = true;
            }
        }
    }
    /**
     * Get a random compatible external magazine for a weapon, exclude internal magazines from possible pool
     * @param weaponTpl Weapon to get mag for
     * @returns tpl of magazine
     */
    getRandomExternalMagazineForInternalMagazineGun(weaponTpl, magazineBlacklist) {
        // The mag Slot data for the weapon
        const magSlot = this.itemHelper.getItem(weaponTpl)[1]._props.Slots.find((x) => x._name === "mod_magazine");
        if (!magSlot) {
            return undefined;
        }
        // All possible mags that fit into the weapon excluding blacklisted
        const magazinePool = magSlot._props.filters[0].Filter.filter((x) => !magazineBlacklist.includes(x)).map((x) => this.itemHelper.getItem(x)[1]);
        if (!magazinePool) {
            return undefined;
        }
        // Non-internal magazines that fit into the weapon
        const externalMagazineOnlyPool = magazinePool.filter((x) => x._props.ReloadMagType !== "InternalMagazine");
        if (!externalMagazineOnlyPool || externalMagazineOnlyPool?.length === 0) {
            return undefined;
        }
        // Randomly chosen external magazine
        return this.randomUtil.getArrayValue(externalMagazineOnlyPool);
    }
};
exports.APBSExternalInventoryMagGen = APBSExternalInventoryMagGen;
exports.APBSExternalInventoryMagGen = APBSExternalInventoryMagGen = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("ItemHelper")),
    __param(2, (0, tsyringe_1.inject)("LocalisationService")),
    __param(3, (0, tsyringe_1.inject)("BotWeaponGeneratorHelper")),
    __param(4, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(5, (0, tsyringe_1.inject)("RandomUtil")),
    __param(6, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(7, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(8, (0, tsyringe_1.inject)("APBSMethodHolder")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _b : Object, typeof (_c = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _c : Object, typeof (_d = typeof BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper !== "undefined" && BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper) === "function" ? _d : Object, typeof (_e = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _e : Object, typeof (_f = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _f : Object, typeof (_g = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _g : Object, typeof (_h = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _h : Object, typeof (_j = typeof APBSMethodHolder_1.APBSMethodHolder !== "undefined" && APBSMethodHolder_1.APBSMethodHolder) === "function" ? _j : Object])
], APBSExternalInventoryMagGen);
//# sourceMappingURL=APBSExternalInventoryMagGen.js.map