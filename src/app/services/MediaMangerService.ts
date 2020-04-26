import { MediaDeletionQueueInstance } from "../helpers/MongoInstance";
import * as fs from 'fs';

class MediaManagerService {
    constructor() {
    }
    public addToDeletionQueue(fileName) {
        let queueInstance = new MediaDeletionQueueInstance({ fileName: fileName });
        queueInstance.save();
    };
    public removeFromDeletionQueue(filePath) {
        if (!filePath) {
            return;
        }
        let pathLocation = filePath.split(/[\\, \/]/g),
            fileName = pathLocation[pathLocation.length - 1];
        MediaDeletionQueueInstance.deleteOne({ fileName: fileName }, () => { });
    };
    public deleteMedia(paths: string | Array<string>) {
        let filePaths: Array<string> = paths ? typeof paths === "string" ? [paths] : paths : [];
        if (!filePaths || filePaths.length === 0) {
            return;
        }
        filePaths.forEach(filePath => {
            let pathLocation = filePath.split(/[\\, \/]/g),
                fileName = pathLocation[pathLocation.length - 1];
            fs.unlink('./src/assets/' + fileName, () => { });
        })
    };
}

export var mediaManager = new MediaManagerService();