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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSTester = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const APBSLogger_1 = require("./APBSLogger");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const Logging_1 = require("../Enums/Logging");
let APBSTester = class APBSTester {
    apbsLogger;
    hashUtil;
    itemsToSell = [];
    barterScheme = {};
    loyaltyLevel = {};
    constructor(apbsLogger, hashUtil) {
        this.apbsLogger = apbsLogger;
        this.hashUtil = hashUtil;
    }
    createComplexAssortItem(items) {
        items[0].parentId = "hideout";
        items[0].slotId = "hideout";
        if (!items[0].upd) {
            items[0].upd = {};
        }
        items[0].upd.UnlimitedCount = false;
        items[0].upd.StackObjectsCount = 100;
        this.itemsToSell.push(...items);
        return this;
    }
    addStackCount(stackCount) {
        this.itemsToSell[0].upd.StackObjectsCount = stackCount;
        return this;
    }
    addUnlimitedStackCount() {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;
        this.itemsToSell[0].upd.UnlimitedCount = true;
        return this;
    }
    makeStackCountUnlimited() {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;
        return this;
    }
    addBuyRestriction(maxBuyLimit) {
        this.itemsToSell[0].upd.BuyRestrictionMax = maxBuyLimit;
        this.itemsToSell[0].upd.BuyRestrictionCurrent = 0;
        return this;
    }
    addLoyaltyLevel(level) {
        this.loyaltyLevel[this.itemsToSell[0]._id] = level;
        return this;
    }
    addMoneyCost(currencyType, amount) {
        this.barterScheme[this.itemsToSell[0]._id] = [
            [
                {
                    count: amount,
                    _tpl: currencyType
                }
            ]
        ];
        return this;
    }
    export(data) {
        const itemBeingSoldId = this.itemsToSell[0]._id;
        if (data.assort.items.find(x => x._id === itemBeingSoldId)) {
            this.apbsLogger.log(Logging_1.Logging.WARN, `Unable to add complex item with item key ${this.itemsToSell[0]._id}, key already used`);
            return;
        }
        data.assort.items.push(...this.itemsToSell);
        data.assort.barter_scheme[itemBeingSoldId] = this.barterScheme[itemBeingSoldId];
        data.assort.loyal_level_items[itemBeingSoldId] = this.loyaltyLevel[itemBeingSoldId];
        this.itemsToSell = [];
        this.barterScheme = {};
        this.loyaltyLevel = {};
        return this;
    }
    clearAssort(data) {
        data.assort.items = [];
        data.assort.barter_scheme = {};
        data.assort.loyal_level_items = {};
    }
};
exports.APBSTester = APBSTester;
exports.APBSTester = APBSTester = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("APBSLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __metadata("design:paramtypes", [typeof (_a = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object])
], APBSTester);
//# sourceMappingURL=APBSTester.js.map