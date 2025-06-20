"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assortUnlocks = void 0;
const assortUnlocks = (container) => {
    const logger = container.resolve("PrimaryLogger");
    const staticRouterModService = container.resolve("StaticRouterModService");
    const databaseService = container.resolve("DatabaseService");
    const loadAssortmentUnlocks = () => {
        const traders = databaseService.getTraders();
        const quests = databaseService.getQuests();
        const result = {};
        for (const traderId in traders) {
            const trader = traders[traderId];
            if (trader.questassort) {
                for (const questStatus in trader.questassort) {
                    // Explicitly check that quest status is an expected value - some mods accidently import in such a way that adds a "default" value
                    if (!["started", "success", "fail"].includes(questStatus)) {
                        continue;
                    }
                    for (const assortId in trader.questassort[questStatus]) {
                        const questId = trader.questassort[questStatus][assortId];
                        if (!quests[questId]) {
                            logger.warning(`UIFixes: Trader ${traderId} questassort references unknown quest ${JSON.stringify(questId)}! Check that whatever mod added that trader and/or quest is installed correctly.`);
                            continue;
                        }
                        result[assortId] = quests[questId].name;
                    }
                }
            }
        }
        return result;
    };
    staticRouterModService.registerStaticRouter("UIFixesRoutes", [
        {
            url: "/uifixes/assortUnlocks",
            action: async (url, info, sessionId, output) => {
                return JSON.stringify(loadAssortmentUnlocks());
            }
        }
    ], "custom-static-ui-fixes");
};
exports.assortUnlocks = assortUnlocks;
//# sourceMappingURL=assortUnlocks.js.map