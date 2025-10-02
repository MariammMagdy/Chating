const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        users: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
        ],
        isGroup: { 
            type: Boolean, 
            default: false 
        },
        name: { 
            type: String 
        }, // لو جروب
        participantsKey: { 
            type: String, 
            default: null 
        }, // e.g. "603..._604..."

        // optional fields for quick UI
        lastMessage: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Message" 
        },
        lastMessageAt: { 
            type: Date 
        }
    },
    { timestamps: true }
);

// index للبحث السريع عن محادثات لمستخدم
conversationSchema.index({ users: 1, isGroup: 1 });

// فريد للـ 1:1 conversations فقط
conversationSchema.index(
    { participantsKey: 1 },
    { unique: true, partialFilterExpression: { isGroup: false } }
);

module.exports = mongoose.model("Conversation", conversationSchema);
