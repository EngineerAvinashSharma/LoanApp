import { Request, Response, NextFunction } from "express";
import { JWTService } from './JWTService';
import { Role } from "../models/enums/userRole.enum";

export class Authentication {
    jwt: JWTService;
    constructor() {
        this.jwt = new JWTService();
    }
    authenticateVendor = (request: Request, response: Response, next: NextFunction): void => {
        if (request.headers.token && this.validate(request, request.headers.token, Role.vendor)) {
            next();
        } else {
            response.status(401).send('Authentication failed');
        }
    }
    
    authenticate = (request: Request, response: Response, next: NextFunction): void => {
        if (request.headers.token && this.validate(request, request.headers.token, Role.user)) {
            next();
        } else {
            response.status(401).send('Authentication failed Hii');
        }
    }
    validate(request: any, token: string | string[], role?: number): boolean {
        if (token.length === 0) {
            return false;
        } else if (typeof token === "object") {
            token = token[0];
        }
        token = token.replace("Bearer ", "");
        return this.jwt.verify(token, role, request);
    }
}