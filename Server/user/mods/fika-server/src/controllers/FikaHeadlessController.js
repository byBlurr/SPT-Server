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
exports.FikaHeadlessController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const QuestHelper_1 = require("C:/snapshot/project/obj/helpers/QuestHelper");
const QuestStatus_1 = require("C:/snapshot/project/obj/models/enums/QuestStatus");
const FikaHeadlessHelper_1 = require("../helpers/FikaHeadlessHelper");
const FikaConfig_1 = require("../utils/FikaConfig");
let FikaHeadlessController = class FikaHeadlessController {
    fikaHeadlessHelper;
    fikaConfig;
    questHelper;
    constructor(fikaHeadlessHelper, fikaConfig, questHelper) {
        this.fikaHeadlessHelper = fikaHeadlessHelper;
        this.fikaConfig = fikaConfig;
        this.questHelper = questHelper;
    }
    /**
     * Handle /fika/headless/get
     */
    handleGetHeadlesses() {
        const data = {
            headlesses: {},
        };
        for (const [headlessSessionID, headless] of this.fikaHeadlessHelper.getHeadlessClients()) {
            data.headlesses[headlessSessionID] = {
                state: headless.state,
                players: headless.players,
                requesterSessionID: headless.requesterSessionID,
                hasNotifiedRequester: headless.hasNotifiedRequester,
            };
        }
        return data;
    }
    /**
     * Handle /fika/headless/available
     */
    handleGetAvailableHeadlesses() {
        return this.fikaHeadlessHelper.getAvailableHeadlessClients();
    }
    /**
     * Handle /fika/headless/restartafterraidamount
     */
    handleRestartAfterRaidAmount() {
        const data = {
            amount: this.fikaConfig.getConfig().headless.restartAfterAmountOfRaids,
        };
        return data;
    }
    /**
     * Handle /fika/headless/questtemplates
     */
    handleGetAllQuestTemplates() {
        const quests = this.questHelper.getQuestsFromDb();
        for (const quest of quests) {
            quest.sptStatus = QuestStatus_1.QuestStatus.AvailableForStart;
        }
        return quests;
    }
};
exports.FikaHeadlessController = FikaHeadlessController;
exports.FikaHeadlessController = FikaHeadlessController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FikaHeadlessHelper")),
    __param(1, (0, tsyringe_1.inject)("FikaConfig")),
    __param(2, (0, tsyringe_1.inject)("QuestHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof FikaHeadlessHelper_1.FikaHeadlessHelper !== "undefined" && FikaHeadlessHelper_1.FikaHeadlessHelper) === "function" ? _a : Object, typeof (_b = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _b : Object, typeof (_c = typeof QuestHelper_1.QuestHelper !== "undefined" && QuestHelper_1.QuestHelper) === "function" ? _c : Object])
], FikaHeadlessController);
//# sourceMappingURL=FikaHeadlessController.js.map