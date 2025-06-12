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
exports.FikaHeadlessCallbacks = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const FikaHeadlessController_1 = require("../controllers/FikaHeadlessController");
let FikaHeadlessCallbacks = class FikaHeadlessCallbacks {
    httpResponseUtil;
    fikaHeadlessController;
    constructor(httpResponseUtil, fikaHeadlessController) {
        this.httpResponseUtil = httpResponseUtil;
        this.fikaHeadlessController = fikaHeadlessController;
        // empty
    }
    /** Handle /fika/headless/get */
    handleGetHeadlesses(_url, _info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaHeadlessController.handleGetHeadlesses());
    }
    /** Handle /fika/headless/available */
    handleAvailableHeadlesses(_url, _info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaHeadlessController.handleGetAvailableHeadlesses());
    }
    /** Handle /fika/headless/restartafterraidamount */
    handleRestartAfterRaidAmount(_url, _info, _sessionID) {
        return this.httpResponseUtil.noBody(this.fikaHeadlessController.handleRestartAfterRaidAmount());
    }
    /** Handle /fika/headless/questtemplates */
    handleGetAllQuestTemplates(_url, _info, _sessionID) {
        return this.httpResponseUtil.getBody(this.fikaHeadlessController.handleGetAllQuestTemplates());
    }
};
exports.FikaHeadlessCallbacks = FikaHeadlessCallbacks;
exports.FikaHeadlessCallbacks = FikaHeadlessCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaHeadlessController")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof FikaHeadlessController_1.FikaHeadlessController !== "undefined" && FikaHeadlessController_1.FikaHeadlessController) === "function" ? _b : Object])
], FikaHeadlessCallbacks);
//# sourceMappingURL=FikaHeadlessCallbacks.js.map