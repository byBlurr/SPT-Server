"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putToolsBack = void 0;
const returnToProperty = "uifixes.returnTo";
const putToolsBack = (container) => {
    const logger = container.resolve("PrimaryLogger");
    const cloner = container.resolve("RecursiveCloner");
    const itemHelper = container.resolve("ItemHelper");
    container.afterResolution("HideoutHelper", (_, hideoutHelper) => {
        const original = hideoutHelper.registerProduction;
        hideoutHelper.registerProduction = (pmcData, body, sessionID) => {
            const result = original.call(hideoutHelper, pmcData, body, sessionID);
            // The items haven't been deleted yet, augment the list with their parentId
            try {
                const bodyAsSingle = body;
                if (bodyAsSingle && bodyAsSingle.tools?.length > 0) {
                    const requestTools = bodyAsSingle.tools;
                    const tools = pmcData.Hideout.Production[body.recipeId].sptRequiredTools;
                    for (let i = 0; i < tools.length; i++) {
                        const originalTool = pmcData.Inventory.items.find(x => x._id === requestTools[i].id);
                        // If the tool is in the stash itself, skip it. Same check as InventoryHelper.isItemInStash
                        if (originalTool.parentId === pmcData.Inventory.stash &&
                            originalTool.slotId === "hideout") {
                            continue;
                        }
                        tools[i][returnToProperty] = [originalTool.parentId, originalTool.slotId];
                    }
                }
            }
            catch (error) {
                logger.error(`UIFixes: Failed to save tool origin\n ${error}`);
            }
            return result;
        };
    }, { frequency: "Always" });
    // Better tool return - returning the tool
    container.afterResolution("InventoryHelper", (_, inventoryHelper) => {
        const original = inventoryHelper.addItemToStash;
        inventoryHelper.addItemToStash = (sessionId, request, pmcData, output) => {
            const itemWithModsToAddClone = cloner.clone(request.itemWithModsToAdd);
            // If a tool marked with uifixes is there, try to return it to its original container
            const tool = itemWithModsToAddClone[0];
            if (tool[returnToProperty]) {
                try {
                    const [containerId, slotId] = tool[returnToProperty];
                    // Clean the item
                    delete tool[returnToProperty];
                    const [foundContainerFS2D, foundSlotId] = findGridFS2DForItems(inventoryHelper, containerId, slotId, itemWithModsToAddClone, pmcData);
                    if (foundContainerFS2D) {
                        // At this point everything should succeed
                        inventoryHelper.placeItemInContainer(foundContainerFS2D, itemWithModsToAddClone, containerId, foundSlotId);
                        // protected function, bypass typescript
                        inventoryHelper["setFindInRaidStatusForItem"](itemWithModsToAddClone, request.foundInRaid);
                        // Add item + mods to output and profile inventory
                        output.profileChanges[sessionId].items.new.push(...itemWithModsToAddClone);
                        pmcData.Inventory.items.push(...itemWithModsToAddClone);
                        logger.debug(`Added ${itemWithModsToAddClone[0].upd?.StackObjectsCount ?? 1} item: ${itemWithModsToAddClone[0]._tpl} with: ${itemWithModsToAddClone.length - 1} mods to ${containerId}`);
                        return;
                    }
                }
                catch (error) {
                    logger.error(`UIFixes: Encounted an error trying to put tool back.\n ${error}`);
                }
                logger.info("UIFixes: Unable to put tool back in its original container, returning it to stash.");
            }
            return original.call(inventoryHelper, sessionId, request, pmcData, output);
        };
    }, { frequency: "Always" });
    function findGridFS2DForItems(inventoryHelper, containerId, startingGrid, items, pmcData) {
        const container = pmcData.Inventory.items.find(x => x._id === containerId);
        if (!container) {
            return;
        }
        const [foundTemplate, containerTemplate] = itemHelper.getItem(container._tpl);
        if (!foundTemplate || !containerTemplate) {
            return;
        }
        let originalGridIndex = containerTemplate._props.Grids.findIndex(g => g._name === startingGrid);
        if (originalGridIndex < 0) {
            originalGridIndex = 0;
        }
        // Loop through grids, starting from the original grid
        for (let gridIndex = originalGridIndex; gridIndex < containerTemplate._props.Grids.length + originalGridIndex; gridIndex++) {
            const grid = containerTemplate._props.Grids[gridIndex % containerTemplate._props.Grids.length];
            const gridItems = pmcData.Inventory.items.filter(x => x.parentId === containerId && x.slotId === grid._name);
            const containerFS2D = inventoryHelper.getContainerMap(grid._props.cellsH, grid._props.cellsV, gridItems, containerId);
            // will change the array so clone it
            if (inventoryHelper.canPlaceItemInContainer(cloner.clone(containerFS2D), items)) {
                return [containerFS2D, grid._name];
            }
        }
    }
};
exports.putToolsBack = putToolsBack;
//# sourceMappingURL=putToolsBack.js.map