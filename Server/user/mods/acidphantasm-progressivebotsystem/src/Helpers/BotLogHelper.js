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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotLogHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const WeatherGenerator_1 = require("C:/snapshot/project/obj/generators/WeatherGenerator");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const ModInformation_1 = require("../Globals/ModInformation");
const RaidInformation_1 = require("../Globals/RaidInformation");
const APBSTester_1 = require("../Utils/APBSTester");
const Bots_1 = require("../Enums/Bots");
let BotLogHelper = class BotLogHelper {
    itemHelper;
    apbsLogger;
    weatherGenerator;
    raidInformation;
    modInformation;
    databaseService;
    apbsTester;
    profileHelper;
    grenadeList = [
        "5710c24ad2720bc3458b45a3",
        "58d3db5386f77426186285a0",
        "618a431df1eb8e24b8741deb",
        "5448be9a4bdc2dfd2f8b456a",
        "5e32f56fcb6d5863cc5e5ee4",
        "5e340dcdcb6d5863cc5e5efb",
        "617fd91e5539a84ec44ce155"
    ];
    constructor(itemHelper, apbsLogger, weatherGenerator, raidInformation, modInformation, databaseService, apbsTester, profileHelper) {
        this.itemHelper = itemHelper;
        this.apbsLogger = apbsLogger;
        this.weatherGenerator = weatherGenerator;
        this.raidInformation = raidInformation;
        this.modInformation = modInformation;
        this.databaseService = databaseService;
        this.apbsTester = apbsTester;
        this.profileHelper = profileHelper;
    }
    logLocation(info) {
        this.raidInformation.location = info.location;
        const gameTime = this.weatherGenerator.calculateGameTime({ acceleration: 0, time: "", date: "", weather: undefined, season: 1 }).time;
        if (info.timeVariant === "PAST")
            this.raidInformation.currentTime = this.parseTime(gameTime, 12, info.location);
        if (info.timeVariant === "CURR")
            this.raidInformation.currentTime = this.parseTime(gameTime, 0, info.location);
        this.raidInformation.nightTime = this.isNight(this.raidInformation.currentTime);
        this.apbsLogger.log(Logging_1.Logging.WARN, "---Raid Information---");
        this.apbsLogger.log(Logging_1.Logging.WARN, `Location: ${this.raidInformation.location}`);
        this.apbsLogger.log(Logging_1.Logging.WARN, `Time: ${this.raidInformation.currentTime}`);
        this.apbsLogger.log(Logging_1.Logging.WARN, `Night: ${this.raidInformation.nightTime}`);
    }
    parseTime(time, hourDiff, location) {
        if (location == "factory4_night") {
            return "03:28";
        }
        else if (location == "factory4_day" || location == "laboratory") {
            return "15:28";
        }
        else {
            const [hours, minutes] = time.split(":");
            if (hourDiff == 12 && parseInt(hours) >= 12) {
                return `${Math.abs(parseInt(hours) - hourDiff)}:${minutes}`;
            }
            if (hourDiff == 12 && parseInt(hours) < 12) {
                return `${Math.abs(parseInt(hours) + hourDiff)}:${minutes}`;
            }
            return `${hours}:${minutes}`;
        }
    }
    isNight(time) {
        const [hours, minutes] = time.split(":");
        if (parseInt(hours) >= 5 && parseInt(hours) < 20) {
            return false;
        }
        else {
            return true;
        }
    }
    logBotGeneration(outputJSON) {
        for (let i = 0; i < outputJSON.data.length; i++) {
            const botDetails = this.getBotDetails(outputJSON.data[i]);
            const logMessages = this.getLogMessage(botDetails);
            const botRole = botDetails.role.toLowerCase();
            const enabledStringText = this.raidInformation.isBotEnabled(botRole) ? "APBS Bot" : "Vanilla Bot";
            let logged = false;
            if (Object.values(Bots_1.BossBots).includes(botRole) || Object.values(Bots_1.FollowerBots).includes(botRole)) {
                logged = true;
                this.apbsLogger.log(Logging_1.Logging.BOSS, `[${enabledStringText}]----------------------------------------------Bot spawned from cache-----------------------------------------------------`, `| ${logMessages[0]}`, `| ${logMessages[1]}`, `| ${logMessages[2]} ${logMessages[3]}`);
            }
            if (Object.values(Bots_1.PMCBots).includes(botRole)) {
                logged = true;
                this.apbsLogger.log(Logging_1.Logging.PMC, `[${enabledStringText}]----------------------------------------------Bot spawned from cache-----------------------------------------------------`, `| ${logMessages[0]}`, `| ${logMessages[1]}`, `| ${logMessages[2]} ${logMessages[3]}`);
            }
            if (Object.values(Bots_1.ScavBots).includes(botRole)) {
                logged = true;
                this.apbsLogger.log(Logging_1.Logging.SCAV, `[${enabledStringText}]----------------------------------------------Bot spawned from cache-----------------------------------------------------`, `| ${logMessages[0]}`, `| ${logMessages[1]}`, `| ${logMessages[2]} ${logMessages[3]}`);
            }
            if (Object.values(Bots_1.SpecialBots).includes(botRole)) {
                logged = true;
                this.apbsLogger.log(Logging_1.Logging.SPECIAL, `[${enabledStringText}]----------------------------------------------Bot spawned from cache-----------------------------------------------------`, `| ${logMessages[0]}`, `| ${logMessages[1]}`, `| ${logMessages[2]} ${logMessages[3]}`);
            }
            if (Object.values(Bots_1.EventBots).includes(botRole)) {
                logged = true;
                this.apbsLogger.log(Logging_1.Logging.EVENT, `[${enabledStringText}]----------------------------------------------Bot spawned from cache-----------------------------------------------------`, `| ${logMessages[0]}`, `| ${logMessages[1]}`, `| ${logMessages[2]} ${logMessages[3]}`);
            }
            if (!logged)
                this.apbsLogger.log(Logging_1.Logging.ERR, `Logging failed for: ${botRole} - Unknown bot role`);
        }
    }
    getBotDetails(detailsJSON) {
        let primaryID;
        let primaryCaliberID;
        let secondaryID;
        let secondaryCaliberID;
        let holsterID;
        let holsterCaliberID;
        let helmetID;
        let nvgID;
        let earProID;
        let armourVestID;
        let frontPlateID;
        let backPlateID;
        let lSidePlateID;
        let rSidePlateID;
        let scabbardID;
        let canHavePlates = false;
        const botDetails = detailsJSON.Inventory.items;
        let grenadeCount = 0;
        for (const item in botDetails) {
            if (this.grenadeList.includes(botDetails[item]._tpl))
                grenadeCount++;
        }
        const primaryWeapon = botDetails.find(e => e.slotId === "FirstPrimaryWeapon");
        if (typeof primaryWeapon !== "undefined") {
            primaryID = this.itemHelper.getItemName(primaryWeapon._tpl);
            const primaryCaliber = botDetails.find(e => e.slotId === "patron_in_weapon" && e.parentId == primaryWeapon._id);
            if (typeof primaryCaliber !== "undefined") {
                primaryCaliberID = this.itemHelper.getItemName(primaryCaliber._tpl);
            }
        }
        const secondaryWeapon = botDetails.find(e => e.slotId === "SecondPrimaryWeapon");
        if (typeof secondaryWeapon !== "undefined") {
            secondaryID = this.itemHelper.getItemName(secondaryWeapon._tpl);
            const secondaryCaliber = botDetails.find(e => e.slotId === "patron_in_weapon" && e.parentId == secondaryWeapon._id);
            if (typeof secondaryCaliber !== "undefined") {
                secondaryCaliberID = this.itemHelper.getItemName(secondaryCaliber._tpl);
            }
        }
        const holster = botDetails.find(e => e.slotId === "Holster");
        if (typeof holster !== "undefined") {
            holsterID = this.itemHelper.getItemName(holster._tpl);
            const holsterCaliber = botDetails.find(e => e.slotId === "patron_in_weapon" && e.parentId == holster._id);
            if (typeof holsterCaliber !== "undefined") {
                holsterCaliberID = this.itemHelper.getItemName(holsterCaliber._tpl);
            }
        }
        const helmet = botDetails.find(e => e.slotId === "Headwear");
        if (typeof helmet !== "undefined") {
            helmetID = this.itemHelper.getItemName(helmet._tpl);
        }
        const nvg = botDetails.find(e => e.slotId === "mod_nvg" && "upd" in e);
        if (typeof nvg !== "undefined") {
            nvgID = this.itemHelper.getItemName(nvg._tpl);
        }
        const earPro = botDetails.find(e => e.slotId === "Earpiece");
        if (typeof earPro !== "undefined") {
            earProID = this.itemHelper.getItemName(earPro._tpl);
        }
        const scabbard = botDetails.find(e => e.slotId === "Scabbard");
        if (typeof scabbard !== "undefined") {
            scabbardID = this.itemHelper.getItemName(scabbard._tpl);
        }
        const armourVest = botDetails.find(e => e.slotId === "ArmorVest") ?? botDetails.find(e => e.slotId === "TacticalVest");
        if (typeof armourVest !== "undefined") {
            armourVestID = this.itemHelper.getItem(armourVest._tpl);
            if (armourVestID[1]._props.Slots[0]) {
                canHavePlates = true;
                const frontPlate = botDetails.find(e => e.slotId === "Front_plate" && e.parentId == armourVest._id);
                const backPlate = botDetails.find(e => e.slotId === "Back_plate" && e.parentId == armourVest._id);
                const lSidePlate = botDetails.find(e => e.slotId === "Left_side_plate" && e.parentId == armourVest._id);
                const rSidePlate = botDetails.find(e => e.slotId === "Right_side_plate" && e.parentId == armourVest._id);
                if (typeof frontPlate !== "undefined") {
                    frontPlateID = this.itemHelper.getItem(frontPlate._tpl);
                    frontPlateID = frontPlateID[1]._props.armorClass;
                }
                if (typeof backPlate !== "undefined") {
                    backPlateID = this.itemHelper.getItem(backPlate._tpl);
                    backPlateID = backPlateID[1]._props.armorClass;
                }
                if (typeof lSidePlate !== "undefined") {
                    lSidePlateID = this.itemHelper.getItem(lSidePlate._tpl);
                    lSidePlateID = lSidePlateID[1]._props.armorClass;
                }
                if (typeof rSidePlate !== "undefined") {
                    rSidePlateID = this.itemHelper.getItem(rSidePlate._tpl);
                    rSidePlateID = rSidePlateID[1]._props.armorClass;
                }
            }
            armourVestID = this.itemHelper.getItemName(armourVest._tpl);
        }
        return {
            tier: detailsJSON.Info.Tier,
            role: detailsJSON.Info.Settings.Role,
            name: detailsJSON.Info.Nickname,
            level: detailsJSON.Info.Level,
            difficulty: detailsJSON.Info.Settings.BotDifficulty,
            gameVersion: detailsJSON.Info.GameVersion,
            prestigeLevel: detailsJSON.Info.PrestigeLevel,
            primaryID,
            primaryCaliberID,
            secondaryID,
            secondaryCaliberID,
            holsterID,
            holsterCaliberID,
            helmetID,
            nvgID,
            earProID,
            canHavePlates,
            armourVestID,
            frontPlateID,
            backPlateID,
            lSidePlateID,
            rSidePlateID,
            scabbardID,
            grenadeCount
        };
    }
    getLogMessage(botDetails) {
        const removeNoneValues = value => !["None"].some(element => value.includes(element));
        const removeNonArmouredRigs = value => !["Armour/Rig:"].some(element => value.includes(element));
        let realMessage1;
        let realMessage2;
        let realMessage3;
        let realMessage4;
        let temporaryMessage1 = [
            `Tier: ${botDetails.tier}`,
            `Role: ${botDetails.role}`,
            `Nickname: ${botDetails.name}`,
            `Level: ${botDetails.level}`,
            `Difficulty: ${botDetails.difficulty}`,
            `GameVersion: ${botDetails.gameVersion || "None"}`,
            `Prestige: ${botDetails.prestigeLevel || "None"}`,
            `Grenades: ${botDetails.grenadeCount >= 1 ? botDetails.grenadeCount : "None"}`
        ];
        let temporaryMessage2 = [
            `Primary: ${botDetails.primaryID ?? "None"}`,
            `Primary Caliber: ${botDetails.primaryCaliberID ?? "None"}`,
            `Secondary: ${botDetails.secondaryID ?? "None"}`,
            `Secondary Caliber: ${botDetails.secondaryCaliberID ?? "None"}`,
            `Holster: ${botDetails.holsterID ?? "None"}`,
            `Holster Caliber: ${botDetails.holsterCaliberID ?? "None"}`,
            `Melee: ${botDetails.scabbardID ?? "None"}`
        ];
        let temporaryMessage3 = [
            `Helmet: ${botDetails.helmetID ?? "None"}`,
            `NVG: ${botDetails.nvgID ?? "None"}`,
            `Ears: ${botDetails.earProID ?? "None"}`,
            `Armour/Rig: ${botDetails.armourVestID ?? "None"}`
        ];
        let temporaryMessage4 = [
            "| Plates:",
            `Front [${botDetails.frontPlateID ?? "None"}]`,
            `Back [${botDetails.backPlateID ?? "None"}]`,
            `Left [${botDetails.lSidePlateID ?? "None"}]`,
            `Right [${botDetails.rSidePlateID ?? "None"}]`
        ];
        temporaryMessage1 = temporaryMessage1.filter(removeNoneValues);
        if (temporaryMessage1?.length) {
            realMessage1 = temporaryMessage1.filter(Boolean).join(" | ");
        }
        realMessage1 = realMessage1 ?? "No Bot Details";
        temporaryMessage2 = temporaryMessage2.filter(removeNoneValues);
        if (temporaryMessage2?.length) {
            realMessage2 = temporaryMessage2.filter(Boolean).join(" | ");
        }
        realMessage2 = realMessage2 ?? "No Weapon Details";
        if (!botDetails.canHavePlates) {
            temporaryMessage3 = temporaryMessage3.filter(removeNonArmouredRigs);
        }
        temporaryMessage3 = temporaryMessage3.filter(removeNoneValues);
        if (temporaryMessage3?.length) {
            realMessage3 = temporaryMessage3.filter(Boolean).join(" | ");
        }
        realMessage3 = realMessage3 ?? "No Gear Details";
        temporaryMessage4 = temporaryMessage4.filter(removeNoneValues);
        if (temporaryMessage4?.length > 1) {
            realMessage4 = temporaryMessage4.filter(Boolean).join(" ");
        }
        realMessage4 = realMessage4 ?? " ";
        return [
            realMessage1,
            realMessage2,
            realMessage3,
            realMessage4
        ];
    }
};
exports.BotLogHelper = BotLogHelper;
exports.BotLogHelper = BotLogHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ItemHelper")),
    __param(1, (0, tsyringe_1.inject)("APBSLogger")),
    __param(2, (0, tsyringe_1.inject)("WeatherGenerator")),
    __param(3, (0, tsyringe_1.inject)("RaidInformation")),
    __param(4, (0, tsyringe_1.inject)("ModInformation")),
    __param(5, (0, tsyringe_1.inject)("DatabaseService")),
    __param(6, (0, tsyringe_1.inject)("APBSTester")),
    __param(7, (0, tsyringe_1.inject)("ProfileHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _a : Object, typeof (_b = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _b : Object, typeof (_c = typeof WeatherGenerator_1.WeatherGenerator !== "undefined" && WeatherGenerator_1.WeatherGenerator) === "function" ? _c : Object, typeof (_d = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _d : Object, typeof (_e = typeof ModInformation_1.ModInformation !== "undefined" && ModInformation_1.ModInformation) === "function" ? _e : Object, typeof (_f = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _f : Object, typeof (_g = typeof APBSTester_1.APBSTester !== "undefined" && APBSTester_1.APBSTester) === "function" ? _g : Object, typeof (_h = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _h : Object])
], BotLogHelper);
//# sourceMappingURL=BotLogHelper.js.map