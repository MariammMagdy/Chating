const mongoose = require("mongoose");
const Conversation = require("./Conversation");

const privateChatSchema = new mongoose.Schema(
    {
        participantsKey: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

privateChatSchema.index({ participantsKey: 1 }, { unique: true });

module.exports = mongoose.model("PrivateChat", privateChatSchema);

