define(function (require, exports, module) {
    const Popup = require('../../../src/utils/popup/index');
    const Locale = require('../../../src/mixins/locale');
    const ElInput = require('../../input/index');
    const ElButton = require('../../button/index');
    const addClass = require('../../../src/utils/dom').addClass;
    const removeClass = require('../../../src/utils/dom').removeClass;

    const  t  = require('../../../src/locale/index').t;

    let typeMap = {
        success: 'circle-check',
        info: 'information',
        warning: 'warning',
        error: 'circle-cross'
    };

    module.exports = {
        mixins: [Popup, Locale],
        template: require('./message-box.tpl'),
        props: {
            modal: {
                default: true
            },
            lockScroll: {
                default: true
            },
            showClose: {
                type: Boolean,
                default: true
            },
            closeOnClickModal: {
                default: true
            },
            closeOnPressEscape: {
                default: true
            }
        },

        components: {
            ElInput,
            ElButton
        },

        computed: {
            typeClass: function typeClass() {
                return this.type && typeMap[this.type] ? 'el-icon-' + typeMap[this.type] : '';
            },
            confirmButtonClasses: function confirmButtonClasses() {
                return 'el-button--primary ' + this.confirmButtonClass;
            },
            cancelButtonClasses: function cancelButtonClasses() {
                return '' + this.cancelButtonClass;
            }
        },

        methods: {
            getSafeClose: function getSafeClose() {
                var _this = this;

                var currentId = this.uid;
                return function () {
                    _this.$nextTick(function () {
                        if (currentId === _this.uid) _this.doClose();
                    });
                };
            },
            doClose: function doClose() {
                var _this2 = this;

                if (!this.value) return;
                this.value = false;
                this._closing = true;

                this.onClose && this.onClose();

                if (this.lockScroll) {
                    setTimeout(function () {
                        if (_this2.modal && _this2.bodyOverflow !== 'hidden') {
                            document.body.style.overflow = _this2.bodyOverflow;
                            document.body.style.paddingRight = _this2.bodyPaddingRight;
                        }
                        _this2.bodyOverflow = null;
                        _this2.bodyPaddingRight = null;
                    }, 200);
                }
                this.opened = false;

                if (!this.transition) {
                    this.doAfterClose();
                }
                if (this.action) this.callback(this.action, this);
            },
            handleWrapperClick: function handleWrapperClick() {
                if (this.closeOnClickModal) {
                    this.action = '';
                    this.doClose();
                }
            },
            handleAction: function handleAction(action) {
                if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
                    return;
                }
                this.action = action;
                if (typeof this.beforeClose === 'function') {
                    this.close = this.getSafeClose();
                    this.beforeClose(action, this, this.close);
                } else {
                    this.doClose();
                }
            },
            validate: function validate() {
                if (this.$type === 'prompt') {
                    var inputPattern = this.inputPattern;
                    if (inputPattern && !inputPattern.test(this.inputValue || '')) {
                        this.editorErrorMessage = this.inputErrorMessage || (0, _locale3.t)('el.messagebox.error');
                        (0, addClass)(this.$refs.input.$el.querySelector('input'), 'invalid');
                        return false;
                    }
                    var inputValidator = this.inputValidator;
                    if (typeof inputValidator === 'function') {
                        var validateResult = inputValidator(this.inputValue);
                        if (validateResult === false) {
                            this.editorErrorMessage = this.inputErrorMessage || (0, _locale3.t)('el.messagebox.error');
                            (0, addClass)(this.$refs.input.$el.querySelector('input'), 'invalid');
                            return false;
                        }
                        if (typeof validateResult === 'string') {
                            this.editorErrorMessage = validateResult;
                            return false;
                        }
                    }
                }
                this.editorErrorMessage = '';
                (0, removeClass)(this.$refs.input.$el.querySelector('input'), 'invalid');
                return true;
            }
        },

        watch: {
            inputValue: function inputValue(val) {
                if (this.$type === 'prompt' && val !== null) {
                    this.validate();
                }
            },
            value: function value(val) {
                var _this3 = this;

                if (val) this.uid++;
                if (this.$type === 'alert' || this.$type === 'confirm') {
                    this.$nextTick(function () {
                        _this3.$refs.confirm.$el.focus();
                    });
                }
                if (this.$type !== 'prompt') return;
                if (val) {
                    setTimeout(function () {
                        if (_this3.$refs.input && _this3.$refs.input.$el) {
                            _this3.$refs.input.$el.querySelector('input').focus();
                        }
                    }, 500);
                } else {
                    this.editorErrorMessage = '';
                    (0, removeClass)(this.$refs.input.$el.querySelector('input'), 'invalid');
                }
            }
        },

        data: function data() {
            return {
                uid: 1,
                title: undefined,
                message: '',
                type: '',
                customClass: '',
                showInput: false,
                inputValue: null,
                inputPlaceholder: '',
                inputPattern: null,
                inputValidator: null,
                inputErrorMessage: '',
                showConfirmButton: true,
                showCancelButton: false,
                action: '',
                confirmButtonText: '',
                cancelButtonText: '',
                confirmButtonLoading: false,
                cancelButtonLoading: false,
                confirmButtonClass: '',
                confirmButtonDisabled: false,
                cancelButtonClass: '',
                editorErrorMessage: null,
                callback: null
            };
        }
    };
})