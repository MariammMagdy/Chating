const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

// 🟢 Create JWT
/*const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
};*/

// 🟢 Register user
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { userName, email, dateOfBirth, gender, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ApiError("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        userName,
        email,
        dateOfBirth,
        gender,
        password: hashedPassword,
    });

    const token = createToken(user._id);
    res.status(201).json({
        status: "success",
        token,
        data: { userName: user.userName, email: user.email },
    });
});

// 🟢 Login user
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ApiError("Invalid email or password", 401));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ApiError("Invalid email or password", 401));

    const token = createToken(user._id);
    res.status(200).json({ status: "success", token });
});

// 🟢 Get logged in user (from token)
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) return next(new ApiError("User not found", 404));

    res.status(200).json({ data: user });
});

// 🟢 Update logged in user
exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
    const allowedFields = ["userName", "email", "dateOfBirth", "gender"];
    const updateData = {};

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!user) return next(new ApiError("User not found", 404));

    res.status(200).json({ status: "success", data: user });
});

// 🟢 Update password
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return next(new ApiError("User not found", 404));

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return next(new ApiError("Incorrect old password", 401));

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = Date.now();
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ msg: "Password updated successfully", token });
});

// 🟢 Deactivate user
exports.deactivateUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true });
    res.status(200).json({ msg: "User deactivated" });
});

// 🟢 Delete user
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return next(new ApiError("User not found", 404));

    res.status(200).json({ msg: "Account deleted successfully" });
});
