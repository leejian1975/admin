define(function(require,exports,module) {
    module.exports = {
        name: 'ElSteps',
        template:require('./steps.tpl'),
        props: {
            space: Number,
            active: Number,
            direction: {
                type: String,
                default: 'horizontal'
            },
            alignCenter: Boolean,
            center: Boolean,
            finishStatus: {
                type: String,
                default: 'finish'
            },
            processStatus: {
                type: String,
                default: 'process'
            }
        },

        data() {
            return {
                steps: [],
                stepOffset: 0
            };
        },

        watch: {
            active(newVal, oldVal) {
                this.$emit('change', newVal, oldVal);
            }
        },

        mounted() {
            this.steps.forEach((child, index) => {
                child.index = index;
        });
        }
    };

})