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
exports.FikaInsuranceService = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
let FikaInsuranceService = class FikaInsuranceService {
    saveServer;
    itemHelper;
    logger;
    matchInsuranceInfo;
    constructor(saveServer, itemHelper, logger) {
        this.saveServer = saveServer;
        this.itemHelper = itemHelper;
        this.logger = logger;
        this.matchInsuranceInfo = {};
    }
    getMatchId(sessionID) {
        for (const matchId in this.matchInsuranceInfo) {
            const match = this.matchInsuranceInfo[matchId];
            if (match.find((player) => player.sessionID == sessionID)) {
                return matchId;
            }
        }
    }
    addPlayerToMatchId(matchId, sessionID) {
        if (!(matchId in this.matchInsuranceInfo)) {
            this.matchInsuranceInfo[matchId] = [];
        }
        let player = {
            sessionID: sessionID,
            endedRaid: false,
            lostItems: [],
            foundItems: [],
            inventory: [],
        };
        this.matchInsuranceInfo[matchId].push(player);
    }
    onEndLocalRaidRequest(sessionID, matchId, endLocalRaidRequest) {
        if (!(matchId in this.matchInsuranceInfo)) {
            this.logger.error("[Fika Insurance] onEndLocalRaidRequest: matchId not found!");
            return;
        }
        const match = this.matchInsuranceInfo[matchId];
        for (const player of match) {
            if (player.sessionID != sessionID) {
                continue;
            }
            // Map both the lost items and the current inventory
            player.lostItems = endLocalRaidRequest.lostInsuredItems.map((i) => i._id);
            player.inventory = endLocalRaidRequest.results.profile.Inventory.items.map((i) => i._id);
            player.endedRaid = true;
        }
    }
    onMatchEnd(matchId) {
        if (!(matchId in this.matchInsuranceInfo)) {
            return;
        }
        const match = this.matchInsuranceInfo[matchId];
        match.forEach((player) => {
            // This player either crashed or the raid ended prematurely, eitherway we skip him.
            if (!player.endedRaid) {
                return;
            }
            match.forEach((nextPlayer) => {
                // Don't need to check the player we have in the base loop
                if (player.sessionID == nextPlayer.sessionID) {
                    return;
                }
                // This player either crashed or the raid ended prematurely, eitherway we skip him.
                if (!nextPlayer.endedRaid) {
                    return;
                }
                // Find overlap between players other than the initial player we're looping over, if it contains the lost item id of the initial player we add it to foundItems
                const overlap = nextPlayer.inventory.filter((i) => player.lostItems.includes(i));
                // Add said overlap to player's found items
                player.foundItems = player.foundItems.concat(overlap);
            });
            if (player.foundItems.length > 0) {
                this.logger.debug(`${player.sessionID} will lose ${player.foundItems.length}/${player.lostItems.length} items in insurance`);
                this.removeItemsFromInsurance(player.sessionID, player.foundItems);
            }
        });
        delete this.matchInsuranceInfo[matchId];
    }
    removeItemsFromInsurance(sessionID, ids) {
        const profile = this.saveServer.getProfile(sessionID);
        for (let insuranceIndex = 0; insuranceIndex < profile.insurance.length; insuranceIndex++) {
            let insurance = profile.insurance[insuranceIndex];
            for (const idToRemove of ids) {
                const insuredItemIndex = insurance.items.findIndex((i) => i._id == idToRemove);
                if (insuredItemIndex != -1) {
                    const item = insurance.items[insuredItemIndex];
                    this.logger.debug(`[Fika Insurance] Found ${item._id} which will be removed`);
                    // Remove soft inserts out of armors
                    if (this.itemHelper.isOfBaseclass(item._tpl, BaseClasses_1.BaseClasses.ARMOR) || this.itemHelper.isOfBaseclass(item._tpl, BaseClasses_1.BaseClasses.HEADWEAR)) {
                        this.logger.debug(`[Fika Insurance] ${item._id} is an armor or helmet`);
                        // Copy the original array, when we splice into the original array while looping over it we will skip certain items.
                        let insuranceItems = Array.from(insurance.items);
                        insuranceItems.forEach((innerItem) => {
                            this.logger.debug(`[Fika Insurance] Inner item: ${innerItem._id}`);
                            if (innerItem.parentId == item._id && this.itemHelper.isOfBaseclass(innerItem._tpl, BaseClasses_1.BaseClasses.BUILT_IN_INSERTS)) {
                                // There's mods that allow you to take soft inserts out and those will most likely have insurance set, dont need to remove those here.
                                if (!ids.includes(innerItem._id)) {
                                    this.logger.debug(`[Fika Insurance] Removing soft insert ${innerItem._id} of item ${item._id}`);
                                    const innerItemIndex = insurance.items.findIndex((i) => i._id == innerItem._id);
                                    insurance.items.splice(innerItemIndex, 1);
                                }
                            }
                        });
                    }
                    // Remove the original item
                    insurance.items.splice(insuredItemIndex, 1);
                }
            }
            if (insurance.items.length == 0) {
                this.logger.debug("No more insured items left, deleting this entry");
                profile.insurance.splice(insuranceIndex, 1);
                insuranceIndex--;
            }
            else {
                // Update existing insured item list
                profile.insurance[insuranceIndex] = insurance;
            }
        }
    }
};
exports.FikaInsuranceService = FikaInsuranceService;
exports.FikaInsuranceService = FikaInsuranceService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SaveServer")),
    __param(1, (0, tsyringe_1.inject)("ItemHelper")),
    __param(2, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _a : Object, typeof (_b = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _b : Object, Object])
], FikaInsuranceService);
//# sourceMappingURL=FikaInsuranceService.js.map