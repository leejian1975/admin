define(function (require, exports, module) {
    const Popper = require('../../src/utils/vue-popper');
    module.exports = {
        name: 'ElTooltip',
        template: require('./tooltip.tpl'),
        install: function (Vue) {
            Vue.component(this.name, this);
        },
        mixins: [Popper],

        props: {
            openDelay: {
                type: Number,
                default: 0
            },
            disabled: Boolean,
            manual: Boolean,
            effect: {
                type: String,
                default: 'dark'
            },
            popperClass: String,
            content: String,
            visibleArrow: {
                default: true
            },
            transition: {
                type: String,
                default: 'fade-in-linear'
            },
            options: {
                default:function() {
                    return {
                        boundariesPadding: 10,
                        gpuAcceleration: false
                    };
                }
            }
        },

        methods: {
            handleShowPopper:function() {
                var that = this;
                if (that.manual) return;
                this.timeout = setTimeout(function () {
                        that.showPopper = true;
                    },
                    that.openDelay
                )
                ;
            },

            handleClosePopper:function() {
                if (this.manual) return;
                clearTimeout(this.timeout);
                this.showPopper = false;
            }
        }
    }
})