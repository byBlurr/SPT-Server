"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedSlotSearch = void 0;
const linkedSlotSearch = (container) => {
    const logger = container.resolve("PrimaryLogger");
    const itemHelper = container.resolve("ItemHelper");
    const databaseService = container.resolve("DatabaseService");
    container.afterResolution("RagfairLinkedItemService", (_, linkedItemService) => {
        const original = linkedItemService.getLinkedItems;
        linkedItemService.getLinkedItems = linkedSearchId => {
            const [tpl, slotName] = linkedSearchId.split(":", 2);
            if (slotName) {
                logger.info(`UIFixes: Finding items for specific slot ${tpl}:${slotName}`);
                const allItems = databaseService.getItems();
                const resultSet = getSpecificFilter(allItems[tpl], slotName);
                // Default Inventory, for equipment slots
                if (tpl === "55d7217a4bdc2d86028b456d") {
                    const categories = [...resultSet];
                    const items = Object.keys(allItems).filter(tpl => itemHelper.isOfBaseclasses(tpl, categories));
                    // Send the categories along too, some of them might actually be items
                    return new Set(items.concat(categories));
                }
                return resultSet;
            }
            return original.call(linkedItemService, tpl);
        };
    }, { frequency: "Always" });
};
exports.linkedSlotSearch = linkedSlotSearch;
const getSpecificFilter = (item, slotName) => {
    const results = new Set();
    // For whatever reason, all chamber slots have the name "patron_in_weapon"
    const groupName = slotName === "patron_in_weapon" ? "Chambers" : "Slots";
    const group = item._props[groupName] ?? [];
    const sub = group.find(slot => slot._name === slotName);
    for (const filter of sub?._props?.filters ?? []) {
        for (const f of filter.Filter) {
            results.add(f);
        }
    }
    return results;
};
//# sourceMappingURL=linkedSlotSearch.js.map