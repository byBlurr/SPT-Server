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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fika = void 0;
const node_path_1 = __importDefault(require("node:path"));
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ImageRouter_1 = require("C:/snapshot/project/obj/routers/ImageRouter");
const DatabaseServer_1 = require("C:/snapshot/project/obj/servers/DatabaseServer");
const ImporterUtil_1 = require("C:/snapshot/project/obj/utils/ImporterUtil");
const node_fs_1 = require("node:fs");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const FileSystem_1 = require("C:/snapshot/project/obj/utils/FileSystem");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const Overrider_1 = require("./overrides/Overrider");
const FikaClientService_1 = require("./services/FikaClientService");
const FikaPlayerRelationsCacheService_1 = require("./services/cache/FikaPlayerRelationsCacheService");
const FikaHeadlessProfileService_1 = require("./services/headless/FikaHeadlessProfileService");
const FikaConfig_1 = require("./utils/FikaConfig");
const FikaServerTools_1 = require("./utils/FikaServerTools");
let Fika = class Fika {
    logger;
    databaseServer;
    configServer;
    overrider;
    fikaServerTools;
    fikaConfig;
    fikaClientService;
    fikaHeadlessProfileService;
    imageRouter;
    importerUtil;
    jsonUtil;
    fileSystem;
    fikaPlayerRelationCacheServce;
    modPath;
    natPunchServerConfig;
    headlessConfig;
    backgroundConfig;
    constructor(logger, databaseServer, configServer, overrider, fikaServerTools, fikaConfig, fikaClientService, fikaHeadlessProfileService, imageRouter, importerUtil, jsonUtil, fileSystem, fikaPlayerRelationCacheServce) {
        this.logger = logger;
        this.databaseServer = databaseServer;
        this.configServer = configServer;
        this.overrider = overrider;
        this.fikaServerTools = fikaServerTools;
        this.fikaConfig = fikaConfig;
        this.fikaClientService = fikaClientService;
        this.fikaHeadlessProfileService = fikaHeadlessProfileService;
        this.imageRouter = imageRouter;
        this.importerUtil = importerUtil;
        this.jsonUtil = jsonUtil;
        this.fileSystem = fileSystem;
        this.fikaPlayerRelationCacheServce = fikaPlayerRelationCacheServce;
        this.modPath = fikaConfig.getModPath();
    }
    async preSptLoad(container) {
        await this.fikaConfig.preInit();
        this.natPunchServerConfig = this.fikaConfig.getConfig().natPunchServer;
        this.headlessConfig = this.fikaConfig.getConfig().headless;
        this.backgroundConfig = this.fikaConfig.getConfig().background;
        await this.fikaClientService.preInit();
        await this.overrider.override(container);
    }
    async postSptLoad(_container) {
        if (this.natPunchServerConfig.enable) {
            this.fikaServerTools.startService("NatPunchServer");
        }
        if (this.headlessConfig.profiles.amount > 0) {
            await this.fikaHeadlessProfileService.init();
        }
        await this.addFikaClientLocales();
        this.blacklistSpecialProfiles();
        this.fikaPlayerRelationCacheServce.postInit();
        if (this.backgroundConfig.enable) {
            const image = this.backgroundConfig.easteregg ? "assets/images/launcher/bg-senko.png" : "assets/images/launcher/bg.png";
            this.imageRouter.addRoute("/files/launcher/bg", node_path_1.default.join(this.modPath, image));
        }
        this.watchFikaConfig();
    }
    async addFikaClientLocales() {
        const database = this.databaseServer.getTables();
        const databasePath = node_path_1.default.join(this.fikaConfig.getModPath(), "assets/database/").replace(/\\/g, "/");
        const locales = await this.importerUtil.loadAsync(`${databasePath}locales/`, databasePath);
        for (const folderName in locales) {
            if (folderName === "global") {
                for (const localeKey in locales.global) {
                    const localeData = locales.global[localeKey];
                    database.locales.global[localeKey] = { ...database.locales.global[localeKey], ...localeData };
                }
            }
        }
    }
    async blacklistSpecialProfiles() {
        const coreConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.CORE);
        const profileBlacklist = coreConfig.features.createNewProfileTypesBlacklist;
        if (!this.fikaConfig.getConfig().server.showDevProfile) {
            profileBlacklist.push("SPT Developer");
        }
        if (!this.fikaConfig.getConfig().server.showNonStandardProfile) {
            for (const id of ["Tournament", "SPT Easy start", "SPT Zero to hero"]) {
                profileBlacklist.push(id);
            }
        }
    }
    watchFikaConfig() {
        const configPath = node_path_1.default.join(this.modPath, "assets/configs/fika.jsonc");
        let fileChangeTimeout = null;
        // At the moment this doesn't reload:
        // Nat punch server (Requires additional setup)
        // SPT Http configuration (Can't be changed once initialized)
        // Backgrounds on the launcher (cached?)
        // Any client options if a client is already in-game, client will have to restart his game.
        (0, node_fs_1.watch)(configPath, async (eventType, _filename) => {
            if (eventType === "change") {
                if (fileChangeTimeout) {
                    clearTimeout(fileChangeTimeout);
                }
                // Timeout is required here, sometimes Windows will send three events if a file has changed.
                fileChangeTimeout = setTimeout(async () => {
                    let config = this.jsonUtil.deserializeJsonC(await this.fileSystem.read(configPath));
                    if (!config) {
                        this.logger.error("[Fika Server] could not hot-reload configuration, is the syntax correct?");
                        return;
                    }
                    const oldHeadlessAmount = this.fikaConfig.getConfig().headless.profiles.amount;
                    if (this.fikaConfig.updateFikaConfig(config)) {
                        // Re-initialize new headless profiles if the number changed.
                        if (this.fikaConfig.getConfig().headless.profiles.amount > oldHeadlessAmount) {
                            await this.fikaHeadlessProfileService.init();
                        }
                        // Re-initialize required & optional mods
                        await this.fikaClientService.preInit();
                        // Re-initialize background
                        if (this.backgroundConfig.enable) {
                            const image = this.backgroundConfig.easteregg ? "assets/images/launcher/bg-senko.png" : "assets/images/launcher/bg.png";
                            this.imageRouter.addRoute("/files/launcher/bg", node_path_1.default.join(this.modPath, image));
                        }
                        // Re-initialize profile preset blacklist
                        const coreConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.CORE);
                        // Re-initialize showing of dev profile
                        if (this.fikaConfig.getConfig().server.showDevProfile) {
                            // Remove the blacklisted developer template
                            coreConfig.features.createNewProfileTypesBlacklist = coreConfig.features.createNewProfileTypesBlacklist.filter((item) => item !== "SPT Developer");
                        }
                        else {
                            // Re-add the blacklisted developer template
                            if (!coreConfig.features.createNewProfileTypesBlacklist.includes("SPT Developer")) {
                                coreConfig.features.createNewProfileTypesBlacklist.push("SPT Developer");
                            }
                        }
                        if (this.fikaConfig.getConfig().server.showNonStandardProfile) {
                            for (const id of ["Tournament", "SPT Easy start", "SPT Zero to hero"]) {
                                // Remove each blacklisted template
                                coreConfig.features.createNewProfileTypesBlacklist = coreConfig.features.createNewProfileTypesBlacklist.filter((item) => item !== id);
                            }
                        }
                        else {
                            for (const id of ["Tournament", "SPT Easy start", "SPT Zero to hero"]) {
                                // Re-add the blacklisted templates
                                if (!coreConfig.features.createNewProfileTypesBlacklist.includes(id)) {
                                    coreConfig.features.createNewProfileTypesBlacklist.push(id);
                                }
                            }
                        }
                        this.logger.info("[Fika Server] Configuration hot-reloaded successfully");
                    }
                }, 750);
            }
        });
    }
};
exports.Fika = Fika;
exports.Fika = Fika = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("DatabaseServer")),
    __param(2, (0, tsyringe_1.inject)("ConfigServer")),
    __param(3, (0, tsyringe_1.inject)("Overrider")),
    __param(4, (0, tsyringe_1.inject)("FikaServerTools")),
    __param(5, (0, tsyringe_1.inject)("FikaConfig")),
    __param(6, (0, tsyringe_1.inject)("FikaClientService")),
    __param(7, (0, tsyringe_1.inject)("FikaHeadlessProfileService")),
    __param(8, (0, tsyringe_1.inject)("ImageRouter")),
    __param(9, (0, tsyringe_1.inject)("ImporterUtil")),
    __param(10, (0, tsyringe_1.inject)("JsonUtil")),
    __param(11, (0, tsyringe_1.inject)("FileSystem")),
    __param(12, (0, tsyringe_1.inject)("FikaPlayerRelationsCacheService")),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof DatabaseServer_1.DatabaseServer !== "undefined" && DatabaseServer_1.DatabaseServer) === "function" ? _a : Object, typeof (_b = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _b : Object, typeof (_c = typeof Overrider_1.Overrider !== "undefined" && Overrider_1.Overrider) === "function" ? _c : Object, typeof (_d = typeof FikaServerTools_1.FikaServerTools !== "undefined" && FikaServerTools_1.FikaServerTools) === "function" ? _d : Object, typeof (_e = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _e : Object, typeof (_f = typeof FikaClientService_1.FikaClientService !== "undefined" && FikaClientService_1.FikaClientService) === "function" ? _f : Object, typeof (_g = typeof FikaHeadlessProfileService_1.FikaHeadlessProfileService !== "undefined" && FikaHeadlessProfileService_1.FikaHeadlessProfileService) === "function" ? _g : Object, typeof (_h = typeof ImageRouter_1.ImageRouter !== "undefined" && ImageRouter_1.ImageRouter) === "function" ? _h : Object, typeof (_j = typeof ImporterUtil_1.ImporterUtil !== "undefined" && ImporterUtil_1.ImporterUtil) === "function" ? _j : Object, typeof (_k = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _k : Object, typeof (_l = typeof FileSystem_1.FileSystem !== "undefined" && FileSystem_1.FileSystem) === "function" ? _l : Object, typeof (_m = typeof FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService !== "undefined" && FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService) === "function" ? _m : Object])
], Fika);
//# sourceMappingURL=Fika.js.map