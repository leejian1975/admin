
define(function (require, exports, module) {
  const Popover = require('./src/main.js');
  const directive = require('./src/directive.js');
  const Vue = require('vue');

  Vue.directive('popover', directive);


  Popover.install = function(Vue) {
    Vue.directive('popover', directive);
    Vue.component(Popover.name, Popover);
  };
  Popover.directive = directive;

  module.exports= Popover;
})