'use strict';

let _ = require('lodash'),
    router = require('../router'),
    data = require('../../data/query');

router
  .route('/article/select')
  .get(function(request, response) {
    let status = 200;

    if(!request.query.q || !request.query.wt) {
      status = 400;
      data = '{}';
    }

    if(request.query.status) {
      status = parseInt(request.query.status) || 500;
    }

    if(data) {
      data.response.docs = _.shuffle(data.response.docs);
    }
    
    setTimeout(() => response.send(status, data), 1000);
    
  });