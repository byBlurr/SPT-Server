"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const TierInformation_1 = require("../Globals/TierInformation");
const RaidInformation_1 = require("../Globals/RaidInformation");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const Tier0equipment = require("../db/Tier0_equipment.json");
const Tier1equipment = require("../db/Tier1_equipment.json");
const Tier2equipment = require("../db/Tier2_equipment.json");
const Tier3equipment = require("../db/Tier3_equipment.json");
const Tier4equipment = require("../db/Tier4_equipment.json");
const Tier5equipment = require("../db/Tier5_equipment.json");
const Tier6equipment = require("../db/Tier6_equipment.json");
const Tier7equipment = require("../db/Tier7_equipment.json");
const Tier0mods = require("../db/Tier0_mods.json");
const Tier1mods = require("../db/Tier1_mods.json");
const Tier2mods = require("../db/Tier2_mods.json");
const Tier3mods = require("../db/Tier3_mods.json");
const Tier4mods = require("../db/Tier4_mods.json");
const Tier5mods = require("../db/Tier5_mods.json");
const Tier6mods = require("../db/Tier6_mods.json");
const Tier7mods = require("../db/Tier7_mods.json");
const Tier0chances = require("../db/Tier0_chances.json");
const Tier1chances = require("../db/Tier1_chances.json");
const Tier2chances = require("../db/Tier2_chances.json");
const Tier3chances = require("../db/Tier3_chances.json");
const Tier4chances = require("../db/Tier4_chances.json");
const Tier5chances = require("../db/Tier5_chances.json");
const Tier6chances = require("../db/Tier6_chances.json");
const Tier7chances = require("../db/Tier7_chances.json");
const Tier0ammo = require("../db/Tier0_ammo.json");
const Tier1ammo = require("../db/Tier1_ammo.json");
const Tier2ammo = require("../db/Tier2_ammo.json");
const Tier3ammo = require("../db/Tier3_ammo.json");
const Tier4ammo = require("../db/Tier4_ammo.json");
const Tier5ammo = require("../db/Tier5_ammo.json");
const Tier6ammo = require("../db/Tier6_ammo.json");
const Tier7ammo = require("../db/Tier7_ammo.json");
const Tier0appearance = require("../db/Tier0_appearance.json");
const Tier1appearance = require("../db/Tier1_appearance.json");
const Tier2appearance = require("../db/Tier2_appearance.json");
const Tier3appearance = require("../db/Tier3_appearance.json");
const Tier4appearance = require("../db/Tier4_appearance.json");
const Tier5appearance = require("../db/Tier5_appearance.json");
const Tier6appearance = require("../db/Tier6_appearance.json");
const Tier7appearance = require("../db/Tier7_appearance.json");
let JSONHelper = class JSONHelper {
    tierInformation;
    raidInformation;
    apbsLogger;
    count;
    constructor(tierInformation, raidInformation, apbsLogger) {
        this.tierInformation = tierInformation;
        this.raidInformation = raidInformation;
        this.apbsLogger = apbsLogger;
        this.count = 0;
    }
    buildTierJson() {
        this.tierInformation.tier0 = Tier0equipment;
        this.tierInformation.tier1 = Tier1equipment;
        this.tierInformation.tier2 = Tier2equipment;
        this.tierInformation.tier3 = Tier3equipment;
        this.tierInformation.tier4 = Tier4equipment;
        this.tierInformation.tier5 = Tier5equipment;
        this.tierInformation.tier6 = Tier6equipment;
        this.tierInformation.tier7 = Tier7equipment;
        this.tierInformation.tier0mods = Tier0mods;
        this.tierInformation.tier1mods = Tier1mods;
        this.tierInformation.tier2mods = Tier2mods;
        this.tierInformation.tier3mods = Tier3mods;
        this.tierInformation.tier4mods = Tier4mods;
        this.tierInformation.tier5mods = Tier5mods;
        this.tierInformation.tier6mods = Tier6mods;
        this.tierInformation.tier7mods = Tier7mods;
        this.tierInformation.tier0chances = Tier0chances;
        this.tierInformation.tier1chances = Tier1chances;
        this.tierInformation.tier2chances = Tier2chances;
        this.tierInformation.tier3chances = Tier3chances;
        this.tierInformation.tier4chances = Tier4chances;
        this.tierInformation.tier5chances = Tier5chances;
        this.tierInformation.tier6chances = Tier6chances;
        this.tierInformation.tier7chances = Tier7chances;
        this.tierInformation.tier0ammo = Tier0ammo;
        this.tierInformation.tier1ammo = Tier1ammo;
        this.tierInformation.tier2ammo = Tier2ammo;
        this.tierInformation.tier3ammo = Tier3ammo;
        this.tierInformation.tier4ammo = Tier4ammo;
        this.tierInformation.tier5ammo = Tier5ammo;
        this.tierInformation.tier6ammo = Tier6ammo;
        this.tierInformation.tier7ammo = Tier7ammo;
        this.tierInformation.tier0appearance = Tier0appearance;
        this.tierInformation.tier1appearance = Tier1appearance;
        this.tierInformation.tier2appearance = Tier2appearance;
        this.tierInformation.tier3appearance = Tier3appearance;
        this.tierInformation.tier4appearance = Tier4appearance;
        this.tierInformation.tier5appearance = Tier5appearance;
        this.tierInformation.tier6appearance = Tier6appearance;
        this.tierInformation.tier7appearance = Tier7appearance;
    }
    usePreset(presetName) {
        const folderName = presetName;
        const presetFolder = path.join(path.dirname(__filename), "..", "..", "presets");
        const folderPath = path.join(presetFolder, folderName);
        if (!fs.existsSync(folderPath)) {
            this.missingPresetFolder(folderName, presetFolder);
            return;
        }
        const files = fs.readdirSync(folderPath);
        if (files.length < 35) {
            this.missingFileCount(folderName, 0);
            return;
        }
        if (files.length > 35) {
            this.missingFileCount(folderName, 1);
            return;
        }
        this.raidInformation.usingDefaultDB = false;
        for (const item of files) {
            const filePath = path.join(folderPath, item);
            this.mapFileToTierType(filePath, folderName, item);
        }
        if (this.count == 35)
            this.apbsLogger.log(Logging_1.Logging.WARN, `"${folderName}" preset loaded...`);
    }
    mapFileToTierType(filePath, folderName, item) {
        let tier = 0;
        let type = "none";
        if (item.includes("1"))
            tier = 1;
        if (item.includes("2"))
            tier = 2;
        if (item.includes("3"))
            tier = 3;
        if (item.includes("4"))
            tier = 4;
        if (item.includes("5"))
            tier = 5;
        if (item.includes("6"))
            tier = 6;
        if (item.includes("7"))
            tier = 7;
        if (tier == 0) {
            this.invalidFileName(folderName, item);
            return;
        }
        if (item.includes("equipment"))
            type = "equipment";
        if (item.includes("mods"))
            type = "mods";
        if (item.includes("chances"))
            type = "chances";
        if (item.includes("ammo"))
            type = "ammo";
        if (item.includes("appearance"))
            type = "appearance";
        if (type == "none") {
            this.invalidFileName(folderName, item);
            return;
        }
        this.configureTierType(filePath, tier, type);
    }
    configureTierType(filePath, tier, type) {
        this.count++;
        this.tierInformation.tier0 = Tier0equipment;
        this.tierInformation.tier0mods = Tier0mods;
        this.tierInformation.tier0chances = Tier0chances;
        this.tierInformation.tier0ammo = Tier0ammo;
        this.tierInformation.tier0appearance = Tier0appearance;
        switch (true) {
            case tier == 1 && type == "equipment":
                this.tierInformation.tier1 = require(filePath);
                return;
            case tier == 2 && type == "equipment":
                this.tierInformation.tier2 = require(filePath);
                return;
            case tier == 3 && type == "equipment":
                this.tierInformation.tier3 = require(filePath);
                return;
            case tier == 4 && type == "equipment":
                this.tierInformation.tier4 = require(filePath);
                return;
            case tier == 5 && type == "equipment":
                this.tierInformation.tier5 = require(filePath);
                return;
            case tier == 6 && type == "equipment":
                this.tierInformation.tier6 = require(filePath);
                return;
            case tier == 7 && type == "equipment":
                this.tierInformation.tier7 = require(filePath);
                return;
            case tier == 1 && type == "mods":
                this.tierInformation.tier1mods = require(filePath);
                return;
            case tier == 2 && type == "mods":
                this.tierInformation.tier2mods = require(filePath);
                return;
            case tier == 3 && type == "mods":
                this.tierInformation.tier3mods = require(filePath);
                return;
            case tier == 4 && type == "mods":
                this.tierInformation.tier4mods = require(filePath);
                return;
            case tier == 5 && type == "mods":
                this.tierInformation.tier5mods = require(filePath);
                return;
            case tier == 6 && type == "mods":
                this.tierInformation.tier6mods = require(filePath);
                return;
            case tier == 7 && type == "mods":
                this.tierInformation.tier7mods = require(filePath);
                return;
            case tier == 1 && type == "chances":
                this.tierInformation.tier1chances = require(filePath);
                return;
            case tier == 2 && type == "chances":
                this.tierInformation.tier2chances = require(filePath);
                return;
            case tier == 3 && type == "chances":
                this.tierInformation.tier3chances = require(filePath);
                return;
            case tier == 4 && type == "chances":
                this.tierInformation.tier4chances = require(filePath);
                return;
            case tier == 5 && type == "chances":
                this.tierInformation.tier5chances = require(filePath);
                return;
            case tier == 6 && type == "chances":
                this.tierInformation.tier6chances = require(filePath);
                return;
            case tier == 7 && type == "chances":
                this.tierInformation.tier7chances = require(filePath);
                return;
            case tier == 1 && type == "ammo":
                this.tierInformation.tier1ammo = require(filePath);
                return;
            case tier == 2 && type == "ammo":
                this.tierInformation.tier2ammo = require(filePath);
                return;
            case tier == 3 && type == "ammo":
                this.tierInformation.tier3ammo = require(filePath);
                return;
            case tier == 4 && type == "ammo":
                this.tierInformation.tier4ammo = require(filePath);
                return;
            case tier == 5 && type == "ammo":
                this.tierInformation.tier5ammo = require(filePath);
                return;
            case tier == 6 && type == "ammo":
                this.tierInformation.tier6ammo = require(filePath);
                return;
            case tier == 7 && type == "ammo":
                this.tierInformation.tier7ammo = require(filePath);
                return;
            case tier == 1 && type == "appearance":
                this.tierInformation.tier1appearance = require(filePath);
                return;
            case tier == 2 && type == "appearance":
                this.tierInformation.tier2appearance = require(filePath);
                return;
            case tier == 3 && type == "appearance":
                this.tierInformation.tier3appearance = require(filePath);
                return;
            case tier == 4 && type == "appearance":
                this.tierInformation.tier4appearance = require(filePath);
                return;
            case tier == 5 && type == "appearance":
                this.tierInformation.tier5appearance = require(filePath);
                return;
            case tier == 6 && type == "appearance":
                this.tierInformation.tier6appearance = require(filePath);
                return;
            case tier == 7 && type == "appearance":
                this.tierInformation.tier7appearance = require(filePath);
                return;
        }
    }
    missingFileCount(folderName, errorType) {
        const error = errorType == 0 ? "Missing files" : "Extra files found";
        this.raidInformation.usingDefaultDB = true;
        this.apbsLogger.log(Logging_1.Logging.ERR, `Preset name "${folderName}" is invalid.`);
        this.apbsLogger.log(Logging_1.Logging.ERR, `${error}. Report issue to author of preset.`);
        this.apbsLogger.log(Logging_1.Logging.WARN, "Using APBS database instead of preset...");
        this.buildTierJson();
    }
    invalidFileName(folderName, item) {
        this.raidInformation.usingDefaultDB = true;
        this.apbsLogger.log(Logging_1.Logging.ERR, `Preset name "${folderName}" is invalid.`);
        this.apbsLogger.log(Logging_1.Logging.ERR, `"${item}" is incorrectly named. Report issue to author of preset.`);
        this.apbsLogger.log(Logging_1.Logging.WARN, "Using APBS database instead of preset...");
        this.buildTierJson();
    }
    missingPresetFolder(folderName, presetFolder) {
        this.raidInformation.usingDefaultDB = true;
        this.apbsLogger.log(Logging_1.Logging.ERR, `Preset name "${folderName}" is invalid.`);
        this.apbsLogger.log(Logging_1.Logging.ERR, `Verify the preset folder exists in "${presetFolder}" and is named properly.`);
        this.apbsLogger.log(Logging_1.Logging.WARN, "Using APBS database instead of preset...");
        this.buildTierJson();
    }
};
exports.JSONHelper = JSONHelper;
exports.JSONHelper = JSONHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("TierInformation")),
    __param(1, (0, tsyringe_1.inject)("RaidInformation")),
    __param(2, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _a : Object, typeof (_b = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _b : Object, typeof (_c = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _c : Object])
], JSONHelper);
//# sourceMappingURL=JSONHelper.js.map