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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSTierGetter = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const TierInformation_1 = require("../Globals/TierInformation");
let APBSTierGetter = class APBSTierGetter {
    tierInformation;
    constructor(tierInformation) {
        this.tierInformation = tierInformation;
    }
    getTierByLevel(level) {
        return this.tierInformation.tiers.find(({ playerMinimumLevel, playerMaximumLevel }) => level >= playerMinimumLevel && level <= playerMaximumLevel)?.tier;
    }
    getTierUpperLevelDeviation(level) {
        return this.tierInformation.tiers.find(({ playerMinimumLevel, playerMaximumLevel }) => level >= playerMinimumLevel && level <= playerMaximumLevel)?.botMaxLevelVariance;
    }
    getTierLowerLevelDeviation(level) {
        return this.tierInformation.tiers.find(({ playerMinimumLevel, playerMaximumLevel }) => level >= playerMinimumLevel && level <= playerMaximumLevel)?.botMinLevelVariance;
    }
    getScavTierUpperLevelDeviation(level) {
        return this.tierInformation.tiers.find(({ playerMinimumLevel, playerMaximumLevel }) => level >= playerMinimumLevel && level <= playerMaximumLevel)?.scavMaxLevelVariance;
    }
    getScavTierLowerLevelDeviation(level) {
        return this.tierInformation.tiers.find(({ playerMinimumLevel, playerMaximumLevel }) => level >= playerMinimumLevel && level <= playerMaximumLevel)?.scavMinLevelVariance;
    }
};
exports.APBSTierGetter = APBSTierGetter;
exports.APBSTierGetter = APBSTierGetter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("TierInformation")),
    __metadata("design:paramtypes", [typeof (_a = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _a : Object])
], APBSTierGetter);
//# sourceMappingURL=APBSTierGetter.js.map