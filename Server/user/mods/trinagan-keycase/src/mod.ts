/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/brace-style */
import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { Traders } from "@spt/models/enums/Traders";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { ITrader } from "@spt/models/eft/common/tables/ITrader";
import { ILogger } from "@spt/models/spt/utils/ILogger";

import cases from "../config/cases.json"
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

class Mod implements IPostDBLoadMod {
    private HANDBOOK_GEARCASES = "5b5f6fa186f77409407a7eb7";
    ID = "684868d60b032cbbf606d3cf"

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        logger.log("[Key Case] : Mod loading", LogTextColor.GREEN)

        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const dbTables = databaseServer.getTables();

        this.createCase(cases["Key Case"], dbTables);

    }

    createCase(caseConfig, tables) {
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        const itemPrefabPath = "item_container_keys_case.bundle"
        const itemId = this.ID

        const baseItem = tables.templates.items[ItemTpl.CONTAINER_SICC];
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

        const price = caseConfig.flea_price

        handbook.Items.push(
            {
                Id: itemId,
                ParentId: this.HANDBOOK_GEARCASES,
                Price: price
            }
        );

        this.pushToTrader(caseConfig, itemId, tables.traders);
    }

    pushToTrader(caseConfig, itemID: string, dbTraders: Record<string, ITrader>) {
        const traderID = {
            therapist: Traders.THERAPIST,
            ref: Traders.REF
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
                upd:
                {
                    UnlimitedCount: configTraders[i].unlimited_stock,
                    StackObjectsCount: configTraders[i].stock_amount,
                    BuyRestrictionMax: configTraders[i].stock_amount
                }
            });

            const barterTrade: any = [];
            const configBarters = configTraders[i].barter;

            for (const barter in configBarters) {
                barterTrade.push(configBarters[barter]);
            }

            trader.assort.barter_scheme[itemID] = [barterTrade];
            trader.assort.loyal_level_items[itemID] = configTraders[i].trader_loyalty_level;
        }
    }
}

export const mod = new Mod();
