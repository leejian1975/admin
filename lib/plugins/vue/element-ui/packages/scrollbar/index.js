

define(function (require, exports, module) {
    const Scrollbar = require('./src/main.js');
    Scrollbar.install = function(Vue) {
        Vue.component(this.name, this);
    }
    module.exports = Scrollbar;
})