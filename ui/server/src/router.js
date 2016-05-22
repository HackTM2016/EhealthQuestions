'use strict';

let router = require('express').Router(),
    pkg = require('../package.json');


// Some default processing of each request
// currently none
router.use((request, response, next) => {
  next();
});

// Home route provides details about the API
router.route('/').get((request, response) => {
  response.send(200, {
    version: pkg.version,
    name: pkg.name
  })
});

module.exports = router;