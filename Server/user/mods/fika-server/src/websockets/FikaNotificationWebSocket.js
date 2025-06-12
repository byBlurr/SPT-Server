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
exports.FikaNotificationWebSocket = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const EFikaNotifications_1 = require("../models/enums/EFikaNotifications");
const FikaPresenceService_1 = require("../services/FikaPresenceService");
let FikaNotificationWebSocket = class FikaNotificationWebSocket {
    saveServer;
    logger;
    fikaPresenceService;
    clientWebSockets;
    constructor(saveServer, logger, fikaPresenceService) {
        this.saveServer = saveServer;
        this.logger = logger;
        this.fikaPresenceService = fikaPresenceService;
        this.clientWebSockets = {};
        // Keep websocket connections alive
        setInterval(async () => {
            await this.keepWebSocketAlive();
        }, 30000);
    }
    getSocketId() {
        return "Fika Notification Manager";
    }
    getHookUrl() {
        return "/fika/notification/";
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
        this.clientWebSockets[UserSessionID] = ws;
        ws.on("message", (msg) => this.onMessage(UserSessionID, msg.toString()));
        ws.on("close", (code, reason) => this.onClose(ws, UserSessionID, code, reason));
        this.fikaPresenceService.addPlayerPresence(UserSessionID);
    }
    // biome-ignore lint/correctness/noUnusedVariables: Currently unused, but might be implemented in the future.
    onMessage(sessionID, msg) {
        // Do nothing
    }
    // biome-ignore lint/correctness/noUnusedVariables: Currently unused, but might be implemented in the future.
    onClose(ws, sessionID, code, reason) {
        const clientWebSocket = this.clientWebSockets[sessionID];
        if (clientWebSocket === ws) {
            this.logger.debug(`[${this.getSocketId()}] Deleting client ${sessionID}`);
            delete this.clientWebSockets[sessionID];
        }
        this.fikaPresenceService.removePlayerPresence(sessionID);
    }
    // Send functionality for sending to a single client.
    async sendAsync(sessionID, message) {
        const client = this.clientWebSockets[sessionID];
        // Client is not online or not currently connected to the websocket.
        if (!client) {
            return;
        }
        // Client was formerly connected to the websocket, but may have connection issues as it didn't run onClose
        if (client.readyState === WebSocket.CLOSED) {
            return;
        }
        await client.sendAsync(JSON.stringify(message));
    }
    async broadcast(message) {
        for (const sessionID in this.clientWebSockets) {
            await this.sendAsync(sessionID, message);
        }
    }
    async keepWebSocketAlive() {
        for (const sessionID in this.clientWebSockets) {
            let message = {
                type: EFikaNotifications_1.EFikaNotifications.KeepAlive,
            };
            await this.sendAsync(sessionID, message);
        }
    }
};
exports.FikaNotificationWebSocket = FikaNotificationWebSocket;
exports.FikaNotificationWebSocket = FikaNotificationWebSocket = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SaveServer")),
    __param(1, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(2, (0, tsyringe_1.inject)("FikaPresenceService")),
    __metadata("design:paramtypes", [typeof (_a = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _a : Object, Object, typeof (_b = typeof FikaPresenceService_1.FikaPresenceService !== "undefined" && FikaPresenceService_1.FikaPresenceService) === "function" ? _b : Object])
], FikaNotificationWebSocket);
//# sourceMappingURL=FikaNotificationWebSocket.js.map