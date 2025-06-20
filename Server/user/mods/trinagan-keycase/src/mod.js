"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const ItemTpl_1 = require("C:/snapshot/project/obj/models/enums/ItemTpl");
const cases_json_1 = __importDefault(require("../config/cases.json"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class Mod {
    HANDBOOK_GEARCASES = "5b5f6fa186f77409407a7eb7";
    ID = "684868d60b032cbbf606d3cf";
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        logger.log("[Key Case] : Mod loading", LogTextColor_1.LogTextColor.GREEN);
        const databaseServer = container.resolve("DatabaseServer");
        const dbTables = databaseServer.getTables();
        this.createCase(cases_json_1.default["Key Case"], dbTables);
    }
    createCase(caseConfig, tables) {
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global);
        const itemPrefabPath = "item_container_keys_case.bundle";
        const itemId = this.ID;
        const baseItem = tables.templates.items[ItemTpl_1.ItemTpl.CONTAINER_SICC];
        if (!baseItem) {
            throw new Error("Base item CONTAINER_SICC not found in templates.");
        }
        const item = structuredClone(baseItem);
        item._props.DiscardLimit = 0;
        item._name = caseConfig.item_name;
        item._id = itemId;
        item._props.Prefab.path = itemPrefabPath;
        item._props.Grids = caseConfig.Grids.map((grid) => ({
            _name: "main",
            _id: "key-case-container-grid",
            _parent: "key-case-container",
            _proto: "55d329c24bdc2d892f8b4567",
            _props: {
                cellsH: grid.width,
                cellsV: grid.height,
                filters: [
                    {
                        Filter: grid.included_filter || []
                    }
                ]
            }
        }));
        item._props.Width = caseConfig.ExternalSize.width;
        item._props.Height = caseConfig.ExternalSize.height;
        item._props.Weight = caseConfig.ExternalSize.weight;
        tables.templates.items[itemId] = item;
        for (const locale of locales) {
            locale[`${itemId} Name`] = caseConfig.item_name;
            locale[`${itemId} ShortName`] = caseConfig.item_short_name;
            locale[`${itemId} Description`] = caseConfig.item_description;
        }
        const price = caseConfig.flea_price;
        handbook.Items.push({
            Id: itemId,
            ParentId: this.HANDBOOK_GEARCASES,
            Price: price
        });
        this.pushToTrader(caseConfig, itemId, tables.traders);
    }
    pushToTrader(caseConfig, itemID, dbTraders) {
        const traderID = {
            therapist: Traders_1.Traders.THERAPIST,
            ref: Traders_1.Traders.REF
        };
        const configTraders = caseConfig.traders;
        for (const i in configTraders) {
            let traderToPush = configTraders[i].trader;
            for (const [key, val] of Object.entries(traderID)) {
                if (key === configTraders[i].trader) {
                    traderToPush = val;
                }
            }
            const trader = dbTraders[traderToPush];
            trader.assort.items.push({
                _id: itemID,
                _tpl: itemID,
                parentId: "hideout",
                slotId: "hideout",
                upd: {
                    UnlimitedCount: configTraders[i].unlimited_stock,
                    StackObjectsCount: configTraders[i].stock_amount,
                    BuyRestrictionMax: configTraders[i].stock_amount
                }
            });
            const barterTrade = [];
            const configBarters = configTraders[i].barter;
            for (const barter in configBarters) {
                barterTrade.push(configBarters[barter]);
            }
            trader.assort.barter_scheme[itemID] = [barterTrade];
            trader.assort.loyal_level_items[itemID] = configTraders[i].trader_loyalty_level;
        }
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map