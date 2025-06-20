"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
class Mod {
    static container;
    static updateTimer;
    static config;
    static configPath = path.resolve(__dirname, "../config/config.json");
    static pricesPath = path.resolve(__dirname, "../config/prices.json");
    static blacklistPath = path.resolve(__dirname, "../config/blacklist.json");
    static blacklist;
    static originalPrices;
    async postSptLoadAsync(container) {
        Mod.container = container;
        Mod.config = JSON.parse(fs.readFileSync(Mod.configPath, "utf-8"));
        Mod.blacklist = JSON.parse(fs.readFileSync(Mod.blacklistPath, "utf-8"));
        // Store a clone of the original prices table, so we can make sure things don't go too crazy
        const databaseServer = Mod.container.resolve("DatabaseServer");
        const priceTable = databaseServer.getTables().templates.prices;
        Mod.originalPrices = structuredClone(priceTable);
        // Update prices on startup
        const currentTime = Math.floor(Date.now() / 1000);
        let fetchPrices = false;
        if (currentTime > Mod.config.nextUpdate) {
            fetchPrices = true;
        }
        if (!await Mod.updatePrices(fetchPrices)) {
            return;
        }
        // Setup a refresh interval to update once every hour
        Mod.updateTimer = setInterval(Mod.updatePrices, (60 * 60 * 1000));
    }
    static async updatePrices(fetchPrices = true) {
        const logger = Mod.container.resolve("WinstonLogger");
        const databaseServer = Mod.container.resolve("DatabaseServer");
        const ragfairPriceService = Mod.container.resolve("RagfairPriceService");
        const ragfairConfig = Mod.container.resolve("ConfigServer").getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const traderHelper = Mod.container.resolve("TraderHelper");
        const priceTable = databaseServer.getTables().templates.prices;
        const itemTable = databaseServer.getTables().templates.items;
        const handbookTable = databaseServer.getTables().templates.handbook;
        const gameMode = Mod.config.pvePrices ? "pve" : "regular";
        let prices;
        // Fetch the latest prices.json if we're triggered with fetch enabled, or the prices file doesn't exist
        if (fetchPrices || !fs.existsSync(Mod.pricesPath)) {
            logger.info(`[LiveFleaPrices] Fetching Flea Prices for gamemode ${gameMode}...`);
            try {
                const response = await fetch(`https://raw.githubusercontent.com/DrakiaXYZ/SPT-LiveFleaPriceDB/main/prices-${gameMode}.json`);
                // If the request failed, disable future updating
                if (!response?.ok) {
                    logger.error(`[LiveFleaPrices] Error fetching flea prices: ${response.status} (${response.statusText})`);
                    clearInterval(Mod.updateTimer);
                    return false;
                }
                prices = await response.json();
                // Store the prices to disk for next time
                fs.writeFileSync(Mod.pricesPath, JSON.stringify(prices));
            }
            catch (ex) {
                logger.error(`[LiveFleaPrices] Error fetching flea prices: ${ex}`);
                logger.error("[LiveFleaPrices] This is unlikely due to the mod, and more likely due to a system configuration issue");
                if (fs.existsSync(Mod.pricesPath)) {
                    logger.success("[LiveFleaPrices] Falling back to existing prices file");
                    prices = JSON.parse(fs.readFileSync(Mod.pricesPath, "utf-8"));
                }
                else {
                    logger.error("[LiveFleaPrices] Unable to fetch prices, and no local prices file. Skipping LiveFleaPrices");
                    return;
                }
            }
            // Update config file with the next update time
            Mod.config.nextUpdate = Math.floor(Date.now() / 1000) + 3600;
            fs.writeFileSync(Mod.configPath, JSON.stringify(Mod.config, null, 4));
        }
        // Otherwise, read the file from disk
        else {
            prices = JSON.parse(fs.readFileSync(Mod.pricesPath, "utf-8"));
        }
        // Loop through the new prices file, updating all prices present
        for (const itemId in prices) {
            // Skip any price that doesn't exist in the item table
            if (!itemTable[itemId]) {
                continue;
            }
            // Skip any item that's blacklisted
            if (Mod.blacklist.includes(itemId)) {
                if (Mod.config.debug) {
                    logger.debug(`[LiveFleaPrices] Item ${itemId} was skipped due to it being blacklisted.`);
                }
                continue;
            }
            let basePrice = Mod.originalPrices[itemId];
            if (!basePrice) {
                basePrice = handbookTable.Items.find(x => x.Id === itemId)?.Price ?? 0;
            }
            const maxPrice = basePrice * Mod.config.maxIncreaseMult;
            if (maxPrice !== 0 && (!Mod.config.maxLimiter || prices[itemId] <= maxPrice)) {
                priceTable[itemId] = prices[itemId];
            }
            else {
                if (Mod.config.debug) {
                    logger.debug(`[LiveFleaPrices] Setting ${itemId} to ${maxPrice} instead of ${prices[itemId]} due to over inflation`);
                }
                priceTable[itemId] = maxPrice;
            }
            // Special handling in the event `useTraderPriceForOffersIfHigher` is enabled, to fix issues selling items
            if (ragfairConfig.dynamic.useTraderPriceForOffersIfHigher) {
                // If the trader price is greater than the flea price, set the flea price to 10% higher than the trader price
                const traderPrice = traderHelper.getHighestSellToTraderPrice(itemId);
                if (traderPrice > priceTable[itemId]) {
                    const newPrice = Math.floor(traderPrice * 1.1);
                    if (Mod.config.debug) {
                        logger.debug(`[LiveFleaPrices] Setting ${itemId} to ${newPrice} instead of ${prices[itemId]} due to trader price`);
                    }
                    priceTable[itemId] = newPrice;
                }
            }
        }
        // Refresh dynamic price cache.
        ragfairPriceService.refreshDynamicPrices();
        return true;
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map