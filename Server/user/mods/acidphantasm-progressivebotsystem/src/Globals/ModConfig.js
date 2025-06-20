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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ModConfig_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModConfig = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const FileSystemSync_1 = require("C:/snapshot/project/obj/utils/FileSystemSync");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const path_1 = __importDefault(require("path"));
const TierInformation_1 = require("./TierInformation");
const APBSLogger_1 = require("../Utils/APBSLogger");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
let ModConfig = class ModConfig {
    static { ModConfig_1 = this; }
    apbsLogger;
    logger;
    tierInformation;
    fileSystemSync;
    static config;
    static blacklist;
    constructor(apbsLogger, logger, tierInformation, fileSystemSync) {
        this.apbsLogger = apbsLogger;
        this.logger = logger;
        this.tierInformation = tierInformation;
        this.fileSystemSync = fileSystemSync;
        ModConfig_1.config = this.fileSystemSync.readJson(path_1.default.resolve(__dirname, "../../config/config.json"));
        ModConfig_1.blacklist = this.fileSystemSync.readJson(path_1.default.resolve(__dirname, "../../config/blacklists.json"));
    }
    serverLogDetails() {
        this.logger.debug("[APBS] Mod Config - FOR SUPPORT FOLKS ❤❤");
        this.logger.debug("[APBS] If any of these values are true, you can send them to me for support regarding bots/bot gen.");
        this.logger.debug(`[APBS] Using a Preset? ${ModConfig_1.config.usePreset}`);
        this.logger.debug(`[APBS] Mod Weapons: ${ModConfig_1.config.compatibilityConfig.enableModdedWeapons}`);
        this.logger.debug(`[APBS] Mod Equipment: ${ModConfig_1.config.compatibilityConfig.enableModdedEquipment}`);
        this.logger.debug(`[APBS] Mod Clothing: ${ModConfig_1.config.compatibilityConfig.enableModdedClothing}`);
        this.logger.debug(`[APBS] Mod Attachments: ${ModConfig_1.config.compatibilityConfig.enableModdedAttachments}`);
    }
};
exports.ModConfig = ModConfig;
exports.ModConfig = ModConfig = ModConfig_1 = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("APBSLogger")),
    __param(1, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(2, (0, tsyringe_1.inject)("TierInformation")),
    __param(3, (0, tsyringe_1.inject)("FileSystemSync")),
    __metadata("design:paramtypes", [typeof (_a = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _a : Object, typeof (_b = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _b : Object, typeof (_c = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _c : Object, typeof (_d = typeof FileSystemSync_1.FileSystemSync !== "undefined" && FileSystemSync_1.FileSystemSync) === "function" ? _d : Object])
], ModConfig);
//# sourceMappingURL=ModConfig.js.map