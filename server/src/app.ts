import express = require('express');
import compression = require('compression');
import expressLayouts = require('express-ejs-layouts');

import { ConfigType, config } from './config';
import Data from './data';
import logger from './logger';

const app = express();

app.use(compression());

app.locals.songOfTheMoment = function() {
    return Data.getPage('/songs').children[0];
};

/////////////////
// Templating
/////////////////

app.set('view engine', 'ejs');

app.use(expressLayouts)

/////////////////
// Inititialise
/////////////////

if (config.type === ConfigType.node) {
    // Used for Node server.
    var server = app.listen(config.port, config.ip, function () {
        var host = server.address().address;
        var port = server.address().port;

        logger.info('Website listening at http://%s:%s.', host, port);
    });
} else if (config.type === ConfigType.iis) {
    // Used for IISNode.
    app.listen(process.env.PORT);
} else {
    logger.error('Error: wrong config.type set');
}

/////////////////
// Export
/////////////////

export default app;
