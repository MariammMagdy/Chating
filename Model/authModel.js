const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        /*name: {
            type: String,
            required: [true, "Name is required"],
        },*/
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
        },
        /*phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
        },*/
        dateOfBirth: {
            type: Date,
            required: [true, "Date of birth is required"],
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
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
