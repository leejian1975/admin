
define(function (require, exports, module) {
  const TimePicker = require('../date-picker/src/picker/time-picker');
  TimePicker.install = function(Vue) {
    Vue.component(TimePicker.name, TimePicker);
  };
  module.exports = TimePicker;
})