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
exports.FikaHeadlessRequesterWebSocket = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const EFikaHeadlessWSMessageTypes_1 = require("../models/enums/EFikaHeadlessWSMessageTypes");
let FikaHeadlessRequesterWebSocket = class FikaHeadlessRequesterWebSocket {
    saveServer;
    logger;
    requesterWebSockets = {};
    constructor(saveServer, logger) {
        this.saveServer = saveServer;
        this.logger = logger;
        // Keep websocket connections alive
        setInterval(async () => {
            await this.keepWebSocketAlive();
        }, 30000);
    }
    getSocketId() {
        return "Fika Headless Requester";
    }
    getHookUrl() {
        return "/fika/headless/requester";
    }
    async onConnection(ws, req) {
        if (req.headers.authorization === undefined) {
            ws.close();
            return;
        }
        const Authorization = Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString().split(":");
        const UserSessionID = Authorization[0];
        this.logger.debug(`[${this.getSocketId()}] User is ${UserSessionID}`);
        if (!this.saveServer.getProfile(UserSessionID)) {
            this.logger.warning(`[${this.getSocketId()}] Invalid user ${UserSessionID} tried to authenticate!`);
            return;
        }
        this.requesterWebSockets[UserSessionID] = ws;
        ws.on("close", (code, reason) => this.onClose(ws, UserSessionID, code, reason));
    }
    // biome-ignore lint/correctness/noUnusedVariables: Currently unused, but might be implemented in the future.
    onClose(ws, sessionID, code, reason) {
        const clientWebSocket = this.requesterWebSockets[sessionID];
        if (clientWebSocket === ws) {
            this.logger.debug(`[${this.getSocketId()}] Deleting requester ${sessionID}`);
            delete this.requesterWebSockets[sessionID];
        }
    }
    async sendAsync(sessionID, message) {
        const client = this.requesterWebSockets[sessionID];
        // Client is not online or not currently connected to the websocket.
        if (!client) {
            this.logger.warning(`[${this.getSocketId()}] Requester (${sessionID}) is not connected yet?`);
            return;
        }
        // Client was formerly connected to the websocket, but may have connection issues as it didn't run onClose
        if (client.readyState === WebSocket.CLOSED) {
            this.logger.warning(`[${this.getSocketId()}] Requester (${sessionID})'s websocket is closed?`);
            return;
        }
        await client.sendAsync(JSON.stringify(message));
    }
    async keepWebSocketAlive() {
        for (const sessionId in this.requesterWebSockets) {
            const clientWebSocket = this.requesterWebSockets[sessionId];
            if (clientWebSocket.readyState === WebSocket.CLOSED) {
                delete this.requesterWebSockets[sessionId];
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
exports.FikaHeadlessRequesterWebSocket = FikaHeadlessRequesterWebSocket;
exports.FikaHeadlessRequesterWebSocket = FikaHeadlessRequesterWebSocket = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SaveServer")),
    __param(1, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _a : Object, Object])
], FikaHeadlessRequesterWebSocket);
//# sourceMappingURL=FikaHeadlessRequesterWebSocket.js.map