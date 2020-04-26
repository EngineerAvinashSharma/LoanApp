import { config } from '../../config/config';
export class Constant {
    static STRING_EMPTY = "";
    static ASSETS_PATH = config.apiUrl + ':' + config.port + '/assets/';
    static USER_MEDIA_PATH = config.apiUrl + ':' + config.port + '/assets/userMedia/';

}