define(function(require,exports,module) {

  const Step = require('./step.js');

  /* istanbul ignore next */
  Step.install = function (Vue) {
    Vue.component(Step.name, Step);
  };

  module.exports = Step;
})