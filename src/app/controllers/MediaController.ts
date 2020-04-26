import { Response } from 'express';
import * as path from "path";
import { Common } from '../helpers/common';
import * as multer from 'multer';
import { Constant } from '../helpers/Constant';
import { mediaManager } from '../services/MediaMangerService';

export class MediaController {
    storeProperties;
    uploadProperties;
    constructor() {
        this.storeProperties = multer.diskStorage({
            destination: function (req, file, get) {
                get(null, path.join(__dirname, '../../../../src/assets/userMedia'))
            },
            filename: function (req, file, get) {
                get(null, req.authToken.id + "_" + Common.MakeUID(true) + "_" + file.originalname.replace(/\\/g, "").replace(/\//g, ""));
            }
        });
        this.uploadProperties = multer({ storage: this.storeProperties }).array('file', 10);
    }

    post = (req: any, res: Response) => {
        this.uploadProperties(req, res, (err) => {
            try {
                if (err instanceof multer.MulterError) {
                    res.status(500).send(err && err.message);
                } else if (err) {
                    res.status(500).send(err && err.message);
                } else if (req.file && req.file.filename) {
                    res.status(200).send(Constant.USER_MEDIA_PATH + req.file.filename);
                    if (req.params.action !== "save") {
                        mediaManager.addToDeletionQueue(req.file.filename);
                    }
                } else if (req.files && req.files.length > 0) {
                    if (req.files.length === 1) {
                        res.status(200).send(Constant.USER_MEDIA_PATH + req.files[0].filename);
                    } else {
                        res.status(200).send(req.files.map(file => Constant.USER_MEDIA_PATH + file.filename));
                    }
                    if (req.params.action !== "save") {
                        req.files.forEach(file => {
                            mediaManager.addToDeletionQueue(file.filename);
                        });
                    }
                } else {
                    res.status(400).send();
                }
            } catch (e) {
                res.status(400).send();
            }
        });
    }
}