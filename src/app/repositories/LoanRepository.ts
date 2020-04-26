import { JWTService } from "../authentication/JWTService";
import { Common } from "../helpers/common";
import { UserInstance, LoanRequestInstance, MongoInstance } from "../helpers/MongoInstance";
import { Role } from "../models/enums/userRole.enum";
import { LoanRequestModel } from "../models/LoanRequestModel";
import { Status } from "../models/enums/loanStatus.enum";

export class LoanRepository {
    jwtService: JWTService;
    constructor() {
        this.jwtService = new JWTService();
    }



    public loanRequest = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            //Loan Request From User
            if (req.body.status == Status.NotApproved && req.authToken.role == Role.user) {
                UserInstance.findOne({ $and: [{ _id: MongoInstance.Types.ObjectId(req.authToken.id), role: Role.user }] }, Common.mongoCallBk(error, user => {
                    if (user && user._id) {
                        UserInstance.findOne({ $and: [{ vendorToken: user.vendorToken, role: Role.vendor }] }, Common.mongoCallBk(error, vendor => {
                            if (vendor && vendor._id) {
                                req.body.uId = req.authToken.id;
                                req.body.vId = vendor._id;
                                let newLoan = new LoanRequestInstance(req.body);
                                newLoan.save(Common.mongoCallBk(error, response => {
                                    success(response._id);
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
            }
            //Appproved Loan Request From Vendor
            if (req.body.status == Status.Approved && req.authToken.role == Role.vendor) {
                let condition =
                {
                    $and: [{ _id: MongoInstance.Types.ObjectId(req.body.id) },
                    { status: Status.NotApproved },
                    { vId: MongoInstance.Types.ObjectId(req.authToken.id) }

                    ]
                };
                LoanRequestInstance.updateOne(condition, req.body, { $set: { status: req.body.status } }, Common.mongoCallBk(error, response => {
                    success(Boolean(response.nModified && response.ok));
                }))

            }
            //Confirm Loan Request From User
            if (req.body.status == Status.Confirm && req.authToken.role == Role.user) {
                let condition =
                {
                    $and: [{ _id: MongoInstance.Types.ObjectId(req.body.id) },
                    { status: Status.Approved },
                    { uId: MongoInstance.Types.ObjectId(req.authToken.id) }

                    ]
                };
                LoanRequestInstance.updateOne(condition, { $set: { status: req.body.status } }, Common.mongoCallBk(error, response => {
                    success(Boolean(response.nModified && response.ok));
                }))
            }



        })
    }
    getLoanRequest = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            LoanRequestInstance.aggregate([
                {
                    $match: {
                        $or:
                            [{ vId: MongoInstance.Types.ObjectId(req.authToken.id) },
                            { uId: MongoInstance.Types.ObjectId(req.authToken.id) }]
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "uId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $sort: { 'createdAt': -1 }
                },
                {
                    $facet: {
                        data: [{ $skip: ((parseInt(req.query.page) - 1) || 0) * (parseInt(req.query.pageSize) || 5) }, { $limit: (parseInt(req.query.pageSize) || 5) }]
                    }
                }
            ], Common.mongoCallBk(error, response => {
                let loans = response[0].data;
                if (loans && loans.length > 0) {
                    success(loans.map(data => Common.LoadModel(data, LoanRequestModel)));
                } else {
                    error(["No Requests Found", 404]);
                }
            }))
        })
    }

    deleteLoanRequest = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            LoanRequestInstance.deleteOne({ _id: req.body.id }, Common.mongoCallBk(error, response => {
                success(Boolean(response.nModified && response.ok));
            }))
        })
    }

    getLoanAccToDailyBasis = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            let condition = {
                $or: [{
                    $and: [{
                        uId: req.authToken.id,
                        paymentType: "Daily",
                        status:Status.Confirm
                    }]
                },
                {
                    $and: [{
                        vId: req.authToken.id,
                        paymentType: "Daily",
                        status:Status.Confirm
                    }]
                }
                ]
            }

            LoanRequestInstance.find(condition, Common.mongoCallBk(error, response => {
                success(response);
            }))
        })
    }
    getLoanAccToMonthlyBasis = (req: Request): Promise<any> => {
        return Common.loadPromise((success, error) => {
            let condition = {
                $or: [{
                    $and: [{
                        uId: req.authToken.id,
                        paymentType: "Monthly",
                        status:Status.Confirm
                    }]
                },
                {
                    $and: [{
                        vId: req.authToken.id,
                        paymentType: "Monthly",
                        status:Status.Confirm
                    }]
                }
                ]
            }

            LoanRequestInstance.find(condition, Common.mongoCallBk(error, response => {
                success(response);
            }))

        })
    }

}