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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotEnablementHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Bots_1 = require("../Enums/Bots");
const ModConfig_1 = require("../Globals/ModConfig");
let BotEnablementHelper = class BotEnablementHelper {
    constructor() { }
    doesBotExist(botType) {
        const boss = Object.values(Bots_1.BossBots);
        const follower = Object.values(Bots_1.FollowerBots);
        const pmc = Object.values(Bots_1.PMCBots);
        const scav = Object.values(Bots_1.ScavBots);
        const special = Object.values(Bots_1.SpecialBots);
        const event = Object.values(Bots_1.EventBots);
        if (!boss.includes(botType) && !follower.includes(botType) && !pmc.includes(botType) && !scav.includes(botType) && !special.includes(botType) && !event.includes(botType)) {
            return false;
        }
        return true;
    }
    botDisabled(botType) {
        // Special handling for punisher & legion
        if (botType.toLowerCase() == "bosspunisher" || botType.toLowerCase() == "bosslegion")
            return true;
        // Normal bot types
        if (this.isPMC(botType))
            return !ModConfig_1.ModConfig.config.pmcBots.enable;
        if (this.isScav(botType))
            return !ModConfig_1.ModConfig.config.scavBots.enable;
        if (this.isBoss(botType))
            return !ModConfig_1.ModConfig.config.bossBots.enable;
        if (this.isFollower(botType))
            return !ModConfig_1.ModConfig.config.followerBots.enable;
        if (this.isSpecial(botType))
            return !ModConfig_1.ModConfig.config.specialBots.enable;
        if (this.isEvent(botType))
            return true;
        return false;
    }
    isBoss(botType) {
        return Object.values(Bots_1.BossBots).includes(botType);
    }
    isFollower(botType) {
        return Object.values(Bots_1.FollowerBots).includes(botType);
    }
    isPMC(botType) {
        return Object.values(Bots_1.PMCBots).includes(botType);
    }
    isScav(botType) {
        return Object.values(Bots_1.ScavBots).includes(botType);
    }
    isEvent(botType) {
        return Object.values(Bots_1.EventBots).includes(botType);
    }
    isSpecial(botType) {
        return Object.values(Bots_1.SpecialBots).includes(botType);
    }
};
exports.BotEnablementHelper = BotEnablementHelper;
exports.BotEnablementHelper = BotEnablementHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BotEnablementHelper);
//# sourceMappingURL=BotEnablementHelper.js.map