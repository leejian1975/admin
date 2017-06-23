define(function (require, exports, module) {
    let typeMap = {
        success: 'circle-check',
        info: 'information',
        warning: 'warning',
        error: 'circle-cross'
    };

    module.exports = {
        template:require('./notification.tpl'),
        data() {
            return {
                visible: false,
                title: '',
                message: '',
                duration: 4500,
                type: '',
                customClass: '',
                iconClass: '',
                onClose: null,
                closed: false,
                top: null,
                timer: null
            };
        },

        computed: {
            typeClass() {
                return this.type && typeMap[this.type] ? `el-icon-${ typeMap[this.type] }` : '';
            }
        },

        watch: {
            closed(newVal) {
                if (newVal) {
                    this.visible = false;
                    this.$el.addEventListener('transitionend', this.destroyElement);
                }
            }
        },

        methods: {
            destroyElement() {
                this.$el.removeEventListener('transitionend', this.destroyElement);
                this.$destroy(true);
                this.$el.parentNode.removeChild(this.$el);
            },

            close() {
                this.closed = true;
                if (typeof this.onClose === 'function') {
                    this.onClose();
                }
            },

            clearTimer() {
                clearTimeout(this.timer);
            },

            startTimer() {
                if (this.duration > 0) {
                    this.timer = setTimeout(() => {
                            if (!this.closed) {
                        this.close();
                    }
                }, this.duration);
                }
            }
        },

        mounted() {
            if (this.duration > 0) {
                this.timer = setTimeout(() => {
                        if (!this.closed) {
                    this.close();
                }
            }, this.duration);
            }
        }
    };
})