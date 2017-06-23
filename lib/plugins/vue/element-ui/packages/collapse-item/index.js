
define(function(require,exports,module) {
  const ElCollapseItem = require('./collapse-item');
  ElCollapseItem.install = function(Vue) {
    Vue.component(ElCollapseItem.name, ElCollapseItem);
  };

  module.exports = ElCollapseItem;
})