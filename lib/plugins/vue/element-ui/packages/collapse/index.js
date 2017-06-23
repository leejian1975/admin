

define(function(require,exports,module) {
  const ElCollapse = require('./collapse');
  ElCollapse.install = function(Vue) {
    Vue.component(ElCollapse.name, ElCollapse);
  };

  module.exports = ElCollapse;
})