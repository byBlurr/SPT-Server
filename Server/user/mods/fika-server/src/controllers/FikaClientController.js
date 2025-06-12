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
exports.FikaClientController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaClientService_1 = require("../services/FikaClientService");
let FikaClientController = class FikaClientController {
    fikaClientService;
    requiredMods = [];
    allowedMods = [];
    hasRequiredOrOptionalMods = true;
    constructor(fikaClientService) {
        this.fikaClientService = fikaClientService;
    }
    /**
     * Handle /fika/client/config
     */
    handleClientConfig() {
        const clientConfig = this.fikaClientService.getClientConfig();
        //Here be dragons, this is technically not in the client config, or well it was.. But it was decided it was better for this configuration
        //To be together with 'sentItemsLoseFIR' so users could find both options easier.
        //Keep this here as this is really only supposed to be a 'client' config and it's really only used on the client.
        clientConfig.allowItemSending = this.fikaClientService.getIsItemSendingAllowed();
        return clientConfig;
    }
    /**
     * Handle /fika/natpunchserver/config
     */
    handleNatPunchServerConfig() {
        return this.fikaClientService.getNatPunchServerConfig();
    }
    /**
     * Handle /fika/client/check/mods
     */
    handleCheckMods(request, sessionID) {
        return this.fikaClientService.getCheckModsResponse(request, sessionID);
    }
    /**
     * Handle /fika/profile/download
     */
    handleProfileDownload(sessionID) {
        return this.fikaClientService.getProfileBySessionID(sessionID);
    }
    /**
     * Handle /fika/client/check/version
     */
    handleVersionCheck() {
        return this.fikaClientService.getVersion();
    }
};
exports.FikaClientController = FikaClientController;
exports.FikaClientController = FikaClientController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaClientService")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaClientService_1.FikaClientService !== "undefined" && FikaClientService_1.FikaClientService) === "function" ? _a : Object])
], FikaClientController);
//# sourceMappingURL=FikaClientController.js.map