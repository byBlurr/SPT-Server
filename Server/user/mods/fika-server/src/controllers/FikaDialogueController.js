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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FikaDialogueController = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const DialogueHelper_1 = require("C:/snapshot/project/obj/helpers/DialogueHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const BackendErrorCodes_1 = require("C:/snapshot/project/obj/models/enums/BackendErrorCodes");
const DialogueController_1 = require("C:/snapshot/project/obj/controllers/DialogueController");
const MessageType_1 = require("C:/snapshot/project/obj/models/enums/MessageType");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
const SptWebSocketConnectionHandler_1 = require("C:/snapshot/project/obj/servers/ws/SptWebSocketConnectionHandler");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const TimeUtil_1 = require("C:/snapshot/project/obj/utils/TimeUtil");
const FikaFriendRequestsHelper_1 = require("../helpers/FikaFriendRequestsHelper");
const FikaPlayerRelationsHelper_1 = require("../helpers/FikaPlayerRelationsHelper");
let FikaDialogueController = class FikaDialogueController {
    profileHelper;
    dialogueHelper;
    fikaFriendRequestsHelper;
    fikaPlayerRelationsHelper;
    dialogueController;
    saveServer;
    hashUtil;
    timeUtil;
    webSocketHandler;
    logger;
    constructor(profileHelper, dialogueHelper, fikaFriendRequestsHelper, fikaPlayerRelationsHelper, dialogueController, saveServer, hashUtil, timeUtil, webSocketHandler, logger) {
        this.profileHelper = profileHelper;
        this.dialogueHelper = dialogueHelper;
        this.fikaFriendRequestsHelper = fikaFriendRequestsHelper;
        this.fikaPlayerRelationsHelper = fikaPlayerRelationsHelper;
        this.dialogueController = dialogueController;
        this.saveServer = saveServer;
        this.hashUtil = hashUtil;
        this.timeUtil = timeUtil;
        this.webSocketHandler = webSocketHandler;
        this.logger = logger;
        // empty
    }
    getFriendList(sessionID) {
        let botsAndFriends = this.dialogueController.getActiveChatBots();
        const friendsIds = this.fikaPlayerRelationsHelper.getFriendsList(sessionID);
        for (const friendId of friendsIds) {
            const profile = this.profileHelper.getPmcProfile(friendId);
            if (!profile) {
                this.fikaPlayerRelationsHelper.removeFriend(sessionID, friendId);
                continue;
            }
            botsAndFriends.push({
                _id: profile._id,
                aid: profile.aid,
                Info: {
                    Nickname: profile.Info.Nickname,
                    Level: profile.Info.Level,
                    Side: profile.Info.Side,
                    MemberCategory: profile.Info.MemberCategory,
                    SelectedMemberCategory: profile.Info.SelectedMemberCategory,
                },
            });
        }
        return {
            Friends: botsAndFriends,
            Ignore: this.fikaPlayerRelationsHelper.getIgnoreList(sessionID),
            InIgnoreList: this.fikaPlayerRelationsHelper.getInIgnoreList(sessionID),
        };
    }
    sendMessage(sessionID, request) {
        const profiles = this.saveServer.getProfiles();
        if (!(sessionID in profiles) || !(request.dialogId in profiles)) {
            // if it's not to another player let SPT handle it
            return DialogueController_1.DialogueController.prototype.sendMessage.call(this.dialogueController, sessionID, request);
        }
        const receiverProfile = profiles[request.dialogId];
        const senderProfile = profiles[sessionID];
        if (!(request.dialogId in senderProfile.dialogues)) {
            senderProfile.dialogues[request.dialogId] = {
                attachmentsNew: 0,
                new: 0,
                pinned: false,
                type: MessageType_1.MessageType.USER_MESSAGE,
                messages: [],
                Users: [],
                _id: request.dialogId,
            };
        }
        const senderDialog = senderProfile.dialogues[request.dialogId];
        senderDialog.Users = [
            {
                _id: receiverProfile.info.id,
                aid: receiverProfile.info.aid,
                Info: {
                    Nickname: receiverProfile.characters.pmc.Info.Nickname,
                    Side: receiverProfile.characters.pmc.Info.Side,
                    Level: receiverProfile.characters.pmc.Info.Level,
                    MemberCategory: receiverProfile.characters.pmc.Info.MemberCategory,
                    SelectedMemberCategory: receiverProfile.characters.pmc.Info.SelectedMemberCategory,
                },
            },
            {
                _id: senderProfile.info.id,
                aid: senderProfile.info.aid,
                Info: {
                    Nickname: senderProfile.characters.pmc.Info.Nickname,
                    Side: senderProfile.characters.pmc.Info.Side,
                    Level: senderProfile.characters.pmc.Info.Level,
                    MemberCategory: senderProfile.characters.pmc.Info.MemberCategory,
                    SelectedMemberCategory: receiverProfile.characters.pmc.Info.SelectedMemberCategory,
                },
            },
        ];
        if (!(sessionID in receiverProfile.dialogues)) {
            receiverProfile.dialogues[sessionID] = {
                attachmentsNew: 0,
                new: 0,
                pinned: false,
                type: MessageType_1.MessageType.USER_MESSAGE,
                messages: [],
                _id: sessionID,
                Users: [],
            };
        }
        const receiverDialog = receiverProfile.dialogues[sessionID];
        receiverDialog.new++;
        receiverDialog.Users = [
            {
                _id: senderProfile.info.id,
                aid: senderProfile.info.aid,
                Info: {
                    Nickname: senderProfile.characters.pmc.Info.Nickname,
                    Side: senderProfile.characters.pmc.Info.Side,
                    Level: senderProfile.characters.pmc.Info.Level,
                    MemberCategory: senderProfile.characters.pmc.Info.MemberCategory,
                    SelectedMemberCategory: receiverProfile.characters.pmc.Info.SelectedMemberCategory,
                },
            },
            {
                _id: receiverProfile.info.id,
                aid: receiverProfile.info.aid,
                Info: {
                    Nickname: receiverProfile.characters.pmc.Info.Nickname,
                    Side: receiverProfile.characters.pmc.Info.Side,
                    Level: receiverProfile.characters.pmc.Info.Level,
                    MemberCategory: receiverProfile.characters.pmc.Info.MemberCategory,
                    SelectedMemberCategory: receiverProfile.characters.pmc.Info.SelectedMemberCategory,
                },
            },
        ];
        const message = {
            _id: this.hashUtil.generate(),
            uid: sessionID,
            type: request.type,
            Member: {
                Nickname: senderProfile.characters.pmc.Info.Nickname,
                Side: senderProfile.characters.pmc.Info.Side,
                Level: senderProfile.characters.pmc.Info.Level,
                MemberCategory: senderProfile.characters.pmc.Info.MemberCategory,
                Ignored: this.fikaPlayerRelationsHelper.getInIgnoreList(sessionID).includes(request.dialogId),
                Banned: false,
            },
            dt: this.timeUtil.getTimestamp(),
            text: request.text,
            rewardCollected: false,
        };
        if (request.replyTo) {
            const replyMessage = this.getMessageToReplyTo(request.dialogId, request.replyTo, sessionID);
            if (replyMessage) {
                message.replyTo = replyMessage;
            }
        }
        senderDialog.messages.push(message);
        receiverDialog.messages.push(message);
        this.webSocketHandler.sendMessageAsync(receiverProfile.info.id, {
            type: "new_message",
            eventId: "new_message",
            EventId: "new_message",
            dialogId: sessionID,
            message: message,
        });
        return message._id;
    }
    /**
     * @param recipientId The id of the recipient
     * @param replyToId The id of the message to reply to
     * @param dialogueId The id of the dialogue (traderId or profileId)
     * @returns A new instance with data from the found message, otherwise undefined
     */
    getMessageToReplyTo(recipientId, replyToId, dialogueId) {
        let message = undefined;
        const currentDialogue = this.dialogueHelper.getDialogueFromProfile(recipientId, dialogueId);
        if (!currentDialogue) {
            this.logger.warning(`Could not find dialogue ${dialogueId} from sender`);
            return message;
        }
        for (const dialogueMessage of currentDialogue.messages) {
            if (dialogueMessage._id === replyToId) {
                message = {
                    _id: dialogueMessage._id,
                    dt: dialogueMessage.dt,
                    type: dialogueMessage.type,
                    uid: dialogueMessage.uid,
                    text: dialogueMessage.text,
                };
                break;
            }
        }
        return message;
    }
    listOutbox(sessionID) {
        const sentFriendRequests = this.fikaFriendRequestsHelper.getSentFriendRequests(sessionID);
        for (const sentFriendRequest of sentFriendRequests) {
            const profile = this.profileHelper.getPmcProfile(sentFriendRequest.to);
            if (!profile) {
                continue;
            }
            sentFriendRequest.profile = {
                _id: profile._id,
                aid: profile.aid,
                Info: {
                    Nickname: profile.Info.Nickname,
                    Side: profile.Info.Side,
                    Level: profile.Info.Level,
                    MemberCategory: profile.Info.MemberCategory,
                },
            };
        }
        return sentFriendRequests;
    }
    listInbox(sessionID) {
        const receivedFriendRequests = this.fikaFriendRequestsHelper.getReceivedFriendRequests(sessionID);
        for (const receivedFriendRequest of receivedFriendRequests) {
            const profile = this.profileHelper.getPmcProfile(receivedFriendRequest.from);
            if (!profile) {
                continue;
            }
            receivedFriendRequest.profile = {
                _id: profile._id,
                aid: profile.aid,
                Info: {
                    Nickname: profile.Info.Nickname,
                    Side: profile.Info.Side,
                    Level: profile.Info.Level,
                    MemberCategory: profile.Info.MemberCategory,
                },
            };
        }
        return receivedFriendRequests;
    }
    sendFriendRequest(from, to) {
        this.fikaFriendRequestsHelper.addFriendRequest(from, to);
        return {
            status: BackendErrorCodes_1.BackendErrorCodes.NONE,
            requestId: from,
            retryAfter: 0,
        };
    }
    acceptAllFriendRequests(sessionID) {
        const receivedFriendRequests = this.fikaFriendRequestsHelper.getReceivedFriendRequests(sessionID);
        for (const friendRequest of receivedFriendRequests) {
            this.acceptFriendRequest(friendRequest.from, friendRequest.to);
        }
    }
    acceptFriendRequest(from, to) {
        this.fikaFriendRequestsHelper.removeFriendRequest(from, to, "accept");
        this.fikaPlayerRelationsHelper.addFriend(from, to);
    }
    cancelFriendRequest(from, to) {
        this.fikaFriendRequestsHelper.removeFriendRequest(from, to, "cancel");
    }
    declineFriendRequest(from, to) {
        this.fikaFriendRequestsHelper.removeFriendRequest(from, to, "decline");
    }
    deleteFriend(fromId, friendId) {
        this.fikaPlayerRelationsHelper.removeFriend(fromId, friendId);
    }
    ignoreFriend(fromId, friendId) {
        this.fikaPlayerRelationsHelper.addToIgnoreList(fromId, friendId);
    }
    unIgnoreFriend(fromId, friendId) {
        this.fikaPlayerRelationsHelper.removeFromIgnoreList(fromId, friendId);
    }
};
exports.FikaDialogueController = FikaDialogueController;
exports.FikaDialogueController = FikaDialogueController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(1, (0, tsyringe_1.inject)("DialogueHelper")),
    __param(2, (0, tsyringe_1.inject)("FikaFriendRequestsHelper")),
    __param(3, (0, tsyringe_1.inject)("FikaPlayerRelationsHelper")),
    __param(4, (0, tsyringe_1.inject)("DialogueController")),
    __param(5, (0, tsyringe_1.inject)("SaveServer")),
    __param(6, (0, tsyringe_1.inject)("HashUtil")),
    __param(7, (0, tsyringe_1.inject)("TimeUtil")),
    __param(8, (0, tsyringe_1.inject)("SptWebSocketConnectionHandler")),
    __param(9, (0, tsyringe_1.inject)("WinstonLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _a : Object, typeof (_b = typeof DialogueHelper_1.DialogueHelper !== "undefined" && DialogueHelper_1.DialogueHelper) === "function" ? _b : Object, typeof (_c = typeof FikaFriendRequestsHelper_1.FikaFriendRequestsHelper !== "undefined" && FikaFriendRequestsHelper_1.FikaFriendRequestsHelper) === "function" ? _c : Object, typeof (_d = typeof FikaPlayerRelationsHelper_1.FikaPlayerRelationsHelper !== "undefined" && FikaPlayerRelationsHelper_1.FikaPlayerRelationsHelper) === "function" ? _d : Object, typeof (_e = typeof DialogueController_1.DialogueController !== "undefined" && DialogueController_1.DialogueController) === "function" ? _e : Object, typeof (_f = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _f : Object, typeof (_g = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _g : Object, typeof (_h = typeof TimeUtil_1.TimeUtil !== "undefined" && TimeUtil_1.TimeUtil) === "function" ? _h : Object, typeof (_j = typeof SptWebSocketConnectionHandler_1.SptWebSocketConnectionHandler !== "undefined" && SptWebSocketConnectionHandler_1.SptWebSocketConnectionHandler) === "function" ? _j : Object, Object])
], FikaDialogueController);
//# sourceMappingURL=FikaDialogueController.js.map