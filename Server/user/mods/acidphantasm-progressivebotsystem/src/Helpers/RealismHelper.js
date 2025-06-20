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
exports.RealismHelper = void 0;
/* eslint-disable @typescript-eslint/quotes */
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const APBSLogger_1 = require("../Utils/APBSLogger");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const TierInformation_1 = require("../Globals/TierInformation");
let RealismHelper = class RealismHelper {
    tierInformation;
    apbsEquipmentGetter;
    apbsLogger;
    constructor(tierInformation, apbsEquipmentGetter, apbsLogger) {
        this.tierInformation = tierInformation;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsLogger = apbsLogger;
    }
    realismDetected = false;
    gasMasks = [
        "5b432c305acfc40019478128",
        "60363c0c92ec1c31037959f5"
    ];
    initialize() {
        this.realismDetected = true;
        this.addGasMasksToBots();
    }
    addGasMasksToBots() {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierJson(tierNumber, true);
            for (const botType in tierJson) {
                let weight = 22;
                if (botType == "bossTagilla" || botType == "bossKilla")
                    continue;
                if (botType == "pmcUSEC" || botType == "pmcUSEC")
                    weight = 40;
                if (botType == "scav")
                    weight = 26;
                tierJson[botType].equipment.FaceCover["5b432c305acfc40019478128"] = weight;
                tierJson[botType].equipment.FaceCover["60363c0c92ec1c31037959f5"] = weight;
            }
        }
        this.addGasMasksFiltersToMasks();
    }
    addGasMasksFiltersToMasks() {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierModsJson(tierNumber, true);
            tierJson["5b432c305acfc40019478128"] = {
                "mod_equipment": [
                    "590c595c86f7747884343ad7"
                ]
            };
            tierJson["60363c0c92ec1c31037959f5"] = {
                "mod_equipment": [
                    "590c595c86f7747884343ad7"
                ]
            };
        }
    }
};
exports.RealismHelper = RealismHelper;
exports.RealismHelper = RealismHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("TierInformation")),
    __param(1, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(2, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _a : Object, typeof (_b = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _b : Object, typeof (_c = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _c : Object])
], RealismHelper);
//# sourceMappingURL=RealismHelper.js.map