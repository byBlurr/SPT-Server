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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaConfig = void 0;
const node_path_1 = __importDefault(require("node:path"));
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const PreSptModLoader_1 = require("C:/snapshot/project/obj/loaders/PreSptModLoader");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const FileSystem_1 = require("C:/snapshot/project/obj/utils/FileSystem");
const package_json_1 = __importDefault(require("../../package.json"));
let FikaConfig = class FikaConfig {
    preSptModLoader;
    fileSystem;
    jsonUtil;
    configServer;
    logger;
    modAuthor;
    modName;
    modPath;
    fikaConfig;
    defaultFikaConfig = {
        client: {
            useBtr: true,
            friendlyFire: true,
            dynamicVExfils: false,
            allowFreeCam: false,
            allowSpectateFreeCam: false,
            blacklistedItems: [],
            forceSaveOnDeath: false,
            mods: {
                required: [],
                optional: [],
            },
            useInertia: true,
            sharedQuestProgression: false,
            canEditRaidSettings: true,
            enableTransits: true,
            anyoneCanStartRaid: false,
        },
        server: {
            SPT: {
                http: {
                    ip: "0.0.0.0",
                    port: 6969,
                    backendIp: "0.0.0.0",
                    backendPort: 6969,
                },
                disableSPTChatBots: true,
            },
            allowItemSending: true,
            sentItemsLoseFIR: true,
            launcherListAllProfiles: false,
            sessionTimeout: 5,
            showDevProfile: false,
            showNonStandardProfile: false,
            logClientModsInConsole: false,
        },
        natPunchServer: {
            enable: false,
            port: 6790,
            natIntroduceAmount: 1,
        },
        headless: {
            profiles: {
                amount: 0,
                aliases: {},
            },
            scripts: {
                generate: true,
                forceIp: "",
            },
            setLevelToAverageOfLobby: true,
            restartAfterAmountOfRaids: 0,
        },
        background: {
            enable: true,
            easteregg: false,
        },
    };
    constructor(preSptModLoader, fileSystem, jsonUtil, configServer, logger) {
        this.preSptModLoader = preSptModLoader;
        this.fileSystem = fileSystem;
        this.jsonUtil = jsonUtil;
        this.configServer = configServer;
        this.logger = logger;
        this.modAuthor = package_json_1.default.author.replace(/\W/g, "").toLowerCase();
        this.modName = package_json_1.default.name.replace(/\W/g, "").toLowerCase();
        this.modPath = this.preSptModLoader.getModPath(this.getModFolderName());
    }
    async preInit() {
        const configPath = node_path_1.default.join(this.modPath, "assets/configs/fika.jsonc");
        if (!(await this.fileSystem.exists(node_path_1.default.join(configPath)))) {
            await this.fileSystem.writeJson(configPath, this.defaultFikaConfig, "\t");
        }
        this.fikaConfig = this.jsonUtil.deserializeJsonC(await this.fileSystem.read(configPath));
        if (await this.checkAndAddMissingConfigProperties(this.defaultFikaConfig, this.fikaConfig)) {
            this.fikaConfig = this.sortProperties(this.defaultFikaConfig, this.fikaConfig);
            await this.fileSystem.writeJson(configPath, this.fikaConfig, "\t");
        }
        await this.applySPTConfig(this.fikaConfig.server.SPT);
    }
    async checkAndAddMissingConfigProperties(source, target) {
        let modified = false;
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === "object" && !Array.isArray(source[key])) {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = {};
                        modified = true;
                    }
                    const nestedModified = await this.checkAndAddMissingConfigProperties(source[key], target[key]);
                    if (nestedModified) {
                        modified = true;
                    }
                }
                else {
                    if (!target.hasOwnProperty(key)) {
                        target[key] = source[key];
                        modified = true;
                    }
                }
            }
        }
        return modified;
    }
    sortProperties(source, target) {
        // Cast as IFikaConfig as this is empty before sorting.
        const sortedTarget = {};
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === "object" && !Array.isArray(source[key])) {
                    sortedTarget[key] = this.sortProperties(source[key], target[key] || {});
                }
                else {
                    sortedTarget[key] = target[key];
                }
            }
        }
        return sortedTarget;
    }
    async applySPTConfig(config) {
        this.logger.info("[Fika Server] Overriding SPT configuration");
        const coreConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.CORE);
        const httpConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.HTTP);
        if (config.disableSPTChatBots) {
            const commando = coreConfig.features.chatbotFeatures.ids.commando;
            const sptFriend = coreConfig.features.chatbotFeatures.ids.spt;
            coreConfig.features.chatbotFeatures.enabledBots[commando] = false;
            coreConfig.features.chatbotFeatures.enabledBots[sptFriend] = false;
        }
        httpConfig.ip = config.http.ip;
        httpConfig.port = config.http.port;
        httpConfig.backendIp = config.http.backendIp;
        httpConfig.backendPort = config.http.backendPort;
    }
    updateFikaConfig(config) {
        if (config != this.fikaConfig) {
            this.fikaConfig = config;
            const coreConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.CORE);
            const commando = coreConfig.features.chatbotFeatures.ids.commando;
            const sptFriend = coreConfig.features.chatbotFeatures.ids.spt;
            // Re-handle chatbot settings
            if (config.server.SPT.disableSPTChatBots) {
                coreConfig.features.chatbotFeatures.enabledBots[commando] = false;
                coreConfig.features.chatbotFeatures.enabledBots[sptFriend] = false;
            }
            else {
                coreConfig.features.chatbotFeatures.enabledBots[commando] = true;
                coreConfig.features.chatbotFeatures.enabledBots[sptFriend] = true;
            }
            return true;
        }
        return false;
    }
    getConfig() {
        return this.fikaConfig;
    }
    getModFolderName() {
        return `${this.modAuthor}-${this.modName}`;
    }
    getModPath() {
        return this.modPath;
    }
    getVersion() {
        return package_json_1.default.version;
    }
};
exports.FikaConfig = FikaConfig;
exports.FikaConfig = FikaConfig = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PreSptModLoader")),
    __param(1, (0, tsyringe_1.inject)("FileSystem")),
    __param(2, (0, tsyringe_1.inject)("JsonUtil")),
    __param(3, (0, tsyringe_1.inject)("ConfigServer")),
    __param(4, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof PreSptModLoader_1.PreSptModLoader !== "undefined" && PreSptModLoader_1.PreSptModLoader) === "function" ? _a : Object, typeof (_b = typeof FileSystem_1.FileSystem !== "undefined" && FileSystem_1.FileSystem) === "function" ? _b : Object, typeof (_c = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _c : Object, typeof (_d = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _d : Object, Object])
], FikaConfig);
//# sourceMappingURL=FikaConfig.js.map