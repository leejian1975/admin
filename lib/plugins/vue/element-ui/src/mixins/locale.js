define(function (require, exports, module) {
    const t = require('../locale/index').t;
    module.exports = {
        methods: {
            t(...args){
                return t.apply(this, args);
            }
        }
    };
})