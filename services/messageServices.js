const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");


// @desc    Send (create) a new message
// @route   POST /api/v1/messages
// @access  Private/protect
exports.sendMessage = asyncHandler(async (req, res, next) => {
    const { conversationId, content } = req.body;

    // ✅ Validate conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return next(new ApiError("Conversation not found", 404));
    }

    // ✅ Create the new message
    const newMessage = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        content,
    });

    // ✅ Update lastMessage & lastMessageAt in conversation
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage._id,
        lastMessageAt: Date.now(),
    });

    // ✅ Populate sender for frontend
    const populatedMessage = await newMessage.populate("sender", "userName ");

    res.status(201).json({
        status: "success",
        data: populatedMessage,
    });
});


// @desc    Get all messages for a specific conversation
// @route   GET /api/v1/messages/:conversationId
// @access  Private/protect
exports.getMessagesByConversation = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;

    // ✅ Check conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return next(new ApiError("Conversation not found", 404));
    }

    // ✅ Get all messages in this conversation
    const messages = await Message.find({ conversation: conversationId })
        .populate("sender", "userName")
        .sort({ createdAt: 1 });

    res.status(200).json({
        status: "success",
        results: messages.length,
        data: messages,
    });
});


// @desc    Delete a message (only sender can delete)
// @route   DELETE /api/v1/messages/:messageId
// @access  Private/protect
exports.deleteMessage = asyncHandler(async (req, res, next) => {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
        return next(new ApiError("Message not found", 404));
    }

    /*// ✅ Ensure only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
        return next(new ApiError("You are not allowed to delete this message", 403));
    } */ 

    await message.deleteOne();

    res.status(200).json({
        status: "success",
        message: "Message deleted successfully",
    });
});


// @desc    Update a message (optional)
// @route   PATCH /api/v1/messages/:messageId
// @access  Private/protect
exports.updateMessage = asyncHandler(async (req, res, next) => {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
        return next(new ApiError("Message not found", 404));
    }

    /*// ✅ Check permission
    if (message.sender.toString() !== req.user._id.toString()) {
        return next(new ApiError("You are not allowed to edit this message", 403));
    }*/

    message.content = content;
    await message.save();

    const updatedMessage = await message.populate("sender", "userName");

    res.status(200).json({
        status: "success",
        data: updatedMessage,
    });
});

/*
// @desc    Upload message media (optional feature)
// @route   POST /api/v1/messages/upload
// @access  Private/protect
exports.uploadMedia = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.body;
    const fileUrl = req.file?.path;

    if (!fileUrl) {
        return next(new ApiError("No media uploaded", 400));
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return next(new ApiError("Conversation not found", 404));
    }

    const newMessage = await Message.create({
        conversation: conversationId,
        sender: req.user._id,
        media: fileUrl,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage._id,
        lastMessageAt: Date.now(),
    });

    const populated = await newMessage.populate("sender", "userName profilePic");

    res.status(201).json({
        status: "success",
        data: populated,
    });
});*/
