/*
 * app.js with basic express configuration
 * 
 
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

// ------------- BEGIN SERVER CONFIGURATION ---------------


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('port', process.env.PORT || 5000);


var server = app.listen(app.get('port'), function () {
    console.log('Express server lsitening on port %d in %s mode', server.address().port, app.settings.env);
});// development error handler


routes.configRoutes(app, server);

app.use(function(err,req,res,next){
if(err){
    console.log(err.message);
   
}
next();
});

