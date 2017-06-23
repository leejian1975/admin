define(function(require,exports,module) {

  const Steps = require('./steps.js');

  /* istanbul ignore next */
  Steps.install = function (Vue) {
    Vue.component(Steps.name, Steps);
  };

  module.exports = Steps;
})
