define(function (require, exports, module) {

  const ElMenuItem = require('./menu-item');

  /* istanbul ignore next */
  ElMenuItem.install = function (Vue) {
    Vue.component(ElMenuItem.name, ElMenuItem);
  };

  module.exports = ElMenuItem;
})