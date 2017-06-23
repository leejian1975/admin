define(function (require, exports, module) {
    var detail = function (config) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve([200, {
                    errorCode: 0,
                    errorMsg: null,
                    data: {
                        name: 'admin'
                    }
                }]);
            }, 1000);
        });
    }
    module.exports = {
        detail: detail
    }
})
