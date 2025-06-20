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
exports.BlacklistHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const ModConfig_1 = require("../Globals/ModConfig");
let BlacklistHelper = class BlacklistHelper {
    database;
    apbsEquipmentGetter;
    apbsLogger;
    constructor(database, apbsEquipmentGetter, apbsLogger) {
        this.database = database;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsLogger = apbsLogger;
    }
    invalidAmmoIDs = [];
    invalidEquipmentIDs = [];
    invalidWeaponIDs = [];
    invalidAttachmentIDs = [];
    invalidClothingIDs = [];
    initialize() {
        if (ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier1Blacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier1Blacklist, 1);
        if (ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier2Blacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier2Blacklist, 2);
        if (ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier3Blacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier3Blacklist, 3);
        if (ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier4Blacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier4Blacklist, 4);
        if (ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier5Blacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier5Blacklist, 5);
        if (ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier6Blacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier6Blacklist, 6);
        if (ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier7Blacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.blacklist.weaponBlacklist.tier7Blacklist, 7);
        if (ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier1Blacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier1Blacklist, 1);
        if (ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier2Blacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier2Blacklist, 2);
        if (ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier3Blacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier3Blacklist, 3);
        if (ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier4Blacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier4Blacklist, 4);
        if (ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier5Blacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier5Blacklist, 5);
        if (ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier6Blacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier6Blacklist, 6);
        if (ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier7Blacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.blacklist.equipmentBlacklist.tier7Blacklist, 7);
        if (ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier1Blacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier1Blacklist, 1);
        if (ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier2Blacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier2Blacklist, 2);
        if (ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier3Blacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier3Blacklist, 3);
        if (ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier4Blacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier4Blacklist, 4);
        if (ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier5Blacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier5Blacklist, 5);
        if (ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier6Blacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier6Blacklist, 6);
        if (ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier7Blacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.blacklist.ammoBlacklist.tier7Blacklist, 7);
        if (ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier1Blacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier1Blacklist, 1);
        if (ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier2Blacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier2Blacklist, 2);
        if (ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier3Blacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier3Blacklist, 3);
        if (ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier4Blacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier4Blacklist, 4);
        if (ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier5Blacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier5Blacklist, 5);
        if (ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier6Blacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier6Blacklist, 6);
        if (ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier7Blacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.blacklist.attachmentBlacklist.tier7Blacklist, 7);
        if (ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier1Blacklist.length > 0)
            this.removeBlacklistedClothing(ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier1Blacklist, 1);
        if (ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier2Blacklist.length > 0)
            this.removeBlacklistedClothing(ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier2Blacklist, 2);
        if (ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier3Blacklist.length > 0)
            this.removeBlacklistedClothing(ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier3Blacklist, 3);
        if (ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier4Blacklist.length > 0)
            this.removeBlacklistedClothing(ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier4Blacklist, 4);
        if (ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier5Blacklist.length > 0)
            this.removeBlacklistedClothing(ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier5Blacklist, 5);
        if (ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier6Blacklist.length > 0)
            this.removeBlacklistedClothing(ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier6Blacklist, 6);
        if (ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier7Blacklist.length > 0)
            this.removeBlacklistedClothing(ModConfig_1.ModConfig.blacklist.clothingBlacklist.tier7Blacklist, 7);
        this.validateBlacklist();
    }
    removeBlacklistedAmmo(ammoBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierAmmoJson(tier, true);
        for (const item in ammoBlacklist) {
            const itemDetails = this.getItem(ammoBlacklist[item]);
            if (itemDetails != undefined && itemDetails._parent == "5485a8684bdc2da71d8b4567") {
                for (const botType in tierJSON) {
                    for (const ammo in tierJSON[botType]) {
                        if (Object.keys(tierJSON[botType][ammo]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType][ammo]).length > 1) {
                                delete tierJSON[botType][ammo][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${ammo} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" for "${botType}" as it would make the Tier${tier} ${ammo} pool empty`);
                            continue;
                        }
                    }
                }
            }
            if (itemDetails == undefined || itemDetails._parent != "5485a8684bdc2da71d8b4567") {
                if (!this.invalidAmmoIDs.includes(ammoBlacklist[item]))
                    this.invalidAmmoIDs.push(ammoBlacklist[item]);
            }
        }
    }
    removeBlacklistedEquipment(equipmentBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierJson(tier, true);
        for (const item in equipmentBlacklist) {
            const itemDetails = this.getItem(equipmentBlacklist[item]);
            if (itemDetails != undefined) {
                for (const botType in tierJSON) {
                    for (const equipmentSlot in tierJSON[botType].equipment) {
                        if (Object.keys(tierJSON[botType].equipment[equipmentSlot]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType].equipment[equipmentSlot]).length > 1) {
                                delete tierJSON[botType].equipment[equipmentSlot][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${equipmentSlot} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" for "${botType}" as it would make the Tier${tier} ${equipmentSlot} pool empty.`);
                            continue;
                        }
                    }
                }
            }
            if (itemDetails == undefined) {
                if (!this.invalidEquipmentIDs.includes(equipmentBlacklist[item]))
                    this.invalidEquipmentIDs.push(equipmentBlacklist[item]);
            }
        }
    }
    removeBlacklistedWeapons(weaponBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierJson(tier, true);
        for (const item in weaponBlacklist) {
            const itemDetails = this.getItem(weaponBlacklist[item]);
            if (itemDetails != undefined) {
                for (const botType in tierJSON) {
                    for (const equipmentSlot in tierJSON[botType].equipment.FirstPrimaryWeapon) {
                        if (Object.keys(tierJSON[botType].equipment.FirstPrimaryWeapon[equipmentSlot]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType].equipment.FirstPrimaryWeapon[equipmentSlot]).length > 1) {
                                delete tierJSON[botType].equipment.FirstPrimaryWeapon[equipmentSlot][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${equipmentSlot} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" for "${botType}" as it would make the Tier${tier} ${equipmentSlot} pool empty.`);
                            continue;
                        }
                    }
                    for (const equipmentSlot in tierJSON[botType].equipment.SecondPrimaryWeapon) {
                        if (Object.keys(tierJSON[botType].equipment.SecondPrimaryWeapon[equipmentSlot]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType].equipment.SecondPrimaryWeapon[equipmentSlot]).length > 1) {
                                delete tierJSON[botType].equipment.SecondPrimaryWeapon[equipmentSlot][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${equipmentSlot} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" for "${botType}" as it would make the Tier${tier} ${equipmentSlot} pool empty.`);
                            continue;
                        }
                    }
                    if (Object.keys(tierJSON[botType].equipment.Holster).includes(itemDetails._id)) {
                        if (Object.keys(tierJSON[botType].equipment.Holster).length > 1) {
                            delete tierJSON[botType].equipment.Holster[itemDetails._id];
                            this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" Holster pool.`);
                            continue;
                        }
                        this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" for "${botType}" as it would make the Tier${tier} Holster pool empty.`);
                        continue;
                    }
                    if (Object.keys(tierJSON[botType].equipment.Scabbard).includes(itemDetails._id)) {
                        if (Object.keys(tierJSON[botType].equipment.Scabbard).length > 1) {
                            delete tierJSON[botType].equipment.Scabbard[itemDetails._id];
                            this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" Scabbard pool.`);
                            continue;
                        }
                        this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" for "${botType}" as it would make the Tier${tier} Scabbard pool empty.`);
                        continue;
                    }
                }
            }
            if (itemDetails == undefined) {
                if (!this.invalidWeaponIDs.includes(weaponBlacklist[item]))
                    this.invalidWeaponIDs.push(weaponBlacklist[item]);
            }
        }
    }
    removeBlacklistedAttachments(attachmentBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierModsJson(tier, true);
        for (const item in attachmentBlacklist) {
            const itemDetails = this.getItem(attachmentBlacklist[item]);
            if (itemDetails != undefined) {
                for (const parentID in tierJSON) {
                    const parentItemName = this.getItem(parentID);
                    const parentItemID = tierJSON[parentID];
                    for (const slotName in parentItemID) {
                        const itemSlotName = tierJSON[parentID][slotName];
                        if (itemSlotName.includes(itemDetails._id)) {
                            if (itemSlotName.length == 1) {
                                delete tierJSON[parentID][slotName];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed slot "${slotName}" from "${parentItemName._name}" because array is now empty.`);
                                continue;
                            }
                            const index = itemSlotName.indexOf(itemDetails._id);
                            if (index > -1) {
                                itemSlotName.splice(index, 1);
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${parentItemName._name}" slot "${slotName}".`);
                                continue;
                            }
                        }
                    }
                }
            }
            if (itemDetails == undefined) {
                if (!this.invalidAttachmentIDs.includes(attachmentBlacklist[item]))
                    this.invalidAttachmentIDs.push(attachmentBlacklist[item]);
            }
        }
    }
    removeBlacklistedClothing(clothingBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getAppearanceJson(tier, true);
        for (const item in clothingBlacklist) {
            const itemDetails = this.getCustomization(clothingBlacklist[item]);
            if (itemDetails != undefined) {
                for (const botType in tierJSON) {
                    for (const type in tierJSON[botType].appearance) {
                        if (type == "hands" || type == "head")
                            continue;
                        if (Object.keys(tierJSON[botType].appearance[type]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType].appearance[type]).length > 1) {
                                delete tierJSON[botType].appearance[type][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${type} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" for "${botType}" as it would make the Tier${tier} ${type} pool empty.`);
                            continue;
                        }
                    }
                }
            }
            if (itemDetails == undefined) {
                if (!this.invalidClothingIDs.includes(clothingBlacklist[item]))
                    this.invalidClothingIDs.push(clothingBlacklist[item]);
            }
        }
    }
    getItem(tpl) {
        if (tpl in this.database.getItems()) {
            return this.database.getItems()[tpl];
        }
        return undefined;
    }
    getCustomization(tpl) {
        if (tpl in this.database.getCustomization()) {
            return this.database.getCustomization()[tpl];
        }
        return undefined;
    }
    isCustomization(tpl, type) {
        if (tpl in this.database.getCustomization()) {
            const item = this.database.getCustomization()[tpl];
            if (item._props.Side == undefined) {
                return false;
            }
            if (item._props.Side.includes("Bear") || item._props.Side.includes("Usec")) {
                if (item._props.BodyPart == type) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }
    validateBlacklist() {
        if (this.invalidAmmoIDs.length > 0) {
            for (const item in this.invalidAmmoIDs) {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${this.invalidAmmoIDs[item]}" in Ammo Blacklist is an invalid item ID.`);
            }
        }
        if (this.invalidEquipmentIDs.length > 0) {
            for (const item in this.invalidEquipmentIDs) {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${this.invalidEquipmentIDs[item]}" in Equipment Blacklist is an invalid item ID.`);
            }
        }
        if (this.invalidWeaponIDs.length > 0) {
            for (const item in this.invalidWeaponIDs) {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${this.invalidWeaponIDs[item]}" in Weapon Blacklist is an invalid item ID.`);
            }
        }
        if (this.invalidAttachmentIDs.length > 0) {
            for (const item in this.invalidAttachmentIDs) {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${this.invalidAttachmentIDs[item]}" in Attachment Blacklist is an invalid item ID.`);
            }
        }
    }
};
exports.BlacklistHelper = BlacklistHelper;
exports.BlacklistHelper = BlacklistHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseService")),
    __param(1, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(2, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _b : Object, typeof (_c = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _c : Object])
], BlacklistHelper);
//# sourceMappingURL=BlacklistHelper.js.map