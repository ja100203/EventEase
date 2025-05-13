const mongoose = require("mongoose");

const privatePartySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    eventName: {
        type: String,
        required: true,
    },
    contacts: [
        {
            name: String,
            phone: String,
        },
    ],
    csvFilePath: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("PrivateParty", privatePartySchema);
