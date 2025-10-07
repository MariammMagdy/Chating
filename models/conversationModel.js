const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        users: [
            {   type: mongoose.Schema.Types.ObjectId, 
                ref: "User", 
                required: true 
            }
        ],
        // optional fields for quick UI
        lastMessage: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Message" 
        },
        lastMessageAt: { 
            type: Date 
        }
    },
    { timestamps: true, discriminatorKey: "chatType"}
);

// index للبحث السريع عن محادثات لمستخدم
conversationSchema.index({ users: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);

