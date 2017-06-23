define(function (require, exports, module) {

  const ElMenuItemGroup = require('./menu-item-group');

  /* istanbul ignore next */
  ElMenuItemGroup.install = function (Vue) {
    Vue.component(ElMenuItemGroup.name, ElMenuItemGroup);
  };

  module.exports = ElMenuItemGroup;
})