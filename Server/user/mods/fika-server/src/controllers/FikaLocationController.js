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
exports.FikaLocationController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaHeadlessHelper_1 = require("../helpers/FikaHeadlessHelper");
const FikaMatchService_1 = require("../services/FikaMatchService");
let FikaLocationController = class FikaLocationController {
    fikaMatchService;
    fikaHeadlessHelper;
    constructor(fikaMatchService, fikaHeadlessHelper) {
        this.fikaMatchService = fikaMatchService;
        this.fikaHeadlessHelper = fikaHeadlessHelper;
        // empty
    }
    /**
     * Handle /fika/location/raids
     * @param request
     * @returns
     */
    handleGetRaids(_request) {
        const matches = [];
        for (const [matchId, match] of this.fikaMatchService.getAllMatches()) {
            const players = {};
            for (const [profileId, player] of match.players) {
                players[profileId] = player.isDead;
            }
            let hostUsername = match.hostUsername;
            if (match.isHeadless) {
                hostUsername = this.fikaHeadlessHelper.getHeadlessNickname(matchId);
            }
            matches.push({
                serverId: matchId,
                hostUsername: hostUsername,
                playerCount: match.players.size,
                status: match.status,
                location: match.raidConfig.location,
                side: match.side,
                time: match.time,
                players: players,
                isHeadless: match.isHeadless,
                headlessRequesterNickname: this.fikaHeadlessHelper.getRequesterUsername(matchId) || "", //Set this to an empty string if there is no requester.
            });
        }
        return matches;
    }
};
exports.FikaLocationController = FikaLocationController;
exports.FikaLocationController = FikaLocationController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaMatchService")),
    __param(1, (0, tsyringe_1.inject)("FikaHeadlessHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _a : Object, typeof (_b = typeof FikaHeadlessHelper_1.FikaHeadlessHelper !== "undefined" && FikaHeadlessHelper_1.FikaHeadlessHelper) === "function" ? _b : Object])
], FikaLocationController);
//# sourceMappingURL=FikaLocationController.js.map