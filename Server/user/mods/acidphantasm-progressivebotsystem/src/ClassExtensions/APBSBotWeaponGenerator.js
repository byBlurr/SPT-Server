"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotWeaponGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const APBSLogger_1 = require("../Utils/APBSLogger");
const BotWeaponGenerator_1 = require("C:/snapshot/project/obj/generators/BotWeaponGenerator");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const RepairService_1 = require("C:/snapshot/project/obj/services/RepairService");
const BotWeaponModLimitService_1 = require("C:/snapshot/project/obj/services/BotWeaponModLimitService");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotEquipmentModGenerator_1 = require("C:/snapshot/project/obj/generators/BotEquipmentModGenerator");
const BotWeaponGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotWeaponGeneratorHelper");
const RaidInformation_1 = require("../Globals/RaidInformation");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const ModConfig_1 = require("../Globals/ModConfig");
const Logging_1 = require("../Enums/Logging");
const APBSTester_1 = require("../Utils/APBSTester");
const ModInformation_1 = require("../Globals/ModInformation");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const APBSBotEquipmentModGenerator_1 = require("./APBSBotEquipmentModGenerator");
const APBSInventoryMagGen_1 = require("../InventoryMagGen/APBSInventoryMagGen");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const Bots_1 = require("../Enums/Bots");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
/** Handle profile related client events */
let APBSBotWeaponGenerator = class APBSBotWeaponGenerator extends BotWeaponGenerator_1.BotWeaponGenerator {
    logger;
    hashUtil;
    databaseService;
    itemHelper;
    weightedRandomHelper;
    botGeneratorHelper;
    randomUtil;
    configServer;
    botWeaponGeneratorHelper;
    botWeaponModLimitService;
    botEquipmentModGenerator;
    localisationService;
    repairService;
    inventoryMagGenComponents;
    cloner;
    apbsLogger;
    apbsTierGetter;
    raidInformation;
    apbsEquipmentGetter;
    apbsTester;
    apbsBotEquipmentModGenerator;
    modInformation;
    apbsInventoryMagGenComponents;
    constructor(logger, hashUtil, databaseService, itemHelper, weightedRandomHelper, botGeneratorHelper, randomUtil, configServer, botWeaponGeneratorHelper, botWeaponModLimitService, botEquipmentModGenerator, localisationService, repairService, inventoryMagGenComponents, cloner, apbsLogger, apbsTierGetter, raidInformation, apbsEquipmentGetter, apbsTester, apbsBotEquipmentModGenerator, modInformation, apbsInventoryMagGenComponents) {
        super(logger, hashUtil, databaseService, itemHelper, weightedRandomHelper, botGeneratorHelper, randomUtil, configServer, botWeaponGeneratorHelper, botWeaponModLimitService, botEquipmentModGenerator, localisationService, repairService, inventoryMagGenComponents, cloner);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.databaseService = databaseService;
        this.itemHelper = itemHelper;
        this.weightedRandomHelper = weightedRandomHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.randomUtil = randomUtil;
        this.configServer = configServer;
        this.botWeaponGeneratorHelper = botWeaponGeneratorHelper;
        this.botWeaponModLimitService = botWeaponModLimitService;
        this.botEquipmentModGenerator = botEquipmentModGenerator;
        this.localisationService = localisationService;
        this.repairService = repairService;
        this.inventoryMagGenComponents = inventoryMagGenComponents;
        this.cloner = cloner;
        this.apbsLogger = apbsLogger;
        this.apbsTierGetter = apbsTierGetter;
        this.raidInformation = raidInformation;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTester = apbsTester;
        this.apbsBotEquipmentModGenerator = apbsBotEquipmentModGenerator;
        this.modInformation = modInformation;
        this.apbsInventoryMagGenComponents = apbsInventoryMagGenComponents;
    }
    apbsGenerateRandomWeapon(sessionId, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc, botLevel, tierNumber, hasBothPrimary, questInformation) {
        if (!questInformation.isQuesting || equipmentSlot == EquipmentSlots_1.EquipmentSlots.HOLSTER || questInformation.questData.PrimaryWeapon.length === 0) {
            const weaponTpl = (hasBothPrimary && isPmc)
                ? this.apbsPickWeightedWeaponTplFromPoolHasBothPrimary(equipmentSlot, botRole, tierNumber)
                : this.apbsPickWeightedWeaponTplFromPool(equipmentSlot, botRole, tierNumber);
            return this.apbsGenerateWeaponByTpl(sessionId, weaponTpl, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc, botLevel, tierNumber, questInformation);
        }
        const questWeaponTpl = hasBothPrimary
            ? this.apbsPickWeightedWeaponTplFromQuestPoolBothPrimary(equipmentSlot, botRole, tierNumber, questInformation)
            : this.apbsPickWeightedWeaponTplFromQuestPool(equipmentSlot, botRole, tierNumber, questInformation);
        return this.apbsGenerateWeaponByTpl(sessionId, questWeaponTpl, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc, botLevel, tierNumber, questInformation);
    }
    apbsPickWeightedWeaponTplFromQuestPool(equipmentSlot, botRole, tierInfo, questInformation) {
        const newEquipmentPool = {};
        for (const item in questInformation.questData.PrimaryWeapon) {
            const itemTPL = questInformation.questData.PrimaryWeapon[item];
            newEquipmentPool[itemTPL] = 1;
        }
        return this.weightedRandomHelper.getWeightedValue(newEquipmentPool);
    }
    apbsPickWeightedWeaponTplFromQuestPoolBothPrimary(equipmentSlot, botRole, tierInfo, questInformation) {
        const newEquipmentPool = {};
        // Specific to Fishing Gear - put the SV-98 in the second primary weapon slot
        if (questInformation.questData.questName == "Fishing Gear") {
            if (equipmentSlot == EquipmentSlots_1.EquipmentSlots.SECOND_PRIMARY_WEAPON) {
                for (const item in questInformation.questData.PrimaryWeapon) {
                    const itemTPL = questInformation.questData.PrimaryWeapon[item];
                    newEquipmentPool[itemTPL] = 1;
                }
                return this.weightedRandomHelper.getWeightedValue(newEquipmentPool);
            }
            const rangeType = this.weightedRandomHelper.getWeightedValue(this.raidInformation.mapWeights[this.raidInformation.location]);
            const weaponPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(botRole, tierInfo, equipmentSlot, rangeType);
            return this.weightedRandomHelper.getWeightedValue(weaponPool);
        }
        let range;
        if (questInformation.questData.requiredEquipmentSlots.includes("ShortRange"))
            range = "ShortRange";
        else
            range = "LongRange";
        // All other quests, put the required weapon in the primary weapon slot
        if (equipmentSlot == EquipmentSlots_1.EquipmentSlots.SECOND_PRIMARY_WEAPON) {
            const weaponPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(botRole, tierInfo, equipmentSlot, range);
            return this.weightedRandomHelper.getWeightedValue(weaponPool);
        }
        for (const item in questInformation.questData.PrimaryWeapon) {
            const itemTPL = questInformation.questData.PrimaryWeapon[item];
            newEquipmentPool[itemTPL] = 1;
        }
        return this.weightedRandomHelper.getWeightedValue(newEquipmentPool);
    }
    apbsPickWeightedWeaponTplFromPoolHasBothPrimary(equipmentSlot, botRole, tierInfo) {
        let rangeType = "ShortRange";
        if (equipmentSlot == EquipmentSlots_1.EquipmentSlots.FIRST_PRIMARY_WEAPON) {
            if (this.raidInformation.location == "Woods")
                rangeType = "LongRange";
            const weaponPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(botRole, tierInfo, equipmentSlot, rangeType);
            return this.weightedRandomHelper.getWeightedValue(weaponPool);
        }
        if (equipmentSlot == EquipmentSlots_1.EquipmentSlots.SECOND_PRIMARY_WEAPON) {
            if (this.raidInformation.location != "Woods")
                rangeType = "LongRange";
            const weaponPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(botRole, tierInfo, equipmentSlot, rangeType);
            return this.weightedRandomHelper.getWeightedValue(weaponPool);
        }
        const weaponPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(botRole, tierInfo, equipmentSlot);
        return this.weightedRandomHelper.getWeightedValue(weaponPool);
    }
    apbsPickWeightedWeaponTplFromPool(equipmentSlot, botRole, tierInfo) {
        if (equipmentSlot == EquipmentSlots_1.EquipmentSlots.FIRST_PRIMARY_WEAPON || equipmentSlot == EquipmentSlots_1.EquipmentSlots.SECOND_PRIMARY_WEAPON) {
            const rangeType = this.weightedRandomHelper.getWeightedValue(this.raidInformation.mapWeights[this.raidInformation.location]);
            const weaponPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(botRole, tierInfo, equipmentSlot, rangeType);
            return this.weightedRandomHelper.getWeightedValue(weaponPool);
        }
        const weaponPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(botRole, tierInfo, equipmentSlot);
        return this.weightedRandomHelper.getWeightedValue(weaponPool);
    }
    apbsGenerateWeaponByTpl(sessionId, weaponTpl, equipmentSlot, botTemplateInventory, weaponParentId, modChances, botRole, isPmc, botLevel, tierInfo, questInformation) {
        const modPool = this.apbsEquipmentGetter.getModsByBotRole(botRole, tierInfo);
        let weaponChances = modChances.weaponMods;
        const weaponItemTemplate = this.itemHelper.getItem(weaponTpl)[1];
        if (ModConfig_1.ModConfig.config.generalConfig.enablePerWeaponTypeAttachmentChances) {
            switch (weaponItemTemplate._parent) {
                case "5447b5fc4bdc2d87278b4567":
                    weaponChances = modChances.assaultCarbine;
                    break;
                case "5447b6254bdc2dc3278b4568":
                    weaponChances = modChances.sniperRifle;
                    break;
                case "5447b6194bdc2d67278b4567":
                    weaponChances = modChances.marksmanRifle;
                    break;
                case "5447b5f14bdc2d61278b4567":
                    weaponChances = modChances.assaultRifle;
                    break;
                case "5447bed64bdc2d97278b4568":
                    weaponChances = modChances.machinegun;
                    break;
                case "5447b5e04bdc2d62278b4567":
                    weaponChances = modChances.smg;
                    break;
                case "5447b5cf4bdc2d65278b4567":
                    weaponChances = modChances.handgun;
                    break;
                case "617f1ef5e8b54b0998387733":
                    weaponChances = modChances.revolver;
                    break;
                case "5447b6094bdc2dc3278b4567":
                    weaponChances = modChances.shotgun;
                    break;
                case "5447bedf4bdc2d87278b4568":
                    weaponChances = modChances.weaponMods;
                    break;
                default:
                    weaponChances = modChances.weaponMods;
                    this.apbsLogger.log(Logging_1.Logging.WARN, `ItemTemplate._parent is missing classification - Report to acidphantasm - ${weaponItemTemplate._parent}`);
                    break;
            }
        }
        if (!weaponItemTemplate) {
            this.logger.error(this.localisationService.getText("bot-missing_item_template", weaponTpl));
            this.logger.error(`WeaponSlot -> ${equipmentSlot}`);
            return;
        }
        // Find ammo to use when filling magazines/chamber
        if (!botTemplateInventory.Ammo) {
            this.logger.error(this.localisationService.getText("bot-no_ammo_found_in_bot_json", botRole));
            throw new Error(this.localisationService.getText("bot-generation_failed"));
        }
        const ammoTable = this.apbsEquipmentGetter.getAmmoByBotRole(botRole, tierInfo);
        const ammoTpl = this.apbsGetWeightedCompatibleAmmo(ammoTable, weaponItemTemplate);
        // Create with just base weapon item
        let weaponWithModsArray = this.constructWeaponBaseArray(weaponTpl, weaponParentId, equipmentSlot, weaponItemTemplate, botRole);
        let weaponEnhancementChance = 0;
        if (this.raidInformation.isBotEnabled(botRole)) {
            if (Object.values(Bots_1.PMCBots).includes(botRole)) {
                weaponEnhancementChance = ModConfig_1.ModConfig.config.pmcBots.weaponDurability.enhancementChance;
            }
            if (Object.values(Bots_1.ScavBots).includes(botRole)) {
                weaponEnhancementChance = ModConfig_1.ModConfig.config.scavBots.weaponDurability.enhancementChance;
            }
            if (Object.values(Bots_1.BossBots).includes(botRole)) {
                weaponEnhancementChance = ModConfig_1.ModConfig.config.bossBots.weaponDurability.enhancementChance;
            }
            if (Object.values(Bots_1.FollowerBots).includes(botRole)) {
                weaponEnhancementChance = ModConfig_1.ModConfig.config.followerBots.weaponDurability.enhancementChance;
            }
            if (Object.values(Bots_1.SpecialBots).includes(botRole)) {
                weaponEnhancementChance = ModConfig_1.ModConfig.config.specialBots.weaponDurability.enhancementChance;
            }
        }
        // Chance to add randomised weapon enhancement
        if (this.randomUtil.getChance100(weaponEnhancementChance)) {
            const weaponConfig = this.repairConfig.repairKit.weapon;
            this.repairService.addBuff(weaponConfig, weaponWithModsArray[0]);
        }
        // Add mods to weapon base
        if (Object.keys(modPool).includes(weaponTpl)) {
            const botEquipmentRole = this.botGeneratorHelper.getBotEquipmentRole(botRole);
            const modLimits = this.botWeaponModLimitService.getWeaponModLimits(botEquipmentRole);
            if (this.itemHelper.isOfBaseclass(weaponTpl, BaseClasses_1.BaseClasses.PISTOL)) {
                modLimits.scopeMax = 1;
            }
            const generateWeaponModsRequest = {
                weapon: weaponWithModsArray, // Will become hydrated array of weapon + mods
                modPool: modPool,
                weaponId: weaponWithModsArray[0]._id, // Weapon root id
                parentTemplate: weaponItemTemplate,
                modSpawnChances: weaponChances,
                ammoTpl: ammoTpl,
                botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole },
                modLimits: modLimits,
                weaponStats: {},
                conflictingItemTpls: new Set()
            };
            weaponWithModsArray = this.apbsBotEquipmentModGenerator.apbsGenerateModsForWeapon(sessionId, generateWeaponModsRequest, isPmc, questInformation, weaponItemTemplate._id);
        }
        // Use weapon preset from globals.json if weapon isnt valid
        if (!this.isWeaponValid(weaponWithModsArray, botRole)) {
            // Weapon is bad, fall back to weapons preset
            weaponWithModsArray = this.getPresetWeaponMods(weaponTpl, equipmentSlot, weaponParentId, weaponItemTemplate, botRole);
        }
        // Fill existing magazines to full and sync ammo type
        for (const magazine of weaponWithModsArray.filter((item) => item.slotId === this.modMagazineSlotId)) {
            this.fillExistingMagazines(weaponWithModsArray, magazine, ammoTpl);
        }
        // Add cartridge(s) to gun chamber(s)
        if (weaponItemTemplate._props.Chambers?.length > 0
            && weaponItemTemplate._props.Chambers[0]?._props?.filters[0]?.Filter?.includes(ammoTpl)) {
            // Guns have variety of possible Chamber ids, patron_in_weapon/patron_in_weapon_000/patron_in_weapon_001
            const chamberSlotNames = weaponItemTemplate._props.Chambers.map((x) => x._name);
            this.addCartridgeToChamber(weaponWithModsArray, ammoTpl, chamberSlotNames);
        }
        // Fill UBGL if found
        const ubglMod = weaponWithModsArray.find((x) => x.slotId === "mod_launcher");
        let ubglAmmoTpl = undefined;
        if (ubglMod) {
            const ubglTemplate = this.itemHelper.getItem(ubglMod._tpl)[1];
            ubglAmmoTpl = this.apbsGetWeightedCompatibleAmmo(botTemplateInventory.Ammo, ubglTemplate);
            this.fillUbgl(weaponWithModsArray, ubglMod, ubglAmmoTpl);
        }
        // This is for testing...
        if (this.modInformation.testMode && this.modInformation.testBotRole.includes(botRole.toLowerCase())) {
            const tables = this.databaseService.getTables();
            const assortWeapon = this.cloner.clone(weaponWithModsArray);
            for (const item in assortWeapon) {
                const oldID = assortWeapon[item]._id;
                const newID = this.hashUtil.generate();
                assortWeapon[item]._id = newID;
                // Loop array again to fix parentID
                for (const i in assortWeapon) {
                    if (assortWeapon[i].parentId == oldID) {
                        assortWeapon[i].parentId = newID;
                    }
                }
            }
            this.apbsTester.createComplexAssortItem(assortWeapon)
                .addStackCount(1)
                .addMoneyCost(Money_1.Money.ROUBLES, botLevel)
                .addBuyRestriction(1)
                .addLoyaltyLevel(1)
                .export(tables.traders[this.modInformation.testTrader]);
        }
        return {
            weapon: weaponWithModsArray,
            chosenAmmoTpl: ammoTpl,
            chosenUbglAmmoTpl: ubglAmmoTpl,
            weaponMods: modPool,
            weaponTemplate: weaponItemTemplate
        };
    }
    apbsAddExtraMagazinesToInventory(generatedWeaponResult, magWeights, inventory, botRole, botLevel, tier) {
        const weaponAndMods = generatedWeaponResult.weapon;
        const weaponTemplate = generatedWeaponResult.weaponTemplate;
        const magazineTpl = this.getMagazineTplFromWeaponTemplate(weaponAndMods, weaponTemplate, botRole);
        const magTemplate = this.itemHelper.getItem(magazineTpl)[1];
        if (!magTemplate) {
            this.logger.error(this.localisationService.getText("bot-unable_to_find_magazine_item", magazineTpl));
            return;
        }
        const ammoTemplate = this.itemHelper.getItem(generatedWeaponResult.chosenAmmoTpl)[1];
        if (!ammoTemplate) {
            this.logger.error(this.localisationService.getText("bot-unable_to_find_ammo_item", generatedWeaponResult.chosenAmmoTpl));
            return;
        }
        // Has an UBGL
        if (generatedWeaponResult.chosenUbglAmmoTpl) {
            this.addUbglGrenadesToBotInventory(weaponAndMods, generatedWeaponResult, inventory);
        }
        const apbsInventoryMagGenModel = new APBSInventoryMagGen_1.APBSInventoryMagGen(magWeights, magTemplate, weaponTemplate, ammoTemplate, inventory, botRole, botLevel, tier, this.getToploadConfig(botRole), this.getRerollConfig(botRole));
        this.apbsInventoryMagGenComponents
            .find((v) => v.canHandleInventoryMagGen(apbsInventoryMagGenModel))
            .process(apbsInventoryMagGenModel);
        // Add x stacks of bullets to SecuredContainer (bots use a magic mag packing skill to reload instantly)
        this.addAmmoToSecureContainer(this.botConfig.secureContainerAmmoStackCount, generatedWeaponResult.chosenAmmoTpl, ammoTemplate._props.StackMaxSize, inventory);
    }
    // I'm only overriding this so I can get the ID and not the name because most custom item mods don't change this.
    isWeaponValid(weaponItemArray, botRole) {
        for (const mod of weaponItemArray) {
            const modTemplate = this.itemHelper.getItem(mod._tpl)[1];
            if (!modTemplate._props.Slots?.length) {
                continue;
            }
            // Iterate over required slots in db item, check mod exists for that slot
            for (const modSlotTemplate of modTemplate._props.Slots.filter((slot) => slot._required)) {
                const slotName = modSlotTemplate._name;
                const hasWeaponSlotItem = weaponItemArray.some((weaponItem) => weaponItem.parentId === mod._id && weaponItem.slotId === slotName);
                if (!hasWeaponSlotItem) {
                    this.logger.warning(this.localisationService.getText("bot-weapons_required_slot_missing_item", {
                        modSlot: modSlotTemplate._name,
                        modName: modTemplate._id,
                        slotId: mod.slotId,
                        botRole: botRole
                    }));
                    return false;
                }
            }
        }
        return true;
    }
    apbsGetWeightedCompatibleAmmo(cartridgePool, weaponTemplate) {
        let desiredCaliber = this.getWeaponCaliber(weaponTemplate);
        if ((weaponTemplate._id == "67a01e4ea2b82626b73d10a3" || weaponTemplate._id == "67a01e4ea2b82626b73d10a4")) {
            if (this.randomUtil.getChance100(50)) {
                desiredCaliber = "Caliber762x39";
            }
        }
        let cartridgePoolForWeapon = cartridgePool[desiredCaliber];
        if (!cartridgePoolForWeapon || cartridgePoolForWeapon?.length === 0) {
            this.logger.debug(`weapon generation, ${desiredCaliber}`);
            this.logger.debug(this.localisationService.getText("bot-no_caliber_data_for_weapon_falling_back_to_default", {
                weaponId: weaponTemplate._id,
                weaponName: weaponTemplate._name,
                defaultAmmo: weaponTemplate._props.defAmmo
            }));
            // Immediately returns, default ammo is guaranteed to be compatible
            return weaponTemplate._props.defAmmo;
        }
        // Get cartridges the weapons first chamber allow
        const compatibleCartridgesInTemplate = this.getCompatibleCartridgesFromWeaponTemplate(weaponTemplate);
        if (!compatibleCartridgesInTemplate) {
            // No chamber data found in weapon, send default
            return weaponTemplate._props.defAmmo;
        }
        // Inner join the weapons allowed + passed in cartridge pool to get compatible cartridges
        const compatibleCartridges = {};
        for (const cartridge of Object.keys(cartridgePoolForWeapon)) {
            if (compatibleCartridgesInTemplate.includes(cartridge)) {
                compatibleCartridges[cartridge] = cartridgePoolForWeapon[cartridge];
            }
        }
        // If no compatible cartridges found still, get caliber data from magazine in weapon template
        if (Object.keys(compatibleCartridges).length === 0) {
            // Get cartridges from the weapons first magazine in filters
            const compatibleCartridgesInMagazine = this.getCompatibleCartridgesFromMagazineTemplate(weaponTemplate);
            if (compatibleCartridgesInMagazine.length === 0) {
                // No compatible cartridges found in magazine, use default
                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[AMMO] No compatible ammo found for ${weaponTemplate._id}, using weapons default ammo instead.`);
                return weaponTemplate._props.defAmmo;
            }
            // Get the caliber data from the first compatible round in the magazine
            const magazineCaliberData = this.itemHelper.getItem(compatibleCartridgesInMagazine[0])[1]._props.Caliber;
            cartridgePoolForWeapon = cartridgePool[magazineCaliberData];
            for (const cartridge of Object.keys(cartridgePoolForWeapon)) {
                if (compatibleCartridgesInMagazine.includes(cartridge)) {
                    compatibleCartridges[cartridge] = cartridgePoolForWeapon[cartridge];
                }
            }
            // Nothing found after also checking magazines, return default ammo
            if (Object.keys(compatibleCartridges).length === 0) {
                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[AMMO] No compatible ammo found for ${weaponTemplate._id} in last ditch effort, using weapons default ammo instead.`);
                return weaponTemplate._props.defAmmo;
            }
        }
        return this.weightedRandomHelper.getWeightedValue(compatibleCartridges);
    }
    getRerollConfig(botRole) {
        if (Object.values(Bots_1.PMCBots).includes(botRole))
            return ModConfig_1.ModConfig.config.pmcBots.rerollConfig;
        if (Object.values(Bots_1.ScavBots).includes(botRole))
            return ModConfig_1.ModConfig.config.scavBots.rerollConfig;
        if (Object.values(Bots_1.BossBots).includes(botRole))
            return ModConfig_1.ModConfig.config.bossBots.rerollConfig;
        if (Object.values(Bots_1.FollowerBots).includes(botRole))
            return ModConfig_1.ModConfig.config.followerBots.rerollConfig;
        if (Object.values(Bots_1.SpecialBots).includes(botRole))
            return ModConfig_1.ModConfig.config.specialBots.rerollConfig;
        return {
            enable: false,
            chance: 0
        };
    }
    getToploadConfig(botRole) {
        if (Object.values(Bots_1.PMCBots).includes(botRole))
            return ModConfig_1.ModConfig.config.pmcBots.toploadConfig;
        if (Object.values(Bots_1.ScavBots).includes(botRole))
            return ModConfig_1.ModConfig.config.scavBots.toploadConfig;
        if (Object.values(Bots_1.BossBots).includes(botRole))
            return ModConfig_1.ModConfig.config.bossBots.toploadConfig;
        if (Object.values(Bots_1.FollowerBots).includes(botRole))
            return ModConfig_1.ModConfig.config.followerBots.toploadConfig;
        if (Object.values(Bots_1.SpecialBots).includes(botRole))
            return ModConfig_1.ModConfig.config.specialBots.toploadConfig;
        return {
            enable: false,
            chance: 0,
            percent: 0
        };
    }
};
exports.APBSBotWeaponGenerator = APBSBotWeaponGenerator;
exports.APBSBotWeaponGenerator = APBSBotWeaponGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("DatabaseService")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(5, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(6, (0, tsyringe_1.inject)("RandomUtil")),
    __param(7, (0, tsyringe_1.inject)("ConfigServer")),
    __param(8, (0, tsyringe_1.inject)("BotWeaponGeneratorHelper")),
    __param(9, (0, tsyringe_1.inject)("BotWeaponModLimitService")),
    __param(10, (0, tsyringe_1.inject)("BotEquipmentModGenerator")),
    __param(11, (0, tsyringe_1.inject)("LocalisationService")),
    __param(12, (0, tsyringe_1.inject)("RepairService")),
    __param(13, (0, tsyringe_1.injectAll)("InventoryMagGen")),
    __param(14, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(15, (0, tsyringe_1.inject)("APBSLogger")),
    __param(16, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(17, (0, tsyringe_1.inject)("RaidInformation")),
    __param(18, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(19, (0, tsyringe_1.inject)("APBSTester")),
    __param(20, (0, tsyringe_1.inject)("APBSBotEquipmentModGenerator")),
    __param(21, (0, tsyringe_1.inject)("ModInformation")),
    __param(22, (0, tsyringe_1.injectAll)("APBSInventoryMagGen")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _e : Object, typeof (_f = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _f : Object, typeof (_g = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _g : Object, typeof (_h = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _h : Object, typeof (_j = typeof BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper !== "undefined" && BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper) === "function" ? _j : Object, typeof (_k = typeof BotWeaponModLimitService_1.BotWeaponModLimitService !== "undefined" && BotWeaponModLimitService_1.BotWeaponModLimitService) === "function" ? _k : Object, typeof (_l = typeof BotEquipmentModGenerator_1.BotEquipmentModGenerator !== "undefined" && BotEquipmentModGenerator_1.BotEquipmentModGenerator) === "function" ? _l : Object, typeof (_m = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _m : Object, typeof (_o = typeof RepairService_1.RepairService !== "undefined" && RepairService_1.RepairService) === "function" ? _o : Object, Array, typeof (_p = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _p : Object, typeof (_q = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _q : Object, typeof (_r = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _r : Object, typeof (_s = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _s : Object, typeof (_t = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _t : Object, typeof (_u = typeof APBSTester_1.APBSTester !== "undefined" && APBSTester_1.APBSTester) === "function" ? _u : Object, typeof (_v = typeof APBSBotEquipmentModGenerator_1.APBSBotEquipmentModGenerator !== "undefined" && APBSBotEquipmentModGenerator_1.APBSBotEquipmentModGenerator) === "function" ? _v : Object, typeof (_w = typeof ModInformation_1.ModInformation !== "undefined" && ModInformation_1.ModInformation) === "function" ? _w : Object, Array])
], APBSBotWeaponGenerator);
//# sourceMappingURL=APBSBotWeaponGenerator.js.map