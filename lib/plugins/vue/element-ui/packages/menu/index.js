define(function (require, exports, module) {

  const ElMenu = require('./menu.js');

  /* istanbul ignore next */
  ElMenu.install = function (Vue) {
    Vue.component(ElMenu.name, ElMenu);
  };

  module.exports = ElMenu;
})