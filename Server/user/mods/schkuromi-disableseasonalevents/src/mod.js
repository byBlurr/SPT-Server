"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
class Mod {
    preSptLoad(container) {
        // get the config server so we can get a config with it
        const configServer = container.resolve("ConfigServer");
        // Request seasonal event config
        const seasonConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.SEASONAL_EVENT);
        // Disable the seasonal event detection
        seasonConfig.enableSeasonalEventDetection = false;
        // extra make sure that events are disabled
        for (const i in seasonConfig.events) {
            seasonConfig.events[i].enabled = false;
        }
        // Log the new seasonal event setting
        console.log("[SCHKRM] Seasonal events are now off.");
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map