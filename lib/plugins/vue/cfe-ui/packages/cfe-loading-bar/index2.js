/**
 * Created by Zhou on 17/3/21.
 */
define(function(require,exports,module){
    var loadingBar = require('./main');
    var loadingBarInstance = void 0;
    var color = 'primary';
    var failedColor = 'error';
    var height = 2;
    var timer = void 0;

    function getLoadingBarInstance() {
        loadingBarInstance = loadingBarInstance || loadingBar.newInstance({
                color: color,
                failedColor: failedColor,
                height: height
            });

        return loadingBarInstance;
    }

    function _update(options) {
        var instance = getLoadingBarInstance();

        instance.update(options);
    }

    function hide() {
        setTimeout(function () {
            _update({
                show: false
            });
            setTimeout(function () {
                _update({
                    percent: 0
                });
            }, 200);
        }, 800);
    }

    function clearTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    module.exports = {
        start: function start() {
            if (timer) return;

            var percent = 0;

            _update({
                percent: percent,
                status: 'success',
                show: true
            });

            timer = setInterval(function () {
                percent += Math.floor(Math.random() * 3 + 5);
                if (percent > 95) {
                    clearTimer();
                }
                _update({
                    percent: percent,
                    status: 'success',
                    show: true
                });
            }, 200);
        },
        update: function update(percent) {
            clearTimer();
            _update({
                percent: percent,
                status: 'success',
                show: true
            });
        },
        finish: function finish() {
            clearTimer();
            _update({
                percent: 100,
                status: 'success',
                show: true
            });
            hide();
        },
        error: function error() {
            clearTimer();
            _update({
                percent: 100,
                status: 'error',
                show: true
            });
            hide();
        },
        config: function config(options) {
            if (options.color) {
                color = options.color;
            }
            if (options.failedColor) {
                failedColor = options.failedColor;
            }
            if (options.height) {
                height = options.height;
            }
        },
        destroy: function destroy() {
            clearTimer();
            var instance = getLoadingBarInstance();
            loadingBarInstance = null;
            instance.destroy();
        }
    };
})