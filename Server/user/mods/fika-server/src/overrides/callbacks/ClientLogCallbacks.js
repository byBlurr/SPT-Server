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
exports.ClientLogCallbacksOverride = void 0;
const ClientLogCallbacks_1 = require("C:/snapshot/project/obj/callbacks/ClientLogCallbacks");
const ClientLogController_1 = require("C:/snapshot/project/obj/controllers/ClientLogController");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Override_1 = require("../../di/Override");
const FikaHeadlessHelper_1 = require("../../helpers/FikaHeadlessHelper");
let ClientLogCallbacksOverride = class ClientLogCallbacksOverride extends Override_1.Override {
    httpResponseUtil;
    fikaHeadlessHelper;
    clientLogController;
    constructor(httpResponseUtil, fikaHeadlessHelper, clientLogController) {
        super();
        this.httpResponseUtil = httpResponseUtil;
        this.fikaHeadlessHelper = fikaHeadlessHelper;
        this.clientLogController = clientLogController;
    }
    execute(container) {
        container.afterResolution("ClientLogCallbacks", (_t, result) => {
            result.clientLog = (url, info, sessionID) => {
                if (this.fikaHeadlessHelper.isHeadlessClient(sessionID)) {
                    this.clientLogController.clientLog(info);
                    return this.httpResponseUtil.nullResponse();
                }
                return ClientLogCallbacks_1.ClientLogCallbacks.prototype.clientLog.call(result, url, info, sessionID);
            };
        }, { frequency: "Always" });
    }
};
exports.ClientLogCallbacksOverride = ClientLogCallbacksOverride;
exports.ClientLogCallbacksOverride = ClientLogCallbacksOverride = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaHeadlessHelper")),
    __param(2, (0, tsyringe_1.inject)("ClientLogController")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof FikaHeadlessHelper_1.FikaHeadlessHelper !== "undefined" && FikaHeadlessHelper_1.FikaHeadlessHelper) === "function" ? _b : Object, typeof (_c = typeof ClientLogController_1.ClientLogController !== "undefined" && ClientLogController_1.ClientLogController) === "function" ? _c : Object])
], ClientLogCallbacksOverride);
//# sourceMappingURL=ClientLogCallbacks.js.map