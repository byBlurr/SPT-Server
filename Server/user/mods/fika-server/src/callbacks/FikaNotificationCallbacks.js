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
exports.FikaNotificationCallbacks = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const EEFTNotificationIconType_1 = require("../models/enums/EEFTNotificationIconType");
const EFikaNotifications_1 = require("../models/enums/EFikaNotifications");
const FikaNotificationWebSocket_1 = require("../websockets/FikaNotificationWebSocket");
let FikaNotificationCallbacks = class FikaNotificationCallbacks {
    httpResponseUtil;
    fikaNotificationWebSocket;
    constructor(httpResponseUtil, fikaNotificationWebSocket) {
        this.httpResponseUtil = httpResponseUtil;
        this.fikaNotificationWebSocket = fikaNotificationWebSocket;
        // empty
    }
    /** Handle /fika/notification/push */
    async handlePushNotification(_url, info, _sessionID) {
        // Yes, technically this needs a controller to fit into this format. But I cant be bothered setting up a whole controller for a few checks.
        if (!info.notification) {
            return this.httpResponseUtil.nullResponse();
        }
        info.type = EFikaNotifications_1.EFikaNotifications.PushNotification;
        // Set default notification icon if data for this has not been correctly given.
        if (!info.notificationIcon || typeof info.notificationIcon != "number") {
            info.notificationIcon = EEFTNotificationIconType_1.EEFTNotificationIconType.Default;
        }
        //Do some exception handling for the client, icon 6 seems to cause an exception as well as going out of the enum's bounds.
        if (info.notificationIcon == 6 || info.notificationIcon > 14) {
            info.notificationIcon = EEFTNotificationIconType_1.EEFTNotificationIconType.Default;
        }
        await this.fikaNotificationWebSocket.broadcast(info);
        return this.httpResponseUtil.nullResponse();
    }
};
exports.FikaNotificationCallbacks = FikaNotificationCallbacks;
exports.FikaNotificationCallbacks = FikaNotificationCallbacks = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(1, (0, tsyringe_1.inject)("FikaNotificationWebSocket")),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _a : Object, typeof (_b = typeof FikaNotificationWebSocket_1.FikaNotificationWebSocket !== "undefined" && FikaNotificationWebSocket_1.FikaNotificationWebSocket) === "function" ? _b : Object])
], FikaNotificationCallbacks);
//# sourceMappingURL=FikaNotificationCallbacks.js.map