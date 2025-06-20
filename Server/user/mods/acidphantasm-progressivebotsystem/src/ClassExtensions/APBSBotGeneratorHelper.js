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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotGeneratorHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const ApplicationContext_1 = require("C:/snapshot/project/obj/context/ApplicationContext");
const ContainerHelper_1 = require("C:/snapshot/project/obj/helpers/ContainerHelper");
const DurabilityLimitsHelper_1 = require("C:/snapshot/project/obj/helpers/DurabilityLimitsHelper");
const InventoryHelper_1 = require("C:/snapshot/project/obj/helpers/InventoryHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
/** Handle profile related client events */
let APBSBotGeneratorHelper = class APBSBotGeneratorHelper extends BotGeneratorHelper_1.BotGeneratorHelper {
    logger;
    randomUtil;
    databaseService;
    durabilityLimitsHelper;
    itemHelper;
    inventoryHelper;
    containerHelper;
    applicationContext;
    localisationService;
    configServer;
    constructor(logger, randomUtil, databaseService, durabilityLimitsHelper, itemHelper, inventoryHelper, containerHelper, applicationContext, localisationService, configServer) {
        super(logger, randomUtil, databaseService, durabilityLimitsHelper, itemHelper, inventoryHelper, containerHelper, applicationContext, localisationService, configServer);
        this.logger = logger;
        this.randomUtil = randomUtil;
        this.databaseService = databaseService;
        this.durabilityLimitsHelper = durabilityLimitsHelper;
        this.itemHelper = itemHelper;
        this.inventoryHelper = inventoryHelper;
        this.containerHelper = containerHelper;
        this.applicationContext = applicationContext;
        this.localisationService = localisationService;
        this.configServer = configServer;
    }
    getRandomizedResourceValue(maxResource, randomizationValues) {
        if (!randomizationValues) {
            return maxResource;
        }
        if (this.randomUtil.getChance100(randomizationValues.chanceMaxResourcePercent)) {
            return maxResource;
        }
        // Never let % value fall below 1
        const percentOfValue = Math.max(1, this.randomUtil.getPercentOfValue(randomizationValues.resourcePercent, maxResource, 0));
        return this.randomUtil.getInt(percentOfValue, maxResource);
    }
};
exports.APBSBotGeneratorHelper = APBSBotGeneratorHelper;
exports.APBSBotGeneratorHelper = APBSBotGeneratorHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("RandomUtil")),
    __param(2, (0, tsyringe_1.inject)("DatabaseService")),
    __param(3, (0, tsyringe_1.inject)("DurabilityLimitsHelper")),
    __param(4, (0, tsyringe_1.inject)("ItemHelper")),
    __param(5, (0, tsyringe_1.inject)("InventoryHelper")),
    __param(6, (0, tsyringe_1.inject)("ContainerHelper")),
    __param(7, (0, tsyringe_1.inject)("ApplicationContext")),
    __param(8, (0, tsyringe_1.inject)("LocalisationService")),
    __param(9, (0, tsyringe_1.inject)("ConfigServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _b : Object, typeof (_c = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _c : Object, typeof (_d = typeof DurabilityLimitsHelper_1.DurabilityLimitsHelper !== "undefined" && DurabilityLimitsHelper_1.DurabilityLimitsHelper) === "function" ? _d : Object, typeof (_e = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _e : Object, typeof (_f = typeof InventoryHelper_1.InventoryHelper !== "undefined" && InventoryHelper_1.InventoryHelper) === "function" ? _f : Object, typeof (_g = typeof ContainerHelper_1.ContainerHelper !== "undefined" && ContainerHelper_1.ContainerHelper) === "function" ? _g : Object, typeof (_h = typeof ApplicationContext_1.ApplicationContext !== "undefined" && ApplicationContext_1.ApplicationContext) === "function" ? _h : Object, typeof (_j = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _j : Object, typeof (_k = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _k : Object])
], APBSBotGeneratorHelper);
//# sourceMappingURL=APBSBotGeneratorHelper.js.map