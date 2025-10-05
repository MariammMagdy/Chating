const slugify = require("slugify");
const { check, body} = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createPrivateConversationValidator = [
    check("userId")
        .notEmpty()
        .withMessage("UserId is required")
        .isMongoId()
        .withMessage("Invalid UserId format"),
    validatorMiddleware,
];

exports.createGroupConversationValidator = [
    body("users")
        .notEmpty()
        .withMessage("Users are required")
        .isArray({ min: 2 })
        .withMessage("A group must have at least 2 users (excluding you)"),
    check("users.*")
        .isMongoId()
        .withMessage("Each user id in users must be a valid MongoId"),
    check("name")
        .notEmpty()
        .withMessage("Group name is required")
        .isLength({ min: 2 })
        .withMessage("Too short group name")
        .isLength({ max: 100 })
        .withMessage("Too long group name"),
    validatorMiddleware,
];

exports.getConversationByIdValidator = [
    check("id")
        .notEmpty()
        .withMessage("Conversation ID is required")
        .isMongoId()
        .withMessage("Invalid Conversation ID format"),
    validatorMiddleware,
];

exports.renameGroupValidator = [
    check("id")
        .notEmpty()
        .withMessage("Conversation ID is required")
        .isMongoId()
        .withMessage("Invalid Conversation ID format"),
    check("name")
        .notEmpty()
        .withMessage("Group name is required")
        .isLength({ min: 2 })
        .withMessage("Too short group name")
        .isLength({ max: 100 })
        .withMessage("Too long group name"),
    validatorMiddleware,
];

exports.addGroupAdminValidator = [
    check("id")
        .notEmpty()
        .withMessage("Conversation ID is required")
        .isMongoId()
        .withMessage("Invalid Conversation ID format"),
    check("userId")
        .notEmpty()
        .withMessage("UserId is required")
        .isMongoId()
        .withMessage("Invalid UserId format"),
    validatorMiddleware,
];

exports.removeGroupAdminValidator = [
    check("id")
        .notEmpty()
        .withMessage("Conversation ID is required")
        .isMongoId()
        .withMessage("Invalid Conversation ID format"),
    check("userId")
        .notEmpty()
        .withMessage("UserId is required")
        .isMongoId()
        .withMessage("Invalid UserId format"),
    validatorMiddleware,
];

exports.addGroupUserValidator = [
    check("id")
        .notEmpty()
        .withMessage("Conversation ID is required")
        .isMongoId()
        .withMessage("Invalid Conversation ID format"),
    check("userId")
        .notEmpty()
        .withMessage("UserId is required")
        .isMongoId()
        .withMessage("Invalid UserId format"),
    validatorMiddleware,
];

exports.removeGroupUserValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Conversation ID format"),
    check("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID format"),
    validatorMiddleware,
];

exports.deleteGroupConversationValidator = [
    check("id")
        .notEmpty()
        .withMessage("Conversation ID is required")
        .isMongoId()
        .withMessage("Invalid Conversation ID format"),
    validatorMiddleware,
];

