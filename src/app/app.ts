import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as path from "path";
//import { DaemonRunner } from "@code/daemons/DaemonRunner";
//import * as fs from "fs";
import { config } from '../config/config';
import { Route } from "./routes/Route";


class App {

    public app: express.Application;
     public routePrv: Route = new Route();
    //public daemonRunner: DaemonRunner = new DaemonRunner();

    constructor() {
        this.init();
    }
    init() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
        //this.daemonRunner.init();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files 
        // this.app.use(express.static('public'));
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token,origin,accept,multipart/form-data');
            next();
        });
        this.app.use('/assets', express.static(path.join(__dirname, '../../../src/assets')));
        // this.app.use('/api-doc', express.static(path.join(__dirname,'../../../src/assets/api-doc.json')));
        // this.app.get('/logs', this.getRecordFiles);
        // this.app.get('/errors', this.getRecordFiles);
        // this.app.get('/logs/:lastNumber', this.getRecordFiles);
        // this.app.get('/errors/:lastNumber', this.getRecordFiles);
        // this.app.get('/api-doc', function (req, res) {
        //     res.redirect("https://documenter.getpostman.com/view/8378387/SVmpW1tp?version=latest");
        //     res.end();
        // });
    }

    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongodb, { useUnifiedTopology: true, useNewUrlParser: true });
        mongoose.set('useCreateIndex', true);
        mongoose.set("debug", false);
        mongoose.set('useFindAndModify', false);
    }


 }

export default new App().app;