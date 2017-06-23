;(function(root, factory) {
	if(typeof define === 'function') {
        // AMD&CMD. Register as an anonymous module.
        define(function() {
            return factory();
        });
    } else if(typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('localStorage'));
    } else {
        // Browser globals (root is window)
        root.localStorage = factory();
    }
}(this, function() {
	/**
	 * 本地存储帮助类
	 */
	var _localStorage = {};

	/**
	 * 读取本地存储的数据
	 * @param {string} key
	 * @return {Object}
	 */
	_localStorage.get = function(key) {
		if(!window.localStorage) {
			return null;
		}
		var sessionStr = window.localStorage.getItem(key);
		if(sessionStr == "" || sessionStr == null || sessionStr == undefined) {
			return null;
		}
		return JSON.parse(sessionStr);
	};

	/**
	 * 保存数据至本地存储
	 * @param {string} key
	 * @param {Object} data
	 */
	_localStorage.set = function(key, data) {
		if(!window.localStorage) {
			return;
		}
		var sessionStr = JSON.stringify(data);
		window.localStorage.removeItem(key);
		window.localStorage.setItem(key, sessionStr);
	};

	/**
	 * 移除本地存储的数据
	 * @param {string} key
	 */
	_localStorage.remove = function(key) {
		if(!window.localStorage) {
			return;
		}
		window.localStorage.removeItem(key);
	};

	return _localStorage;

}));

