const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");


// helper function للتحقق من صلاحية الأدمن
const checkIsGroupAdmin = (conv, userId, next) => {
    const isAdmin = conv.admins.some(
        (adminId) => adminId.toString() === userId.toString()
    );
    if (!isAdmin) {
        throw new ApiError("Only group admins can perform this action", 403);
    }
};


// @desc    Create or Get Private Conversation
// @route   POST /conversations/private
// @access  Private
exports.createPrivateConversation = asyncHandler(async (req, res, next) => {
    const { userId } = req.body; // ده الـ user اللي عايز تبدأ معاه محادثة

    if (!userId) {
        return next(new ApiError("UserId is required", 400));
    }

    // validate user exists
    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError(`No User Found for this id ${userId}`, 404));
    }

    // participantsKey (علشان نتأكد إن مفيش duplicate private conv)
    const ids = [req.user._id.toString(), userId.toString()].sort();
    const participantsKey = ids.join("_");

    const conversation = await Conversation.findOneAndUpdate(
        { participantsKey, isGroup: false },
        {
            $setOnInsert: {
                users: ids.map((id) => mongoose.Types.ObjectId(id)),
                participantsKey,
                isGroup: false,
            },
        },
        { new: true, upsert: true }
    ).populate("users", "userName");

    res.status(201).json({
        status: "success",
        data: conversation,
    });
});

// @desc    Create Group Conversation
// @route   POST /conversations/group
// @access  Private
exports.createGroupConversation = asyncHandler(async (req, res, next) => {
    const { users, name } = req.body;

    if (!users || users.length < 2) {
        return next(new ApiError("A group must have at least 2 users + you", 400));
    }

    if (!name) {
        return next(new ApiError("Group name is required", 400));
    }

    // Add the creator automatically
    const allUsers = [...users, req.user._id];

    const conversation = await Conversation.create({
        name,
        users: allUsers,
        isGroup: true,
        groupAdmins: [req.user._id], // creator هو admin
    });

    const fullConv = await Conversation.findById(conversation._id)
        .populate("users", "userName")
        .populate("groupAdmins", "userName");

    res.status(201).json({
        status: "success",
        data: fullConv,
    });
});

// @desc    Get a conversation by Id
// @route   GET /api/v1/conversations/:convId
// @access  Private/protect
exports.getConversationById = asyncHandler(async (req, res, next) => {
    const { convId } = req.params;
    const userId = req.user._id;

    const conv = await Conversation.findById(convId)
        .populate("users", "userName")
        .populate({ path: "lastMessage", select: "content sender createdAt" });

    if (!conv) {
        return next(new ApiError(`No Conversation found for this id: ${convId}`, 404));
    }

    // تأكد إن اليوزر مشارك
    const isParticipant = conv.users.some((u) => u._id.toString() === userId.toString());
    if (!isParticipant) {
        return next(new ApiError("Not authorized to view this conversation", 403));
    }

    res.status(200).json({ status: "success", data: conv });
});

// @desc    Rename group conversation
// @route   PATCH /api/v1/conversations/:id/rename
// @access  Private/protect
exports.renameGroup = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return next(new ApiError("Group name is required", 400));
    }

    const conv = await Conversation.findById(id);
    if (!conv) {
        return next(new ApiError(`No Conversation found with id ${id}`, 404));
    }

    checkIsGroupAdmin(conv, req.user._id, next);

    conv.name = name;
    await conv.save();

    res.status(200).json({ status: "success", data: conv });
});

// @desc    Add admin to group
// @route   PATCH /api/v1/conversations/:id/addAdmin
// @access  Private/protect
exports.addGroupAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    const conv = await Conversation.findById(id);
    if (!conv) {
        return next(new ApiError(`No Conversation found with id ${id}`, 404));
    }

    checkIsGroupAdmin(conv, req.user._id, next);

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    if (!conv.admins.includes(userId)) {
        conv.admins.push(userId);
        await conv.save();
    }

    res.status(200).json({ 
        status: "success",  
        msg: `${user.userName} Add to Admins successfully.`, 
        data: conv });
});

// @desc    Remove admin from group
// @route   PATCH /api/v1/conversations/:id/removeAdmin
// @access  Private/protect
exports.removeGroupAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    const conv = await Conversation.findById(id);
    if (!conv) {
        return next(new ApiError(`No Conversation found with id ${id}`, 404));
    }

    checkIsGroupAdmin(conv, req.user._id, next);

    conv.admins = conv.admins.filter((a) => a.toString() !== userId.toString());
    await conv.save();

    res.status(200).json({ status: "success",
        msg: `${conv.admins.userName} deleted successfully.`,
        data: conv });
});

// @desc    Add user to group
// @route   PATCH /api/v1/conversations/:id/addUser
// @access  Private/protect
exports.addGroupUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    const conv = await Conversation.findById(id);
    if (!conv) {
        return next(new ApiError(`No Conversation found with id ${id}`, 404));
    }

    checkIsGroupAdmin(conv, req.user._id, next);

    const user = await User.findById(userId);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    if (!conv.users.includes(userId)) {
        conv.users.push(userId);
        await conv.save();
    }

    res.status(200).json({ status: "success",
        msg: `${user.userName} added successfully to the group.`,
        data: conv });
});

// @desc    Remove user from group
// @route   PATCH /api/v1/conversations/:id/removeUser
// @access  Private/protect
exports.removeGroupUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;

    const conv = await Conversation.findById(id);
    if (!conv) {
        return next(new ApiError(`No Conversation found with id ${id}`, 404));
    }

    checkIsGroupAdmin(conv, req.user._id, next);

    conv.users = conv.users.filter((u) => u.toString() !== userId.toString());
    await conv.save();

    res.status(200).json({ status: "success",
        msg: `${conv.users.userName} deleted successfully.`,
        data: conv });
});

// @desc    Delete a group conversation
// @route   DELETE /api/v1/conversations/:id
// @access  Private/protect (Group Admin only)
exports.deleteGroupConversation = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const conv = await Conversation.findById(id);
    if (!conv) {
        return next(new ApiError(`No Conversation found with id ${id}`, 404));
    }

    // check admin authorization
    checkIsGroupAdmin(conv, req.user._id, next);

    await Conversation.findByIdAndDelete(id);

    res.status(200).json({ status: "success", message: "Conversation deleted successfully" });
});
