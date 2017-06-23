

define(function (require, exports, module) {
    const Vue = require('vue')
    const MessageBox = require('./src/main.js')
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    module.exports = MessageBox;
})