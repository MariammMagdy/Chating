const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "User name is required"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },
        dateOfBirth: {
            type: String,
            required: [true, "Date of birth is required"],
            match: [
                /^\d{2}-\d{2}-\d{4}$/,
                "Date of birth must be in DD-MM-YYYY format",
            ],
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            required: [true, "Gender is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false, // ميظهرش في الـ queries
        },
        online: { 
            type: Boolean,
            default: false 
        },
        lastSeen: {
            type: Date,
        },
        role: {
            type: String,
            enum: ["user", "group admin", "admin"],
            default: "user",
            select: false, // لو فيه هذا السطر لازم تعمل .select("+role")
        },
        fcmToken: {
            type: [String],
            default: [],
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
