import { Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserRepository } from '../repositories/UserRepository';
import { Authentication } from '../authentication/Authentication';
import { MediaController } from '../controllers/MediaController';
import { LoanController } from '../controllers/LoanController';
import { LoanRepository } from '../repositories/LoanRepository';



export class Route {
    userController: UserController = new UserController(new UserRepository());
    authenticationInstance: Authentication = new Authentication();
    mediaController: MediaController = new MediaController();
    loanController: LoanController = new LoanController(new LoanRepository());
    constructor() { }
    public routes(app): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET Loan App request successfulll!!!!'
                })
            });

        app.route('/user')
            .post(this.userController.post)
            .put(this.authenticationInstance.authenticate, this.userController.updateUserInfo);
        app.route('/user/verify')
            .post(this.userController.otpVerify);
        app.route('/user/login')
            .post(this.userController.login);
        app.route('/user/uploadDocuments')
            .post(this.authenticationInstance.authenticate, this.userController.uplaodDocuments);
        app.route('/user/userList')
            .get(this.authenticationInstance.authenticateVendor, this.userController.getUserList);
        app.route('/user/forgotPassword')
            .post(this.userController.forgotPassword);
        app.route('/user/resetPassword')
            .post(this.userController.resetPassword);
        app.route('/user/loanRequest')
            .post(this.authenticationInstance.authenticate, this.loanController.LoanRequest)
            .delete(this.authenticationInstance.authenticate, this.loanController.deleteLoanRequest)
            .get(this.authenticationInstance.authenticate, this.loanController.getLoanRequest);
        app.route('/vendor/loanRequest')
            .post(this.authenticationInstance.authenticateVendor, this.loanController.LoanRequest)
            .get(this.authenticationInstance.authenticateVendor, this.loanController.getLoanRequest);
        app.route('/vendor/loans/dailyBasis')
            .get(this.authenticationInstance.authenticateVendor, this.loanController.dailyBasisLoan);

        app.route('/user/loans/dailyBasis')
            .get(this.authenticationInstance.authenticate, this.loanController.dailyBasisLoan);

        // Media upload
        app.route('/media')
            .post(this.authenticationInstance.authenticate, this.mediaController.post);
        // Media upload
        app.route('/media/:action')
            .post(this.authenticationInstance.authenticate, this.mediaController.post);

    }

}