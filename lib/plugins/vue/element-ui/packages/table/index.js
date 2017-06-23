
define(function (require, exports, module) {
  const ElTable = require('./src/table');
  ElTable.install = function(Vue) {
    Vue.component(this.name, this);
  };
  module.exports = ElTable;
})
