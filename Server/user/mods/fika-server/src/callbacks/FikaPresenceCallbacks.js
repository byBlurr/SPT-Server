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
exports.FikaPresenceCallbacks = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const EFikaPlayerPresences_1 = require("../models/enums/EFikaPlayerPresences");
const FikaPresenceService_1 = require("../services/FikaPresenceService");
let FikaPresenceCallbacks = class FikaPresenceCallbacks {
    httpResponseUtil;
    fikaPresenceService;
    constructor(httpResponseUtil, fikaPresenceService) {
        this.httpResponseUtil = httpResponseUtil;
        this.fikaPresenceService = fikaPresenceService;
        // empty
    }
    /** Handle /fika/presence/get */
    handleGetPresence(_url, _info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaPresenceService.getAllPlayersPresence());
    }
    /** Handle /fika/presence/set */
    handleSetPresence(_url, data, sessionID) {
        data.activity = this.setActivityValue(data.activity);
        this.fikaPresenceService.updatePlayerPresence(sessionID, data);
        return this.httpResponseUtil.nullResponse();
    }
    /** Handle /fika/presence/setget */
    handleSetGetPresence(_url, data, sessionID) {
        data.activity = this.setActivityValue(data.activity);
        this.fikaPresenceService.updatePlayerPresence(sessionID, data);
        return this.httpResponseUtil.noBody(this.fikaPresenceService.getAllPlayersPresence());
    }
    setActivityValue(presence) {
        if (Object.keys(EFikaPlayerPresences_1.EFikaPlayerPresences).includes(presence.toString())) {
            presence = EFikaPlayerPresences_1.EFikaPlayerPresences[presence.toString()];
        }
        return presence;
    }
};
exports.FikaPresenceCallbacks = FikaPresenceCallbacks;
exports.FikaPresenceCallbacks = FikaPresenceCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaPresenceService")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof FikaPresenceService_1.FikaPresenceService !== "undefined" && FikaPresenceService_1.FikaPresenceService) === "function" ? _b : Object])
], FikaPresenceCallbacks);
//# sourceMappingURL=FikaPresenceCallbacks.js.map