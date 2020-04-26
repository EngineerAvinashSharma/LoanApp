import app from "./app/app";
import { config } from './config/config';


(function () {
    app.listen(config.port, () => {
        console.log('Express server listening on port ' + config.port);
    })
})();