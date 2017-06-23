/**
 * Created by Zhou on 17/2/9.
 */
define(function (require, exports, module) {

    const limitRange = require('../util/index').limitRange;
    const Locale = require('../../../../src/mixins/locale');
    const TimeSpinner = require('../basic/time-spinner')
    module.exports = {
        mixins: [Locale],
        template:require('./time.tpl'),
        components: {
            TimeSpinner
        },

        props: {
            pickerWidth: {},
            date: {
                default() {
                    return new Date();
                }
            },
            visible: Boolean
        },

        watch: {
            visible(val) {
                this.currentVisible = val;
            },

            pickerWidth(val) {
                this.width = val;
            },

            value(newVal) {
                let date;
                var that = this;
                if (newVal instanceof Date) {
                    date = limitRange(newVal, this.selectableRange);
                } else if (!newVal) {
                    date = new Date();
                }

                this.handleChange({
                    hours: date.getHours(),
                    minutes: date.getMinutes(),
                    seconds: date.getSeconds()
                });
                this.$nextTick(function(_){that.ajustScrollTop()});
            },

            selectableRange(val) {
                this.$refs.spinner.selectableRange = val;
            }
        },

        data() {
            return {
                popperClass: '',
                format: 'HH:mm:ss',
                value: '',
                hours: 0,
                minutes: 0,
                seconds: 0,
                selectableRange: [],
                currentDate: this.$options.defaultValue || this.date || new Date(),
                currentVisible: this.visible || false,
                width: this.pickerWidth || 0
            };
        },

        computed: {
            showSeconds() {
                return (this.format || '').indexOf('ss') !== -1;
            }
        },

        methods: {
            handleClear() {
                this.$emit('pick');
            },

            handleCancel() {
                this.$emit('pick');
            },

            handleChange(date) {
                if (date.hours !== undefined) {
                    this.currentDate.setHours(date.hours);
                    this.hours = this.currentDate.getHours();
                }
                if (date.minutes !== undefined) {
                    this.currentDate.setMinutes(date.minutes);
                    this.minutes = this.currentDate.getMinutes();
                }
                if (date.seconds !== undefined) {
                    this.currentDate.setSeconds(date.seconds);
                    this.seconds = this.currentDate.getSeconds();
                }

                this.handleConfirm(true);
            },

            setSelectionRange(start, end) {
                this.$emit('select-range', start, end);
            },

            handleConfirm(visible = false, first) {
                if (first) return;
                const date = new Date(limitRange(this.currentDate, this.selectableRange));
                this.$emit('pick', date, visible, first);
            },

            ajustScrollTop() {
                return this.$refs.spinner.ajustScrollTop();
            }
        },

        created() {
            this.hours = this.currentDate.getHours();
            this.minutes = this.currentDate.getMinutes();
            this.seconds = this.currentDate.getSeconds();
        },

        mounted() {
            var that = this;
            this.$nextTick(function(){
                that.handleConfirm(true, true)
            });
        }
    }
})