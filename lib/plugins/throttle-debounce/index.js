define(function (require, exports, module) {
	var throttle = require('./throttle');
	var debounce = require('./debounce');

	module.exports = {
		throttle: throttle,
		debounce: debounce
	};
})
