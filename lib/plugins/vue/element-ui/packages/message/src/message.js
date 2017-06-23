define(function (require, exports, module) {
    module.exports = {
        template:require('./message.tpl'),
        data() {
            return {
                visible: false,
                message: '',
                duration: 3000,
                type: 'info',
                iconClass: '',
                customClass: '',
                onClose: null,
                showClose: false,
                closed: false,
                timer: null
            };
        },

        computed: {
            typeImg:function() {
                switch (this.type){
                    case 'error':
                        return require('../assets/error')
                    case 'info':
                        return require('../assets/info')
                    case 'success':
                        return require('../assets/success')
                    case 'warning':
                        return require('../assets/warning')
                    default:
                        return require('../assets/warning')

                }

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
                    this.onClose(this);
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
            this.startTimer();
        }
    };
})