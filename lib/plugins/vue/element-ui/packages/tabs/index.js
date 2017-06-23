define(function (require,exports,module) {

  const ElTabs = require('./src/tabs.js');
  /* istanbul ignore next */
  ElTabs.install = function(Vue) {
    Vue.component(ElTabs.name, ElTabs);
  };
  module.exports = ElTabs;
})
