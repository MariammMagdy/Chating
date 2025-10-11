const express = require("express");
const authService = require("../services/authServices");

const {
    createPrivateConversationValidator,
    createGroupConversationValidator,
    getConversationByIdValidator,
    renameGroupValidator,
    addGroupAdminValidator,
    removeGroupAdminValidator,
    addGroupUserValidator,
    removeGroupUserValidator,
    deleteGroupConversationValidator,
} = require("../utils/validator/conversationValidator");

const {
    createPrivateConversation,
    createGroupConversation,
    getUserConversations,
    getConversationById,
    renameGroup,
    addGroupAdmin,
    removeGroupAdmin,
    addGroupUser,
    removeGroupUser,
    deleteGroupConversation,
} = require("../services/conversationServices");

const {protect} = require("../services/authServices");

const router = express.Router();

router.use(protect);

router.post("/private", createPrivateConversationValidator, createPrivateConversation);
router.post("/group", createGroupConversationValidator, createGroupConversation);
router.get("/", getUserConversations);
router.get("/:id", getConversationByIdValidator, getConversationById);
router.put("/:id/rename", renameGroupValidator, renameGroup);
router.put("/:id/addAdmin", addGroupAdminValidator, addGroupAdmin);
router.put("/:id/removeAdmin", removeGroupAdminValidator, removeGroupAdmin);
router.put("/:id/addUser", addGroupUserValidator, addGroupUser);
router.put("/:id/removeUser", removeGroupUserValidator, removeGroupUser);
router.delete("/:id", deleteGroupConversationValidator, deleteGroupConversation);

module.exports = router;
