const slugify = require("slugify");
const { check, body , param} = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.sendMessageValidator = [
    check("conversationId")
        .notEmpty()
        .withMessage("conversationId is required")
        .isMongoId()
        .withMessage("Invalid conversationId format"),

    check("content")
        .optional() // ممكن تبقى رسالة فاضية لو مثلاً هتضيف ميديا بعدين
        .isString()
        .withMessage("Message content must be a string")
        .isLength({ min: 1 })
        .withMessage("Message content cannot be empty"),

    validatorMiddleware,
];

exports.getMessagesByConversationValidator = [
    param("conversationId")
        .notEmpty()
        .withMessage("conversationId is required in params")
        .isMongoId()
        .withMessage("Invalid conversationId format"),

    validatorMiddleware,
];

exports.deleteMessageValidator = [
    param("messageId")
        .notEmpty()
        .withMessage("messageId is required in params")
        .isMongoId()
        .withMessage("Invalid messageId format"),

    validatorMiddleware,
];

exports.updateMessageValidator = [
    param("messageId")
        .notEmpty()
        .withMessage("messageId is required in params")
        .isMongoId()
        .withMessage("Invalid messageId format"),

    check("content")
        .notEmpty()
        .withMessage("Message content is required")
        .isString()
        .withMessage("Message content must be a string")
        .isLength({ min: 1 })
        .withMessage("Message content cannot be empty"),

    validatorMiddleware,
];

/*exports.uploadMediaValidator = [
    check("conversationId")
        .notEmpty()
        .withMessage("conversationId is required")
        .isMongoId()
        .withMessage("Invalid conversationId format"),

     // هنتأكد من وجود ملف مرفق
    check("file")
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Media file is required");
        }
        return true;
        }),

    validatorMiddleware,
];*/
