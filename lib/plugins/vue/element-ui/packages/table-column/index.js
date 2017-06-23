
define(function (require, exports, module) {
  const ElTableColumn = require('../table/src/table-column');
  ElTableColumn.install = function(Vue) {
    Vue.component(this.name, this);
  };
  module.exports = ElTableColumn;
})