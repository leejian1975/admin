/**
 * Created by Zhou on 17/2/8.
 */
define(function (require, exports, module) {
    const Popper = require('../../src/utils/vue-popper.js')
    module.exports = {
        name: 'ElSelectDropdown',
        template:require('./select-dropdown.tpl'),
        componentName: 'ElSelectDropdown',

        mixins: [Popper],

        props: {
            placement: {
                default: 'bottom-start'
            },

            boundariesPadding: {
                default: 0
            },

            popperOptions: {
                default: function _default() {
                    return {
                        forceAbsolute: true,
                        gpuAcceleration: false
                    };
                }
            }
        },

        data: function data() {
            return {
                minWidth: ''
            };
        },


        computed: {
            popperClass: function popperClass() {
                return this.$parent.popperClass;
            }
        },

        watch: {
            '$parent.inputWidth': function $parentInputWidth() {
                this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px';
            }
        },

        mounted: function mounted() {
            this.referenceElm = this.$parent.$refs.reference.$el;
            this.$parent.popperElm = this.popperElm = this.$el;
            this.$on('updatePopper', this.updatePopper);
            this.$on('destroyPopper', this.destroyPopper);
        }
    }
})