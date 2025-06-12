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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaPresenceService = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const TimeUtil_1 = require("C:/snapshot/project/obj/utils/TimeUtil");
const EFikaPlayerPresences_1 = require("../models/enums/EFikaPlayerPresences");
let FikaPresenceService = class FikaPresenceService {
    saveServer;
    timeUtil;
    logger;
    onlinePlayers;
    constructor(saveServer, timeUtil, logger) {
        this.saveServer = saveServer;
        this.timeUtil = timeUtil;
        this.logger = logger;
        this.onlinePlayers = {};
    }
    addPlayerPresence(sessionID) {
        const profile = this.saveServer.getProfile(sessionID);
        if (!profile) {
            return;
        }
        let data = {
            nickname: profile.characters.pmc.Info.Nickname,
            level: profile.characters.pmc.Info.Level,
            activity: EFikaPlayerPresences_1.EFikaPlayerPresences.IN_MENU,
            activityStartedTimestamp: this.timeUtil.getTimestamp(),
            raidInformation: null,
        };
        this.logger.debug(`[Fika Presence] Adding player: ${data.nickname}`);
        this.onlinePlayers[sessionID] = data;
    }
    getAllPlayersPresence() {
        let playerList = [];
        for (const sessionID in this.onlinePlayers) {
            let player = this.onlinePlayers[sessionID];
            playerList.push(player);
        }
        return playerList;
    }
    generateSetPresence(activity, raidInformation) {
        return {
            activity: activity,
            raidInformation: raidInformation,
        };
    }
    generateRaidPresence(location, side, time) {
        return {
            location: location,
            side: side,
            time: time,
        };
    }
    updatePlayerPresence(sessionID, newPresence) {
        if (!this.onlinePlayers[sessionID]) {
            return;
        }
        const profile = this.saveServer.getProfile(sessionID);
        let data = {
            nickname: profile.characters.pmc.Info.Nickname,
            level: profile.characters.pmc.Info.Level,
            activity: newPresence.activity,
            activityStartedTimestamp: this.timeUtil.getTimestamp(),
            raidInformation: newPresence.raidInformation,
        };
        this.onlinePlayers[sessionID] = data;
    }
    removePlayerPresence(sessionID) {
        if (!this.onlinePlayers[sessionID]) {
            return;
        }
        delete this.onlinePlayers[sessionID];
    }
};
exports.FikaPresenceService = FikaPresenceService;
exports.FikaPresenceService = FikaPresenceService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SaveServer")),
    __param(1, (0, tsyringe_1.inject)("TimeUtil")),
    __param(2, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _a : Object, typeof (_b = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _b : Object, Object])
], FikaPresenceService);
//# sourceMappingURL=FikaPresenceService.js.map