
define(function (require, exports, module) {
  const DatePicker = require('./src/picker/date-picker.js');
  DatePicker.install = function install(Vue) {
    Vue.component(DatePicker.name, DatePicker);
  };
  module.exports = DatePicker;
})