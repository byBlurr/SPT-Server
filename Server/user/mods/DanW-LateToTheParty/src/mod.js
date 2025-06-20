"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const config_json_1 = __importDefault(require("../config/config.json"));
const CommonUtils_1 = require("./CommonUtils");
const LootRankingGenerator_1 = require("./LootRankingGenerator");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const modName = "LateToTheParty";
class LateToTheParty {
    commonUtils;
    lootRankingGenerator;
    logger;
    locationConfig;
    inRaidConfig;
    configServer;
    databaseServer;
    databaseTables;
    fileSystem;
    localeService;
    botWeaponGenerator;
    hashUtil;
    originalLooseLootMultipliers;
    originalStaticLootMultipliers;
    preSptLoad(container) {
        const staticRouterModService = container.resolve("StaticRouterModService");
        const dynamicRouterModService = container.resolve("DynamicRouterModService");
        this.logger = container.resolve("WinstonLogger");
        // Get config.json settings for the bepinex plugin
        staticRouterModService.registerStaticRouter(`StaticGetConfig${modName}`, [{
                url: "/LateToTheParty/GetConfig",
                action: async () => {
                    return JSON.stringify(config_json_1.default);
                }
            }], "GetConfig");
        if (!config_json_1.default.enabled) {
            return;
        }
        // Game start
        // Needed to initialize loot ranking generator after any other mods have potentially changed config settings
        staticRouterModService.registerStaticRouter(`StaticAkiGameStart${modName}`, [{
                url: "/client/game/start",
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                action: async (url, info, sessionId, output) => {
                    this.generateLootRankingData(sessionId);
                    return output;
                }
            }], "aki");
        // Get lootRanking.json for loot ranking
        staticRouterModService.registerStaticRouter(`StaticGetLootRankingData${modName}`, [{
                url: "/LateToTheParty/GetLootRankingData",
                action: async () => {
                    return JSON.stringify(this.lootRankingGenerator.getLootRankingDataFromFile());
                }
            }], "GetLootRankingData");
        // Get an array of all car extract names
        staticRouterModService.registerStaticRouter(`StaticGetCarExtractNames${modName}`, [{
                url: "/LateToTheParty/GetCarExtractNames",
                action: async () => {
                    return JSON.stringify(this.inRaidConfig.carExtracts);
                }
            }], "GetCarExtractNames");
        // Adjust the static and loose loot multipliers
        dynamicRouterModService.registerDynamicRouter(`DynamicSetLootMultipliers${modName}`, [{
                url: "/LateToTheParty/SetLootMultiplier/",
                action: async (url) => {
                    const urlParts = url.split("/");
                    const factor = Number(urlParts[urlParts.length - 1]);
                    this.setLootMultipliers(factor);
                    return JSON.stringify({ resp: "OK" });
                }
            }], "SetLootMultiplier");
    }
    postDBLoad(container) {
        this.configServer = container.resolve("ConfigServer");
        this.databaseServer = container.resolve("DatabaseServer");
        this.fileSystem = container.resolve("FileSystemSync");
        this.localeService = container.resolve("LocaleService");
        this.botWeaponGenerator = container.resolve("BotWeaponGenerator");
        this.hashUtil = container.resolve("HashUtil");
        this.locationConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.LOCATION);
        this.inRaidConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.IN_RAID);
        this.databaseTables = this.databaseServer.getTables();
        this.commonUtils = new CommonUtils_1.CommonUtils(this.logger, this.databaseTables, this.localeService);
        if (!config_json_1.default.enabled) {
            this.commonUtils.logInfo("Mod disabled in config.json.");
            return;
        }
        if (!this.doesFileIntegrityCheckPass()) {
            config_json_1.default.enabled = false;
            return;
        }
        this.adjustSPTScavRaidChanges();
    }
    postSptLoad() {
        if (!config_json_1.default.enabled) {
            return;
        }
        // Store the original static and loose loot multipliers
        this.getLootMultipliers();
    }
    adjustSPTScavRaidChanges() {
        this.commonUtils.logInfo("Adjusting SPT Scav-raid changes...");
        for (const map in this.locationConfig.scavRaidTimeSettings.maps) {
            if (config_json_1.default.scav_raid_adjustments.always_spawn_late) {
                this.locationConfig.scavRaidTimeSettings.maps[map].reducedChancePercent = 100;
            }
            if (config_json_1.default.destroy_loot_during_raid.enabled) {
                this.locationConfig.scavRaidTimeSettings.maps[map].reduceLootByPercent = false;
            }
        }
    }
    getLootMultipliers() {
        this.originalLooseLootMultipliers =
            {
                bigmap: this.locationConfig.looseLootMultiplier.bigmap,
                develop: this.locationConfig.looseLootMultiplier.develop,
                factory4_day: this.locationConfig.looseLootMultiplier.factory4_day,
                factory4_night: this.locationConfig.looseLootMultiplier.factory4_night,
                hideout: this.locationConfig.looseLootMultiplier.hideout,
                interchange: this.locationConfig.looseLootMultiplier.interchange,
                laboratory: this.locationConfig.looseLootMultiplier.laboratory,
                lighthouse: this.locationConfig.looseLootMultiplier.lighthouse,
                privatearea: this.locationConfig.looseLootMultiplier.privatearea,
                rezervbase: this.locationConfig.looseLootMultiplier.rezervbase,
                shoreline: this.locationConfig.looseLootMultiplier.shoreline,
                suburbs: this.locationConfig.looseLootMultiplier.suburbs,
                tarkovstreets: this.locationConfig.looseLootMultiplier.tarkovstreets,
                terminal: this.locationConfig.looseLootMultiplier.terminal,
                town: this.locationConfig.looseLootMultiplier.town,
                woods: this.locationConfig.looseLootMultiplier.woods,
                sandbox: this.locationConfig.looseLootMultiplier.sandbox
            };
        this.originalStaticLootMultipliers =
            {
                bigmap: this.locationConfig.staticLootMultiplier.bigmap,
                develop: this.locationConfig.staticLootMultiplier.develop,
                factory4_day: this.locationConfig.staticLootMultiplier.factory4_day,
                factory4_night: this.locationConfig.staticLootMultiplier.factory4_night,
                hideout: this.locationConfig.staticLootMultiplier.hideout,
                interchange: this.locationConfig.staticLootMultiplier.interchange,
                laboratory: this.locationConfig.staticLootMultiplier.laboratory,
                lighthouse: this.locationConfig.staticLootMultiplier.lighthouse,
                privatearea: this.locationConfig.staticLootMultiplier.privatearea,
                rezervbase: this.locationConfig.staticLootMultiplier.rezervbase,
                shoreline: this.locationConfig.staticLootMultiplier.shoreline,
                suburbs: this.locationConfig.staticLootMultiplier.suburbs,
                tarkovstreets: this.locationConfig.staticLootMultiplier.tarkovstreets,
                terminal: this.locationConfig.staticLootMultiplier.terminal,
                town: this.locationConfig.staticLootMultiplier.town,
                woods: this.locationConfig.staticLootMultiplier.woods,
                sandbox: this.locationConfig.staticLootMultiplier.sandbox
            };
    }
    setLootMultipliers(factor) {
        this.commonUtils.logInfo(`Adjusting loot multipliers by a factor of ${factor}...`);
        this.locationConfig.looseLootMultiplier.bigmap = this.originalLooseLootMultipliers.bigmap * factor;
        this.locationConfig.looseLootMultiplier.develop = this.originalLooseLootMultipliers.develop * factor;
        this.locationConfig.looseLootMultiplier.factory4_day = this.originalLooseLootMultipliers.factory4_day * factor;
        this.locationConfig.looseLootMultiplier.factory4_night = this.originalLooseLootMultipliers.factory4_night * factor;
        this.locationConfig.looseLootMultiplier.hideout = this.originalLooseLootMultipliers.hideout * factor;
        this.locationConfig.looseLootMultiplier.interchange = this.originalLooseLootMultipliers.interchange * factor;
        this.locationConfig.looseLootMultiplier.laboratory = this.originalLooseLootMultipliers.laboratory * factor;
        this.locationConfig.looseLootMultiplier.lighthouse = this.originalLooseLootMultipliers.lighthouse * factor;
        this.locationConfig.looseLootMultiplier.privatearea = this.originalLooseLootMultipliers.privatearea * factor;
        this.locationConfig.looseLootMultiplier.rezervbase = this.originalLooseLootMultipliers.rezervbase * factor;
        this.locationConfig.looseLootMultiplier.shoreline = this.originalLooseLootMultipliers.shoreline * factor;
        this.locationConfig.looseLootMultiplier.suburbs = this.originalLooseLootMultipliers.suburbs * factor;
        this.locationConfig.looseLootMultiplier.tarkovstreets = this.originalLooseLootMultipliers.tarkovstreets * factor;
        this.locationConfig.looseLootMultiplier.terminal = this.originalLooseLootMultipliers.terminal * factor;
        this.locationConfig.looseLootMultiplier.town = this.originalLooseLootMultipliers.town * factor;
        this.locationConfig.looseLootMultiplier.woods = this.originalLooseLootMultipliers.woods * factor;
        this.locationConfig.looseLootMultiplier.sandbox = this.originalLooseLootMultipliers.sandbox * factor;
        this.locationConfig.staticLootMultiplier.bigmap = this.originalStaticLootMultipliers.bigmap * factor;
        this.locationConfig.staticLootMultiplier.develop = this.originalStaticLootMultipliers.develop * factor;
        this.locationConfig.staticLootMultiplier.factory4_day = this.originalStaticLootMultipliers.factory4_day * factor;
        this.locationConfig.staticLootMultiplier.factory4_night = this.originalStaticLootMultipliers.factory4_night * factor;
        this.locationConfig.staticLootMultiplier.hideout = this.originalStaticLootMultipliers.hideout * factor;
        this.locationConfig.staticLootMultiplier.interchange = this.originalStaticLootMultipliers.interchange * factor;
        this.locationConfig.staticLootMultiplier.laboratory = this.originalStaticLootMultipliers.laboratory * factor;
        this.locationConfig.staticLootMultiplier.lighthouse = this.originalStaticLootMultipliers.lighthouse * factor;
        this.locationConfig.staticLootMultiplier.privatearea = this.originalStaticLootMultipliers.privatearea * factor;
        this.locationConfig.staticLootMultiplier.rezervbase = this.originalStaticLootMultipliers.rezervbase * factor;
        this.locationConfig.staticLootMultiplier.shoreline = this.originalStaticLootMultipliers.shoreline * factor;
        this.locationConfig.staticLootMultiplier.suburbs = this.originalStaticLootMultipliers.suburbs * factor;
        this.locationConfig.staticLootMultiplier.tarkovstreets = this.originalStaticLootMultipliers.tarkovstreets * factor;
        this.locationConfig.staticLootMultiplier.terminal = this.originalStaticLootMultipliers.terminal * factor;
        this.locationConfig.staticLootMultiplier.town = this.originalStaticLootMultipliers.town * factor;
        this.locationConfig.staticLootMultiplier.woods = this.originalStaticLootMultipliers.woods * factor;
        this.locationConfig.staticLootMultiplier.sandbox = this.originalStaticLootMultipliers.sandbox * factor;
    }
    generateLootRankingData(sessionId) {
        this.lootRankingGenerator = new LootRankingGenerator_1.LootRankingGenerator(this.commonUtils, this.databaseTables, this.fileSystem, this.botWeaponGenerator, this.hashUtil);
        this.lootRankingGenerator.generateLootRankingData(sessionId);
    }
    doesFileIntegrityCheckPass() {
        const path = `${__dirname}/..`;
        if (this.fileSystem.exists(`${path}/log/`)) {
            this.commonUtils.logWarning("Found obsolete log folder 'user\\mods\\DanW-LateToTheParty\\log'. Logs are now saved in 'BepInEx\\plugins\\DanW-LateToTheParty\\log'.");
        }
        if (this.fileSystem.exists(`${path}/../../../BepInEx/plugins/LateToTheParty.dll`)) {
            this.commonUtils.logError("Please remove BepInEx/plugins/LateToTheParty.dll from the previous version of this mod and restart the server, or it will NOT work correctly.");
            return false;
        }
        return true;
    }
}
module.exports = { mod: new LateToTheParty() };
//# sourceMappingURL=mod.js.map