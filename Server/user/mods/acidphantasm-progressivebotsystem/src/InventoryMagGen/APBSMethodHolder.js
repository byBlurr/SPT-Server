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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSMethodHolder = void 0;
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
let APBSMethodHolder = class APBSMethodHolder {
    logger;
    apbsLogger;
    localisationService;
    weightedRandomHelper;
    itemHelper;
    hashUtil;
    randUtil;
    weaponsWithNoSmallMagazines = [
        "5cc82d76e24e8d00134b4b83",
        "64ca3d3954fc657e230529cc",
        "64637076203536ad5600c990",
        "6513ef33e06849f06c0957ca",
        "65268d8ecb944ff1e90ea385",
        "65fb023261d5829b2d090755"
    ];
    constructor(logger, apbsLogger, localisationService, weightedRandomHelper, itemHelper, hashUtil, randUtil) {
        this.logger = logger;
        this.apbsLogger = apbsLogger;
        this.localisationService = localisationService;
        this.weightedRandomHelper = weightedRandomHelper;
        this.itemHelper = itemHelper;
        this.hashUtil = hashUtil;
        this.randUtil = randUtil;
    }
    apbsGetWeightedCompatibleAmmo(cartridgePool, currentCaliber, weaponTemplate) {
        if (currentCaliber == "762x67mmB") {
            currentCaliber = "Caliber762x67mmB";
        }
        let cartridgePoolForWeapon = cartridgePool[currentCaliber];
        if (!cartridgePoolForWeapon || cartridgePoolForWeapon?.length === 0) {
            this.logger.debug(this.localisationService.getText("bot-no_caliber_data_for_weapon_falling_back_to_default", {
                weaponId: weaponTemplate._id,
                weaponName: weaponTemplate._name,
                defaultAmmo: weaponTemplate._props.defAmmo
            }));
            // Immediately returns, default ammo is guaranteed to be compatible
            return weaponTemplate._props.defAmmo;
        }
        // Get cartridges the weapons first chamber allow
        const compatibleCartridgesInTemplate = this.getCompatibleCartridgesFromWeaponTemplate(weaponTemplate);
        if (!compatibleCartridgesInTemplate) {
            // No chamber data found in weapon, send default
            return weaponTemplate._props.defAmmo;
        }
        // Inner join the weapons allowed + passed in cartridge pool to get compatible cartridges
        const compatibleCartridges = {};
        for (const cartridge of Object.keys(cartridgePoolForWeapon)) {
            if (compatibleCartridgesInTemplate.includes(cartridge)) {
                compatibleCartridges[cartridge] = cartridgePoolForWeapon[cartridge];
            }
        }
        // If no compatible cartridges found still, get caliber data from magazine in weapon template
        if (Object.keys(compatibleCartridges).length === 0) {
            // Get cartridges from the weapons first magazine in filters
            const compatibleCartridgesInMagazine = this.getCompatibleCartridgesFromMagazineTemplate(weaponTemplate);
            if (compatibleCartridgesInMagazine.length === 0) {
                // No compatible cartridges found in magazine, use default
                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[AMMO] No compatible ammo found for ${weaponTemplate._id}, using weapons default ammo instead.`);
                return weaponTemplate._props.defAmmo;
            }
            // Get the caliber data from the first compatible round in the magazine
            const magazineCaliberData = this.itemHelper.getItem(compatibleCartridgesInMagazine[0])[1]._props.Caliber;
            cartridgePoolForWeapon = cartridgePool[magazineCaliberData];
            for (const cartridge of Object.keys(cartridgePoolForWeapon)) {
                if (compatibleCartridgesInMagazine.includes(cartridge)) {
                    compatibleCartridges[cartridge] = cartridgePoolForWeapon[cartridge];
                }
            }
            // Nothing found after also checking magazines, return default ammo
            if (Object.keys(compatibleCartridges).length === 0) {
                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[AMMO] No compatible ammo found for ${weaponTemplate._id} in last ditch effort, using weapons default ammo instead.`);
                return weaponTemplate._props.defAmmo;
            }
        }
        return this.weightedRandomHelper.getWeightedValue(compatibleCartridges);
    }
    getWeaponCaliber(weaponTemplate) {
        if (weaponTemplate._props.Caliber) {
            return weaponTemplate._props.Caliber;
        }
        if (weaponTemplate._props.ammoCaliber) {
            // 9x18pmm has a typo, should be Caliber9x18PM
            return weaponTemplate._props.ammoCaliber === "Caliber9x18PMM"
                ? "Caliber9x18PM"
                : weaponTemplate._props.ammoCaliber;
        }
        if (weaponTemplate._props.LinkedWeapon) {
            const ammoInChamber = this.itemHelper.getItem(weaponTemplate._props.Chambers[0]._props.filters[0].Filter[0]);
            if (!ammoInChamber[0]) {
                return;
            }
            return ammoInChamber[1]._props.Caliber;
        }
    }
    getCompatibleCartridgesFromWeaponTemplate(weaponTemplate) {
        const cartridges = weaponTemplate._props?.Chambers[0]?._props?.filters[0]?.Filter;
        if (!cartridges) {
            // Fallback to the magazine if possible, e.g. for revolvers
            return this.getCompatibleCartridgesFromMagazineTemplate(weaponTemplate);
        }
        return cartridges;
    }
    getCompatibleCartridgesFromMagazineTemplate(weaponTemplate) {
        // Get the first magazine's template from the weapon
        const magazineSlot = weaponTemplate._props.Slots?.find((slot) => slot._name === "mod_magazine");
        if (!magazineSlot) {
            return [];
        }
        const magazineTemplate = this.itemHelper.getItem(magazineSlot._props.filters[0].Filter[0]);
        if (!magazineTemplate[0]) {
            return [];
        }
        // Get the first slots array of cartridges
        let cartridges = magazineTemplate[1]._props.Slots[0]?._props?.filters[0].Filter;
        if (!cartridges) {
            // Normal magazines
            // None found, try the cartridges array
            cartridges = magazineTemplate[1]._props.Cartridges[0]?._props?.filters[0].Filter;
        }
        return cartridges ?? [];
    }
    magazineHasCompatibleCaliber(magazineTemplate, currentCaliber) {
        const cartridges = magazineTemplate._props.Cartridges[0]?._props?.filters[0].Filter;
        if (cartridges.length) {
            // Check each rout in the compatible cartridges
            for (const round in cartridges) {
                const caliberData = this.itemHelper.getItem(cartridges[round])[1]._props.Caliber;
                if (caliberData == currentCaliber)
                    return true;
            }
            return false;
        }
        return false;
    }
    // Custom filtered magazine pool by capacity - returns empty array if nothing is compatible
    getFilteredMagazinePoolByCapacity(tier, weapon, currentCaliber, modPool) {
        const desiredMagazineTpls = modPool.filter((magTpl) => {
            const magazineDb = this.itemHelper.getItem(magTpl);
            if (!magazineDb[0])
                return false;
            if (!this.magazineHasCompatibleCaliber(magazineDb[1], currentCaliber))
                return false;
            return magazineDb[1]._props && magazineDb[1]._props.Cartridges[0]._max_count < 40 && magazineDb[1]._props.Cartridges[0]._max_count >= 25;
        });
        if (desiredMagazineTpls.length === 0) {
            this.apbsLogger.log(Logging_1.Logging.DEBUG, `[MAGAZINES] Weapon: ${weapon._id} does not have compatible small magazines available in tier ${tier}. Ignoring filter...`);
        }
        return desiredMagazineTpls;
    }
    createMagazineWithAmmo(magazineTpl, ammoTpl, ammoPool, ammoCaliber, magTemplate, percentOfMag) {
        const magazine = [{ _id: this.hashUtil.generate(), _tpl: magazineTpl }];
        this.fillMagazineWithCartridge(magazine, magTemplate, ammoTpl, ammoPool, ammoCaliber, percentOfMag);
        return magazine;
    }
    fillMagazineWithCartridge(magazineWithChildCartridges, magTemplate, cartridgeTpl, ammoPool, ammoCaliber, percentOfMag) {
        // Get cartridge properties and max allowed stack size
        const cartridgeDetails = this.itemHelper.getItem(cartridgeTpl);
        if (!cartridgeDetails[0]) {
            this.logger.error(this.localisationService.getText("item-invalid_tpl_item", cartridgeTpl));
        }
        const cartridgeMaxStackSize = cartridgeDetails[1]._props?.StackMaxSize;
        if (!cartridgeMaxStackSize) {
            this.logger.error(`Item with tpl: ${cartridgeTpl} lacks a _props or StackMaxSize property`);
        }
        // Get max number of cartridges in magazine, choose random value between min/max
        const magazineCartridgeMaxCount = this.itemHelper.isOfBaseclass(magTemplate._id, BaseClasses_1.BaseClasses.SPRING_DRIVEN_CYLINDER)
            ? magTemplate._props.Slots.length // Edge case for rotating grenade launcher magazine
            : magTemplate._props.Cartridges[0]?._max_count;
        if (!magazineCartridgeMaxCount) {
            this.logger.warning(`Magazine: ${magTemplate._id} ${magTemplate._name} lacks a Cartridges array, unable to fill magazine with ammo`);
            return;
        }
        let bottomLoadTpl = cartridgeTpl;
        let topLoadTpl = cartridgeTpl;
        const ammoTableKeys = Object.keys(ammoPool[ammoCaliber]);
        const topLoadAmmoSelection = ammoTableKeys.at(ammoTableKeys.indexOf(cartridgeTpl) + 1);
        if (topLoadAmmoSelection == null) {
            bottomLoadTpl = ammoTableKeys.at(ammoTableKeys.indexOf(cartridgeTpl) - 1) ?? cartridgeTpl;
            topLoadTpl = cartridgeTpl;
        }
        else {
            topLoadTpl = topLoadAmmoSelection;
        }
        const desiredMaxStackCount = magazineCartridgeMaxCount;
        const desiredTopLoadAmount = Math.max(1, this.randUtil.getPercentOfValue(percentOfMag, desiredMaxStackCount, 0));
        const desiredBottomLoadAmount = desiredMaxStackCount - desiredTopLoadAmount;
        if (magazineWithChildCartridges.length > 1) {
            this.logger.warning(`Magazine ${magTemplate._name} already has cartridges defined, this may cause issues`);
        }
        // Loop over cartridge count and add stacks to magazine
        let cartridgeTplToAdd = cartridgeTpl;
        let cartridgeCountToAdd = 0;
        let currentStoredCartridgeCount = 0;
        let location = 0;
        let remainingMagSpace = 0;
        while (currentStoredCartridgeCount < desiredMaxStackCount) {
            remainingMagSpace = desiredMaxStackCount - currentStoredCartridgeCount;
            if (currentStoredCartridgeCount < desiredBottomLoadAmount) {
                cartridgeTplToAdd = bottomLoadTpl;
                cartridgeCountToAdd = desiredBottomLoadAmount <= cartridgeMaxStackSize ? desiredBottomLoadAmount : cartridgeMaxStackSize;
                if (cartridgeCountToAdd > (remainingMagSpace - desiredTopLoadAmount)) {
                    cartridgeCountToAdd = remainingMagSpace - desiredTopLoadAmount;
                }
            }
            else {
                cartridgeTplToAdd = topLoadTpl;
                cartridgeCountToAdd = desiredTopLoadAmount <= cartridgeMaxStackSize ? desiredTopLoadAmount : cartridgeMaxStackSize;
            }
            // Ensure we don't go over the max stackcount size
            const actualSpace = desiredMaxStackCount - currentStoredCartridgeCount;
            if (cartridgeCountToAdd > actualSpace) {
                cartridgeCountToAdd = actualSpace;
            }
            // Add cartridge item object into items array
            magazineWithChildCartridges.push(this.itemHelper.createCartridges(magazineWithChildCartridges[0]._id, cartridgeTplToAdd, cartridgeCountToAdd, location, magazineWithChildCartridges[0].upd?.SpawnedInSession));
            currentStoredCartridgeCount += cartridgeCountToAdd;
            location++;
        }
        // Only one cartridge stack added, remove location property as its only used for 2 or more stacks
        if (location === 1) {
            delete magazineWithChildCartridges[1].location;
        }
    }
};
exports.APBSMethodHolder = APBSMethodHolder;
exports.APBSMethodHolder = APBSMethodHolder = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("APBSLogger")),
    __param(2, (0, tsyringe_1.inject)("LocalisationService")),
    __param(3, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(4, (0, tsyringe_1.inject)("ItemHelper")),
    __param(5, (0, tsyringe_1.inject)("HashUtil")),
    __param(6, (0, tsyringe_1.inject)("RandomUtil")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _b : Object, typeof (_c = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _c : Object, typeof (_d = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _d : Object, typeof (_e = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _e : Object, typeof (_f = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _f : Object, typeof (_g = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _g : Object])
], APBSMethodHolder);
//# sourceMappingURL=APBSMethodHolder.js.map