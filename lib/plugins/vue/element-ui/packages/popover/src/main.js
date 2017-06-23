define(function (require, exports, module) {
    const Popper = require('../../../src/utils/vue-popper');
    const on = require('../../../src/utils/dom').on;
    const off = require('../../../src/utils/dom').off;


    module.exports = {
        name: 'ElPopover',
        template:require('./main.tpl'),
        mixins: [Popper],

        props: {
            trigger: {
                type: String,
                default: 'click',
                validator: function(value){ return ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1}
        },
        title: String,
        disabled: Boolean,
        content: String,
        reference: {},
        popperClass: String,
        width: {},
        visibleArrow: {
            default: true
        },
        transition: {
            type: String,
            default: 'fade-in-linear'
        }
    },

    watch: {
        showPopper(newVal, oldVal) {
            newVal ? this.$emit('show') : this.$emit('hide');
        }
    },

        mounted: function mounted() {
            var _this = this;

            var reference = this.reference || this.$refs.reference;
            var popper = this.popper || this.$refs.popper;

            if (!reference && this.$slots.reference && this.$slots.reference[0]) {
                reference = this.referenceElm = this.$slots.reference[0].elm;
            }
            if (this.trigger === 'click') {
                (0, on)(reference, 'click', function () {
                    _this.showPopper = !_this.showPopper;
                });
                (0, on)(document, 'click', this.handleDocumentClick);
            } else if (this.trigger === 'hover') {
                (0, on)(reference, 'mouseenter', this.handleMouseEnter);
                (0, on)(popper, 'mouseenter', this.handleMouseEnter);
                (0, on)(reference, 'mouseleave', this.handleMouseLeave);
                (0, on)(popper, 'mouseleave', this.handleMouseLeave);
            } else if (this.trigger === 'focus') {
                var found = false;

                if ([].slice.call(reference.children).length) {
                    var children = reference.childNodes;
                    var len = children.length;
                    for (var i = 0; i < len; i++) {
                        if (children[i].nodeName === 'INPUT' || children[i].nodeName === 'TEXTAREA') {
                            (0, on)(children[i], 'focus', function () {
                                _this.showPopper = true;
                            });
                            (0, on)(children[i], 'blur', function () {
                                _this.showPopper = false;
                            });
                            found = true;
                            break;
                        }
                    }
                }
                if (found) return;
                if (reference.nodeName === 'INPUT' || reference.nodeName === 'TEXTAREA') {
                    (0, on)(reference, 'focus', function () {
                        _this.showPopper = true;
                    });
                    (0, on)(reference, 'blur', function () {
                        _this.showPopper = false;
                    });
                } else {
                    (0, on)(reference, 'mousedown', function () {
                        _this.showPopper = true;
                    });
                    (0, on)(reference, 'mouseup', function () {
                        _this.showPopper = false;
                    });
                }
            }
        },

    methods: {
        handleMouseEnter: function handleMouseEnter() {
            this.showPopper = true;
            clearTimeout(this._timer);
        },
        handleMouseLeave: function handleMouseLeave() {
            var _this2 = this;

            this._timer = setTimeout(function () {
                _this2.showPopper = false;
            }, 200);
        },
        handleDocumentClick(e) {
            let reference = this.reference || this.$refs.reference;
            const popper = this.popper || this.$refs.popper;

            if (!reference && this.$slots.reference && this.$slots.reference[0]) {
                reference = this.referenceElm = this.$slots.reference[0].elm;
            }
            if (!this.$el ||
                !reference ||
                this.$el.contains(e.target) ||
                reference.contains(e.target) ||
                !popper ||
                popper.contains(e.target)) return;
            this.showPopper = false;
        }
    },

        destroyed: function destroyed() {
            var reference = this.reference;

            (0, off)(reference, 'mouseup');
            (0, off)(reference, 'mousedown');
            (0, off)(reference, 'focus');
            (0, off)(reference, 'blur');
            (0, off)(reference, 'mouseleave');
            (0, off)(reference, 'mouseenter');
            (0, off)(document, 'click', this.handleDocumentClick);
        }
};
})