define(function (require, exports, module) {
    const hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    function extend(to, _from) {
        for (let key in _from) {
            to[key] = _from[key];
        }
        return to;
    };

    function toObject(arr) {
        var res = {};
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i]);
            }
        }
        return res;
    };
    module.exports = {
        hasOwn:hasOwn,
        toObject:toObject
    }
})