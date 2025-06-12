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
exports.FikaHeadlessService = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const EFikaHeadlessWSMessageTypes_1 = require("../../models/enums/EFikaHeadlessWSMessageTypes");
const EHeadlessStatus_1 = require("../../models/enums/EHeadlessStatus");
const FikaConfig_1 = require("../../utils/FikaConfig");
const FikaHeadlessRequesterWebSocket_1 = require("../../websockets/FikaHeadlessRequesterWebSocket");
let FikaHeadlessService = class FikaHeadlessService {
    fikaHeadlessRequesterWebSocket;
    saveServer;
    logger;
    fikaConfig;
    headlessClients = new Map();
    constructor(fikaHeadlessRequesterWebSocket, saveServer, logger, fikaConfig) {
        this.fikaHeadlessRequesterWebSocket = fikaHeadlessRequesterWebSocket;
        this.saveServer = saveServer;
        this.logger = logger;
        this.fikaConfig = fikaConfig;
    }
    getHeadlessClients() {
        return this.headlessClients;
    }
    addHeadlessClient(sessionID, webSocket) {
        this.headlessClients.set(sessionID, { webSocket: webSocket, state: EHeadlessStatus_1.EHeadlessStatus.READY });
    }
    removeHeadlessClient(sessionID) {
        this.headlessClients.delete(sessionID);
    }
    /** Begin setting up a raid for a headless client
     *
     * @returns returns the SessionID of the headless client that is starting this raid, returns null if no client could be found or there was an error.
     */
    async startHeadlessRaid(headlessSessionID, requesterSessionID, info) {
        const headlessClient = this.headlessClients.get(headlessSessionID);
        if (!headlessClient || headlessClient?.state != EHeadlessStatus_1.EHeadlessStatus.READY) {
            return null;
        }
        headlessClient.state = EHeadlessStatus_1.EHeadlessStatus.IN_RAID;
        headlessClient.players = [];
        headlessClient.requesterSessionID = requesterSessionID;
        headlessClient.hasNotifiedRequester = false;
        const headlessClientWS = headlessClient.webSocket;
        if (!headlessClientWS) {
            return null;
        }
        if (headlessClientWS.readyState === WebSocket.CLOSED) {
            return null;
        }
        const startRequest = {
            type: EFikaHeadlessWSMessageTypes_1.EFikaHeadlessWSMessageTypes.HeadlessStartRaid,
            startRequest: info,
        };
        await headlessClientWS.sendAsync(JSON.stringify(startRequest));
        return headlessSessionID;
    }
    /** Sends a join message to the requester of a headless client */
    async sendJoinMessageToRequester(headlessClientId) {
        const headlessClient = this.headlessClients.get(headlessClientId);
        if (!headlessClient || headlessClient?.state === EHeadlessStatus_1.EHeadlessStatus.READY) {
            return null;
        }
        const message = {
            type: EFikaHeadlessWSMessageTypes_1.EFikaHeadlessWSMessageTypes.RequesterJoinMatch,
            matchId: headlessClientId,
        };
        await this.fikaHeadlessRequesterWebSocket.sendAsync(headlessClient.requesterSessionID, message);
        headlessClient.hasNotifiedRequester = true;
    }
    addPlayerToHeadlessMatch(headlessClientId, sessionID) {
        const headlessClient = this.headlessClients.get(headlessClientId);
        if (!headlessClient || headlessClient?.state != EHeadlessStatus_1.EHeadlessStatus.IN_RAID) {
            return;
        }
        if (headlessClientId === sessionID) {
            return;
        }
        headlessClient.players.push(sessionID);
        if (!this.fikaConfig.getConfig().headless.setLevelToAverageOfLobby) {
            // Doing this everytime is unecessary if we're not setting the average level so only set it once the original requester of the headless joins.
            if (headlessClient.requesterSessionID === sessionID) {
                this.setHeadlessLevel(headlessClientId);
            }
        }
        else {
            this.setHeadlessLevel(headlessClientId);
        }
    }
    setHeadlessLevel(headlessClientId) {
        const headlessClient = this.headlessClients.get(headlessClientId);
        if (!headlessClient || headlessClient?.state != EHeadlessStatus_1.EHeadlessStatus.IN_RAID) {
            return;
        }
        const headlessProfile = this.saveServer.getProfile(headlessClientId);
        // Set level of headless to that of the requester.
        if (!this.fikaConfig.getConfig().headless.setLevelToAverageOfLobby) {
            headlessProfile.characters.pmc.Info.Level = this.saveServer.getProfile(headlessClient.requesterSessionID).characters.pmc.Info.Level;
            return;
        }
        let baseHeadlessLevel = 0;
        let players = headlessClient.players.length;
        for (const sessionID of headlessClient.players) {
            baseHeadlessLevel += this.saveServer.getProfile(sessionID).characters.pmc.Info.Level;
        }
        baseHeadlessLevel = Math.round(baseHeadlessLevel / players);
        this.logger.debug(`[${headlessClientId}] Setting headless level to: ${baseHeadlessLevel} | Players: ${players}`);
        headlessProfile.characters.pmc.Info.Level = baseHeadlessLevel;
    }
    /** End the raid for the specified headless client, sets the state back to READY so that he can be requested to host again. */
    endHeadlessRaid(headlessClientId) {
        const headlessClient = this.headlessClients.get(headlessClientId);
        if (!headlessClient) {
            return;
        }
        headlessClient.state = EHeadlessStatus_1.EHeadlessStatus.READY;
        headlessClient.players = null;
        headlessClient.requesterSessionID = null;
        headlessClient.hasNotifiedRequester = null;
    }
};
exports.FikaHeadlessService = FikaHeadlessService;
exports.FikaHeadlessService = FikaHeadlessService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaHeadlessRequesterWebSocket")),
    __param(1, (0, tsyringe_1.inject)("SaveServer")),
    __param(2, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(3, (0, tsyringe_1.inject)("FikaConfig")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaHeadlessRequesterWebSocket_1.FikaHeadlessRequesterWebSocket !== "undefined" && FikaHeadlessRequesterWebSocket_1.FikaHeadlessRequesterWebSocket) === "function" ? _a : Object, typeof (_b = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _b : Object, Object, typeof (_c = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _c : Object])
], FikaHeadlessService);
//# sourceMappingURL=FikaHeadlessService.js.map