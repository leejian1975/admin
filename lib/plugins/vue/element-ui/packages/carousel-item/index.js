define(function (require,exports,module) {
  const ElCarouselItem =require('./carousel-item.js');

  /* istanbul ignore next */
  ElCarouselItem.install = function (Vue) {
    Vue.component(ElCarouselItem.name, ElCarouselItem);
  };

  module.exports = ElCarouselItem;
})