define(function(require,exports,module){
  const ElDialog = require('./src/component.js');

  /* istanbul ignore next */
  ElDialog.install = function(Vue) {
    Vue.component(ElDialog.name, ElDialog);
  };

  module.exports = ElDialog;
})

