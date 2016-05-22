'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    config = require('./config'),
    router = require('./router');


module.exports = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(methodOverride())

  .use(function(error, request, response, next) {
    response.send(500, error);
  })

  .use(function(request, response, next) {
    const headers = config.api.headers;

    Object.keys(headers).forEach((key) => {
      response.header(key, headers[key]);
    });

    next();
  })

  .use('/', router)

  //.set('json spaces', config.api.jsonSpaces)

  .listen(config.port);