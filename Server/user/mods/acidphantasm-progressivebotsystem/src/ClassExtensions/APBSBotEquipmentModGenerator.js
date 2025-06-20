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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotEquipmentModGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const BotWeaponGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotWeaponGeneratorHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const PresetHelper_1 = require("C:/snapshot/project/obj/helpers/PresetHelper");
const ProbabilityHelper_1 = require("C:/snapshot/project/obj/helpers/ProbabilityHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const ModSpawn_1 = require("C:/snapshot/project/obj/models/enums/ModSpawn");
const IFilterPlateModsForSlotByLevelResult_1 = require("C:/snapshot/project/obj/models/spt/bots/IFilterPlateModsForSlotByLevelResult");
const ExhaustableArray_1 = require("C:/snapshot/project/obj/models/spt/server/ExhaustableArray");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const BotEquipmentFilterService_1 = require("C:/snapshot/project/obj/services/BotEquipmentFilterService");
const BotEquipmentModPoolService_1 = require("C:/snapshot/project/obj/services/BotEquipmentModPoolService");
const BotWeaponModLimitService_1 = require("C:/snapshot/project/obj/services/BotWeaponModLimitService");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const ItemFilterService_1 = require("C:/snapshot/project/obj/services/ItemFilterService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const BotEquipmentModGenerator_1 = require("C:/snapshot/project/obj/generators/BotEquipmentModGenerator");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const ModConfig_1 = require("../Globals/ModConfig");
const RaidInformation_1 = require("../Globals/RaidInformation");
const ModInformation_1 = require("../Globals/ModInformation");
const APBSTester_1 = require("../Utils/APBSTester");
const VanillaItemLists_1 = require("../Globals/VanillaItemLists");
const APBSLogger_1 = require("../Utils/APBSLogger");
const RealismHelper_1 = require("../Helpers/RealismHelper");
/** Handle profile related client events */
let APBSBotEquipmentModGenerator = class APBSBotEquipmentModGenerator extends BotEquipmentModGenerator_1.BotEquipmentModGenerator {
    logger;
    hashUtil;
    randomUtil;
    probabilityHelper;
    databaseService;
    itemHelper;
    botEquipmentFilterService;
    itemFilterService;
    profileHelper;
    botWeaponModLimitService;
    botHelper;
    botGeneratorHelper;
    botWeaponGeneratorHelper;
    weightedRandomHelper;
    presetHelper;
    localisationService;
    botEquipmentModPoolService;
    configServer;
    cloner;
    apbsTierGetter;
    raidInformation;
    modInformation;
    apbsTester;
    apbsLogger;
    realismHelper;
    constructor(logger, hashUtil, randomUtil, probabilityHelper, databaseService, itemHelper, botEquipmentFilterService, itemFilterService, profileHelper, botWeaponModLimitService, botHelper, botGeneratorHelper, botWeaponGeneratorHelper, weightedRandomHelper, presetHelper, localisationService, botEquipmentModPoolService, configServer, cloner, apbsTierGetter, raidInformation, modInformation, apbsTester, apbsLogger, realismHelper) {
        super(logger, hashUtil, randomUtil, probabilityHelper, databaseService, itemHelper, botEquipmentFilterService, itemFilterService, profileHelper, botWeaponModLimitService, botHelper, botGeneratorHelper, botWeaponGeneratorHelper, weightedRandomHelper, presetHelper, localisationService, botEquipmentModPoolService, configServer, cloner);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.probabilityHelper = probabilityHelper;
        this.databaseService = databaseService;
        this.itemHelper = itemHelper;
        this.botEquipmentFilterService = botEquipmentFilterService;
        this.itemFilterService = itemFilterService;
        this.profileHelper = profileHelper;
        this.botWeaponModLimitService = botWeaponModLimitService;
        this.botHelper = botHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.botWeaponGeneratorHelper = botWeaponGeneratorHelper;
        this.weightedRandomHelper = weightedRandomHelper;
        this.presetHelper = presetHelper;
        this.localisationService = localisationService;
        this.botEquipmentModPoolService = botEquipmentModPoolService;
        this.configServer = configServer;
        this.cloner = cloner;
        this.apbsTierGetter = apbsTierGetter;
        this.raidInformation = raidInformation;
        this.modInformation = modInformation;
        this.apbsTester = apbsTester;
        this.apbsLogger = apbsLogger;
        this.realismHelper = realismHelper;
    }
    apbsGenerateModsForEquipment(equipment, parentId, parentTemplate, settings, shouldForceSpawn = false) {
        let forceSpawn = shouldForceSpawn;
        if (!settings.modPool[parentTemplate._id]) {
            this.logger.warning(`bot: ${settings.botData.role} lacks a mod slot pool for item: ${parentTemplate._id} ${parentTemplate._name}`);
        }
        // Iterate over mod pool and choose mods to add to item
        for (const modSlotName in settings.modPool[parentTemplate._id]) {
            if (modSlotName === "mod_equipment_000" && this.raidInformation.nightTime && parentTemplate._id != "5df8a58286f77412631087ed")
                continue;
            if (modSlotName === "mod_equipment" && this.realismHelper.gasMasks.includes(parentTemplate._id) && this.realismHelper.realismDetected == true) {
                forceSpawn = true;
            }
            const itemSlotTemplate = this.getModItemSlotFromDb(modSlotName, parentTemplate);
            if (!itemSlotTemplate) {
                this.logger.error(this.localisationService.getText("bot-mod_slot_missing_from_item", {
                    modSlot: modSlotName,
                    parentId: parentTemplate._id,
                    parentName: parentTemplate._name,
                    botRole: settings.botData.role
                }));
                continue;
            }
            const modSpawnResult = this.shouldModBeSpawned(itemSlotTemplate, modSlotName.toLowerCase(), settings.spawnChances.equipmentMods, settings.botEquipmentConfig);
            if (modSpawnResult === ModSpawn_1.ModSpawn.SKIP && !forceSpawn) {
                continue;
            }
            // Ensure submods for nvgs all spawn together if it's night
            if (modSlotName === "mod_nvg") {
                if (this.raidInformation.nightTime) {
                    forceSpawn = true;
                }
                else {
                    continue;
                }
            }
            let modPoolToChooseFrom = settings.modPool[parentTemplate._id][modSlotName];
            if (settings.botEquipmentConfig.filterPlatesByLevel
                && this.itemHelper.isRemovablePlateSlot(modSlotName.toLowerCase())) {
                const outcome = this.filterPlateModsForSlotByLevel(settings, modSlotName.toLowerCase(), settings.modPool[parentTemplate._id][modSlotName], parentTemplate);
                if ([IFilterPlateModsForSlotByLevelResult_1.Result.UNKNOWN_FAILURE, IFilterPlateModsForSlotByLevelResult_1.Result.NO_DEFAULT_FILTER].includes(outcome.result)) {
                    this.logger.debug(`Plate slot: ${modSlotName} selection for armor: ${parentTemplate._id} failed: ${IFilterPlateModsForSlotByLevelResult_1.Result[outcome.result]}, skipping`);
                    continue;
                }
                if ([IFilterPlateModsForSlotByLevelResult_1.Result.LACKS_PLATE_WEIGHTS].includes(outcome.result)) {
                    this.logger.warning(`Plate slot: ${modSlotName} lacks weights for armor: ${parentTemplate._id}, unable to adjust plate choice, using existing data`);
                }
                modPoolToChooseFrom = outcome.plateModTpls;
            }
            // Find random mod and check its compatible
            let modTpl;
            let found = false;
            const exhaustableModPool = new ExhaustableArray_1.ExhaustableArray(modPoolToChooseFrom, this.randomUtil, this.cloner);
            while (exhaustableModPool.hasValues()) {
                modTpl = exhaustableModPool.getRandomValue();
                if (modTpl
                    && !this.botGeneratorHelper.isItemIncompatibleWithCurrentItems(equipment, modTpl, modSlotName)
                        .incompatible) {
                    found = true;
                    break;
                }
            }
            // Compatible item not found but slot REQUIRES item, get random item from db
            if (!found && itemSlotTemplate._required) {
                modTpl = this.getRandomModTplFromItemDb(modTpl, itemSlotTemplate, modSlotName, equipment);
                found = !!modTpl;
            }
            // Compatible item not found + not required
            if (!(found || itemSlotTemplate._required)) {
                // Don't add item
                continue;
            }
            const modTemplate = this.itemHelper.getItem(modTpl);
            if (!this.isModValidForSlot(modTemplate, itemSlotTemplate, modSlotName, parentTemplate, settings.botData.role)) {
                continue;
            }
            // Generate new id to ensure all items are unique on bot
            const modId = this.hashUtil.generate();
            equipment.push(this.createModItem(modId, modTpl, parentId, modSlotName, modTemplate[1], settings.botData.role));
            // Does the item being added have possible child mods?
            if (Object.keys(settings.modPool).includes(modTpl)) {
                // Call self recursively with item being checkced item we just added to bot
                this.apbsGenerateModsForEquipment(equipment, modId, modTemplate[1], settings, forceSpawn);
            }
        }
        // This is for testing...
        if (this.modInformation.testMode && this.modInformation.testBotRole.includes(settings.botData.role.toLowerCase())) {
            const tables = this.databaseService.getTables();
            const assortEquipment = this.cloner.clone(equipment);
            for (const item in assortEquipment) {
                const oldID = assortEquipment[item]._id;
                const newID = this.hashUtil.generate();
                assortEquipment[item]._id = newID;
                // Loop array again to fix parentID
                for (const i in assortEquipment) {
                    if (assortEquipment[i].parentId == oldID) {
                        assortEquipment[i].parentId = newID;
                    }
                }
            }
            this.apbsTester.createComplexAssortItem(assortEquipment)
                .addStackCount(1)
                .addMoneyCost(Money_1.Money.ROUBLES, settings.botData.level)
                .addBuyRestriction(1)
                .addLoyaltyLevel(1)
                .export(tables.traders[this.modInformation.testTrader]);
        }
        return equipment;
    }
    getCompatibleModFromPool(modPool, modSpawnType, weapon) {
        // Create exhaustable pool to pick mod item from
        const exhaustableModPool = this.createExhaustableArray(modPool);
        // Create default response if no compatible item is found below
        const chosenModResult = {
            incompatible: true,
            found: false,
            reason: "unknown"
        };
        // Limit how many attempts to find a compatible mod can occur before giving up
        const maxBlockedAttempts = Math.round(modPool.length); // 75% of pool size
        let blockedAttemptCount = 0;
        let chosenTpl;
        while (exhaustableModPool.hasValues()) {
            chosenTpl = exhaustableModPool.getRandomValue();
            const pickedItemDetails = this.itemHelper.getItem(chosenTpl);
            if (!pickedItemDetails[0]) {
                // Not valid item, try again
                continue;
            }
            if (!pickedItemDetails[1]._props) {
                // no props data, try again
                continue;
            }
            // Success - Default wanted + only 1 item in pool
            if (modSpawnType === ModSpawn_1.ModSpawn.DEFAULT_MOD && modPool.length === 1) {
                chosenModResult.found = true;
                chosenModResult.incompatible = false;
                chosenModResult.chosenTpl = chosenTpl;
                break;
            }
            // Check if existing weapon mods are incompatible with chosen item
            const existingItemBlockingChoice = weapon.find((item) => pickedItemDetails[1]._props.ConflictingItems?.includes(item._tpl));
            if (existingItemBlockingChoice) {
                // Give max of x attempts of picking a mod if blocked by another
                if (blockedAttemptCount > maxBlockedAttempts) {
                    blockedAttemptCount = 0; // reset
                    break;
                }
                blockedAttemptCount++;
                // Not compatible - Try again
                continue;
            }
            // Edge case- Some mod combos will never work, make sure this isnt the case
            if (this.weaponModComboIsIncompatible(weapon, chosenTpl)) {
                chosenModResult.reason = `Chosen weapon mod: ${chosenTpl} can never be compatible with existing weapon mods`;
                break;
            }
            // Success
            chosenModResult.found = true;
            chosenModResult.incompatible = false;
            chosenModResult.chosenTpl = chosenTpl;
            break;
        }
        return chosenModResult;
    }
    apbsGenerateModsForWeapon(sessionId, request, isPmc, questInformation, weaponID) {
        const pmcProfile = this.profileHelper.getPmcProfile(sessionId);
        // Get pool of mods that fit weapon
        const compatibleModsPool = request.modPool[request.parentTemplate._id];
        if (!(request.parentTemplate._props.Slots?.length ||
            request.parentTemplate._props.Cartridges?.length ||
            request.parentTemplate._props.Chambers?.length)) {
            this.logger.error(this.localisationService.getText("bot-unable_to_add_mods_to_weapon_missing_ammo_slot", {
                weaponName: request.parentTemplate._name,
                weaponId: request.parentTemplate._id,
                botRole: request.botData.role
            }));
            return request.weapon;
        }
        const botEquipConfig = this.botConfig.equipment[request.botData.equipmentRole];
        const botEquipBlacklist = this.botEquipmentFilterService.getBotEquipmentBlacklist(request.botData.equipmentRole, pmcProfile.Info.Level);
        const botWeaponSightWhitelist = this.botEquipmentFilterService.getBotWeaponSightWhitelist(request.botData.equipmentRole);
        const randomisationSettings = this.botHelper.getBotRandomizationDetails(request.botData.level, botEquipConfig);
        // Iterate over mod pool and choose mods to attach
        const sortedModKeys = this.sortModKeys(Object.keys(compatibleModsPool), request.parentTemplate._id);
        for (const modSlot of sortedModKeys) {
            // Check weapon has slot for mod to fit in
            const modsParentSlot = this.getModItemSlotFromDb(modSlot, request.parentTemplate);
            if (!modsParentSlot) {
                this.logger.error(this.localisationService.getText("bot-weapon_missing_mod_slot", {
                    modSlot: modSlot,
                    weaponId: request.parentTemplate._id,
                    weaponName: request.parentTemplate._name,
                    botRole: request.botData.role
                }));
                continue;
            }
            // Check spawn chance of mod
            let modSpawnResult = this.shouldModBeSpawned(modsParentSlot, modSlot, request.modSpawnChances, botEquipConfig);
            if (questInformation.isQuesting && !this.itemHelper.isOfBaseclasses(weaponID, [BaseClasses_1.BaseClasses.PISTOL, BaseClasses_1.BaseClasses.REVOLVER])) {
                if (questInformation.questData.requiredWeaponModSlots.includes(modSlot)) {
                    if (questInformation.questData.PrimaryWeapon.includes(weaponID)) {
                        modSpawnResult = ModSpawn_1.ModSpawn.SPAWN;
                    }
                    if (questInformation.questData.PrimaryWeapon.length === 0) {
                        modSpawnResult = ModSpawn_1.ModSpawn.SPAWN;
                    }
                }
                if (!questInformation.questData.requiredWeaponModSlots.includes(modSlot) && questInformation.questData.questName == "Fishing Gear" && questInformation.questData.PrimaryWeapon.includes(weaponID)) {
                    modSpawnResult = ModSpawn_1.ModSpawn.SKIP;
                }
            }
            if (modSpawnResult === ModSpawn_1.ModSpawn.SKIP) {
                continue;
            }
            const isRandomisableSlot = randomisationSettings?.randomisedWeaponModSlots?.includes(modSlot) ?? false;
            const modToSpawnRequest = {
                modSlot: modSlot,
                isRandomisableSlot: isRandomisableSlot,
                randomisationSettings: randomisationSettings,
                botWeaponSightWhitelist: botWeaponSightWhitelist,
                botEquipBlacklist: botEquipBlacklist,
                itemModPool: compatibleModsPool,
                weapon: request.weapon,
                ammoTpl: request.ammoTpl,
                parentTemplate: request.parentTemplate,
                modSpawnResult: modSpawnResult,
                weaponStats: request.weaponStats,
                conflictingItemTpls: request.conflictingItemTpls,
                botData: request.botData
            };
            const modToAdd = this.apbsChooseModToPutIntoSlot(modToSpawnRequest, questInformation, weaponID);
            // Compatible mod not found
            if (!modToAdd || typeof modToAdd === "undefined") {
                continue;
            }
            if (!this.isModValidForSlot(modToAdd, modsParentSlot, modSlot, request.parentTemplate, request.botData.role)) {
                continue;
            }
            const modToAddTemplate = modToAdd[1];
            // Skip adding mod to weapon if type limit reached
            if (this.botWeaponModLimitService.weaponModHasReachedLimit(request.botData.equipmentRole, modToAddTemplate, request.modLimits, request.parentTemplate, request.weapon)) {
                continue;
            }
            if (VanillaItemLists_1.vanillaButtpads.includes(modToAddTemplate._id)) {
                if (!this.randomUtil.getChance100(ModConfig_1.ModConfig.config.generalConfig.stockButtpadChance)) {
                    continue;
                }
            }
            // If item is a mount for scopes, set scope chance to 100%, this helps fix empty mounts appearing on weapons
            if (this.modSlotCanHoldScope(modSlot, modToAddTemplate._parent)) {
                // mod_mount was picked to be added to weapon, force scope chance to ensure its filled
                let scopeSlots = ["mod_scope", "mod_scope_000", "mod_scope_001", "mod_scope_002", "mod_scope_003"];
                if (isPmc)
                    scopeSlots = ["mod_scope", "mod_scope_000"];
                this.adjustSlotSpawnChances(request.modSpawnChances, scopeSlots, 100);
                // Hydrate pool of mods that fit into mount as its a randomisable slot
                if (isRandomisableSlot) {
                    // Add scope mods to modPool dictionary to ensure the mount has a scope in the pool to pick
                    this.addCompatibleModsForProvidedMod("mod_scope", modToAddTemplate, request.modPool, botEquipBlacklist);
                }
            }
            if (ModConfig_1.ModConfig.config.generalConfig.forceChildrenMuzzle) {
                // If picked item is muzzle adapter that can hold a child, adjust spawn chance
                if (this.modSlotCanHoldMuzzleDevices(modSlot, modToAddTemplate._parent)) {
                    const muzzleSlots = ["mod_muzzle", "mod_muzzle_000", "mod_muzzle_001"];
                    this.adjustSlotSpawnChances(request.modSpawnChances, muzzleSlots, 100);
                }
            }
            // If front/rear sight are to be added, set opposite to 100% chance
            if (this.modIsFrontOrRearSight(modSlot, modToAddTemplate._id)) {
                request.modSpawnChances.mod_sight_front = 100;
                request.modSpawnChances.mod_sight_rear = 100;
            }
            // Handguard mod can take a sub handguard mod + weapon has no UBGL (takes same slot)
            // Force spawn chance to be 100% to ensure it gets added
            if (modSlot === "mod_handguard" &&
                modToAddTemplate._props.Slots.some((slot) => slot._name === "mod_handguard") &&
                !request.weapon.some((item) => item.slotId === "mod_launcher")) {
                // Needed for handguards with lower
                request.modSpawnChances.mod_handguard = 100;
            }
            // If stock mod can take a sub stock mod, force spawn chance to be 100% to ensure sub-stock gets added
            // Or if mod_stock is configured to be forced on
            if (this.shouldForceSubStockSlots(modSlot, botEquipConfig, modToAddTemplate)) {
                // Stock mod can take additional stocks, could be a locking device, force 100% chance
                const subStockSlots = ["mod_stock", "mod_stock_000", "mod_stock_001", "mod_stock_akms"];
                this.adjustSlotSpawnChances(request.modSpawnChances, subStockSlots, 100);
            }
            // Gather stats on mods being added to weapon
            if (this.itemHelper.isOfBaseclass(modToAddTemplate._id, BaseClasses_1.BaseClasses.IRON_SIGHT)) {
                if (modSlot === "mod_sight_front") {
                    request.weaponStats.hasFrontIronSight = true;
                }
                else if (modSlot === "mod_sight_rear") {
                    request.weaponStats.hasRearIronSight = true;
                }
            }
            else if (!request.weaponStats.hasOptic &&
                this.itemHelper.isOfBaseclass(modToAddTemplate._id, BaseClasses_1.BaseClasses.SIGHTS)) {
                request.weaponStats.hasOptic = true;
            }
            const modId = this.hashUtil.generate();
            request.weapon.push(this.createModItem(modId, modToAddTemplate._id, request.weaponId, modSlot, modToAddTemplate, request.botData.role));
            // Update conflicting item list now item has been chosen
            for (const conflictingItem of modToAddTemplate._props.ConflictingItems) {
                request.conflictingItemTpls.add(conflictingItem);
            }
            // I first thought we could use the recursive generateModsForItems as previously for cylinder magazines.
            // However, the recursion doesn't go over the slots of the parent mod but over the modPool which is given by the bot config
            // where we decided to keep cartridges instead of camoras. And since a CylinderMagazine only has one cartridge entry and
            // this entry is not to be filled, we need a special handling for the CylinderMagazine
            const modParentItem = this.itemHelper.getItem(modToAddTemplate._parent)[1];
            if (this.botWeaponGeneratorHelper.magazineIsCylinderRelated(modParentItem._name)) {
                // We don't have child mods, we need to create the camoras for the magazines instead
                this.fillCamora(request.weapon, request.modPool, modId, modToAddTemplate);
            }
            else {
                let containsModInPool = Object.keys(request.modPool).includes(modToAddTemplate._id);
                // Sometimes randomised slots are missing sub-mods, if so, get values from mod pool service
                // Check for a randomisable slot + without data in modPool + item being added as additional slots
                if (isRandomisableSlot && !containsModInPool && modToAddTemplate._props.Slots.length > 0) {
                    const modFromService = this.botEquipmentModPoolService.getModsForWeaponSlot(modToAddTemplate._id);
                    if (Object.keys(modFromService ?? {}).length > 0) {
                        request.modPool[modToAddTemplate._id] = modFromService;
                        containsModInPool = true;
                    }
                }
                if (containsModInPool) {
                    const recursiveRequestData = {
                        weapon: request.weapon,
                        modPool: request.modPool,
                        weaponId: modId,
                        parentTemplate: modToAddTemplate,
                        modSpawnChances: request.modSpawnChances,
                        ammoTpl: request.ammoTpl,
                        botData: {
                            role: request.botData.role,
                            level: request.botData.level,
                            equipmentRole: request.botData.equipmentRole
                        },
                        modLimits: request.modLimits,
                        weaponStats: request.weaponStats,
                        conflictingItemTpls: request.conflictingItemTpls
                    };
                    // Call self recursively to add mods to this mod
                    this.apbsGenerateModsForWeapon(sessionId, recursiveRequestData, isPmc, questInformation, weaponID);
                }
            }
        }
        return request.weapon;
    }
    apbsChooseModToPutIntoSlot(request, questInformation, weaponID) {
        /** Slot mod will fill */
        const parentSlot = request.parentTemplate._props.Slots?.find((i) => i._name === request.modSlot);
        const weaponTemplate = this.itemHelper.getItem(request.weapon[0]._tpl)[1];
        // It's ammo, use predefined ammo parameter
        if (this.getAmmoContainers().includes(request.modSlot) && request.modSlot !== "mod_magazine") {
            return this.itemHelper.getItem(request.ammoTpl);
        }
        // Ensure there's a pool of mods to pick from
        let modPool = this.getModPoolForSlot(request, weaponTemplate);
        if (!modPool && !parentSlot?._required) {
            // Nothing in mod pool + item not required
            this.logger.debug(`Mod pool for optional slot: ${request.modSlot} on item: ${request.parentTemplate._name} was empty, skipping mod`);
            return undefined;
        }
        // Filter out non-whitelisted scopes, use full modpool if filtered pool would have no elements
        if (request.modSlot.includes("mod_scope") && request.botWeaponSightWhitelist) {
            // scope pool has more than one scope
            if (modPool.length > 1) {
                modPool = this.filterSightsByWeaponType(request.weapon[0], modPool, request.botWeaponSightWhitelist);
            }
        }
        if (request.modSlot === "mod_gas_block") {
            if (request.weaponStats.hasOptic && modPool.length > 1) {
                // Attempt to limit modpool to low profile gas blocks when weapon has an optic
                const onlyLowProfileGasBlocks = modPool.filter((tpl) => this.botConfig.lowProfileGasBlockTpls.includes(tpl));
                if (onlyLowProfileGasBlocks.length > 0) {
                    modPool = onlyLowProfileGasBlocks;
                }
            }
            else if (request.weaponStats.hasRearIronSight && modPool.length > 1) {
                // Attempt to limit modpool to high profile gas blocks when weapon has rear iron sight + no front iron sight
                const onlyHighProfileGasBlocks = modPool.filter((tpl) => !this.botConfig.lowProfileGasBlockTpls.includes(tpl));
                if (onlyHighProfileGasBlocks.length > 0) {
                    modPool = onlyHighProfileGasBlocks;
                }
            }
        }
        // Quest specific handling, because it's stupid
        if (questInformation.isQuesting) {
            if (questInformation.questData.questName != "Fishing Gear") {
                if (questInformation.questData.PrimaryWeapon.includes(weaponID) && questInformation.questData.requiredWeaponMods.length && (questInformation.questData.requiredWeaponModSlots.includes(request.modSlot) || request.modSlot.includes("mod_scope_"))) {
                    //console.log(`Searching for specific mod for Item: ${request.parentTemplate._id} | Slot ${request.modSlot}`);
                    const newModPool = this.apbsGetModPoolToForceSpecificMods(request.parentTemplate, questInformation, request.modSlot);
                    if (newModPool != undefined) {
                        //console.log(`Mods found: ${newModPool}`)
                        modPool = newModPool;
                    }
                }
                if (!this.itemHelper.isOfBaseclasses(weaponID, [BaseClasses_1.BaseClasses.PISTOL, BaseClasses_1.BaseClasses.REVOLVER]) && questInformation.questData.requiredWeaponModBaseClasses.includes(BaseClasses_1.BaseClasses.SILENCER)) {
                    if (request.modSlot === "mod_barrel" && questInformation.questData.requiredWeaponModSlots.includes("mod_muzzle")) {
                        const barrelModPool = this.apbsGetBarrelModsForSilencer(request.parentTemplate);
                        if (barrelModPool != undefined)
                            modPool = barrelModPool;
                    }
                    // Quest requires a silencer, only allow silencers in the muzzle pool
                    if (request.modSlot === "mod_muzzle" && questInformation.questData.requiredWeaponModSlots.includes("mod_muzzle")) {
                        const muzzleModPool = this.apbsGetMuzzleModsForSilencer(request.parentTemplate);
                        if (muzzleModPool != undefined)
                            modPool = muzzleModPool;
                    }
                }
            }
            else if (questInformation.questData.questName == "Fishing Gear" && questInformation.questData.PrimaryWeapon.includes(weaponID)) {
                if (request.modSlot === "mod_stock")
                    modPool = ["61faa91878830f069b6b7967"];
                if (request.modSlot === "mod_bipod")
                    modPool = ["56ea8222d2720b69698b4567"];
                if (request.modSlot === "mod_muzzle")
                    modPool = ["560e620e4bdc2d724b8b456b"];
                if (request.modSlot === "mod_tactical")
                    modPool = ["56083eab4bdc2d26448b456a"];
                if (request.modSlot === "mod_sight_rear")
                    modPool = ["56083e1b4bdc2dc8488b4572"];
                if (request.modSlot === "mod_magazine")
                    modPool = ["559ba5b34bdc2d1f1a8b4582"];
            }
        }
        if ((weaponID == "67a01e4ea2b82626b73d10a3" || weaponID == "67a01e4ea2b82626b73d10a4") && (request.modSlot === "mod_barrel" || request.modSlot === "mod_magazine")) {
            const ammoCaliberSelected = this.itemHelper.getItem(request.ammoTpl);
            if (ammoCaliberSelected[0]) {
                const caliberData = ammoCaliberSelected[1]._props.Caliber;
                switch (caliberData) {
                    case "Caliber762x39":
                        if (request.modSlot === "mod_barrel") {
                            modPool = [
                                "67a01e4ea2b82626b73d10a6",
                                "67a01e4ea2b82626b73d10a7",
                                "67a01e4ea2b82626b73d10a8"
                            ];
                        }
                        if (request.modSlot === "mod_magazine") {
                            modPool = [
                                "67a01e4ea2b82626b73d10a5"
                            ];
                        }
                        break;
                    case "Caliber556x45NATO":
                        if (request.modSlot === "mod_barrel") {
                            modPool = [
                                "67a01e4ea2b82626b73d10a9",
                                "67a01e4ea2b82626b73d10aa",
                                "67a01e4ea2b82626b73d10ab"
                            ];
                        }
                        if (request.modSlot === "mod_magazine") {
                            const index = modPool.indexOf("67a01e4ea2b82626b73d10a5");
                            if (index > -1) {
                                modPool.splice(index);
                            }
                        }
                        break;
                }
            }
        }
        // Pick random mod that's compatible
        const chosenModResult = this.getCompatibleWeaponModTplForSlotFromPool(request, modPool, parentSlot, request.modSpawnResult, request.weapon, request.modSlot);
        if (chosenModResult.slotBlocked && !parentSlot._required) {
            // Don't bother trying to fit mod, slot is completely blocked
            return undefined;
        }
        // Log if mod chosen was incompatible
        if (chosenModResult.incompatible && parentSlot._required) {
            this.logger.debug(chosenModResult.reason);
        }
        // Get random mod to attach from items db for required slots if none found above
        if (!chosenModResult.found && parentSlot !== undefined && parentSlot._required) {
            chosenModResult.chosenTpl = this.getRandomModTplFromItemDb("", parentSlot, request.modSlot, request.weapon);
            chosenModResult.found = true;
        }
        // Compatible item not found + not required
        if (!chosenModResult.found && parentSlot !== undefined && !parentSlot._required) {
            return undefined;
        }
        if (!chosenModResult.found && parentSlot !== undefined) {
            if (parentSlot._required) {
                this.logger.warning(`Required slot unable to be filled, ${request.modSlot} on ${request.parentTemplate._name} ${request.parentTemplate._id} for weapon: ${request.weapon[0]._tpl}`);
            }
            return undefined;
        }
        return this.itemHelper.getItem(chosenModResult.chosenTpl);
    }
    apbsGetBarrelModsForSilencer(parentTemplate) {
        const barrelModPool = [];
        // Get barrel slot for parent
        const modSlot = parentTemplate._props.Slots.find((slot) => slot._name === "mod_barrel");
        if (modSlot) {
            // All possible mods that fit in slot
            const modSlotPool = modSlot._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
            if (modSlotPool) {
                // Has muzzle children
                const onlyMuzzleDevicesForChildren = modSlotPool.filter((item) => this.itemHelper.getItem(item)[1]._props.Slots.find((slot) => slot._name === "mod_muzzle"));
                if (onlyMuzzleDevicesForChildren.length) {
                    for (const item in onlyMuzzleDevicesForChildren) {
                        barrelModPool.push(item);
                    }
                    return barrelModPool;
                }
            }
        }
        //console.log(`barrels - NOTHING FOUND NOT COOL MAN. Parent ${parentTemplate._id}`)
        return undefined;
    }
    apbsGetMuzzleModsForSilencer(parentTemplate) {
        const muzzleModPool = [];
        const modSlot = parentTemplate._props.Slots.find((slot) => slot._name === "mod_muzzle");
        if (modSlot) {
            // All possible mods that fit in slot - this quest doesn't require specific muzzle IDs
            const modSlotPool = modSlot._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
            if (modSlotPool.length) {
                // Silencers & Combo Devices
                const allMuzzleInBaseModSlot = modSlotPool.filter((tpl) => this.itemHelper.isOfBaseclasses(tpl, [BaseClasses_1.BaseClasses.MUZZLE]));
                if (allMuzzleInBaseModSlot.length) {
                    for (const item of allMuzzleInBaseModSlot) {
                        const itemData = this.itemHelper.getItem(item)[1];
                        // Push silencers as they're already found
                        if (this.itemHelper.isOfBaseclass(itemData._id, BaseClasses_1.BaseClasses.SILENCER)) {
                            muzzleModPool.push(itemData._id);
                        }
                        const muzzleCanHoldChildren = itemData._props.Slots.find((slot) => slot._name === "mod_muzzle");
                        if (muzzleCanHoldChildren) {
                            const muzzlesThatCanHoldChildren = muzzleCanHoldChildren._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
                            if (muzzlesThatCanHoldChildren.length) {
                                const muzzleHasChildrenThatCanHoldSilencers = muzzlesThatCanHoldChildren.filter((tpl) => this.itemHelper.isOfBaseclasses(tpl, [BaseClasses_1.BaseClasses.SILENCER, "550aa4dd4bdc2dc9348b4569"]));
                                for (const itemChild of muzzleHasChildrenThatCanHoldSilencers) {
                                    // Push silencers as they're already found
                                    if (this.itemHelper.isOfBaseclass(itemChild, BaseClasses_1.BaseClasses.SILENCER)) {
                                        if (!muzzleModPool.includes(itemData._id)) {
                                            muzzleModPool.push(itemData._id);
                                        }
                                    }
                                    const muzzleItem = this.itemHelper.getItem(itemChild)[1];
                                    const muzzleOfParentMuzzleCanHoldChildren = muzzleItem._props.Slots.find((slot) => slot._name === "mod_muzzle");
                                    if (muzzleOfParentMuzzleCanHoldChildren) {
                                        const muzzlesOfParentThatCanHoldChildren = muzzleOfParentMuzzleCanHoldChildren._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
                                        if (muzzlesOfParentThatCanHoldChildren.length) {
                                            const muzzleOfParentHasChildrenThatCanHoldSilencers = muzzlesOfParentThatCanHoldChildren.filter((tpl) => this.itemHelper.isOfBaseclasses(tpl, [BaseClasses_1.BaseClasses.SILENCER, "550aa4dd4bdc2dc9348b4569"]));
                                            for (const itemChildOfParent of muzzleOfParentHasChildrenThatCanHoldSilencers) {
                                                // Push silencers as they're already found
                                                if (this.itemHelper.isOfBaseclass(itemChildOfParent, BaseClasses_1.BaseClasses.SILENCER)) {
                                                    if (!muzzleModPool.includes(itemData._id)) {
                                                        muzzleModPool.push(itemData._id);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (muzzleModPool.length) {
            return muzzleModPool;
        }
        //console.log(`Muzzles - NOTHING FOUND NOT COOL MAN. Parent ${parentTemplate._id}`)
        return undefined;
    }
    apbsGetModPoolToForceSpecificMods(parentTemplate, questInformation, modSlot) {
        const bannedSlot = modSlot.includes("mod_scope") ? ["mod_mount", "mod_scope_001"] : [];
        const modPoolToReturn = [];
        const slotSearchStart = parentTemplate._props.Slots.find((slot) => slot._name === modSlot);
        if (slotSearchStart) {
            const parentModSlotPool = slotSearchStart._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
            if (parentModSlotPool.length) {
                for (const itemInSlot of parentModSlotPool) {
                    const itemInSlotData = this.itemHelper.getItem(itemInSlot)[1];
                    const itemInSlotDataHasModMount = itemInSlotData._props.Slots.some(slot => bannedSlot.includes(slot._name));
                    if (itemInSlotDataHasModMount)
                        continue;
                    if (questInformation.questData.requiredWeaponMods.includes(itemInSlot)) {
                        //console.log(`pushing ${itemInSlot} found in slot ${modSlot} | banned: ${bannedSlot} | ${itemInSlotDataHasModMount}`)
                        modPoolToReturn.push(itemInSlot);
                        continue;
                    }
                    if (itemInSlotData?._props?.Slots?.length) {
                        const childSlots = itemInSlotData._props.Slots;
                        for (const childSlot in childSlots) {
                            const childModSlotPool = childSlots[childSlot]._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
                            {
                                if (childModSlotPool.length) {
                                    for (const itemInItemChildSlot of childModSlotPool) {
                                        const itemInItemChildSlotData = this.itemHelper.getItem(itemInItemChildSlot)[1];
                                        if (questInformation.questData.requiredWeaponMods.includes(itemInItemChildSlot)) {
                                            if (!modPoolToReturn.includes(itemInSlot)) {
                                                //console.log(`pushing ${itemInSlot} found in slot ${modSlot} | banned: ${bannedSlot} | ${itemInSlotDataHasModMount}`)
                                                modPoolToReturn.push(itemInSlot);
                                            }
                                            continue;
                                        }
                                        if (itemInItemChildSlotData?._props?.Slots?.length) {
                                            const childOfChildSlots = itemInItemChildSlotData._props.Slots;
                                            for (const childOfChildSlot in childOfChildSlots) {
                                                const childOfChildModSlotPool = childOfChildSlots[childOfChildSlot]._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
                                                {
                                                    if (childOfChildModSlotPool.length) {
                                                        for (const itemInItemChildOfChildSlot of childOfChildModSlotPool) {
                                                            const itemInItemChildOfChildSlotData = this.itemHelper.getItem(itemInItemChildOfChildSlot)[1];
                                                            if (questInformation.questData.requiredWeaponMods.includes(itemInItemChildOfChildSlot)) {
                                                                if (!modPoolToReturn.includes(itemInSlot)) {
                                                                    //console.log(`pushing ${itemInSlot} found in slot ${modSlot} | banned: ${bannedSlot} | ${itemInSlotDataHasModMount}`)
                                                                    modPoolToReturn.push(itemInSlot);
                                                                }
                                                                continue;
                                                            }
                                                            if (itemInItemChildOfChildSlotData?._props?.Slots?.length) {
                                                                const childOfChildOfChildSlots = itemInItemChildOfChildSlotData._props.Slots;
                                                                for (const childOfChildOfChildSlot in childOfChildOfChildSlots) {
                                                                    const childOfChildOfChildModSlotPool = childOfChildOfChildSlots[childOfChildOfChildSlot]._props.filters[0].Filter.filter((tpl) => this.itemHelper.getItem(tpl)[1]);
                                                                    {
                                                                        if (childOfChildOfChildModSlotPool.length) {
                                                                            for (const itemInItemChildOfChildOfChildSlot of childOfChildOfChildModSlotPool) {
                                                                                if (questInformation.questData.requiredWeaponMods.includes(itemInItemChildOfChildOfChildSlot)) {
                                                                                    if (!modPoolToReturn.includes(itemInSlot)) {
                                                                                        //console.log(`pushing ${itemInSlot} found in slot ${modSlot} | banned: ${bannedSlot} | ${itemInSlotDataHasModMount}`)
                                                                                        modPoolToReturn.push(itemInSlot);
                                                                                    }
                                                                                    continue;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (modPoolToReturn.length) {
            return modPoolToReturn;
        }
        //console.log(`Specific mods - NOTHING FOUND NOT COOL MAN. Parent ${parentTemplate._id}`)
        return undefined;
    }
};
exports.APBSBotEquipmentModGenerator = APBSBotEquipmentModGenerator;
exports.APBSBotEquipmentModGenerator = APBSBotEquipmentModGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("ProbabilityHelper")),
    __param(4, (0, tsyringe_1.inject)("DatabaseService")),
    __param(5, (0, tsyringe_1.inject)("ItemHelper")),
    __param(6, (0, tsyringe_1.inject)("BotEquipmentFilterService")),
    __param(7, (0, tsyringe_1.inject)("ItemFilterService")),
    __param(8, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(9, (0, tsyringe_1.inject)("BotWeaponModLimitService")),
    __param(10, (0, tsyringe_1.inject)("BotHelper")),
    __param(11, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(12, (0, tsyringe_1.inject)("BotWeaponGeneratorHelper")),
    __param(13, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(14, (0, tsyringe_1.inject)("PresetHelper")),
    __param(15, (0, tsyringe_1.inject)("LocalisationService")),
    __param(16, (0, tsyringe_1.inject)("BotEquipmentModPoolService")),
    __param(17, (0, tsyringe_1.inject)("ConfigServer")),
    __param(18, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(19, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(20, (0, tsyringe_1.inject)("RaidInformation")),
    __param(21, (0, tsyringe_1.inject)("ModInformation")),
    __param(22, (0, tsyringe_1.inject)("APBSTester")),
    __param(23, (0, tsyringe_1.inject)("APBSLogger")),
    __param(24, (0, tsyringe_1.inject)("RealismHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof ProbabilityHelper_1.ProbabilityHelper !== "undefined" && ProbabilityHelper_1.ProbabilityHelper) === "function" ? _d : Object, typeof (_e = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _e : Object, typeof (_f = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _f : Object, typeof (_g = typeof BotEquipmentFilterService_1.BotEquipmentFilterService !== "undefined" && BotEquipmentFilterService_1.BotEquipmentFilterService) === "function" ? _g : Object, typeof (_h = typeof ItemFilterService_1.ItemFilterService !== "undefined" && ItemFilterService_1.ItemFilterService) === "function" ? _h : Object, typeof (_j = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _j : Object, typeof (_k = typeof BotWeaponModLimitService_1.BotWeaponModLimitService !== "undefined" && BotWeaponModLimitService_1.BotWeaponModLimitService) === "function" ? _k : Object, typeof (_l = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _l : Object, typeof (_m = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _m : Object, typeof (_o = typeof BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper !== "undefined" && BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper) === "function" ? _o : Object, typeof (_p = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _p : Object, typeof (_q = typeof PresetHelper_1.PresetHelper !== "undefined" && PresetHelper_1.PresetHelper) === "function" ? _q : Object, typeof (_r = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _r : Object, typeof (_s = typeof BotEquipmentModPoolService_1.BotEquipmentModPoolService !== "undefined" && BotEquipmentModPoolService_1.BotEquipmentModPoolService) === "function" ? _s : Object, typeof (_t = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _t : Object, typeof (_u = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _u : Object, typeof (_v = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _v : Object, typeof (_w = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _w : Object, typeof (_x = typeof ModInformation_1.ModInformation !== "undefined" && ModInformation_1.ModInformation) === "function" ? _x : Object, typeof (_y = typeof APBSTester_1.APBSTester !== "undefined" && APBSTester_1.APBSTester) === "function" ? _y : Object, typeof (_z = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _z : Object, typeof (_0 = typeof RealismHelper_1.RealismHelper !== "undefined" && RealismHelper_1.RealismHelper) === "function" ? _0 : Object])
], APBSBotEquipmentModGenerator);
//# sourceMappingURL=APBSBotEquipmentModGenerator.js.map