define(function (require,exports,module) {
    const scrollTop = require('../../utils/assist').scrollTop;
    const prefixCls = 'cfe-back-top';

    module.exports = {
        name: 'CfeBackTop',
        template:require('./backtop.tpl'),
        install:function(Vue){
            Vue.component(this.name, this);
        },
        props: {
            height: {
                type: Number,
                default: 400
            },
            bottom: {
                type: Number,
                default: 30
            },
            right: {
                type: Number,
                default: 30
            },
            duration: {
                type: Number,
                default: 1000
            }
        },
        data:function () {
            return {
                backTop: false
            };
        },
        mounted:function () {
            window.addEventListener('scroll', this.handleScroll, false);
            window.addEventListener('resize', this.handleScroll, false);
        },
        beforeDestroy:function  () {
            window.removeEventListener('scroll', this.handleScroll, false);
            window.removeEventListener('resize', this.handleScroll, false);
        },
        computed: {
            classes:function () {
                var show = prefixCls+'-show'
                return [
                    prefixCls,
                    {
                        [show]: this.backTop
                    }
                ];
            },
            styles:function () {
                return {
                    bottom: this.bottom+'px',
                    right: this.right+'px'
                };
            },
            innerClasses:function () {
                return prefixCls+'-inner';
            }
        },
        methods: {
            handleScroll:function () {
                this.backTop = window.pageYOffset >= this.height;
            },
            back:function () {
                scrollTop(window, document.body.scrollTop, 0, this.duration);
                this.$emit('on-click');
            }
        }
    };
})