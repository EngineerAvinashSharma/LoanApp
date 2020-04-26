interface IRepoFunction {
    (req: Request): Promise<any>;
}

interface Request {
    authToken?: IAuthTokenData;
    body: any;
    params?: any;
    query?: any;
    file?: any;
}

interface IAuthTokenData {
    id: string;
    role: number;
    phoneNo: string;
}

interface IMongoInstance {
    Types: {
        ObjectId(id: string): Object;
    }
}