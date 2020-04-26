import { Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { UserRepository } from '../repositories/UserRepository';





export class UserController extends BaseController {
    constructor(private repo: UserRepository) {
        super();
    }

    post = (req: Request, res: Response) => {
        this.requestManager(req, res, this.repo.post);
    }
    otpVerify = (req: Request, res: Response) => {
        this.requestManager(req, res, this.repo.otpVerify);
    }
    login = (req: Request, res: Response) => {
        this.requestManager(req, res, this.repo.login);
    }
    updateUserInfo = (req:Request, res:Response) =>{
        this.requestManager(req, res, this.repo.updateUserInfo);
    }
    uplaodDocuments = (req:Request, res:Response) =>{
        this.requestManager(req, res, this.repo.uplaodDocuments);
    }
    getUserList = (req:Request, res:Response) =>{
        this.requestManager(req,res, this.repo.getUserListAccToVendor);
    }
    forgotPassword = (req:Request, res:Response) =>{
        this.requestManager(req,res,this.repo.forgotPassword);
    }
    resetPassword = (req:Request,res:Response) =>{
        this.requestManager(req, res,this.repo.resetPassword);
    }
    
}