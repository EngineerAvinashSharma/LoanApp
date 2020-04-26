import { Response } from 'express';
import { BaseController } from '../controllers/BaseController';
import { LoanRepository } from '../repositories/LoanRepository';





export class LoanController extends BaseController {
    constructor(private repo: LoanRepository) {
        super();
    }


    LoanRequest = (req: Request, res: Response) => {
        this.requestManager(req, res, this.repo.loanRequest);
    }
    getLoanRequest = (req: Request, res: Response) => {
        this.requestManager(req, res, this.repo.getLoanRequest);
    }
    deleteLoanRequest = (req: Request, res: Response) => {
        this.requestManager(req, res, this.repo.deleteLoanRequest);
    }
    dailyBasisLoan = (req:Request, res:Response) =>{
        this.requestManager(req,res,this.repo.getLoanAccToDailyBasis);
    }
    monthlyBasisLoan = (req:Request, res:Response) =>{
        this.requestManager(req,res,this.repo.getLoanAccToMonthlyBasis);
    }



}