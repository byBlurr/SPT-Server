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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaRaidController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const InraidController_1 = require("C:/snapshot/project/obj/controllers/InraidController");
const FikaHeadlessHelper_1 = require("../helpers/FikaHeadlessHelper");
const EFikaMatchEndSessionMessages_1 = require("../models/enums/EFikaMatchEndSessionMessages");
const EFikaNotifications_1 = require("../models/enums/EFikaNotifications");
const FikaMatchService_1 = require("../services/FikaMatchService");
const FikaHeadlessService_1 = require("../services/headless/FikaHeadlessService");
const FikaNotificationWebSocket_1 = require("../websockets/FikaNotificationWebSocket");
let FikaRaidController = class FikaRaidController {
    fikaMatchService;
    fikaHeadlessHelper;
    fikaHeadlessService;
    logger;
    inraidController;
    fikaNotificationWebSocket;
    constructor(fikaMatchService, fikaHeadlessHelper, fikaHeadlessService, logger, inraidController, fikaNotificationWebSocket) {
        this.fikaMatchService = fikaMatchService;
        this.fikaHeadlessHelper = fikaHeadlessHelper;
        this.fikaHeadlessService = fikaHeadlessService;
        this.logger = logger;
        this.inraidController = inraidController;
        this.fikaNotificationWebSocket = fikaNotificationWebSocket;
        // empty
    }
    /**
     * Handle /fika/raid/create
     * @param request
     */
    handleRaidCreate(request) {
        let hostUsername = request.hostUsername;
        if (this.fikaHeadlessHelper.isHeadlessClient(request.serverId)) {
            hostUsername = this.fikaHeadlessHelper.getHeadlessNickname(request.serverId);
        }
        const notification = {
            type: EFikaNotifications_1.EFikaNotifications.StartedRaid,
            nickname: hostUsername,
            location: request.settings.location,
            isHeadlessRaid: this.fikaHeadlessHelper.isHeadlessClient(request.serverId),
            headlessRequesterName: this.fikaHeadlessHelper.getRequesterUsername(request.serverId) || "",
            raidTime: request.time
        };
        this.fikaNotificationWebSocket.broadcast(notification);
        return {
            success: this.fikaMatchService.createMatch(request),
        };
    }
    /**
     * Handle /fika/raid/join
     * @param request
     */
    handleRaidJoin(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        return {
            serverId: request.serverId,
            timestamp: match.timestamp,
            gameVersion: match.gameVersion,
            crc32: match.crc32,
            raidCode: match.raidCode,
        };
    }
    /**
     * Handle /fika/raid/leave
     * @param request
     */
    handleRaidLeave(request) {
        if (request.serverId === request.profileId) {
            this.fikaMatchService.endMatch(request.serverId, EFikaMatchEndSessionMessages_1.EFikaMatchEndSessionMessage.HOST_SHUTDOWN_MESSAGE);
            return;
        }
        this.fikaMatchService.removePlayerFromMatch(request.serverId, request.profileId);
    }
    /**
     * Handle /fika/raid/gethost
     * @param request
     */
    handleRaidGetHost(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            ips: match.ips,
            port: match.port,
            natPunch: match.natPunch,
            isHeadless: match.isHeadless,
        };
    }
    /**
     * Handle /fika/raid/getsettings
     * @param request
     */
    handleRaidGetSettings(request) {
        const match = this.fikaMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }
        return {
            metabolismDisabled: match.raidConfig.metabolismDisabled,
            playersSpawnPlace: match.raidConfig.playersSpawnPlace,
            hourOfDay: match.raidConfig.timeAndWeatherSettings.hourOfDay,
            timeFlowType: match.raidConfig.timeAndWeatherSettings.timeFlowType,
        };
    }
    /** Handle /fika/raid/headless/start */
    async handleRaidStartHeadless(sessionID, info) {
        if (!this.fikaHeadlessHelper.isHeadlessClientAvailable(info.headlessSessionID)) {
            return {
                matchId: null,
                error: "This headless client is not available.",
            };
        }
        if (this.fikaHeadlessHelper.isHeadlessClient(sessionID)) {
            return {
                matchId: null,
                error: "You are trying to connect to a headless client while having Fika.Headless installed. Please remove Fika.Headless from your client and try again.",
            };
        }
        const headlessClientId = await this.fikaHeadlessService.startHeadlessRaid(info.headlessSessionID, sessionID, info);
        this.logger.info(`Sent WS fikaHeadlessStartRaid to ${headlessClientId}`);
        return {
            // This really isn't required, I just want to make sure on the client
            matchId: headlessClientId,
            error: null,
        };
    }
    /** Handle /fika/raid/registerPlayer */
    handleRaidRegisterPlayer(sessionId, info) {
        this.inraidController.addPlayer(sessionId, info);
    }
};
exports.FikaRaidController = FikaRaidController;
exports.FikaRaidController = FikaRaidController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaMatchService")),
    __param(1, (0, tsyringe_1.inject)("FikaHeadlessHelper")),
    __param(2, (0, tsyringe_1.inject)("FikaHeadlessService")),
    __param(3, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(4, (0, tsyringe_1.inject)("InraidController")),
    __param(5, (0, tsyringe_1.inject)("FikaNotificationWebSocket")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _a : Object, typeof (_b = typeof FikaHeadlessHelper_1.FikaHeadlessHelper !== "undefined" && FikaHeadlessHelper_1.FikaHeadlessHelper) === "function" ? _b : Object, typeof (_c = typeof FikaHeadlessService_1.FikaHeadlessService !== "undefined" && FikaHeadlessService_1.FikaHeadlessService) === "function" ? _c : Object, Object, typeof (_d = typeof InraidController_1.InraidController !== "undefined" && InraidController_1.InraidController) === "function" ? _d : Object, typeof (_e = typeof FikaNotificationWebSocket_1.FikaNotificationWebSocket !== "undefined" && FikaNotificationWebSocket_1.FikaNotificationWebSocket) === "function" ? _e : Object])
], FikaRaidController);
//# sourceMappingURL=FikaRaidController.js.map