define(function (require, exports, module) {

  const defaults = {
    title: undefined,
    message: '',
    type: '',
    showInput: false,
    showClose: true,
    modalFade: true,
    lockScroll: true,
    closeOnClickModal: true,
    inputValue: null,
    inputPlaceholder: '',
    inputPattern: null,
    inputValidator: null,
    inputErrorMessage: '',
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonPosition: 'right',
    confirmButtonHighlight: false,
    cancelButtonHighlight: false,
    confirmButtonText: '',
    cancelButtonText: '',
    confirmButtonClass: '',
    cancelButtonClass: '',
    customClass: '',
    beforeClose: null
  };

  const Vue = require('vue');
  const msgboxVue = require('./message-box.js');
  const merge = require('../../../src/utils/merge');

  const MessageBoxConstructor = Vue.extend(msgboxVue);


  var currentMsg = void 0,
      instance = void 0;
  var msgQueue = [];

  var defaultCallback = function defaultCallback(action) {
    if (currentMsg) {
      var callback = currentMsg.callback;
      if (typeof callback === 'function') {
        if (instance.showInput) {
          callback(instance.inputValue, action);
        } else {
          callback(action);
        }
      }
      if (currentMsg.resolve) {
        var $type = currentMsg.options.$type;
        if ($type === 'confirm' || $type === 'prompt') {
          if (action === 'confirm') {
            if (instance.showInput) {
              currentMsg.resolve({ value: instance.inputValue, action: action });
            } else {
              currentMsg.resolve(action);
            }
          } else if (action === 'cancel' && currentMsg.reject) {
            currentMsg.reject(action);
          }
        } else {
          currentMsg.resolve(action);
        }
      }
    }
  };

  var initInstance = function initInstance() {
    instance = new MessageBoxConstructor({
      el: document.createElement('div')
    });

    instance.callback = defaultCallback;
  };

  var showNextMsg = function showNextMsg() {
    if (!instance) {
      initInstance();
    }

    if (!instance.value || instance.closeTimer) {
      if (msgQueue.length > 0) {
        (function () {
          currentMsg = msgQueue.shift();

          var options = currentMsg.options;
          for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
              instance[prop] = options[prop];
            }
          }
          if (options.callback === undefined) {
            instance.callback = defaultCallback;
          }

          var oldCb = instance.callback;
          instance.callback = function (action) {
            oldCb(action);
            showNextMsg();
          };
          ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(function (prop) {
            if (instance[prop] === undefined) {
              instance[prop] = true;
            }
          });
          document.body.appendChild(instance.$el);

          Vue.nextTick(function () {
            instance.value = true;
          });
        })();
      }
    }
  };

  var MessageBox = function MessageBox(options, callback) {
    if (Vue.prototype.$isServer) return;
    if (typeof options === 'string') {
      options = {
        message: options
      };
      if (arguments[1]) {
        options.title = arguments[1];
      }
      if (arguments[2]) {
        options.type = arguments[2];
      }
    } else if (options.callback && !callback) {
      callback = options.callback;
    }

    if (typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        // eslint-disable-line
        msgQueue.push({
          options: (0, merge)({}, defaults, MessageBox.defaults, options),
          callback: callback,
          resolve: resolve,
          reject: reject
        });

        showNextMsg();
      });
    } else {
      msgQueue.push({
        options: (0, merge)({}, defaults, MessageBox.defaults, options),
        callback: callback
      });

      showNextMsg();
    }
  };

  MessageBox.setDefaults = function (defaults) {
    MessageBox.defaults = defaults;
  };

  MessageBox.alert = function (message, title, options) {
    if (typeof title === 'object') {
      options = title;
      title = '';
    }
    return MessageBox((0, merge)({
      title: title,
      message: message,
      $type: 'alert',
      closeOnPressEscape: false,
      closeOnClickModal: false
    }, options));
  };

  MessageBox.confirm = function (message, title, options) {
    if (typeof title === 'object') {
      options = title;
      title = '';
    }
    return MessageBox((0, merge)({
      title: title,
      message: message,
      $type: 'confirm',
      showCancelButton: true
    }, options));
  };

  MessageBox.prompt = function (message, title, options) {
    if (typeof title === 'object') {
      options = title;
      title = '';
    }
    return MessageBox((0, merge)({
      title: title,
      message: message,
      showCancelButton: true,
      showInput: true,
      $type: 'prompt'
    }, options));
  };

  MessageBox.close = function () {
    instance.value = false;
    msgQueue = [];
    currentMsg = null;
  };


  module.exports = MessageBox;
})