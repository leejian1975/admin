define(function (require,exports,module) {

  const Carousel = require('./carousel.js');

  /* istanbul ignore next */
  Carousel.install = function (Vue) {
    Vue.component(Carousel.name, Carousel);
  };

  module.exports = Carousel;
})