define(function (require, exports, module) {
    require('custom-default-css')
    require('element-default-css')
    const Vue = require("vue");

    function init() {

        //axios-mock-adapter模拟后台访问，调试可用，写法见./pages/mock/index.js
        //var Mock = require('app-mock'); Mock.bootstrap();

        const vueRouter = require('vue-router');
        const vuex = require('vuex');
        const Row = require('element-row');
        const Col = require('element-col');
        require('element-message');
        require('element-message-box');
        require('element-alert');
        require('element-loading');
        Vue.use(vueRouter);
        Vue.use(vuex);
        Vue.use(Row);
        Vue.use(Col);
        Cfe.requestError = require("pages/utils/common.js").requestError;
        const store = require('app-store');
        const router = require('app-router');

        var app = new Vue({
            router: router,
            store: store,
            el: '#app'
        })
    }

    module.exports = {
        init:init
    }

});
