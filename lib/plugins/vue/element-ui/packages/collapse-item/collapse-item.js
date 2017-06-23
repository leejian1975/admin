define(function(require,exports,module) {
    const Emitter = require('../../src/mixins/emitter');
    const CollapseTransition = require('../../src/transitions/collapse-transition');

    module.exports = {
        name: 'ElCollapseItem',
        template:require('./collapse-item.tpl'),
        componentName: 'ElCollapseItem',

        mixins: [Emitter],

        components: {
            CollapseTransition
        },

        data() {
            return {
                contentWrapStyle: {
                    height: 'auto',
                    display: 'block'
                },
                contentHeight: 0
            };
        },

        props: {
            title: String,
            name: {
                type: [String, Number],
                default() {
                    return this._uid;
                }
            }
        },

        computed: {
            isActive() {
                return this.$parent.activeNames.indexOf(this.name) > -1;
            }
        },

        watch: {
            'isActive'(value) {
            }
        },

        methods: {
            handleHeaderClick() {
                this.dispatch('ElCollapse', 'item-click', this);
            }
        },

        mounted() {
        }
    };

})