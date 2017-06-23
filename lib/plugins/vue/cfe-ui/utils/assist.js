define(function (require, exports, module) {
    function scrollTop(el, from = 0, to, duration = 500) {
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = (
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return window.setTimeout(callback, 1000/60);
                }
            );
        }
        const difference = Math.abs(from - to);
        const step = Math.ceil(difference / duration * 50);

        function scroll(start, end, step) {
            if (start === end) return;

            let d = (start + step > end) ? end : start + step;
            if (start > end) {
                d = (start - step < end) ? end : start - step;
            }

            if (el === window) {
                window.scrollTo(d, d);
            } else {
                el.scrollTop = d;
            }
            window.requestAnimationFrame(function() {
                scroll(d, end, step)
            });
        }
        scroll(from, to, step);

    }
    function camelcaseToHyphen(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    module.exports = {
        scrollTop:scrollTop,
        camelcaseToHyphen:camelcaseToHyphen
    }
})