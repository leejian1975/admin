define(function(require,exports,module){

  const TabPane = require('./tab-pane.js');

  /* istanbul ignore next */
  TabPane.install = function(Vue) {
    Vue.component(TabPane.name, TabPane);
  };

  module.exports = TabPane;
})
