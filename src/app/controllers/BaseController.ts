import { Response } from "express";


export class BaseController {
    constructor() { }

    requestManager(req: Request, res: Response, repoFunction: IRepoFunction, checkParam?: boolean): boolean {
        if(checkParam && req.params.id !== req.authToken.id) {
            res.status(401).send("Unauthorized");
            return;
        }
        try {
            repoFunction(req)
                .then((data) => {
                    res.send(data);
                    return true;
                }).catch((err) => {
                    if (typeof err === "string") {
                        res.status(400).send(err);
                    } else if (err && err.message) {
                        res.status(400).send(err.message);
                    }else {
                        res.status(err[1] || 400).send(err[0]);
                    }
                    return false;
                })
        } catch (ex) {
            res.status(400).send(ex && ex.message);
            return false;
        }
    }
}