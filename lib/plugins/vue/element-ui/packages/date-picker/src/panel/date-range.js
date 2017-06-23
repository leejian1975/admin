/**
 * Created by Zhou on 17/2/9.
 */
define(function (require, exports, module) {
    const nextMonth = require('../util/index').nextMonth
    const prevMonth = require('../util/index').prevMonth
    const toDate = require('../util/index').toDate
    const formatDate = require('../util/index').formatDate
    const parseDate = require('../util/index').parseDate
    const Locale= require('../../../../src/mixins/locale');
    const TimePicker= require('./time');
    const DateTable= require('../basic/date-table');
    const ElInput= require('../../../input/index');

    module.exports = {
        mixins: [Locale],
        template:require('./date-range.tpl'),
        computed: {
            btnDisabled() {
                return !(this.minDate && this.maxDate && !this.selecting);
            },

            leftLabel() {
                return this.date.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t(`el.datepicker.month${ this.date.getMonth() + 1 }`);
            },

            rightLabel() {
                return this.rightDate.getFullYear() + ' ' + this.t('el.datepicker.year') + ' ' + this.t(`el.datepicker.month${ this.rightDate.getMonth() + 1 }`);
            },

            leftYear() {
                return this.date.getFullYear();
            },

            leftMonth() {
                return this.date.getMonth();
            },

            rightYear() {
                return this.rightDate.getFullYear();
            },

            rightMonth() {
                return this.rightDate.getMonth();
            },

            minVisibleDate() {
                return this.minDate ? formatDate(this.minDate) : '';
            },

            maxVisibleDate() {
                return (this.maxDate || this.minDate) ? formatDate(this.maxDate || this.minDate) : '';
            },

            minVisibleTime() {
                return this.minDate ? formatDate(this.minDate, 'HH:mm:ss') : '';
            },

            maxVisibleTime() {
                return (this.maxDate || this.minDate) ? formatDate(this.maxDate || this.minDate, 'HH:mm:ss') : '';
            },

            rightDate() {
                const newDate = new Date(this.date);
                const month = newDate.getMonth();
                newDate.setDate(1);

                if (month === 11) {
                    newDate.setFullYear(newDate.getFullYear() + 1);
                    newDate.setMonth(0);
                } else {
                    newDate.setMonth(month + 1);
                }
                return newDate;
            }
        },

        data() {
            return {
                popperClass: '',
                minPickerWidth: 0,
                maxPickerWidth: 0,
                date: new Date(),
                minDate: '',
                maxDate: '',
                rangeState: {
                    endDate: null,
                    selecting: false,
                    row: null,
                    column: null
                },
                showTime: false,
                shortcuts: '',
                value: '',
                visible: '',
                disabledDate: '',
                firstDayOfWeek: 7,
                minTimePickerVisible: false,
                maxTimePickerVisible: false,
                width: 0
            };
        },

        watch: {
            showTime(val) {
                if (!val) return;
                this.$nextTick(_ => {
                    const minInputElm = this.$refs.minInput.$el;
                const maxInputElm = this.$refs.maxInput.$el;
                if (minInputElm) {
                    this.minPickerWidth = minInputElm.getBoundingClientRect().width + 10;
                }
                if (maxInputElm) {
                    this.maxPickerWidth = maxInputElm.getBoundingClientRect().width + 10;
                }
            });
            },

            minDate() {
                this.$nextTick(() => {
                    if (this.maxDate && this.maxDate < this.minDate) {
                    const format = 'HH:mm:ss';

                    this.$refs.maxTimePicker.selectableRange = [
                        [
                            parseDate(formatDate(this.minDate, format), format),
                            parseDate('23:59:59', format)
                        ]
                    ];
                }
            });
            },

            minTimePickerVisible(val) {
                if (val) this.$nextTick(() => this.$refs.minTimePicker.ajustScrollTop());
            },

            maxTimePickerVisible(val) {
                if (val) this.$nextTick(() => this.$refs.maxTimePicker.ajustScrollTop());
            },

            value(newVal) {
                if (!newVal) {
                    this.minDate = null;
                    this.maxDate = null;
                } else if (Array.isArray(newVal)) {
                    this.minDate = newVal[0] ? toDate(newVal[0]) : null;
                    this.maxDate = newVal[1] ? toDate(newVal[1]) : null;
                    if (this.minDate) this.date = new Date(this.minDate);
                    this.handleConfirm(true);
                }
            }
        },

        methods: {
            handleClear() {
                this.minDate = null;
                this.maxDate = null;
                this.handleConfirm(false);
            },

            handleDateInput(event, type) {
                const value = event.target.value;
                const parsedValue = parseDate(value, 'yyyy-MM-dd');

                if (parsedValue) {
                    if (typeof this.disabledDate === 'function' &&
                        this.disabledDate(new Date(parsedValue))) {
                        return;
                    }
                    const target = new Date(type === 'min' ? this.minDate : this.maxDate);
                    if (target) {
                        target.setFullYear(parsedValue.getFullYear());
                        target.setMonth(parsedValue.getMonth());
                        target.setDate(parsedValue.getDate());
                    }
                }
            },

            handleChangeRange(val) {
                this.minDate = val.minDate;
                this.maxDate = val.maxDate;
                this.rangeState = val.rangeState;
            },

            handleDateChange(event, type) {
                const value = event.target.value;
                const parsedValue = parseDate(value, 'yyyy-MM-dd');
                if (parsedValue) {
                    const target = new Date(type === 'min' ? this.minDate : this.maxDate);
                    if (target) {
                        target.setFullYear(parsedValue.getFullYear());
                        target.setMonth(parsedValue.getMonth());
                        target.setDate(parsedValue.getDate());
                    }
                    if (type === 'min') {
                        if (target < this.maxDate) {
                            this.minDate = new Date(target.getTime());
                        }
                    } else {
                        if (target > this.minDate) {
                            this.maxDate = new Date(target.getTime());
                            if (this.minDate && this.minDate > this.maxDate) {
                                this.minDate = null;
                            }
                        }
                    }
                }
            },

            handleTimeChange(event, type) {
                const value = event.target.value;
                const parsedValue = parseDate(value, 'HH:mm:ss');
                if (parsedValue) {
                    const target = new Date(type === 'min' ? this.minDate : this.maxDate);
                    if (target) {
                        target.setHours(parsedValue.getHours());
                        target.setMinutes(parsedValue.getMinutes());
                        target.setSeconds(parsedValue.getSeconds());
                    }
                    if (type === 'min') {
                        if (target < this.maxDate) {
                            this.minDate = new Date(target.getTime());
                        }
                    } else {
                        if (target > this.minDate) {
                            this.maxDate = new Date(target.getTime());
                        }
                    }
                    this.$refs[type + 'TimePicker'].value = target;
                    this[type + 'TimePickerVisible'] = false;
                }
            },

            handleRangePick(val, close = true) {
                if (this.maxDate === val.maxDate && this.minDate === val.minDate) {
                    return;
                }
                this.maxDate = val.maxDate;
                this.minDate = val.minDate;

                if (!close || this.showTime) return;
                this.handleConfirm();
            },

            changeToToday() {
                this.date = new Date();
            },

            handleShortcutClick(shortcut) {
                if (shortcut.onClick) {
                    shortcut.onClick(this);
                }
            },

            resetView() {
                this.minTimePickerVisible = false;
                this.maxTimePickerVisible = false;
            },

            setTime(date, value) {
                let oldDate = new Date(date.getTime());
                let hour = value.getHours();
                let minute = value.getMinutes();
                let second = value.getSeconds();
                oldDate.setHours(hour);
                oldDate.setMinutes(minute);
                oldDate.setSeconds(second);
                return new Date(oldDate.getTime());
            },

            handleMinTimePick(value, visible, first) {
                this.minDate = this.minDate || new Date();
                if (value) {
                    this.minDate = this.setTime(this.minDate, value);
                }

                if (!first) {
                    this.minTimePickerVisible = visible;
                }
            },

            handleMaxTimePick(value, visible, first) {
                if (!this.maxDate) {
                    const now = new Date();
                    if (now >= this.minDate) {
                        this.maxDate = new Date();
                    }
                }

                if (this.maxDate && value) {
                    this.maxDate = this.setTime(this.maxDate, value);
                }

                if (!first) {
                    this.maxTimePickerVisible = visible;
                }
            },

            prevMonth() {
                this.date = prevMonth(this.date);
            },

            nextMonth() {
                this.date = nextMonth(this.date);
            },

            nextYear() {
                const date = this.date;
                date.setFullYear(date.getFullYear() + 1);
                this.resetDate();
            },

            prevYear() {
                const date = this.date;
                date.setFullYear(date.getFullYear() - 1);
                this.resetDate();
            },

            handleConfirm(visible = false) {
                this.$emit('pick', [this.minDate, this.maxDate], visible);
            },

            resetDate() {
                this.date = new Date(this.date);
            }
        },

        components: { TimePicker, DateTable, ElInput }
    };
})