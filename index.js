/*
 * app.js with basic express configuration
 * 
 AWS_ACCESS_KEY='AKIAI3TXRY2BTPL5NP6A'  AWS_SECRET_KEY='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' S3_BUCKET='aige-file-upload' node index.js
 * Copyright (c) Eckhard Kirschning .
 */

/*jslint         node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var debug = require('debug')('MYAIGE');
var
        express = require('express'),
        app = express(),
        path = require('path'),
        favicon = require('serve-favicon'),
        logger = require('morgan'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        routes = require('./routes');
       

// ------------- END MODULE SCOPE VARIABLES ---------------
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'AKIAI3TXRY2BTPL5NP6A' ;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || '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';
var S3_BUCKET = process.env.S3_BUCKET || 'aige-file-upload';
console.log(AWS_ACCESS_KEY + ", " + AWS_SECRET_KEY + "," + S3_BUCKET);
// ------------- BEGIN SERVER CONFIGURATION ---------------


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('port', process.env.PORT || 5000);


var server = app.listen(app.get('port'), function () {
    console.log('Express server lsitening on port %d in %s mode', server.address().port, app.settings.env);
});// development error handler


routes.configRoutes(app, server);

app.use(function (err, req, res, next) {
    console.log("app.use(function(err,req,res,next):");
    if (err) {
        console.log("ERROR in Server:" + err.message);

    }
    next();
});

