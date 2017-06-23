define(function (require, exports, module) {
    const Vue = require('vue');


    var BAR_MAP = {
        vertical: {
            offset: 'offsetHeight',
            scroll: 'scrollTop',
            scrollSize: 'scrollHeight',
            size: 'height',
            key: 'vertical',
            axis: 'Y',
            client: 'clientY',
            direction: 'top'
        },
        horizontal: {
            offset: 'offsetWidth',
            scroll: 'scrollLeft',
            scrollSize: 'scrollWidth',
            size: 'width',
            key: 'horizontal',
            axis: 'X',
            client: 'clientX',
            direction: 'left'
        }
    };

    function renderThumbStyle(_ref) {
        var move = _ref.move,
            size = _ref.size,
            bar = _ref.bar;

        var style = {};
        var translate = 'translate' + bar.axis + '(' + move + '%)';

        style[bar.size] = size;
        style.transform = translate;
        style.msTransform = translate;
        style.webkitTransform = translate;

        return style;
    };

    const toObject = Vue.util.toObject;
    module.exports = {
        BAR_MAP: BAR_MAP,
        renderThumbStyle: renderThumbStyle,
        toObject: toObject
    }
})