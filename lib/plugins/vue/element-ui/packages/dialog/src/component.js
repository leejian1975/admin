define(function(require,exports,module) {
    const Popup = require('../../../src/utils/popup/index');

    module.exports = {
        name: 'ElDialog',
        template:require('./component.tpl'),
        mixins: [Popup],

        props: {
            title: {
                type: String,
                default: ''
            },

            modal: {
                type: Boolean,
                default: true
            },

            lockScroll: {
                type: Boolean,
                default: true
            },

            closeOnClickModal: {
                type: Boolean,
                default: true
            },

            closeOnPressEscape: {
                type: Boolean,
                default: true
            },

            showClose: {
                type: Boolean,
                default: true
            },

            size: {
                type: String,
                default: 'small'
            },

            customClass: {
                type: String,
                default: ''
            },

            top: {
                type: String,
                default: '15%'
            }
        },
        data() {
            return {
                visible: false
            };
        },

        watch: {
            value: function value(val) {
                this.visible = val;
            },
            visible: function visible(val) {
                var _this = this;

                this.$emit('input', val);
                if (val) {
                    this.$emit('open');
                    this.$nextTick(function () {
                        _this.$refs.dialog.scrollTop = 0;
                    });
                } else {
                    this.$emit('close');
                }
            }
        },

        computed: {
            sizeClass() {
                return `el-dialog--${ this.size }`;
            },
            style() {
                return this.size === 'full' ? {} : { 'margin-bottom': '50px', 'top': this.top };
            }
        },

        methods: {
            handleWrapperClick() {
                if (this.closeOnClickModal) {
                    this.close();
                }
            }
        },

        mounted() {
            if (this.value) {
                this.rendered = true;
                this.open();
            }
        }
    };
})