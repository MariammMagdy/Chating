const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        users: [
            {   type: mongoose.Schema.Types.ObjectId, 
                ref: "User", 
                required: true 
            }
        ],
        isGroup: {
            type: Boolean,
            default: false,
        },
        // لو جروب
        groupName: {
            type: String,
            trim: true,
        },
        groupAdmins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
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
    { timestamps: true }
);

// index للبحث السريع عن محادثات لمستخدم
conversationSchema.index({ users: 1 });

// Virtual populate: كل الرسائل التابعة للمحادثة
conversationSchema.virtual("messages", {
    ref: "Message",
    foreignField: "conversation",
    localField: "_id",
});


module.exports = mongoose.model("Conversation", conversationSchema);

