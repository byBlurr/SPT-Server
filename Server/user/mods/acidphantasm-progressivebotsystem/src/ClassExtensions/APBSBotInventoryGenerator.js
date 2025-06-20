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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotInventoryGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotEquipmentModGenerator_1 = require("C:/snapshot/project/obj/generators/BotEquipmentModGenerator");
const BotLootGenerator_1 = require("C:/snapshot/project/obj/generators/BotLootGenerator");
const BotWeaponGenerator_1 = require("C:/snapshot/project/obj/generators/BotWeaponGenerator");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const ContextVariableType_1 = require("C:/snapshot/project/obj/context/ContextVariableType");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const BotEquipmentModPoolService_1 = require("C:/snapshot/project/obj/services/BotEquipmentModPoolService");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const BotInventoryGenerator_1 = require("C:/snapshot/project/obj/generators/BotInventoryGenerator");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const ModConfig_1 = require("../Globals/ModConfig");
const APBSBotWeaponGenerator_1 = require("../ClassExtensions/APBSBotWeaponGenerator");
const ApplicationContext_1 = require("C:/snapshot/project/obj/context/ApplicationContext");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const WeatherHelper_1 = require("C:/snapshot/project/obj/helpers/WeatherHelper");
const BotEquipmentFilterService_1 = require("C:/snapshot/project/obj/services/BotEquipmentFilterService");
const RaidInformation_1 = require("../Globals/RaidInformation");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const BotQuestHelper_1 = require("../Helpers/BotQuestHelper");
const GameEditions_1 = require("C:/snapshot/project/obj/models/enums/GameEditions");
const ItemTpl_1 = require("C:/snapshot/project/obj/models/enums/ItemTpl");
const APBSBotEquipmentModGenerator_1 = require("./APBSBotEquipmentModGenerator");
const APBSBotLootGenerator_1 = require("./APBSBotLootGenerator");
/** Handle profile related client events */
let APBSBotInventoryGenerator = class APBSBotInventoryGenerator extends BotInventoryGenerator_1.BotInventoryGenerator {
    logger;
    hashUtil;
    randomUtil;
    databaseService;
    applicationContext;
    botWeaponGenerator;
    botLootGenerator;
    botGeneratorHelper;
    profileHelper;
    botHelper;
    weightedRandomHelper;
    itemHelper;
    weatherHelper;
    localisationService;
    botEquipmentFilterService;
    botEquipmentModPoolService;
    botEquipmentModGenerator;
    configServer;
    apbsEquipmentGetter;
    apbsTierGetter;
    apbsBotWeaponGenerator;
    apbsBotEquipmentModGenerator;
    apbsBotLootGenerator;
    raidInformation;
    apbsLogger;
    botQuestHelper;
    constructor(logger, hashUtil, randomUtil, databaseService, applicationContext, botWeaponGenerator, botLootGenerator, botGeneratorHelper, profileHelper, botHelper, weightedRandomHelper, itemHelper, weatherHelper, localisationService, botEquipmentFilterService, botEquipmentModPoolService, botEquipmentModGenerator, configServer, apbsEquipmentGetter, apbsTierGetter, apbsBotWeaponGenerator, apbsBotEquipmentModGenerator, apbsBotLootGenerator, raidInformation, apbsLogger, botQuestHelper) {
        super(logger, hashUtil, randomUtil, databaseService, applicationContext, botWeaponGenerator, botLootGenerator, botGeneratorHelper, profileHelper, botHelper, weightedRandomHelper, itemHelper, weatherHelper, localisationService, botEquipmentFilterService, botEquipmentModPoolService, botEquipmentModGenerator, configServer);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.databaseService = databaseService;
        this.applicationContext = applicationContext;
        this.botWeaponGenerator = botWeaponGenerator;
        this.botLootGenerator = botLootGenerator;
        this.botGeneratorHelper = botGeneratorHelper;
        this.profileHelper = profileHelper;
        this.botHelper = botHelper;
        this.weightedRandomHelper = weightedRandomHelper;
        this.itemHelper = itemHelper;
        this.weatherHelper = weatherHelper;
        this.localisationService = localisationService;
        this.botEquipmentFilterService = botEquipmentFilterService;
        this.botEquipmentModPoolService = botEquipmentModPoolService;
        this.botEquipmentModGenerator = botEquipmentModGenerator;
        this.configServer = configServer;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
        this.apbsBotWeaponGenerator = apbsBotWeaponGenerator;
        this.apbsBotEquipmentModGenerator = apbsBotEquipmentModGenerator;
        this.apbsBotLootGenerator = apbsBotLootGenerator;
        this.raidInformation = raidInformation;
        this.apbsLogger = apbsLogger;
        this.botQuestHelper = botQuestHelper;
    }
    generateInventory(sessionId, botJsonTemplate, botRole, isPmc, botLevel, chosenGameVersion) {
        const templateInventory = botJsonTemplate.inventory;
        const wornItemChances = botJsonTemplate.chances;
        const itemGenerationLimitsMinMax = botJsonTemplate.generation;
        // Generate base inventory with no items
        const botInventory = this.generateInventoryBase();
        const raidConfig = this.applicationContext
            .getLatestValue(ContextVariableType_1.ContextVariableType.RAID_CONFIGURATION)
            ?.getValue();
        // Vanilla generation
        if (!this.raidInformation.isBotEnabled(botRole) || this.raidInformation.freshProfile) {
            this.generateAndAddEquipmentToBot(sessionId, templateInventory, wornItemChances, botRole, botInventory, botLevel, chosenGameVersion, isPmc, raidConfig);
            this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
            this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
            return botInventory;
        }
        // APBS generation instead
        let tierNumber = this.apbsTierGetter.getTierByLevel(botLevel);
        // Check if this bot shouuld get quests, and assign one if so
        const shouldCheckForQuests = this.botQuestHelper.shouldBotHaveQuest(isPmc);
        let isQuesting = false;
        let questData;
        if (shouldCheckForQuests) {
            const questRequirements = this.botQuestHelper.getQuestFromInternalDatabase(botLevel, this.raidInformation.location);
            if (questRequirements != null) {
                isQuesting = true;
                questData = questRequirements;
                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[QUEST] Level${botLevel} PMC was assigned the quest ${questRequirements.questName}`);
            }
        }
        if (isPmc && !isQuesting && ModConfig_1.ModConfig.config.pmcBots.povertyConfig.enable && tierNumber > 1) {
            if (this.randomUtil.getChance100(ModConfig_1.ModConfig.config.pmcBots.povertyConfig.chance)) {
                const minTier = Math.max(1, tierNumber - 3);
                const maxTier = Math.max(1, tierNumber - 1);
                const newTierNumber = this.randomUtil.getInt(minTier, maxTier);
                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[POVERTY] Level${botLevel} PMC was flagged to be 'poor' | Old Tier: ${tierNumber} | New Tier: ${newTierNumber}`);
                tierNumber = newTierNumber;
            }
        }
        const chances = this.apbsEquipmentGetter.getSpawnChancesByBotRole(botRole, tierNumber);
        const generation = chances.generation;
        if (isQuesting && questData.questName == "Fishing Gear") {
            chances.equipment.SecondPrimaryWeapon = 100;
        }
        this.apbsGenerateAndAddEquipmentToBot(sessionId, chances, botRole, botInventory, botLevel, chosenGameVersion, isPmc, raidConfig, tierNumber, { isQuesting, questData });
        this.apbsGenerateAndAddWeaponsToBot(templateInventory, chances, sessionId, botInventory, botRole, isPmc, generation, botLevel, tierNumber, { isQuesting, questData });
        this.apbsBotLootGenerator.apbsGenerateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel, tierNumber);
        return botInventory;
    }
    apbsGenerateAndAddEquipmentToBot(sessionId, wornItemChances, botRole, botInventory, botLevel, chosenGameVersion, isPmc, raidConfig, tierInfo, questInformation) {
        // These will be handled later
        const excludedSlots = [
            EquipmentSlots_1.EquipmentSlots.POCKETS,
            EquipmentSlots_1.EquipmentSlots.FIRST_PRIMARY_WEAPON,
            EquipmentSlots_1.EquipmentSlots.SECOND_PRIMARY_WEAPON,
            EquipmentSlots_1.EquipmentSlots.HOLSTER,
            EquipmentSlots_1.EquipmentSlots.ARMOR_VEST,
            EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST,
            EquipmentSlots_1.EquipmentSlots.FACE_COVER,
            EquipmentSlots_1.EquipmentSlots.HEADWEAR,
            EquipmentSlots_1.EquipmentSlots.EARPIECE,
            "ArmouredRig"
        ];
        const botEquipConfig = this.botConfig.equipment[this.botGeneratorHelper.getBotEquipmentRole(botRole)];
        const randomistionDetails = this.botHelper.getBotRandomizationDetails(botLevel, botEquipConfig);
        // Get profile of player generating bots, we use their level later on
        const pmcProfile = this.profileHelper.getPmcProfile(sessionId);
        const botEquipmentRole = this.botGeneratorHelper.getBotEquipmentRole(botRole);
        const equipmentPool = this.apbsEquipmentGetter.getEquipmentByBotRole(botRole, tierInfo);
        const modPool = this.apbsEquipmentGetter.getModsByBotRole(botRole, tierInfo);
        // Iterate over all equipment slots of bot, do it in specifc order to reduce conflicts
        // e.g. ArmorVest should be generated after TactivalVest
        // or FACE_COVER before HEADWEAR
        for (const equipmentSlot in equipmentPool) {
            // Skip some slots as they need to be done in a specific order + with specific parameter values
            // e.g. Weapons
            if (excludedSlots.includes(equipmentSlot)) {
                continue;
            }
            this.apbsGenerateEquipment({
                rootEquipmentSlot: equipmentSlot,
                rootEquipmentPool: equipmentPool[equipmentSlot],
                modPool: modPool,
                spawnChances: wornItemChances,
                botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole, tier: tierInfo },
                inventory: botInventory,
                botEquipmentConfig: botEquipConfig,
                randomisationDetails: randomistionDetails,
                generatingPlayerLevel: pmcProfile.Info.Level
            }, questInformation);
        }
        // Generate below in specific order
        this.apbsGenerateEquipment({
            rootEquipmentSlot: EquipmentSlots_1.EquipmentSlots.POCKETS,
            // Unheard profiles have unique sized pockets, TODO - handle this somewhere else in a better way
            rootEquipmentPool: chosenGameVersion === GameEditions_1.GameEditions.UNHEARD && isPmc
                ? { [ItemTpl_1.ItemTpl.POCKETS_1X4_TUE]: 1 }
                : equipmentPool.Pockets,
            modPool: modPool,
            spawnChances: wornItemChances,
            botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole, tier: tierInfo },
            inventory: botInventory,
            botEquipmentConfig: botEquipConfig,
            randomisationDetails: randomistionDetails,
            generateModsBlacklist: [ItemTpl_1.ItemTpl.POCKETS_1X4_TUE],
            generatingPlayerLevel: pmcProfile.Info.Level
        }, questInformation);
        this.apbsGenerateEquipment({
            rootEquipmentSlot: EquipmentSlots_1.EquipmentSlots.FACE_COVER,
            rootEquipmentPool: equipmentPool.FaceCover,
            modPool: modPool,
            spawnChances: wornItemChances,
            botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole, tier: tierInfo },
            inventory: botInventory,
            botEquipmentConfig: botEquipConfig,
            randomisationDetails: randomistionDetails,
            generatingPlayerLevel: pmcProfile.Info.Level
        }, questInformation);
        this.apbsGenerateEquipment({
            rootEquipmentSlot: EquipmentSlots_1.EquipmentSlots.HEADWEAR,
            rootEquipmentPool: equipmentPool.Headwear,
            modPool: modPool,
            spawnChances: wornItemChances,
            botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole, tier: tierInfo },
            inventory: botInventory,
            botEquipmentConfig: botEquipConfig,
            randomisationDetails: randomistionDetails,
            generatingPlayerLevel: pmcProfile.Info.Level
        }, questInformation);
        this.apbsGenerateEquipment({
            rootEquipmentSlot: EquipmentSlots_1.EquipmentSlots.EARPIECE,
            rootEquipmentPool: equipmentPool.Earpiece,
            modPool: modPool,
            spawnChances: wornItemChances,
            botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole, tier: tierInfo },
            inventory: botInventory,
            botEquipmentConfig: botEquipConfig,
            randomisationDetails: randomistionDetails,
            generatingPlayerLevel: pmcProfile.Info.Level
        }, questInformation);
        // If bot is questing & requires a Tactical Vest, ensure the armour spawns.
        if (questInformation.isQuesting) {
            if (questInformation.questData.requiredEquipmentSlots.includes(EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST)) {
                wornItemChances.equipment.ArmorVest = 100;
            }
        }
        const hasArmorVest = this.apbsGenerateEquipment({
            rootEquipmentSlot: EquipmentSlots_1.EquipmentSlots.ARMOR_VEST,
            rootEquipmentPool: equipmentPool.ArmorVest,
            modPool: modPool,
            spawnChances: wornItemChances,
            botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole, tier: tierInfo },
            inventory: botInventory,
            botEquipmentConfig: botEquipConfig,
            randomisationDetails: randomistionDetails,
            generatingPlayerLevel: pmcProfile.Info.Level
        }, questInformation);
        // Bot is flagged as always needing a vest
        if (!hasArmorVest) {
            wornItemChances.equipment.TacticalVest = 100;
        }
        this.apbsGenerateEquipment({
            rootEquipmentSlot: EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST,
            rootEquipmentPool: equipmentPool.TacticalVest,
            modPool: modPool,
            spawnChances: wornItemChances,
            botData: { role: botRole, level: botLevel, equipmentRole: botEquipmentRole, tier: tierInfo },
            inventory: botInventory,
            botEquipmentConfig: botEquipConfig,
            randomisationDetails: randomistionDetails,
            generatingPlayerLevel: pmcProfile.Info.Level
        }, questInformation);
    }
    apbsGenerateEquipment = (settings, questInformation) => {
        if (questInformation.isQuesting) {
            if (questInformation.questData.requiredEquipmentSlots.includes(settings.rootEquipmentSlot)) {
                const newEquipmentPool = {};
                for (const item in questInformation.questData[settings.rootEquipmentSlot]) {
                    const itemTPL = questInformation.questData[settings.rootEquipmentSlot][item];
                    settings.spawnChances.equipment[settings.rootEquipmentSlot] = 100;
                    newEquipmentPool[itemTPL] = 1;
                }
                settings.rootEquipmentPool = newEquipmentPool;
            }
        }
        // Get Armoured Rig if they didn't get an ArmorVest
        if (settings.rootEquipmentSlot == EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST && !settings.inventory.items.find(e => e.slotId === "ArmorVest")) {
            settings.rootEquipmentPool = this.apbsEquipmentGetter.getEquipmentByBotRoleAndSlot(settings.botData.role, settings.botData.tier, "ArmouredRig");
        }
        const spawnChance = [EquipmentSlots_1.EquipmentSlots.POCKETS, EquipmentSlots_1.EquipmentSlots.SECURED_CONTAINER].includes(settings.rootEquipmentSlot)
            ? 100
            : settings.spawnChances.equipment[settings.rootEquipmentSlot];
        if (typeof spawnChance === "undefined") {
            this.logger.warning(this.localisationService.getText("bot-no_spawn_chance_defined_for_equipment_slot", settings.rootEquipmentSlot));
            return false;
        }
        const shouldSpawn = this.randomUtil.getChance100(spawnChance);
        if (shouldSpawn && Object.keys(settings.rootEquipmentPool).length) {
            let pickedItemDb;
            let found = false;
            const maxAttempts = Math.round(Object.keys(settings.rootEquipmentPool).length * 0.75); // Roughly 75% of pool size
            let attempts = 0;
            while (!found) {
                if (Object.values(settings.rootEquipmentPool).length === 0) {
                    return false;
                }
                const chosenItemTpl = this.weightedRandomHelper.getWeightedValue(settings.rootEquipmentPool);
                const dbResult = this.itemHelper.getItem(chosenItemTpl);
                if (!dbResult[0]) {
                    this.logger.error(this.localisationService.getText("bot-missing_item_template", chosenItemTpl));
                    this.logger.info(`EquipmentSlot -> ${settings.rootEquipmentSlot}`);
                    attempts++;
                    continue;
                }
                const compatabilityResult = this.botGeneratorHelper.isItemIncompatibleWithCurrentItems(settings.inventory.items, chosenItemTpl, settings.rootEquipmentSlot);
                if (compatabilityResult.incompatible) {
                    // Tried x different items that failed, stop
                    if (attempts > maxAttempts) {
                        return false;
                    }
                    attempts++;
                }
                else {
                    // Success
                    found = true;
                    pickedItemDb = dbResult[1];
                }
            }
            // Create root item
            const id = this.hashUtil.generate();
            const item = {
                _id: id,
                _tpl: pickedItemDb._id,
                parentId: settings.inventory.equipment,
                slotId: settings.rootEquipmentSlot,
                ...this.botGeneratorHelper.generateExtraPropertiesForItem(pickedItemDb, settings.botData.role)
            };
            // Does item have slots for sub-mods to be inserted into
            if (pickedItemDb._props.Slots?.length > 0 && !settings.generateModsBlacklist?.includes(pickedItemDb._id)) {
                const childItemsToAdd = this.apbsBotEquipmentModGenerator.apbsGenerateModsForEquipment([item], id, pickedItemDb, settings);
                settings.inventory.items.push(...childItemsToAdd);
            }
            else {
                // No slots, add root item only
                settings.inventory.items.push(item);
            }
            return true;
        }
        return false;
    };
    apbsGenerateAndAddWeaponsToBot(templateInventory, equipmentChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel, tierNumber, questInformation) {
        const weaponSlotsToFill = this.getDesiredWeaponsForBot(equipmentChances);
        let hasBothPrimary = false;
        if (weaponSlotsToFill[0].shouldSpawn && weaponSlotsToFill[1].shouldSpawn) {
            hasBothPrimary = true;
        }
        for (const weaponSlot of weaponSlotsToFill) {
            // Add weapon to bot if true and bot json has something to put into the slot
            if (weaponSlot.shouldSpawn && Object.keys(templateInventory.equipment[weaponSlot.slot]).length) {
                this.apbsAddWeaponAndMagazinesToInventory(sessionId, weaponSlot, templateInventory, botInventory, equipmentChances, botRole, isPmc, itemGenerationLimitsMinMax, botLevel, tierNumber, hasBothPrimary, questInformation);
            }
        }
    }
    apbsAddWeaponAndMagazinesToInventory(sessionId, weaponSlot, templateInventory, botInventory, equipmentChances, botRole, isPmc, itemGenerationWeights, botLevel, tierNumber, hasBothPrimary, questInformation) {
        const generatedWeapon = this.apbsBotWeaponGenerator.apbsGenerateRandomWeapon(sessionId, weaponSlot.slot, templateInventory, botInventory.equipment, equipmentChances, botRole, isPmc, botLevel, tierNumber, hasBothPrimary, questInformation);
        botInventory.items.push(...generatedWeapon.weapon);
        if (questInformation.isQuesting && questInformation.questData.questName == "Fishing Gear" && weaponSlot.slot == "SecondPrimaryWeapon")
            return;
        this.apbsBotWeaponGenerator.apbsAddExtraMagazinesToInventory(generatedWeapon, itemGenerationWeights.items.magazines, botInventory, botRole, botLevel, tierNumber);
    }
};
exports.APBSBotInventoryGenerator = APBSBotInventoryGenerator;
exports.APBSBotInventoryGenerator = APBSBotInventoryGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("DatabaseService")),
    __param(4, (0, tsyringe_1.inject)("ApplicationContext")),
    __param(5, (0, tsyringe_1.inject)("BotWeaponGenerator")),
    __param(6, (0, tsyringe_1.inject)("BotLootGenerator")),
    __param(7, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(8, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(9, (0, tsyringe_1.inject)("BotHelper")),
    __param(10, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(11, (0, tsyringe_1.inject)("ItemHelper")),
    __param(12, (0, tsyringe_1.inject)("WeatherHelper")),
    __param(13, (0, tsyringe_1.inject)("LocalisationService")),
    __param(14, (0, tsyringe_1.inject)("BotEquipmentFilterService")),
    __param(15, (0, tsyringe_1.inject)("BotEquipmentModPoolService")),
    __param(16, (0, tsyringe_1.inject)("BotEquipmentModGenerator")),
    __param(17, (0, tsyringe_1.inject)("ConfigServer")),
    __param(18, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(19, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(20, (0, tsyringe_1.inject)("APBSBotWeaponGenerator")),
    __param(21, (0, tsyringe_1.inject)("APBSBotEquipmentModGenerator")),
    __param(22, (0, tsyringe_1.inject)("APBSBotLootGenerator")),
    __param(23, (0, tsyringe_1.inject)("RaidInformation")),
    __param(24, (0, tsyringe_1.inject)("APBSLogger")),
    __param(25, (0, tsyringe_1.inject)("BotQuestHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _d : Object, typeof (_e = typeof ApplicationContext_1.ApplicationContext !== "undefined" && ApplicationContext_1.ApplicationContext) === "function" ? _e : Object, typeof (_f = typeof BotWeaponGenerator_1.BotWeaponGenerator !== "undefined" && BotWeaponGenerator_1.BotWeaponGenerator) === "function" ? _f : Object, typeof (_g = typeof BotLootGenerator_1.BotLootGenerator !== "undefined" && BotLootGenerator_1.BotLootGenerator) === "function" ? _g : Object, typeof (_h = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _h : Object, typeof (_j = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _j : Object, typeof (_k = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _k : Object, typeof (_l = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _l : Object, typeof (_m = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _m : Object, typeof (_o = typeof WeatherHelper_1.WeatherHelper !== "undefined" && WeatherHelper_1.WeatherHelper) === "function" ? _o : Object, typeof (_p = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _p : Object, typeof (_q = typeof BotEquipmentFilterService_1.BotEquipmentFilterService !== "undefined" && BotEquipmentFilterService_1.BotEquipmentFilterService) === "function" ? _q : Object, typeof (_r = typeof BotEquipmentModPoolService_1.BotEquipmentModPoolService !== "undefined" && BotEquipmentModPoolService_1.BotEquipmentModPoolService) === "function" ? _r : Object, typeof (_s = typeof BotEquipmentModGenerator_1.BotEquipmentModGenerator !== "undefined" && BotEquipmentModGenerator_1.BotEquipmentModGenerator) === "function" ? _s : Object, typeof (_t = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _t : Object, typeof (_u = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _u : Object, typeof (_v = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _v : Object, typeof (_w = typeof APBSBotWeaponGenerator_1.APBSBotWeaponGenerator !== "undefined" && APBSBotWeaponGenerator_1.APBSBotWeaponGenerator) === "function" ? _w : Object, typeof (_x = typeof APBSBotEquipmentModGenerator_1.APBSBotEquipmentModGenerator !== "undefined" && APBSBotEquipmentModGenerator_1.APBSBotEquipmentModGenerator) === "function" ? _x : Object, typeof (_y = typeof APBSBotLootGenerator_1.APBSBotLootGenerator !== "undefined" && APBSBotLootGenerator_1.APBSBotLootGenerator) === "function" ? _y : Object, typeof (_z = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _z : Object, typeof (_0 = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _0 : Object, typeof (_1 = typeof BotQuestHelper_1.BotQuestHelper !== "undefined" && BotQuestHelper_1.BotQuestHelper) === "function" ? _1 : Object])
], APBSBotInventoryGenerator);
//# sourceMappingURL=APBSBotInventoryGenerator.js.map