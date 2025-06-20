"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
const path_1 = __importDefault(require("path"));
class KeysInLoot {
    logger;
    mod;
    modShortName;
    constructor() {
        this.mod = "MusicManiac-KeysInLoot";
        this.modShortName = "KeysInLoot";
    }
    async postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        const logger = this.logger;
        logger.info(`[${this.modShortName}] ${this.mod} started loading`);
        const itemHelper = container.resolve("ItemHelper");
        const db = container.resolve("DatabaseServer");
        const fs = container.resolve("FileSystem");
        const configPath = path_1.default.resolve(__dirname, "../config.jsonc");
        const configFileContent = await fs.read(configPath);
        const configString = configFileContent.toString();
        const config = jsonc_1.jsonc.parse(configString);
        let tables = db.getTables();
        const itemDB = tables.templates.items;
        const handbookPrices = tables.templates.handbook.Items;
        const fleaPrices = tables.templates.prices;
        let keys = [];
        for (let item in itemDB) {
            const itemId = itemDB[item]._id;
            if (itemDB[item]._type == "Item") {
                if ((itemHelper.isOfBaseclass(itemId, BaseClasses_1.BaseClasses.KEY_MECHANICAL) && config.keyWeight !== 0)
                    || (itemHelper.isOfBaseclass(itemId, BaseClasses_1.BaseClasses.KEYCARD) && config.keycardWeight !== 0)) {
                    keys.push(itemId);
                    const itemToModify = handbookPrices.find(item => item.Id === itemId);
                    if (itemToModify) {
                        itemToModify.Price = Math.round(itemToModify.Price * config.keyTraderPricesMultiplier);
                    }
                    if (fleaPrices[itemId]) {
                        fleaPrices[itemId] = Math.round(fleaPrices[itemId] * config.keyFleaPricesMultiplier);
                    }
                }
            }
        }
        let adjustedWeights = 0;
        let addedKeys = 0;
        const maps = ["bigmap", "factory4_day", "factory4_night", "interchange", "laboratory", "lighthouse", "rezervbase", "sandbox", "sandbox_high", "shoreline", "tarkovstreets", "woods"];
        for (const map of maps) {
            for (const key of keys) {
                let configWeight = 0;
                if (itemHelper.isOfBaseclass(key, BaseClasses_1.BaseClasses.KEY_MECHANICAL)) {
                    configWeight = config.keyWeight;
                }
                else {
                    configWeight = config.keycardWeight;
                }
                try {
                    if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["578f8778245977358849a9b5"]) {
                        const jacket = tables.locations[map].staticLoot["578f8778245977358849a9b5"];
                        const foundKeyJacket = jacket.itemDistribution.find(item => item.tpl === key);
                        if (foundKeyJacket) {
                            if (foundKeyJacket.relativeProbability < configWeight) {
                                foundKeyJacket.relativeProbability = configWeight;
                                adjustedWeights++;
                            }
                        }
                        else {
                            jacket.itemDistribution.push({
                                tpl: key,
                                relativeProbability: configWeight
                            });
                            addedKeys++;
                        }
                        if (config.overrideLootDistribution) {
                            jacket.itemcountDistribution = config.overRideLootDistributionJackets;
                        }
                    }
                }
                catch (error) {
                    console.error(`Error processing jacket on map ${map}`, error);
                }
                try {
                    if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["578f87a3245977356274f2cb"]) {
                        const duffleBag = tables.locations[map].staticLoot["578f87a3245977356274f2cb"];
                        const foundKeyDuffle = duffleBag.itemDistribution.find(item => item.tpl === key);
                        if (foundKeyDuffle) {
                            if (foundKeyDuffle.relativeProbability < configWeight) {
                                foundKeyDuffle.relativeProbability = configWeight;
                                adjustedWeights++;
                            }
                        }
                        else {
                            duffleBag.itemDistribution.push({
                                tpl: key,
                                relativeProbability: configWeight
                            });
                            addedKeys++;
                        }
                        if (config.overrideLootDistribution) {
                            duffleBag.itemcountDistribution = config.overRideLootDistributionDuffleBags;
                        }
                    }
                }
                catch (error) {
                    console.error(`Error processing dufflebag on map ${map}`, error);
                }
                try {
                    if (tables.locations[map] && tables.locations[map].staticLoot && tables.locations[map].staticLoot["5909e4b686f7747f5b744fa4"]) {
                        const deadScav = tables.locations[map].staticLoot["5909e4b686f7747f5b744fa4"];
                        const foundDeadScav = deadScav.itemDistribution.find(item => item.tpl === key);
                        if (foundDeadScav) {
                            if (foundDeadScav.relativeProbability < configWeight) {
                                foundDeadScav.relativeProbability = configWeight;
                                adjustedWeights++;
                            }
                        }
                        else {
                            deadScav.itemDistribution.push({
                                tpl: key,
                                relativeProbability: configWeight
                            });
                            addedKeys++;
                        }
                        if (config.overrideLootDistribution) {
                            deadScav.itemcountDistribution = config.overRideLootDistributionDeadScavs;
                        }
                    }
                }
                catch (error) {
                    console.error(`Error processing deadScav on map ${map}`, error);
                }
            }
        }
        logger.info(`[${this.modShortName}] ${adjustedWeights} keys weights were adjusted`);
        logger.info(`[${this.modShortName}] different keys were added ${addedKeys} times to jacket/duffle/dead scav loot`);
        itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsH = config.cellsH;
        itemDB["578f8778245977358849a9b5"]._props.Grids[0]._props.cellsV = config.cellsV;
        logger.success(`[${this.modShortName}] ${this.mod} finished loading`);
    }
}
module.exports = { mod: new KeysInLoot() };
//# sourceMappingURL=mod.js.map