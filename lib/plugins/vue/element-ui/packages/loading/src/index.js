define(function (require, exports, module) {

  const Vue = require('vue');
  const loadingVue = require('./loading.js');
  const merge = require('../../../src/utils/merge');

  const LoadingConstructor = Vue.extend(loadingVue);

  var defaults = {
    text: null,
    fullscreen: true,
    body: false,
    lock: false,
    customClass: ''
  };

  var fullscreenLoading = void 0;

  LoadingConstructor.prototype.originalPosition = '';
  LoadingConstructor.prototype.originalOverflow = '';

  LoadingConstructor.prototype.close = function () {
    var _this = this;

    if (this.fullscreen && this.originalOverflow !== 'hidden') {
      document.body.style.overflow = this.originalOverflow;
    }
    if (this.fullscreen || this.body) {
      document.body.style.position = this.originalPosition;
    } else {
      this.target.style.position = this.originalPosition;
    }
    if (this.fullscreen) {
      fullscreenLoading = undefined;
    }
    this.$on('after-leave', function (_) {
      _this.$el && _this.$el.parentNode && _this.$el.parentNode.removeChild(_this.$el);
      _this.$destroy();
    });
    this.visible = false;
  };

  var addStyle = function addStyle(options, parent, instance) {
    var maskStyle = {};
    if (options.fullscreen) {
      instance.originalPosition = document.body.style.position;
      instance.originalOverflow = document.body.style.overflow;
    } else if (options.body) {
      instance.originalPosition = document.body.style.position;
      ['top', 'left'].forEach(function (property) {
        var scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
        maskStyle[property] = options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px';
      });
      ['height', 'width'].forEach(function (property) {
        maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
      });
    } else {
      instance.originalPosition = parent.style.position;
    }
    Object.keys(maskStyle).forEach(function (property) {
      instance.$el.style[property] = maskStyle[property];
    });
  };

  var Loading = function Loading() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (Vue.prototype.$isServer) return;
    options = (0, merge)({}, defaults, options);
    if (typeof options.target === 'string') {
      options.target = document.querySelector(options.target);
    }
    options.target = options.target || document.body;
    if (options.target !== document.body) {
      options.fullscreen = false;
    } else {
      options.body = true;
    }
    if (options.fullscreen && fullscreenLoading) {
      return fullscreenLoading;
    }

    var parent = options.body ? document.body : options.target;
    var instance = new LoadingConstructor({
      el: document.createElement('div'),
      data: options
    });

    addStyle(options, parent, instance);
    if (instance.originalPosition !== 'absolute') {
      parent.style.position = 'relative';
    }
    if (options.fullscreen && options.lock) {
      parent.style.overflow = 'hidden';
    }
    parent.appendChild(instance.$el);
    Vue.nextTick(function () {
      instance.visible = true;
    });
    if (options.fullscreen) {
      fullscreenLoading = instance;
    }
    return instance;
  };

  module.exports = Loading;
})