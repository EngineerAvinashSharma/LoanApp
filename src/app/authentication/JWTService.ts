import * as fs from 'fs';
import * as jwt from "jsonwebtoken";
import { Role } from '../models/enums/userRole.enum';

const privateKEY = fs.readFileSync('./src/serverFiles/private.key', 'utf8');

export class JWTService {
    constructor() { }
    sign = (data) => {
        var payload = {
            issuer: "avinash.sharma@smalsus.com",
            iat: Date.now(),
            exp: Date.now() + 172800000,             // Valid for 2 day
            data: data
        }
        return jwt.sign(payload, privateKEY);
    }
    verify = (token: string, role: number, request: Request): boolean => {
        var isAuthorized = false;
        jwt.verify(token, privateKEY, (error, jwtDecrypt) => {
            if (!error && jwtDecrypt) {
                if(jwtDecrypt.data && jwtDecrypt.exp > Date.now() && (role === 0 || jwtDecrypt.data.role === Role.vendor || jwtDecrypt.data.role === role)) {
                    request.authToken = jwtDecrypt.data;
                    isAuthorized = true;
                } 
            }
        });
        return isAuthorized;
    }
}
