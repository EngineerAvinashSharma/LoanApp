import * as mongoose from 'mongoose';
import { Common } from '../../helpers/common';
import { Status } from '../enums/loanStatus.enum';

export const LoanRequest = new mongoose.Schema({
    requestAmount: { type: Number, required: "Add Amount" },
    uId: { type: mongoose.Schema.Types.ObjectId, required: "User ID not provided", max: 50 },
    vId: { type: mongoose.Schema.Types.ObjectId, required: "User ID not provided", max: 50 },
    createdAt: { type: Date, default: Date.now },
    status: { type: Number, validate: Common.EnumValidator(Status) },
    timePeriod: { type: String },
    interestAmount: { type: Number },
    totalAmount: { type: Number },
    paymentType:{type:String}

});