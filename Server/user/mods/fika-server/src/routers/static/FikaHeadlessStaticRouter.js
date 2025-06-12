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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaHeadlessStaticRouter = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Router_1 = require("C:/snapshot/project/obj/di/Router");
const FikaHeadlessCallbacks_1 = require("../../callbacks/FikaHeadlessCallbacks");
let FikaHeadlessStaticRouter = class FikaHeadlessStaticRouter extends Router_1.StaticRouter {
    fikaHeadlessCallbacks;
    constructor(fikaHeadlessCallbacks) {
        super([
            new Router_1.RouteAction("/fika/headless/get", async (url, info, sessionID, _output) => {
                return this.fikaHeadlessCallbacks.handleGetHeadlesses(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/headless/available", async (url, info, sessionID, _output) => {
                return this.fikaHeadlessCallbacks.handleAvailableHeadlesses(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/headless/restartafterraidamount", async (url, info, sessionID, _output) => {
                return this.fikaHeadlessCallbacks.handleRestartAfterRaidAmount(url, info, sessionID);
            }),
            new Router_1.RouteAction("/fika/headless/questtemplates", async (url, info, sessionID, _output) => {
                return this.fikaHeadlessCallbacks.handleGetAllQuestTemplates(url, info, sessionID);
            }),
        ]);
        this.fikaHeadlessCallbacks = fikaHeadlessCallbacks;
    }
};
exports.FikaHeadlessStaticRouter = FikaHeadlessStaticRouter;
exports.FikaHeadlessStaticRouter = FikaHeadlessStaticRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaHeadlessCallbacks")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaHeadlessCallbacks_1.FikaHeadlessCallbacks !== "undefined" && FikaHeadlessCallbacks_1.FikaHeadlessCallbacks) === "function" ? _a : Object])
], FikaHeadlessStaticRouter);
//# sourceMappingURL=FikaHeadlessStaticRouter.js.map