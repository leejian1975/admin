define(function(require,exports,module) {
    const Locale = require('../../../src/mixins/locale');
    const ElProgress = require('../../progress/index');
    module.exports = {
        mixins: [Locale],

        components: { ElProgress: ElProgress },
        template:require('./upload-list.tpl'),


        props: {
            files: {
                type: Array,
                default() {
                    return [];
                }
            },
            handlePreview: Function,
            listType: String
        },
        methods: {
            parsePercentage(val) {
                return parseInt(val, 10);
            },
            handleClick(file) {
                this.handlePreview && this.handlePreview(file);
            }
        }
    }
})