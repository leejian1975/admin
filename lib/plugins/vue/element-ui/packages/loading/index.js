define(function (require, exports, module) {
  const Vue = require('vue');

  const directive = require('./src/directive');
  const service = require('./src/index');
  var Loading = {
    directive,
    service
  }

  Vue.use(directive);
  Vue.prototype.$loading = service;
  module.exports = Loading;
})
