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
exports.FikaPlayerRelationsHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const SptWebSocketConnectionHandler_1 = require("C:/snapshot/project/obj/servers/ws/SptWebSocketConnectionHandler");
const FikaPlayerRelationsCacheService_1 = require("../services/cache/FikaPlayerRelationsCacheService");
let FikaPlayerRelationsHelper = class FikaPlayerRelationsHelper {
    fikaPlayerRelationsCacheService;
    saveServer;
    webSocketHandler;
    logger;
    constructor(fikaPlayerRelationsCacheService, saveServer, webSocketHandler, logger) {
        this.fikaPlayerRelationsCacheService = fikaPlayerRelationsCacheService;
        this.saveServer = saveServer;
        this.webSocketHandler = webSocketHandler;
        this.logger = logger;
        // empty
    }
    /**
     * Returns the friendlist from the given player
     * @param profileId
     * @returns
     */
    getFriendsList(profileId) {
        return this.fikaPlayerRelationsCacheService.getStoredValue(profileId).Friends;
    }
    /**
     * Returns the ignorelist from the given player
     * @param profileId
     * @returns
     */
    getIgnoreList(profileId) {
        return this.fikaPlayerRelationsCacheService.getStoredValue(profileId).Ignore;
    }
    /**
     * Returns a list of players ignoring the given player
     * @param profileId
     * @returns
     */
    getInIgnoreList(profileId) {
        const storedPlayers = this.fikaPlayerRelationsCacheService.getKeys();
        return storedPlayers.filter((player) => this.fikaPlayerRelationsCacheService.getStoredValue(player).Ignore.includes(profileId));
    }
    /**
     * Makes 2 players fwends :D
     * @param fromProfileId
     * @param toProfileId
     */
    addFriend(fromProfileId, toProfileId) {
        const playerRelations1 = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (!playerRelations1.Friends.includes(toProfileId)) {
            playerRelations1.Friends.push(toProfileId);
            this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations1);
        }
        const playerRelations2 = this.fikaPlayerRelationsCacheService.getStoredValue(toProfileId);
        if (!playerRelations2.Friends.includes(fromProfileId)) {
            playerRelations2.Friends.push(fromProfileId);
            this.fikaPlayerRelationsCacheService.storeValue(toProfileId, playerRelations2);
        }
    }
    /**
     * If the 2 players are fwends, it makes them not fwends :(
     * @param fromProfileId
     * @param toProfileId
     */
    removeFriend(fromProfileId, toProfileId) {
        const playerRelations1 = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (playerRelations1.Friends.includes(toProfileId)) {
            playerRelations1.Friends.splice(playerRelations1.Friends.indexOf(toProfileId), 1);
            this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations1);
        }
        const playerRelations2 = this.fikaPlayerRelationsCacheService.getStoredValue(toProfileId);
        if (playerRelations2.Friends.includes(fromProfileId)) {
            playerRelations2.Friends.splice(playerRelations2.Friends.indexOf(fromProfileId), 1);
            this.fikaPlayerRelationsCacheService.storeValue(toProfileId, playerRelations2);
        }
        this.logger.info(`removeFriend: ${fromProfileId}->${toProfileId}`);
        const profile = this.saveServer.getProfile(fromProfileId);
        this.webSocketHandler.sendMessageAsync(toProfileId, {
            type: "youAreRemovedFromFriendList",
            eventId: "youAreRemovedFromFriendList",
            profile: {
                _id: profile.info.id,
                aid: profile.info.aid,
                Info: {
                    Nickname: profile.characters.pmc.Info.Nickname,
                    Side: profile.characters.pmc.Info.Side,
                    Level: profile.characters.pmc.Info.Level,
                    MemberCategory: profile.characters.pmc.Info.MemberCategory,
                    SelectedMemberCategory: profile.characters.pmc.Info.MemberCategory,
                    Ignored: false,
                    Banned: profile.characters.pmc.Info.BannedState,
                },
            },
        });
    }
    /**
     * If player2 is not in player1's ignore list, it adds them
     * @param fromProfileId
     * @param toProfileId
     */
    addToIgnoreList(fromProfileId, toProfileId) {
        const playerRelations = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (playerRelations.Ignore.includes(toProfileId)) {
            return;
        }
        playerRelations.Ignore.push(toProfileId);
        this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations);
        let profile = this.saveServer.getProfile(fromProfileId);
        this.webSocketHandler.sendMessageAsync(toProfileId, {
            type: "youAreAddToIgnoreList",
            eventId: "youAreAddToIgnoreList",
            _id: fromProfileId,
            profile: {
                _id: profile.info.id,
                aid: profile.info.aid,
                Info: {
                    Nickname: profile.characters.pmc.Info.Nickname,
                    Side: profile.characters.pmc.Info.Side,
                    Level: profile.characters.pmc.Info.Level,
                    MemberCategory: profile.characters.pmc.Info.MemberCategory,
                    SelectedMemberCategory: profile.characters.pmc.Info.MemberCategory,
                    Ignored: false,
                    Banned: profile.characters.pmc.Info.BannedState,
                },
            },
        });
    }
    /**
     * If player2 is in player1's ignore list, it removes them
     * @param fromProfileId
     * @param toProfileId
     */
    removeFromIgnoreList(fromProfileId, toProfileId) {
        const playerRelations = this.fikaPlayerRelationsCacheService.getStoredValue(fromProfileId);
        if (!playerRelations.Ignore.includes(toProfileId)) {
            return;
        }
        playerRelations.Ignore.splice(playerRelations.Ignore.indexOf(toProfileId), 1);
        this.fikaPlayerRelationsCacheService.storeValue(fromProfileId, playerRelations);
        let profile = this.saveServer.getProfile(fromProfileId);
        this.webSocketHandler.sendMessageAsync(toProfileId, {
            type: "youAreRemoveFromIgnoreList",
            eventId: "youAreRemoveFromIgnoreList",
            _id: fromProfileId,
            profile: {
                _id: profile.info.id,
                aid: profile.info.aid,
                Info: {
                    Nickname: profile.characters.pmc.Info.Nickname,
                    Side: profile.characters.pmc.Info.Side,
                    Level: profile.characters.pmc.Info.Level,
                    MemberCategory: profile.characters.pmc.Info.MemberCategory,
                    SelectedMemberCategory: profile.characters.pmc.Info.MemberCategory,
                    Ignored: false,
                    Banned: profile.characters.pmc.Info.BannedState,
                },
            },
        });
    }
};
exports.FikaPlayerRelationsHelper = FikaPlayerRelationsHelper;
exports.FikaPlayerRelationsHelper = FikaPlayerRelationsHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaPlayerRelationsCacheService")),
    __param(1, (0, tsyringe_1.inject)("SaveServer")),
    __param(2, (0, tsyringe_1.inject)("SptWebSocketConnectionHandler")),
    __param(3, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService !== "undefined" && FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService) === "function" ? _a : Object, typeof (_b = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _b : Object, typeof (_c = typeof SptWebSocketConnectionHandler_1.SptWebSocketConnectionHandler !== "undefined" && SptWebSocketConnectionHandler_1.SptWebSocketConnectionHandler) === "function" ? _c : Object, Object])
], FikaPlayerRelationsHelper);
//# sourceMappingURL=FikaPlayerRelationsHelper.js.map