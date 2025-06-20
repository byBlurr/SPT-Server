"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSInventoryMagGen = void 0;
class APBSInventoryMagGen {
    magCounts;
    magazineTemplate;
    weaponTemplate;
    ammoTemplate;
    pmcInventory;
    botRole;
    botLevel;
    tier;
    toploadDetails;
    rerollDetails;
    constructor(magCounts, magazineTemplate, weaponTemplate, ammoTemplate, pmcInventory, botRole, botLevel, tier, toploadDetails, rerollDetails) {
        this.magCounts = magCounts;
        this.magazineTemplate = magazineTemplate;
        this.weaponTemplate = weaponTemplate;
        this.ammoTemplate = ammoTemplate;
        this.pmcInventory = pmcInventory;
        this.botRole = botRole;
        this.botLevel = botLevel;
        this.tier = tier;
        this.toploadDetails = toploadDetails;
        this.rerollDetails = rerollDetails;
    }
    getMagCount() {
        return this.magCounts;
    }
    getMagazineTemplate() {
        return this.magazineTemplate;
    }
    getWeaponTemplate() {
        return this.weaponTemplate;
    }
    getAmmoTemplate() {
        return this.ammoTemplate;
    }
    getPmcInventory() {
        return this.pmcInventory;
    }
    getBotRole() {
        return this.botRole;
    }
    getBotLevel() {
        return this.botLevel;
    }
    getTierNumber() {
        return this.tier;
    }
    getToploadDetails() {
        return this.toploadDetails;
    }
    getRerollDetails() {
        return this.rerollDetails;
    }
}
exports.APBSInventoryMagGen = APBSInventoryMagGen;
//# sourceMappingURL=APBSInventoryMagGen.js.map