"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const FikaConfig_1 = require("../utils/FikaConfig");
const Overrider_1 = require("../overrides/Overrider");
const DialogueCallbacks_1 = require("../overrides/callbacks/DialogueCallbacks");
const AchievementController_1 = require("../overrides/controllers/AchievementController");
const DialogueController_1 = require("../overrides/controllers/DialogueController");
const ProfileController_1 = require("../overrides/controllers/ProfileController");
// import { LocalesOverride } from "../overrides/other/Locales";
const HttpRouter_1 = require("../overrides/routers/HttpRouter");
const LocationLifecycleService_1 = require("../overrides/services/LocationLifecycleService");
const FikaInsuranceService_1 = require("../services/FikaInsuranceService");
const FikaMatchService_1 = require("../services/FikaMatchService");
const FikaPresenceService_1 = require("../services/FikaPresenceService");
const FikaFriendRequestsCacheService_1 = require("../services/cache/FikaFriendRequestsCacheService");
const FikaPlayerRelationsCacheService_1 = require("../services/cache/FikaPlayerRelationsCacheService");
const FikaClientModHashesHelper_1 = require("../helpers/FikaClientModHashesHelper");
const FikaFriendRequestsHelper_1 = require("../helpers/FikaFriendRequestsHelper");
const FikaPlayerRelationsHelper_1 = require("../helpers/FikaPlayerRelationsHelper");
const FikaAchievementController_1 = require("../controllers/FikaAchievementController");
const FikaClientController_1 = require("../controllers/FikaClientController");
const FikaDialogueController_1 = require("../controllers/FikaDialogueController");
const FikaLocationController_1 = require("../controllers/FikaLocationController");
const FikaRaidController_1 = require("../controllers/FikaRaidController");
const FikaSendItemController_1 = require("../controllers/FikaSendItemController");
const FikaUpdateController_1 = require("../controllers/FikaUpdateController");
const FikaClientCallbacks_1 = require("../callbacks/FikaClientCallbacks");
const FikaLocationCallbacks_1 = require("../callbacks/FikaLocationCallbacks");
const FikaPresenceCallbacks_1 = require("../callbacks/FikaPresenceCallbacks");
const FikaRaidCallbacks_1 = require("../callbacks/FikaRaidCallbacks");
const FikaSendItemCallbacks_1 = require("../callbacks/FikaSendItemCallbacks");
const FikaUpdateCallbacks_1 = require("../callbacks/FikaUpdateCallbacks");
const FikaItemEventRouter_1 = require("../routers/item_events/FikaItemEventRouter");
const FikaClientStaticRouter_1 = require("../routers/static/FikaClientStaticRouter");
const FikaLocationStaticRouter_1 = require("../routers/static/FikaLocationStaticRouter");
const FikaPresenceStaticRouter_1 = require("../routers/static/FikaPresenceStaticRouter");
const FikaRaidStaticRouter_1 = require("../routers/static/FikaRaidStaticRouter");
const FikaSendItemStaticRouter_1 = require("../routers/static/FikaSendItemStaticRouter");
const FikaUpdateStaticRouter_1 = require("../routers/static/FikaUpdateStaticRouter");
const FikaNotificationWebSocket_1 = require("../websockets/FikaNotificationWebSocket");
const Fika_1 = require("../Fika");
const FikaHeadlessCallbacks_1 = require("../callbacks/FikaHeadlessCallbacks");
const FikaNotificationCallbacks_1 = require("../callbacks/FikaNotificationCallbacks");
const FikaHeadlessController_1 = require("../controllers/FikaHeadlessController");
const FikaHeadlessHelper_1 = require("../helpers/FikaHeadlessHelper");
const ClientLogCallbacks_1 = require("../overrides/callbacks/ClientLogCallbacks");
const FikaHeadlessStaticRouter_1 = require("../routers/static/FikaHeadlessStaticRouter");
const FikaNotificationStaticRouter_1 = require("../routers/static/FikaNotificationStaticRouter");
const FikaClientService_1 = require("../services/FikaClientService");
const FikaHeadlessProfileService_1 = require("../services/headless/FikaHeadlessProfileService");
const FikaHeadlessService_1 = require("../services/headless/FikaHeadlessService");
const FikaServerTools_1 = require("../utils/FikaServerTools");
const FikaHeadlessClientWebSocket_1 = require("../websockets/FikaHeadlessClientWebSocket");
const FikaHeadlessRequesterWebSocket_1 = require("../websockets/FikaHeadlessRequesterWebSocket");
class Container {
    static register(container) {
        Container.registerUtils(container);
        Container.registerOverrides(container);
        Container.registerServices(container);
        Container.registerHelpers(container);
        Container.registerControllers(container);
        Container.registerCallbacks(container);
        Container.registerRouters(container);
        Container.registerWebSockets(container);
        Container.registerListTypes(container);
        container.register("Fika", Fika_1.Fika, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerListTypes(container) {
        container.registerType("Overrides", "DialogueCallbacksOverride");
        container.registerType("Overrides", "DialogueControllerOverride");
        container.registerType("Overrides", "ProfileControllerOverride");
        container.registerType("Overrides", "HttpRouterOverride");
        // container.registerType("Overrides", "LocalesOverride");
        container.registerType("Overrides", "AchievementControllerOverride");
        container.registerType("Overrides", "LocationLifecycleServiceOverride");
        container.registerType("StaticRoutes", "FikaClientStaticRouter");
        container.registerType("StaticRoutes", "FikaHeadlessStaticRouter");
        container.registerType("StaticRoutes", "FikaLocationStaticRouter");
        container.registerType("StaticRoutes", "FikaRaidStaticRouter");
        container.registerType("StaticRoutes", "FikaSendItemStaticRouter");
        container.registerType("StaticRoutes", "FikaUpdateStaticRouter");
        container.registerType("StaticRoutes", "FikaNotificationStaticRouter");
        container.registerType("StaticRoutes", "FikaPresenceStaticRouter");
        container.registerType("IERouters", "FikaItemEventRouter");
        container.registerType("WebSocketConnectionHandler", "FikaNotificationWebSocket");
        container.registerType("WebSocketConnectionHandler", "FikaHeadlessClientWebSocket");
        container.registerType("WebSocketConnectionHandler", "FikaHeadlessRequesterWebSocket");
    }
    static registerUtils(container) {
        container.register("FikaConfig", FikaConfig_1.FikaConfig, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaServerTools", FikaServerTools_1.FikaServerTools, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerOverrides(container) {
        container.register("DialogueCallbacksOverride", DialogueCallbacks_1.DialogueCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("ClientLogCallbacksOverride", ClientLogCallbacks_1.ClientLogCallbacksOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("DialogueControllerOverride", DialogueController_1.DialogueControllerOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("ProfileControllerOverride", ProfileController_1.ProfileControllerOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("HttpRouterOverride", HttpRouter_1.HttpRouterOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        // container.register<LocalesOverride>("LocalesOverride", LocalesOverride, { lifecycle: Lifecycle.Singleton });
        container.register("Overrider", Overrider_1.Overrider, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("AchievementControllerOverride", AchievementController_1.AchievementControllerOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("LocationLifecycleServiceOverride", LocationLifecycleService_1.LocationLifecycleServiceOverride, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerServices(container) {
        container.register("FikaClientService", FikaClientService_1.FikaClientService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaMatchService", FikaMatchService_1.FikaMatchService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaFriendRequestsCacheService", FikaFriendRequestsCacheService_1.FikaFriendRequestsCacheService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaPlayerRelationsCacheService", FikaPlayerRelationsCacheService_1.FikaPlayerRelationsCacheService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaHeadlessProfileService", FikaHeadlessProfileService_1.FikaHeadlessProfileService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaInsuranceService", FikaInsuranceService_1.FikaInsuranceService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaPresenceService", FikaPresenceService_1.FikaPresenceService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaHeadlessService", FikaHeadlessService_1.FikaHeadlessService, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
    static registerHelpers(container) {
        container.register("FikaClientModHashesHelper", FikaClientModHashesHelper_1.FikaClientModHashesHelper, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaFriendRequestsHelper", { useClass: FikaFriendRequestsHelper_1.FikaFriendRequestsHelper });
        container.register("FikaPlayerRelationsHelper", { useClass: FikaPlayerRelationsHelper_1.FikaPlayerRelationsHelper });
        container.register("FikaHeadlessHelper", { useClass: FikaHeadlessHelper_1.FikaHeadlessHelper });
    }
    static registerControllers(container) {
        container.register("FikaClientController", { useClass: FikaClientController_1.FikaClientController });
        container.register("FikaHeadlessController", { useClass: FikaHeadlessController_1.FikaHeadlessController });
        container.register("FikaDialogueController", { useClass: FikaDialogueController_1.FikaDialogueController });
        container.register("FikaLocationController", { useClass: FikaLocationController_1.FikaLocationController });
        container.register("FikaRaidController", { useClass: FikaRaidController_1.FikaRaidController });
        container.register("FikaSendItemController", { useClass: FikaSendItemController_1.FikaSendItemController });
        container.register("FikaUpdateController", { useClass: FikaUpdateController_1.FikaUpdateController });
        container.register("FikaAchievementController", { useClass: FikaAchievementController_1.FikaAchievementController });
    }
    static registerCallbacks(container) {
        container.register("FikaClientCallbacks", { useClass: FikaClientCallbacks_1.FikaClientCallbacks });
        container.register("FikaHeadlessCallbacks", { useClass: FikaHeadlessCallbacks_1.FikaHeadlessCallbacks });
        container.register("FikaLocationCallbacks", { useClass: FikaLocationCallbacks_1.FikaLocationCallbacks });
        container.register("FikaRaidCallbacks", { useClass: FikaRaidCallbacks_1.FikaRaidCallbacks });
        container.register("FikaSendItemCallbacks", { useClass: FikaSendItemCallbacks_1.FikaSendItemCallbacks });
        container.register("FikaUpdateCallbacks", { useClass: FikaUpdateCallbacks_1.FikaUpdateCallbacks });
        container.register("FikaNotificationCallbacks", { useClass: FikaNotificationCallbacks_1.FikaNotificationCallbacks });
        container.register("FikaPresenceCallbacks", { useClass: FikaPresenceCallbacks_1.FikaPresenceCallbacks });
    }
    static registerRouters(container) {
        container.register("FikaClientStaticRouter", { useClass: FikaClientStaticRouter_1.FikaClientStaticRouter });
        container.register("FikaHeadlessStaticRouter", { useClass: FikaHeadlessStaticRouter_1.FikaHeadlessStaticRouter });
        container.register("FikaLocationStaticRouter", { useClass: FikaLocationStaticRouter_1.FikaLocationStaticRouter });
        container.register("FikaRaidStaticRouter", { useClass: FikaRaidStaticRouter_1.FikaRaidStaticRouter });
        container.register("FikaSendItemStaticRouter", { useClass: FikaSendItemStaticRouter_1.FikaSendItemStaticRouter });
        container.register("FikaUpdateStaticRouter", { useClass: FikaUpdateStaticRouter_1.FikaUpdateStaticRouter });
        container.register("FikaItemEventRouter", { useClass: FikaItemEventRouter_1.FikaItemEventRouter });
        container.register("FikaNotificationStaticRouter", { useClass: FikaNotificationStaticRouter_1.FikaNotificationStaticRouter });
        container.register("FikaPresenceStaticRouter", { useClass: FikaPresenceStaticRouter_1.FikaPresenceStaticRouter });
    }
    static registerWebSockets(container) {
        container.register("FikaNotificationWebSocket", FikaNotificationWebSocket_1.FikaNotificationWebSocket, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaHeadlessClientWebSocket", FikaHeadlessClientWebSocket_1.FikaHeadlessClientWebSocket, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        container.register("FikaHeadlessRequesterWebSocket", FikaHeadlessRequesterWebSocket_1.FikaHeadlessRequesterWebSocket, { lifecycle: tsyringe_1.Lifecycle.Singleton });
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map