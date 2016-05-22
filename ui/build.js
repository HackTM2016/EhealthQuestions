var path = require('path');
var Builder = require('systemjs-builder');

// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('./app', './app/config.js');

builder.config({
  meta: {}
});

builder.bundle('_app.jsx!', 'out-bundle.js'); // create a named bundle
// builder.buildStatic('app.js', 'out-static.js', { format: 'cjs' }); // create a static optimized build