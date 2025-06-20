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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBarrelInventoryMagGen = void 0;
const BotWeaponGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotWeaponGeneratorHelper");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
let APBSBarrelInventoryMagGen = class APBSBarrelInventoryMagGen {
    randomUtil;
    botWeaponGeneratorHelper;
    constructor(randomUtil, botWeaponGeneratorHelper) {
        this.randomUtil = randomUtil;
        this.botWeaponGeneratorHelper = botWeaponGeneratorHelper;
    }
    getPriority() {
        return 50;
    }
    canHandleInventoryMagGen(inventoryMagGen) {
        return inventoryMagGen.getWeaponTemplate()._props.ReloadMode === "OnlyBarrel";
    }
    process(inventoryMagGen) {
        // Can't be done by _props.ammoType as grenade launcher shoots grenades with ammoType of "buckshot"
        let randomisedAmmoStackSize;
        if (inventoryMagGen.getAmmoTemplate()._props.StackMaxRandom === 1) {
            // doesnt stack
            randomisedAmmoStackSize = this.randomUtil.getInt(3, 6);
        }
        else {
            randomisedAmmoStackSize = this.randomUtil.getInt(inventoryMagGen.getAmmoTemplate()._props.StackMinRandom, inventoryMagGen.getAmmoTemplate()._props.StackMaxRandom);
        }
        this.botWeaponGeneratorHelper.addAmmoIntoEquipmentSlots(inventoryMagGen.getAmmoTemplate()._id, randomisedAmmoStackSize, inventoryMagGen.getPmcInventory());
    }
};
exports.APBSBarrelInventoryMagGen = APBSBarrelInventoryMagGen;
exports.APBSBarrelInventoryMagGen = APBSBarrelInventoryMagGen = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("RandomUtil")),
    __param(1, (0, tsyringe_1.inject)("BotWeaponGeneratorHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _a : Object, typeof (_b = typeof BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper !== "undefined" && BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper) === "function" ? _b : Object])
], APBSBarrelInventoryMagGen);
//# sourceMappingURL=APBSBarrelInventoryMagGen.js.map