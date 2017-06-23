define(function(require,exports,module){
    var loadingBar = require('./loading-bar');
    const Vue = require('vue');
    const camelcaseToHyphen  = require('../../utils/assist').camelcaseToHyphen;
    loadingBar.newInstance = function (properties) {
        var _props = properties || {};

        var props = '';
        Object.keys(_props).forEach(function (prop) {
            props += ' :' + (0, camelcaseToHyphen)(prop) + '=' + prop;
        });

        var div = document.createElement('div');
        div.innerHTML = '<loading-bar' + props + '></loading-bar>';
        document.body.appendChild(div);

        var loading_bar = new Vue({
            el: div,
            data: _props,
            components: { LoadingBar: loadingBar }
        }).$children[0];

        return {
            update: function update(options) {
                if ('percent' in options) {
                    loading_bar.percent = options.percent;
                }
                if (options.status) {
                    loading_bar.status = options.status;
                }
                if ('show' in options) {
                    loading_bar.show = options.show;
                }
            },

            component: loading_bar,
            destroy: function destroy() {
                document.body.removeChild(div);
            }
        };
    };
    module.exports = loadingBar;
})