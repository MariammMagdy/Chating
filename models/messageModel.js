const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        content: {
            type: String,
            trim: true,
        },
        //media: {
        //type: String, // صور، فيديو، صوت، إلخ
        //},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
