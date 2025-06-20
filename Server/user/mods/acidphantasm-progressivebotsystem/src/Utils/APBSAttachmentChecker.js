"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
exports.APBSAttachmentChecker = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const Logging_1 = require("../Enums/Logging");
const APBSLogger_1 = require("./APBSLogger");
const VanillaItemLists_1 = require("../Globals/VanillaItemLists");
let APBSAttachmentChecker = class APBSAttachmentChecker {
    database;
    apbsLogger;
    itemHelper;
    vanillaAttachmentList = [];
    constructor(database, apbsLogger, itemHelper) {
        this.database = database;
        this.apbsLogger = apbsLogger;
        this.itemHelper = itemHelper;
    }
    buildVanillaAttachmentList() {
        const items = this.database.getTables().templates.items;
        const itemValues = Object.values(items);
        const attachments = itemValues.filter(x => this.itemHelper.isOfBaseclass(x._id, BaseClasses_1.BaseClasses.MOD));
        for (const item in attachments) {
            this.vanillaAttachmentList.push(attachments[item]._id);
        }
        this.apbsLogger.log(Logging_1.Logging.DEBUG, `${JSON.stringify(this.vanillaAttachmentList)}`);
    }
    isVanillaItem(itemID) {
        if (VanillaItemLists_1.vanillaAttachments.includes(itemID))
            return true;
        if (VanillaItemLists_1.vanillaItemsList.includes(itemID))
            return true;
        return false;
    }
};
exports.APBSAttachmentChecker = APBSAttachmentChecker;
exports.APBSAttachmentChecker = APBSAttachmentChecker = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseService")),
    __param(1, (0, tsyringe_1.inject)("APBSLogger")),
    __param(2, (0, tsyringe_1.inject)("ItemHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _b : Object, typeof (_c = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _c : Object])
], APBSAttachmentChecker);
//# sourceMappingURL=APBSAttachmentChecker.js.map