define(function(require,exports,module){
    module.exports = {
        name: 'ElStep',
        template:require('./step.tpl'),
        props: {
            title: String,
            icon: String,
            description: String,
            status: {
                type: String,
                default: 'wait'
            }
        },

        data() {
            return {
                index: -1,
                style: {},
                lineStyle: {},
                mainOffset: 0,
                isLast: false,
                currentStatus: this.status
            };
        },

        created() {
            this.$parent.steps.push(this);
        },

        methods: {
            updateStatus(val) {
                const prevChild = this.$parent.$children[this.index - 1];

                if (val > this.index) {
                    this.currentStatus = this.$parent.finishStatus;
                } else if (val === this.index) {
                    this.currentStatus = this.$parent.processStatus;
                } else {
                    this.currentStatus = 'wait';
                }

                if (prevChild) prevChild.calcProgress(this.currentStatus);
            },

            calcProgress(status) {
                let step = 100;
                const style = {};

                style.transitionDelay = 150 * this.index + 'ms';
                if (status === this.$parent.processStatus) {
                    step = 50;
                } else if (status === 'wait') {
                    step = 0;
                    style.transitionDelay = (-150 * this.index) + 'ms';
                }

                this.$parent.direction === 'vertical'
                    ? style.height = step + '%'
                    : style.width = step + '%';

                this.lineStyle = style;
            },

            adjustPosition() {
                this.style = {};
                this.$parent.stepOffset = this.$el.getBoundingClientRect().width / (this.$parent.steps.length - 1);
            }
        },

        mounted() {
            const parent = this.$parent;
            const isCenter = parent.center;
            const len = parent.steps.length;
            const isLast = this.isLast = parent.steps[parent.steps.length - 1] === this;
            const space = parent.space
                ? parent.space + 'px'
                : 100 / (isCenter ? len - 1 : len) + '%';

            if (parent.direction === 'horizontal') {
                this.style = { width: space };
                if (parent.alignCenter) {
                    this.mainOffset = -this.$refs.title.getBoundingClientRect().width / 2 + 16 + 'px';
                }
                isCenter && isLast && this.adjustPosition();
            } else {
                if (!isLast) {
                    this.style = { height: space };
                }
            }

            const unwatch = this.$watch('index', val => {
                    this.$watch('$parent.active', this.updateStatus, { immediate: true });
            unwatch();
        });
        }
    };
})