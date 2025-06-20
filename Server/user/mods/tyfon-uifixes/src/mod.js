"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const assortUnlocks_1 = require("./assortUnlocks");
const keepQuickBinds_1 = require("./keepQuickBinds");
const linkedSlotSearch_1 = require("./linkedSlotSearch");
const putToolsBack_1 = require("./putToolsBack");
const config_json_1 = __importDefault(require("../config/config.json"));
class UIFixes {
    preSptLoad(container) {
        // Keep quickbinds for items that aren't actually lost on death
        (0, keepQuickBinds_1.keepQuickBinds)(container);
        // Better tool return - starting production
        if (config_json_1.default.putToolsBack) {
            (0, putToolsBack_1.putToolsBack)(container);
        }
        // Slot-specific linked search
        (0, linkedSlotSearch_1.linkedSlotSearch)(container);
        // Show unlocking quest on locked offers
        (0, assortUnlocks_1.assortUnlocks)(container);
    }
}
exports.mod = new UIFixes();
//# sourceMappingURL=mod.js.map