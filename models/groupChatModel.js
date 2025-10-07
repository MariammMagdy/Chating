const mongoose = require("mongoose");
const Conversation = require("./Conversation");

const groupChatSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, "Group name is required"] 
        },
        admins: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        ],
        //groupImage: { type: String, default: null },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("GroupChat", groupChatSchema);

