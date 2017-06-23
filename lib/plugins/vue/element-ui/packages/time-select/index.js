
define(function (require, exports, module) {
  const TimeSelect = require('../date-picker/src/picker/time-select');
  TimeSelect.install = function(Vue) {
    Vue.component(TimeSelect.name, TimeSelect);
  };
  module.exports = TimeSelect;
})
