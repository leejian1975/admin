define(function (require, exports, module) {

  const Vue = require('vue');
  const PopupManager = require('../../../src/utils/popup/popup-manager');
  const isVNode = require('../../../src/utils/vdom');
  let NotificationConstructor = Vue.extend(require('./notification.js'));

  let instance;
  let instances = [];
  let seed = 1;

  var Notification = function (options) {
    if (Vue.prototype.$isServer) return;
    options = options || {};
    let userOnClose = options.onClose;
    let id = 'notification_' + seed++;

    options.onClose = function () {
      Notification.close(id, userOnClose);
    };

    instance = new NotificationConstructor({
      data: options
    });

    if (isVNode(options.message)) {
      instance.$slots.default = [options.message];
      options.message = '';
    }
    instance.id = id;
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    instance.dom = instance.vm.$el;
    instance.dom.style.zIndex = PopupManager.nextZIndex();

    const offset = options.offset || 0;
    let topDist = offset;
    for (let i = 0, len = instances.length; i < len; i++) {
      topDist += instances[i].$el.offsetHeight + 16;
    }
    topDist += 16;
    instance.top = topDist;
    instances.push(instance);
    return instance.vm;
  };

  ['success', 'warning', 'info', 'error'].forEach(function(type){
    Notification[type] = function(options) {
    if (typeof options === 'string' || isVNode(options)
  )
  {
    options = {
      message: options
    };
  }
  options.type = type;
  return Notification(options);
}
  ;
})
  ;

  Notification.close = function (id, userOnClose) {
    let index;
    let removedHeight;
    for (var i = 0, len = instances.length; i < len; i++) {
      if (id === instances[i].id) {
        if (typeof userOnClose === 'function') {
          userOnClose(instances[i]);
        }
        index = i;
        removedHeight = instances[i].dom.offsetHeight;
        instances.splice(i, 1);
        break;
      }
    }

    if (len > 1) {
      for (i = index; i < len - 1; i++) {
        instances[i].dom.style.top = parseInt(instances[i].dom.style.top, 10) - removedHeight - 16 + 'px';
      }
    }
  };

  module.exports = Notification;
})
