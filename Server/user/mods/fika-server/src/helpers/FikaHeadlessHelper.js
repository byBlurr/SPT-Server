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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaHeadlessHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const EHeadlessStatus_1 = require("../models/enums/EHeadlessStatus");
const FikaHeadlessProfileService_1 = require("../services/headless/FikaHeadlessProfileService");
const FikaHeadlessService_1 = require("../services/headless/FikaHeadlessService");
const FikaConfig_1 = require("../utils/FikaConfig");
let FikaHeadlessHelper = class FikaHeadlessHelper {
    fikaConfig;
    saveServer;
    FikaHeadlessService;
    fikaHeadlessProfileService;
    constructor(fikaConfig, saveServer, FikaHeadlessService, fikaHeadlessProfileService) {
        this.fikaConfig = fikaConfig;
        this.saveServer = saveServer;
        this.FikaHeadlessService = FikaHeadlessService;
        this.fikaHeadlessProfileService = fikaHeadlessProfileService;
        // empty
    }
    /**
     * Gets all currently logged in headlesses
     *
     * @returns A map where the key is the sessionID and the value is an IHeadlessClientInfo object
     */
    getHeadlessClients() {
        return this.FikaHeadlessService.getHeadlessClients();
    }
    /**
     * Allows for checking if a SessionID is a headless client
     *
     * @param sessionId The sessionID to check
     * @returns Returns true if the passed sessionID is a headless, returns false if not.
     */
    isHeadlessClient(sessionId) {
        return this.fikaHeadlessProfileService.getHeadlessProfiles().some((profile) => profile.info.id === sessionId);
    }
    /**
     * Allows for checking if the given headless client is available
     *
     * @returns Returns true if it's available, returns false if it isn't available.
     */
    isHeadlessClientAvailable(headlessSessionID) {
        const headless = this.FikaHeadlessService.getHeadlessClients().get(headlessSessionID);
        if (!headless) {
            return false;
        }
        if (headless.state === EHeadlessStatus_1.EHeadlessStatus.READY) {
            return true;
        }
        return false;
    }
    /**
     * Gets the requester's username for a headless client if there is any.
     *
     * @returns The nickname if the headless has been requested by a user, returns null if not.
     */
    getRequesterUsername(headlessSessionID) {
        const headlessClient = this.FikaHeadlessService.getHeadlessClients().get(headlessSessionID);
        if (!headlessClient) {
            return null;
        }
        if (!headlessClient.requesterSessionID) {
            return null;
        }
        return this.saveServer.getProfile(headlessClient.requesterSessionID).characters.pmc.Info.Nickname;
    }
    /***
     * Gets the alias (If it has been given one) or nickname of the headless client
     *
     * @returns the alias, or nickname or the headless client.
     */
    getHeadlessNickname(headlessSessionID) {
        const AliasName = this.fikaConfig.getConfig().headless.profiles.aliases[headlessSessionID];
        if (!AliasName) {
            return this.saveServer.getProfile(headlessSessionID).characters.pmc.Info.Nickname;
        }
        return AliasName;
    }
    /**
     * Gets all available headless clients
     *
     * @returns Returns an array of available headless clients
     */
    getAvailableHeadlessClients() {
        const headlessClients = [];
        for (const [headlessSessionID, headless] of this.getHeadlessClients()) {
            if (headless.state === EHeadlessStatus_1.EHeadlessStatus.READY) {
                const availableHeadlessClient = {
                    headlessSessionID: headlessSessionID,
                    alias: this.getHeadlessNickname(headlessSessionID),
                };
                headlessClients.push(availableHeadlessClient);
            }
        }
        return headlessClients;
    }
};
exports.FikaHeadlessHelper = FikaHeadlessHelper;
exports.FikaHeadlessHelper = FikaHeadlessHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaConfig")),
    __param(1, (0, tsyringe_1.inject)("SaveServer")),
    __param(2, (0, tsyringe_1.inject)("FikaHeadlessService")),
    __param(3, (0, tsyringe_1.inject)("FikaHeadlessProfileService")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _a : Object, typeof (_b = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _b : Object, typeof (_c = typeof FikaHeadlessService_1.FikaHeadlessService !== "undefined" && FikaHeadlessService_1.FikaHeadlessService) === "function" ? _c : Object, typeof (_d = typeof FikaHeadlessProfileService_1.FikaHeadlessProfileService !== "undefined" && FikaHeadlessProfileService_1.FikaHeadlessProfileService) === "function" ? _d : Object])
], FikaHeadlessHelper);
//# sourceMappingURL=FikaHeadlessHelper.js.map