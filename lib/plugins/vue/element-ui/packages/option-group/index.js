

defind(function(require,exports,module){
  const ElOptionGroup = require('../select/option-group');
  ElOptionGroup.install = function(Vue) {
    Vue.component(this.name, this);
  };
  module.exports = ElOptElOptionGroupion;
})