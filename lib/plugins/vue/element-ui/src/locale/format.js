/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */
define(function (require, exports, module) {

    const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;

    module.exports = function (Vue) {
        const hasOwn = require('../utils/util').hasOwn;

        /**
         * template
         *
         * @param {String} string
         * @param {Array} ...args
         * @return {String}
         */

        function template(string,...args)
        {
            if (args.length === 1 && typeof args[0] === 'object') {
                args = args[0];
            }

            if (!args || !args.hasOwnProperty) {
                args = {};
            }

            return string.replace(RE_NARGS, function(match, prefix, i, index){
                    let result;

            if (string[index - 1] === '{' &&
                string[index + match.length] === '}') {
                return i;
            } else {
                result = hasOwn(args, i) ? args[i] : null;
                if (result === null || result === undefined) {
                    return '';
                }

                return result;
            }
        })
            ;
        }

        return template;
    }
})
