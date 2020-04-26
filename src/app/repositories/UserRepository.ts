import { Common } from '../helpers/common';
import { UserInstance, MongoInstance, ResetPasswordRequsetInstance, LoanRequestInstance } from "../helpers/MongoInstance";
import { UserInfoModel } from '../models/UserInfoModel';
import { JWTService } from '../authentication/JWTService';
import { Role } from '../models/enums/userRole.enum';
import { mediaManager } from '../services/MediaMangerService';
import { response } from 'express';



export class UserRepository {
    jwtService: JWTService;
    constructor() {
        this.jwtService = new JWTService();
    }

    // Registers a User and Vendor
    public post(req: Request): Promise<any> {
        return new Promise((success, error) => {
            UserInstance.find({$and: [{ phoneNo: req.body.phoneNo },{vendorToken:req.body.vendorToken}]}, Common.mongoCallBk(error, response => {
                if (response.length > 0) {
                    error(["user already exist", 405]);
                }
                else {
                    if (!req.body.vendorToken) {
                        req.body.vendorToken = Common.randomNumber(6);
                    }
                    let user = new UserInstance(req.body);
                    user.save(Common.mongoCallBk(error, rUser => {
                        success(rUser._id);
                    }));
                }
            }))
        })

    }
    //OTP Verificatio While Register A User And Vendor
    public otpVerify(req: Request): Promise<any> {
        return Common.loadPromise((success, error) => {
            UserInstance.find({ _id: req.body.id }, Common.mongoCallBk(error, response => {
                if (response[0].otp == req.body.otp) {
                    success(['Registered Successfully']);
                }
                else {
                    UserInstance.deleteOne({ _id: req.body.id }, { isDeleted: true }, Common.mongoCallBk(error, response => {
                        success(Boolean(response.ok));
                    }))
                }
            }))
        })
    }
    //Logs in the User And Vendor And Genrate JWT AuthToken 
    public login = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            UserInstance.findOne({ phoneNo: req.body.phoneNo }, Common.mongoCallBk(error, response => {
                if (response !== null) {
                    if (response.password === req.body.password) {
                        let user = Common.LoadModel(response, UserInfoModel);
                        user.token = this.jwtService.sign({
                            id: response._id.toString(),
                            role: response.role,
                            phoneNo: response.phoneNo
                        });
                        success(user);
                    } else {
                        error(["Password mismatch", 400]);
                    }
                }
                else {
                    error(["User Not Found", 404]);
                }

            }))
        })
    }
    //Update User Information 
    public updateUserInfo = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            if (req.body) {
                UserInstance.updateOne({ _id: req.authToken.id }, req.body, Common.mongoCallBk(error, response => {
                    success(Boolean(response.nModified && response.ok));
                }))
            }
            else {
                error(['No Changes Required', 404]);
            }
        })
    }
    //Upload Documents of User Pan,Adhaar,OtherDoc
    public uplaodDocuments = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            if (req.body) {
                let tmp_obj = [
                    {
                        documentType: "PanCard",
                        imageUrl: req.body.panCardimageUrl
                    },
                    {
                        documentType: "AdharCard",
                        imageUrl: req.body.adhaarCardimageUrl
                    },
                    {
                        documentType: "Other Document",
                        imageUrl: req.body.otherDocimageUrl
                    }
                ];
                UserInstance.updateOne({ _id: MongoInstance.Types.ObjectId(req.authToken.id) }, { $push: { 'documents': { $each: tmp_obj } } }, Common.mongoCallBk(error, response => {
                    success(Boolean(response.nModified && response.ok));
                    mediaManager.removeFromDeletionQueue(req.body.panCardimageUrl);
                    mediaManager.removeFromDeletionQueue(req.body.adhaarCardimageUrl);
                    mediaManager.removeFromDeletionQueue(req.body.otherDocimageUrl);

                }))
            }
            else {
                error(['No Documents Upload', 404]);
            }

        })
    }
    //Get OTP of Forgot PassWord And Then Reset Password
    public forgotPassword = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            UserInstance.findOne({ phoneNo: req.body.phoneNo }, Common.mongoCallBk(error, res => {
                if (res != null && res._id != null) {
                    req.body.otp = Common.randomNumber(6);
                    req.body.uId = res._id;
                    let passRequst = new ResetPasswordRequsetInstance(req.body);
                    passRequst.save(Common.mongoCallBk(error, response => {
                        success(response._id);
                    }))
                }
                else {
                    error(['Phone Number Not Found', 404]);
                }
            }))
        })
    }
    //Update Or ResetPassword of User And Vendor
    public resetPassword = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            ResetPasswordRequsetInstance.findOneAndUpdate({ otp: req.body.otp, _id: MongoInstance.Types.ObjectId(req.body.id), $or: [{ isExpire: false }, { isExpire: { "$exists": false } }] }, { $set: { isExpire: true } }, { new: true }, Common.mongoCallBk(error, res => {
                if (res && res._id) {
                    let feedTime = new Date(res.createdAt);
                    if (Date.now() - feedTime.getTime() <= 600000) {
                        UserInstance.updateOne({ _id: res.uId }, { $set: { password: req.body.password } }, Common.mongoCallBk(error, response => {
                            success(Boolean(response.nModified && response.ok));
                        }))

                    } else {
                        error(['Token Expire', 400]);
                    }
                }
                else {
                    error(['Token Not Found', 404]);
                }

            }))
        })
    }

    //Get List Of Users According To Vendor
    public getUserListAccToVendor = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            UserInstance({ _id: req.authToken.id }, Common.mongoCallBk(error, res => {
                UserInstance.find({ $and: [{ vendorToken: res.vendorToken }, { role: Role.user }] }, Common.mongoCallBk(error, response => {
                    let rUsers = response[0];
                    success(rUsers.map(user => Common.LoadModel(user, UserInfoModel)));
                }))
            }))
        })

    }


    public loanRequest = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            UserInstance({ _id: req.authToken.id }, Common.mongoCallBk(error, user => {
                if (user && user._id) {
                    UserInstance({ vendorToken: user.vendorToken, role: Role.vendor }, Common.mongoCallBk(error, vendor => {
                        if (vendor && vendor._id) {
                            req.body.uId = req.authToken.id;
                            req.body.vId = vendor._id;
                            let newLoan = new LoanRequestInstance(req.body);
                            newLoan.save(Common.mongoCallBk(error, response => {
                                success(response);
                            }))
                        }
                        else {
                            error(['Vendor Not found', 404]);
                        }
                    }))
                }
                else {
                    error(['User Not Found', 404]);
                }
            }))
        })
    }


}