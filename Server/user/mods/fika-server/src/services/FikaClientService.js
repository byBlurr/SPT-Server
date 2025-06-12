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
exports.FikaClientService = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const FikaClientModHashesHelper_1 = require("../helpers/FikaClientModHashesHelper");
const FikaConfig_1 = require("../utils/FikaConfig");
let FikaClientService = class FikaClientService {
    fikaClientModHashesHelper;
    fikaConfig;
    saveServer;
    logger;
    requiredMods = [];
    allowedMods = [];
    hasRequiredOrOptionalMods = true;
    constructor(fikaClientModHashesHelper, fikaConfig, saveServer, logger) {
        this.fikaClientModHashesHelper = fikaClientModHashesHelper;
        this.fikaConfig = fikaConfig;
        this.saveServer = saveServer;
        this.logger = logger;
    }
    async preInit() {
        const config = this.fikaConfig.getConfig();
        const sanitizedRequiredMods = this.filterEmptyMods(config.client.mods.required);
        const sanitizedOptionalMods = this.filterEmptyMods(config.client.mods.optional);
        if (sanitizedRequiredMods.length === 0 && sanitizedOptionalMods.length === 0) {
            this.hasRequiredOrOptionalMods = false;
        }
        this.requiredMods = [...sanitizedRequiredMods, "com.fika.core", "com.SPT.custom", "com.SPT.singleplayer", "com.SPT.core", "com.SPT.debugging"];
        this.allowedMods = [...this.requiredMods, ...sanitizedOptionalMods, "com.bepis.bepinex.configurationmanager", "com.fika.headless"];
    }
    filterEmptyMods(array) {
        return array.filter((str) => str.trim() !== "");
    }
    getClientConfig() {
        return this.fikaConfig.getConfig().client;
    }
    getIsItemSendingAllowed() {
        return this.fikaConfig.getConfig().server.allowItemSending;
    }
    getNatPunchServerConfig() {
        return this.fikaConfig.getConfig().natPunchServer;
    }
    getHeadlessConfig() {
        return this.fikaConfig.getConfig().headless;
    }
    getVersion() {
        const version = this.fikaConfig.getVersion();
        return { version };
    }
    getCheckModsResponse(request, sessionID) {
        const mismatchedMods = {
            forbidden: [],
            missingRequired: [],
            hashMismatch: [],
        };
        if (this.fikaConfig.getConfig().server.logClientModsInConsole) {
            const username = this.saveServer.getProfile(sessionID).info.username;
            const mods = Object.keys(request);
            this.logger.info(`${username} (${sessionID}) connected with ${mods.length} client mods: ${mods.join(", ")}`);
        }
        // if no configuration was made, allow all mods
        if (!this.hasRequiredOrOptionalMods) {
            return mismatchedMods;
        }
        //check for missing required mods first
        for (const pluginId of this.requiredMods) {
            if (!request[pluginId]) {
                mismatchedMods.missingRequired.push(pluginId);
            }
        }
        // no need to check anything else since it's missing required mods
        if (mismatchedMods.missingRequired.length > 0) {
            return mismatchedMods;
        }
        for (const [pluginId, hash] of Object.entries(request)) {
            // check if the mod isn't allowed
            if (!this.allowedMods.includes(pluginId)) {
                mismatchedMods.forbidden.push(pluginId);
                continue;
            }
            // first request made will fill in at the very least all the required mods hashes, following requests made by different clients will add any optional mod not added by the first request, otherwise will check against the first request data
            if (!this.fikaClientModHashesHelper.exists(pluginId)) {
                this.fikaClientModHashesHelper.addHash(pluginId, hash);
                continue;
            }
            if (this.fikaClientModHashesHelper.getHash(pluginId) !== hash) {
                mismatchedMods.hashMismatch.push(pluginId);
            }
        }
        return mismatchedMods;
    }
    getProfileBySessionID(sessionID) {
        const profile = this.saveServer.getProfile(sessionID);
        if (profile) {
            this.logger.info(`${sessionID} has downloaded their profile`);
            return profile;
        }
        this.logger.error(`${sessionID} wants to download their profile but we don't have it`);
        return null;
    }
};
exports.FikaClientService = FikaClientService;
exports.FikaClientService = FikaClientService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaClientModHashesHelper")),
    __param(1, (0, tsyringe_1.inject)("FikaConfig")),
    __param(2, (0, tsyringe_1.inject)("SaveServer")),
    __param(3, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaClientModHashesHelper_1.FikaClientModHashesHelper !== "undefined" && FikaClientModHashesHelper_1.FikaClientModHashesHelper) === "function" ? _a : Object, typeof (_b = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _b : Object, typeof (_c = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _c : Object, Object])
], FikaClientService);
//# sourceMappingURL=FikaClientService.js.map