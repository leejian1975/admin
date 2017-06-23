define(function (require, exports, module) {
    var _getArrayByParams = function(array,params){
        var items = array.slice((params[0]-1)*params[1],params[0]*params[1]);
        var total = array.length;
        return {
            items:items,
            total:total
        }
    }
    var list = function (config) {
        var params = JSON.parse(decodeURIComponent(config.data.substr(7)));
        return new Promise(function (resolve, reject) {
            var _data = _getArrayByParams(require('./resource/user'),params);
            setTimeout(function () {
                resolve([200, {
                    errorCode: 0,
                    errorMsg: null,
                    data:_data
                }]);
            }, 1000);
        });
    }
    module.exports = {
        list: list
    }
})
