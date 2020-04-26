import * as mongoose from 'mongoose';

export const MediaDeletionQueue = new mongoose.Schema({
    fileName: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});
