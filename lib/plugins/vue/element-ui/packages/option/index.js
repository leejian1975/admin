
define(function(require,exports,module){
  const ElOption = require('../select/option');
  ElOption.install = function(Vue) {
    Vue.component(this.name, this);
  };
  module.exports = ElOption;
})