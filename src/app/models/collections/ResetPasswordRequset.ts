import * as mongoose from 'mongoose';

export const ResestPasswordRequest = new mongoose.Schema({
    uId: { type: mongoose.Schema.Types.ObjectId, required: "User ID not provided", max: 50 },
    otp: { type: Number },
    createdAt: { type: Date, default: Date.now },
    isExpire: { type: Boolean }
})