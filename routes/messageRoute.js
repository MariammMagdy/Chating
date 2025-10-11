const express = require("express");
const authService = require("../services/authServices");

const {
    sendMessageValidator,
    getMessagesByConversationValidator,
    deleteMessageValidator,
    updateMessageValidator,
    uploadMediaValidator,
} = require("../utils/validator/messageValidator");

const {
    sendMessage,
    getMessagesByConversation,
    deleteMessage,
    updateMessage,
    //uploadMedia,
} = require("../services/messageServices");

const {protect} = require("../services/authServices");

const router = express.Router();

router.use(protect);

router.post("/", sendMessageValidator, sendMessage);
router.get("/:conversationId", getMessagesByConversationValidator, getMessagesByConversation);
router.delete("/:messageId", deleteMessageValidator, deleteMessage);
router.put("/:messageId", updateMessageValidator, updateMessage);
//router.post("/upload", upload.single("media"), uploadMediaValidator, uploadMedia);

module.exports = router;
