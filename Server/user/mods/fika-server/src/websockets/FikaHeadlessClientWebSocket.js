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
exports.FikaHeadlessClientWebSocket = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaHeadlessHelper_1 = require("../helpers/FikaHeadlessHelper");
const EFikaHeadlessWSMessageTypes_1 = require("../models/enums/EFikaHeadlessWSMessageTypes");
const FikaMatchService_1 = require("../services/FikaMatchService");
const FikaHeadlessService_1 = require("../services/headless/FikaHeadlessService");
let FikaHeadlessClientWebSocket = class FikaHeadlessClientWebSocket {
    fikaHeadlessHelper;
    fikaHeadlessService;
    fikaMatchService;
    logger;
    headlessWebSockets = {};
    constructor(fikaHeadlessHelper, fikaHeadlessService, fikaMatchService, logger) {
        this.fikaHeadlessHelper = fikaHeadlessHelper;
        this.fikaHeadlessService = fikaHeadlessService;
        this.fikaMatchService = fikaMatchService;
        this.logger = logger;
        // Keep websocket connections alive
        setInterval(async () => {
            await this.keepWebSocketAlive();
        }, 30000);
    }
    getSocketId() {
        return "Fika Headless Client";
    }
    getHookUrl() {
        return "/fika/headless/client";
    }
    async onConnection(ws, req) {
        if (req.headers.authorization === undefined) {
            ws.close();
            return;
        }
        const Authorization = Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString().split(":");
        const UserSessionID = Authorization[0];
        this.logger.debug(`[${this.getSocketId()}] User is ${UserSessionID}`);
        if (!this.fikaHeadlessHelper.isHeadlessClient(UserSessionID)) {
            this.logger.warning(`[${this.getSocketId()}] Invalid headless client ${UserSessionID} tried to authenticate!`);
            return;
        }
        this.headlessWebSockets[UserSessionID] = ws;
        ws.on("message", (msg) => this.onMessage(UserSessionID, msg.toString()));
        ws.on("close", (code, reason) => this.onClose(ws, UserSessionID, code, reason));
        // Cleanup match if headless has crashed before re-adding it as an available client
        if (this.fikaMatchService.getMatchIdByProfile(UserSessionID)) {
            this.fikaMatchService.deleteMatch(UserSessionID);
        }
        this.fikaHeadlessService.addHeadlessClient(UserSessionID, ws);
    }
    // biome-ignore lint/correctness/noUnusedVariables: Currently unused, but might be implemented in the future.
    onMessage(sessionID, msg) {
        // Do nothing
    }
    // biome-ignore lint/correctness/noUnusedVariables: Currently unused, but might be implemented in the future.
    onClose(ws, sessionID, code, reason) {
        const clientWebSocket = this.headlessWebSockets[sessionID];
        if (clientWebSocket === ws) {
            this.logger.debug(`[${this.getSocketId()}] Deleting client ${sessionID}`);
            delete this.headlessWebSockets[sessionID];
            this.fikaHeadlessService.removeHeadlessClient(sessionID);
        }
    }
    async keepWebSocketAlive() {
        for (const sessionId in this.headlessWebSockets) {
            const clientWebSocket = this.headlessWebSockets[sessionId];
            if (clientWebSocket.readyState === WebSocket.CLOSED) {
                delete this.headlessWebSockets[sessionId];
                this.fikaHeadlessService.removeHeadlessClient(sessionId);
                return;
            }
            let message = {
                type: EFikaHeadlessWSMessageTypes_1.EFikaHeadlessWSMessageTypes.KeepAlive,
            };
            // Send a keep alive message to the headless client
            await clientWebSocket.sendAsync(JSON.stringify(message));
        }
    }
};
exports.FikaHeadlessClientWebSocket = FikaHeadlessClientWebSocket;
exports.FikaHeadlessClientWebSocket = FikaHeadlessClientWebSocket = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaHeadlessHelper")),
    __param(1, (0, tsyringe_1.inject)("FikaHeadlessService")),
    __param(2, (0, tsyringe_1.inject)("FikaMatchService")),
    __param(3, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaHeadlessHelper_1.FikaHeadlessHelper !== "undefined" && FikaHeadlessHelper_1.FikaHeadlessHelper) === "function" ? _a : Object, typeof (_b = typeof FikaHeadlessService_1.FikaHeadlessService !== "undefined" && FikaHeadlessService_1.FikaHeadlessService) === "function" ? _b : Object, typeof (_c = typeof FikaMatchService_1.FikaMatchService !== "undefined" && FikaMatchService_1.FikaMatchService) === "function" ? _c : Object, Object])
], FikaHeadlessClientWebSocket);
//# sourceMappingURL=FikaHeadlessClientWebSocket.js.map