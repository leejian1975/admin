/**
 * Created by Zhou on 17/3/21.
 */
define(function(require,exports,module){
    const Vue = require('vue');
    const LoadingBar = require('./index2');
    LoadingBar.install = function(Vue){
        Vue.component('loadingBar',LoadingBar);
    };
    Vue.prototype.$loadingBar = LoadingBar;
    module.exports = LoadingBar;
})