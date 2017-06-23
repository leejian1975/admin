define(function (require, exports, module) {
    const Vue = require('vue');
    const Notification = require('./src/main.js');
    Vue.prototype.$notify = Notification;

    module.exports = Notification;
})
