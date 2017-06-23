define(function (require, exports, module) {
    module.exports = {
        template:require('./loading.tpl'),

        data() {
            return {
                text: null,
                fullscreen: true,
                visible: false,
                customClass: ''
            };
        },

        methods: {
            handleAfterLeave() {
                this.$emit('after-leave');
            }
        }
    }
})