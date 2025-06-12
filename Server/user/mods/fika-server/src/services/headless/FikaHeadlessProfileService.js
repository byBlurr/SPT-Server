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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaHeadlessProfileService = void 0;
const path_1 = __importDefault(require("path"));
const ProfileController_1 = require("C:/snapshot/project/obj/controllers/ProfileController");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const FileSystem_1 = require("C:/snapshot/project/obj/utils/FileSystem");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const InventoryHelper_1 = require("C:/snapshot/project/obj/helpers/InventoryHelper");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaConfig_1 = require("../../utils/FikaConfig");
let FikaHeadlessProfileService = class FikaHeadlessProfileService {
    saveServer;
    logger;
    hashUtil;
    profileController;
    fikaConfig;
    configServer;
    inventoryHelper;
    fileSystem;
    scriptsPath = path_1.default.join(__dirname, "../../../assets/scripts");
    HEAD_USEC_4 = "5fdb4139e4ed5b5ea251e4ed"; // _parent: 5cc085e214c02e000c6bea67
    VOICE_USEC_4 = "6284d6a28e4092597733b7a6"; // _parent: 5fc100cf95572123ae738483
    httpConfig;
    headlessProfiles = [];
    constructor(saveServer, logger, hashUtil, profileController, fikaConfig, configServer, inventoryHelper, fileSystem) {
        this.saveServer = saveServer;
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.profileController = profileController;
        this.fikaConfig = fikaConfig;
        this.configServer = configServer;
        this.inventoryHelper = inventoryHelper;
        this.fileSystem = fileSystem;
        this.httpConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.HTTP);
    }
    getHeadlessProfiles() {
        return this.headlessProfiles;
    }
    async init() {
        const headlessConfig = this.fikaConfig.getConfig().headless;
        this.headlessProfiles = this.loadHeadlessProfiles();
        this.logger.info(`Found ${this.headlessProfiles.length} headless client profiles.`);
        const profileAmount = headlessConfig.profiles.amount;
        if (this.headlessProfiles.length < profileAmount) {
            const createdProfiles = await this.createHeadlessProfiles(profileAmount);
            this.logger.success(`Created ${createdProfiles.length} headless client profiles!`);
            if (headlessConfig.scripts.generate) {
                let ip = this.httpConfig.ip;
                const port = this.httpConfig.port;
                const forceIp = headlessConfig.scripts.forceIp;
                if (forceIp != "") {
                    ip = forceIp;
                }
                if (ip == "0.0.0.0") {
                    ip = "127.0.0.1";
                }
                const backendUrl = `https://${ip}:${port}`;
                for (const profile of createdProfiles) {
                    await this.generateLaunchScript(profile.info.id, backendUrl, this.scriptsPath);
                }
            }
        }
    }
    loadHeadlessProfiles() {
        let profiles = [];
        for (const profileId in this.saveServer.getProfiles()) {
            const profile = this.saveServer.getProfile(profileId);
            if (profile.info.password === "fika-headless") {
                profiles.push(profile);
            }
        }
        return profiles;
    }
    async createHeadlessProfiles(profileAmount) {
        let profileCount = this.headlessProfiles.length;
        let profileAmountToCreate = profileAmount - profileCount;
        let createdProfiles = [];
        for (let i = 0; i < profileAmountToCreate; i++) {
            const profile = await this.createHeadlessProfile();
            createdProfiles.push(profile);
            this.headlessProfiles.push(profile);
        }
        return createdProfiles;
    }
    async createHeadlessProfile() {
        // Generate a unique username
        const username = `headless_${this.hashUtil.generate()}`;
        // Using a password allows us to know which profiles are headless client profiles.
        const password = "fika-headless";
        // Random edition. Doesn't matter
        const edition = "Standard";
        // Create mini profile
        const profileId = await this.createMiniProfile(username, password, edition);
        // Random character configs. Doesn't matter.
        const newProfileData = {
            side: "usec",
            nickname: username, // Use the username as the nickname to ensure it is unique.
            headId: this.HEAD_USEC_4,
            voiceId: this.VOICE_USEC_4,
        };
        const profile = await this.createFullProfile(newProfileData, profileId);
        return profile;
    }
    async createMiniProfile(username, password, edition) {
        const profileId = this.hashUtil.generate();
        const scavId = this.hashUtil.generate();
        const newProfileDetails = {
            id: profileId,
            scavId: scavId,
            aid: this.hashUtil.generateAccountId(),
            username: username,
            password: password,
            wipe: true,
            edition: edition,
        };
        this.saveServer.createProfile(newProfileDetails);
        await this.saveServer.loadProfile(profileId);
        await this.saveServer.saveProfile(profileId);
        return profileId;
    }
    async createFullProfile(profileData, profileId) {
        await this.profileController.createProfile(profileData, profileId);
        const profile = this.saveServer.getProfile(profileId);
        this.clearUnecessaryHeadlessItems(profile.characters.pmc, profileId);
        return profile;
    }
    async generateLaunchScript(profileId, backendUrl, scriptsFolderPath) {
        try {
            if (!(await this.fileSystem.exists(scriptsFolderPath))) {
                await this.fileSystem.ensureDir(scriptsFolderPath);
            }
            const templatePath = path_1.default.join(scriptsFolderPath, "_TEMPLATE.ps1");
            const templateContent = await this.fileSystem.read(templatePath);
            const scriptName = `Start_headless_${profileId}.ps1`;
            const scriptPath = path_1.default.join(scriptsFolderPath, scriptName);
            const scriptContent = templateContent.replace("${profileId}", profileId).replace("${backendUrl}", backendUrl);
            await this.fileSystem.write(scriptPath, scriptContent);
            this.logger.success(`Generated launch script: /fika-server/assets/scripts/${scriptName}`);
        }
        catch (error) {
            this.logger.error(`Failed to generate launch script: ${error}`);
        }
    }
    clearUnecessaryHeadlessItems(pmcProfile, sessionId) {
        const itemsToDelete = this.getAllHeadlessItems(pmcProfile).map((item) => item._id);
        for (const itemIdToDelete of itemsToDelete) {
            this.inventoryHelper.removeItem(pmcProfile, itemIdToDelete, sessionId);
        }
        pmcProfile.Inventory.fastPanel = {};
    }
    getAllHeadlessItems(pmcProfile) {
        const inventoryItems = pmcProfile.Inventory.items ?? [];
        const equipmentRootId = pmcProfile?.Inventory?.equipment;
        const stashRootId = pmcProfile?.Inventory.stash;
        return inventoryItems.filter((item) => item.parentId == equipmentRootId || item.parentId == stashRootId);
    }
};
exports.FikaHeadlessProfileService = FikaHeadlessProfileService;
exports.FikaHeadlessProfileService = FikaHeadlessProfileService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SaveServer")),
    __param(1, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(2, (0, tsyringe_1.inject)("HashUtil")),
    __param(3, (0, tsyringe_1.inject)("ProfileController")),
    __param(4, (0, tsyringe_1.inject)("FikaConfig")),
    __param(5, (0, tsyringe_1.inject)("ConfigServer")),
    __param(6, (0, tsyringe_1.inject)("InventoryHelper")),
    __param(7, (0, tsyringe_1.inject)("FileSystem")),
    __metadata("design:paramtypes", [typeof (_a = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _a : Object, Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof ProfileController_1.ProfileController !== "undefined" && ProfileController_1.ProfileController) === "function" ? _c : Object, typeof (_d = typeof FikaConfig_1.FikaConfig !== "undefined" && FikaConfig_1.FikaConfig) === "function" ? _d : Object, typeof (_e = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _e : Object, typeof (_f = typeof InventoryHelper_1.InventoryHelper !== "undefined" && InventoryHelper_1.InventoryHelper) === "function" ? _f : Object, typeof (_g = typeof FileSystem_1.FileSystem !== "undefined" && FileSystem_1.FileSystem) === "function" ? _g : Object])
], FikaHeadlessProfileService);
//# sourceMappingURL=FikaHeadlessProfileService.js.map