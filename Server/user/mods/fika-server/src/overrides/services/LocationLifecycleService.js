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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationLifecycleServiceOverride = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ApplicationContext_1 = require("C:/snapshot/project/obj/context/ApplicationContext");
const ContextVariableType_1 = require("C:/snapshot/project/obj/context/ContextVariableType");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const LocationLifecycleService_1 = require("C:/snapshot/project/obj/services/LocationLifecycleService");
const TimeUtil_1 = require("C:/snapshot/project/obj/utils/TimeUtil");
const TransitionType_1 = require("C:/snapshot/project/obj/models/enums/TransitionType");
const Override_1 = require("../../di/Override");
const FikaInsuranceService_1 = require("../../services/FikaInsuranceService");
const FikaMatchService_1 = require("../../services/FikaMatchService");
let LocationLifecycleServiceOverride = class LocationLifecycleServiceOverride extends Override_1.Override {
    fikaInsuranceService;
    databaseService;
    profileHelper;
    fikaMatchService;
    locationLifecycleService;
    applicationContext;
    timeUtil;
    constructor(fikaInsuranceService, databaseService, profileHelper, fikaMatchService, locationLifecycleService, applicationContext, timeUtil) {
        super();
        this.fikaInsuranceService = fikaInsuranceService;
        this.databaseService = databaseService;
        this.profileHelper = profileHelper;
        this.fikaMatchService = fikaMatchService;
        this.locationLifecycleService = locationLifecycleService;
        this.applicationContext = applicationContext;
        this.timeUtil = timeUtil;
    }
    execute(container) {
        container.afterResolution("LocationLifecycleService", (_t, result) => {
            result.startLocalRaid = (sessionId, request) => {
                let locationLoot;
                const matchId = this.fikaMatchService.getMatchIdByProfile(sessionId);
                // Stops TS from throwing a tantrum :)
                const lifecycleService = this.locationLifecycleService;
                if (matchId === undefined) {
                    // player isn't in a Fika match, generate new loot
                    locationLoot = lifecycleService.generateLocationAndLoot(request.location);
                }
                else {
                    // player is in a Fika match, use match location loot and regen if transit
                    const match = this.fikaMatchService.getMatch(matchId);
                    if (matchId === sessionId) {
                        match.raids++;
                        if (match.raids > 1) {
                            match.locationData = lifecycleService.generateLocationAndLoot(request.location);
                        }
                    }
                    locationLoot = match.locationData;
                }
                const playerProfile = this.profileHelper.getPmcProfile(sessionId);
                const result = {
                    serverId: `${request.location}.${request.playerSide}.${this.timeUtil.getTimestamp()}`,
                    serverSettings: this.databaseService.getLocationServices(),
                    profile: { insuredItems: playerProfile.InsuredItems },
                    locationLoot: locationLoot,
                    transition: {
                        transitionType: TransitionType_1.TransitionType.Common,
                        transitionRaidId: "66f5750951530ca5ae09876d",
                        transitionCount: 0,
                        visitedLocations: [],
                    },
                };
                // Only has value when transitioning into map from previous one
                if (request.transition) {
                    result.transition = request.transition;
                }
                // Get data stored at end of previous raid (if any)
                const transitionData = this.applicationContext.getLatestValue(ContextVariableType_1.ContextVariableType.TRANSIT_INFO)?.getValue();
                if (transitionData) {
                    result.transition.transitionRaidId = transitionData.transitionRaidId;
                    result.transition.transitionCount += 1;
                    result.transition.visitedLocations.push(transitionData.sptLastVisitedLocation);
                    // Complete, clean up
                    this.applicationContext.clearValues(ContextVariableType_1.ContextVariableType.TRANSIT_INFO);
                }
                if (typeof matchId === "undefined" || sessionId === matchId) {
                    // Apply changes from pmcConfig to bot hostility values
                    lifecycleService.adjustBotHostilitySettings(result.locationLoot);
                    lifecycleService.adjustExtracts(request.playerSide, request.location, result.locationLoot);
                    // Clear bot cache ready for a fresh raid
                    lifecycleService.botGenerationCacheService.clearStoredBots();
                    lifecycleService.botNameService.clearNameCache();
                }
                return result;
            };
            result.endLocalRaid = (sessionId, request) => {
                var isSpectator = false;
                // Get match id from player session id
                const matchId = this.fikaMatchService.getMatchIdByPlayer(sessionId);
                // Find player that exited the raid
                const player = this.fikaMatchService.getPlayerInMatch(matchId, sessionId);
                if (player !== undefined) {
                    if (player.isSpectator) {
                        isSpectator = true;
                    }
                }
                this.fikaInsuranceService.onEndLocalRaidRequest(sessionId, this.fikaInsuranceService.getMatchId(sessionId), request);
                // Execute the original method if not a spectator
                if (!isSpectator) {
                    //Prototype callback because apparently setting a original callback before overriding doesn't allow some stuff to work.
                    LocationLifecycleService_1.LocationLifecycleService.prototype.endLocalRaid.call(result, sessionId, request);
                }
            };
        }, { frequency: "Always" });
    }
};
exports.LocationLifecycleServiceOverride = LocationLifecycleServiceOverride;
exports.LocationLifecycleServiceOverride = LocationLifecycleServiceOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaInsuranceService")),
    __param(1, (0, tsyringe_1.inject)("DatabaseService")),
    __param(2, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(3, (0, tsyringe_1.inject)("FikaMatchService")),
    __param(4, (0, tsyringe_1.inject)("LocationLifecycleService")),
    __param(5, (0, tsyringe_1.inject)("ApplicationContext")),
    __param(6, (0, tsyringe_1.inject)("TimeUtil")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaInsuranceService_1.FikaInsuranceService !== "undefined" && FikaInsuranceService_1.FikaInsuranceService) === "function" ? _a : Object, typeof (_b = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _c : Object, typeof (_d = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _d : Object, typeof (_e = typeof LocationLifecycleService_1.LocationLifecycleService !== "undefined" && LocationLifecycleService_1.LocationLifecycleService) === "function" ? _e : Object, typeof (_f = typeof ApplicationContext_1.ApplicationContext !== "undefined" && ApplicationContext_1.ApplicationContext) === "function" ? _f : Object, typeof (_g = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _g : Object])
], LocationLifecycleServiceOverride);
//# sourceMappingURL=LocationLifecycleService.js.map