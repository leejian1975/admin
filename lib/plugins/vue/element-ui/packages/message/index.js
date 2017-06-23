
define(function (require, exports, module) {
    const Vue = require('vue');
    const Message = require('./src/main');
    Vue.prototype.$message = Message;
    module.exports = Message;
})