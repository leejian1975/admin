define(function(require,exports,module){
    const prefixCls = 'cfe-loading-bar';

    module.exports = {
        template:require('./loading-bar.tpl'),
        props: {
            color: {
                type: String,
                default: 'primary'
            },
            failedColor: {
                type: String,
                default: 'error'
            },
            height: {
                type: Number,
                default: 2
            },
        },
        data () {
            return {
                percent: 0,
                status: 'success',
                show: false
            };
        },
        computed: {
            classes () {
                return `${prefixCls}`;
            },
            innerClasses () {
                return [
                    `${prefixCls}-inner`,
                    {
                        [`${prefixCls}-inner-color-primary`]: this.color === 'primary' && this.status === 'success',
                        [`${prefixCls}-inner-failed-color-error`]: this.failedColor === 'error' && this.status === 'error'
                    }
                ];
            },
            outerStyles () {
                return {
                    height: `${this.height}px`
                };
            },
            styles () {
                let style = {
                    width: `${this.percent}%`,
                    height: `${this.height}px`
                };

                if (this.color !== 'primary' && this.status === 'success') {
                    style.backgroundColor = this.color;
                }

                if (this.failedColor !== 'error' && this.status === 'error') {
                    style.backgroundColor = this.failedColor;
                }

                return style;
            }
        }
    };
})