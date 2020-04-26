import * as mongoose from "mongoose";
import {User} from '../models/collections/User';
import { MediaDeletionQueue } from "../models/collections/MediaDeletionQueue";
import { ResestPasswordRequest } from "../models/collections/ResetPasswordRequset";
import { LoanRequest } from "../models/collections/LoanRequest";




export const MongoInstance:IMongoInstance = mongoose;

export const UserInstance = mongoose.model('user', User);
export const MediaDeletionQueueInstance = mongoose.model('mediaDeletionQueue', MediaDeletionQueue);
export const ResetPasswordRequsetInstance = mongoose.model('resetpasswordrequest',ResestPasswordRequest);
export const LoanRequestInstance = mongoose.model('loanrequest',LoanRequest);
