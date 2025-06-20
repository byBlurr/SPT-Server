"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepQuickBinds = void 0;
const keepQuickBinds = (container) => {
    const logger = container.resolve("PrimaryLogger");
    const cloner = container.resolve("RecursiveCloner");
    container.afterResolution("InRaidHelper", (_, inRaidHelper) => {
        const original = inRaidHelper.deleteInventory;
        inRaidHelper.deleteInventory = (pmcData, sessionId) => {
            // Copy the existing quickbinds
            const fastPanel = cloner.clone(pmcData.Inventory.fastPanel);
            // Nukes the inventory and the fastpanel
            const result = original.call(inRaidHelper, pmcData, sessionId);
            // Restore the quickbinds for items that still exist
            try {
                for (const index in fastPanel) {
                    if (pmcData.Inventory.items.find(i => i._id == fastPanel[index])) {
                        pmcData.Inventory.fastPanel[index] = fastPanel[index];
                    }
                }
            }
            catch (error) {
                logger.error(`UIFixes: Failed to restore quickbinds\n ${error}`);
            }
            return result;
        };
    }, { frequency: "Always" });
};
exports.keepQuickBinds = keepQuickBinds;
//# sourceMappingURL=keepQuickBinds.js.map