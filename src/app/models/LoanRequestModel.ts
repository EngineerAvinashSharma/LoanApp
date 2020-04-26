import { UserInfoModel } from "./UserInfoModel";


export class LoanRequestModel {
   _id:String = undefined;
   requestAmount: Number = undefined;
   userDetails: Array<UserInfoModel> = [new UserInfoModel()];
   status: Number= undefined;
   createdAt: Date = undefined;
   timePeriod:String = undefined;
   totalAmount:Number = undefined;
   interestAmount:Number = undefined;
   paymentType:String = undefined;
}