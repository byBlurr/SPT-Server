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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSUbglExternalMagGen = void 0;
const BotWeaponGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotWeaponGeneratorHelper");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const APBSMethodHolder_1 = require("./APBSMethodHolder");
let APBSUbglExternalMagGen = class APBSUbglExternalMagGen {
    botWeaponGeneratorHelper;
    randomUtil;
    apbsEquipmentGetter;
    apbsTierGetter;
    apbsMethodHolder;
    constructor(botWeaponGeneratorHelper, randomUtil, apbsEquipmentGetter, apbsTierGetter, apbsMethodHolder) {
        this.botWeaponGeneratorHelper = botWeaponGeneratorHelper;
        this.randomUtil = randomUtil;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
        this.apbsMethodHolder = apbsMethodHolder;
    }
    getPriority() {
        return 1;
    }
    canHandleInventoryMagGen(inventoryMagGen) {
        return inventoryMagGen.getWeaponTemplate()._parent === BaseClasses_1.BaseClasses.UBGL;
    }
    process(inventoryMagGen) {
        const bulletCount = this.botWeaponGeneratorHelper.getRandomizedBulletCount(inventoryMagGen.getMagCount(), inventoryMagGen.getMagazineTemplate());
        const rerollConfig = inventoryMagGen.getRerollDetails();
        if (rerollConfig.enable && this.randomUtil.getChance100(rerollConfig.chance)) {
            const weapon = inventoryMagGen.getWeaponTemplate();
            const ammoTable = this.apbsEquipmentGetter.getAmmoByBotRole(inventoryMagGen.getBotRole(), inventoryMagGen.getTierNumber());
            const ammoTemplate = inventoryMagGen.getAmmoTemplate();
            const ammoCaliber = ammoTemplate._props.Caliber;
            const rerolledAmmo = this.apbsMethodHolder.apbsGetWeightedCompatibleAmmo(ammoTable, ammoCaliber, weapon);
            this.botWeaponGeneratorHelper.addAmmoIntoEquipmentSlots(rerolledAmmo, bulletCount, inventoryMagGen.getPmcInventory());
        }
        this.botWeaponGeneratorHelper.addAmmoIntoEquipmentSlots(inventoryMagGen.getAmmoTemplate()._id, bulletCount, inventoryMagGen.getPmcInventory(), [EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST]);
    }
};
exports.APBSUbglExternalMagGen = APBSUbglExternalMagGen;
exports.APBSUbglExternalMagGen = APBSUbglExternalMagGen = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("BotWeaponGeneratorHelper")),
    __param(1, (0, tsyringe_1.inject)("RandomUtil")),
    __param(2, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(3, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(4, (0, tsyringe_1.inject)("APBSMethodHolder")),
    __metadata("design:paramtypes", [typeof (_a = typeof BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper !== "undefined" && BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper) === "function" ? _a : Object, typeof (_b = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _b : Object, typeof (_c = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _c : Object, typeof (_d = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _d : Object, typeof (_e = typeof APBSMethodHolder_1.APBSMethodHolder !== "undefined" && APBSMethodHolder_1.APBSMethodHolder) === "function" ? _e : Object])
], APBSUbglExternalMagGen);
//# sourceMappingURL=APBSUbglExternalMagGen.js.map