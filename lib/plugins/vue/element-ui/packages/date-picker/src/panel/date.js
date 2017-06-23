/**
 * Created by Zhou on 17/2/10.
 */
/**
 * Created by Zhou on 17/2/9.
 */
define(function (require, exports, module) {
    const formatDate = require('../util/index').formatDate;
    const parseDate = require('../util/index').parseDate;
    const Locale= require('../../../../src/mixins/locale');
    const ElInput= require('../../../input/index');
    const TimePicker= require('./time');
    const YearTable= require('../basic/year-table');
    const MonthTable= require('../basic/month-table');
    const DateTable= require('../basic/date-table');
    module.exports = {
        mixins: [Locale],
        template: require('./date.tpl'),
        watch: {
            showTime:function(val) {
                /* istanbul ignore if */
                if (!val) return;
                var that = this;
                this.$nextTick(function(_){
                    const inputElm = that.$refs.input.$el;
                    if (inputElm) {
                        that.pickerWidth = inputElm.getBoundingClientRect().width + 10;
                    }
                });
            },

            value(newVal) {
                if (!newVal) return;
                newVal = new Date(newVal);
                if (!isNaN(newVal)) {
                    if (typeof this.disabledDate === 'function' &&
                        this.disabledDate(new Date(newVal))) {
                        return;
                    }
                    this.date = newVal;
                    this.year = newVal.getFullYear();
                    this.month = newVal.getMonth();
                    this.$emit('pick', newVal, true);
                }
            },

            timePickerVisible(val) {
                if (val) {
                    var that = this;
                    this.$nextTick(function(){
                        that.$refs.timepicker.ajustScrollTop()
                    });
                }

            },

            selectionMode(newVal) {
                if (newVal === 'month') {
                    /* istanbul ignore next */
                    if (this.currentView !== 'year' || this.currentView !== 'month') {
                        this.currentView = 'month';
                    }
                }
            },

            date(newVal) {
                /* istanbul ignore next */
                if (!this.year) {
                    this.year = newVal.getFullYear();
                    this.month = newVal.getMonth();
                }
            }
        },

        methods: {
            handleClear() {
                this.date = new Date();
                this.$emit('pick');
            },

            resetDate() {
                this.date = new Date(this.date);
            },

            showMonthPicker() {
                this.currentView = 'month';
            },

            showYearPicker() {
                this.currentView = 'year';
            },

            // XXX: 没用到
            // handleLabelClick() {
            //   if (this.currentView === 'date') {
            //     this.showMonthPicker();
            //   } else if (this.currentView === 'month') {
            //     this.showYearPicker();
            //   }
            // },

            prevMonth() {
                this.month--;
                if (this.month < 0) {
                    this.month = 11;
                    this.year--;
                }
            },

            nextMonth() {
                this.month++;
                if (this.month > 11) {
                    this.month = 0;
                    this.year++;
                }
            },

            nextYear() {
                if (this.currentView === 'year') {
                    this.$refs.yearTable.nextTenYear();
                } else {
                    this.year++;
                    this.date.setFullYear(this.year);
                    this.resetDate();
                }
            },

            prevYear() {
                if (this.currentView === 'year') {
                    this.$refs.yearTable.prevTenYear();
                } else {
                    this.year--;
                    this.date.setFullYear(this.year);
                    this.resetDate();
                }
            },

            handleShortcutClick(shortcut) {
                if (shortcut.onClick) {
                    shortcut.onClick(this);
                }
            },

            handleTimePick(picker, visible, first) {
                if (picker) {
                    let oldDate = new Date(this.date.getTime());
                    let hour = picker.getHours();
                    let minute = picker.getMinutes();
                    let second = picker.getSeconds();
                    oldDate.setHours(hour);
                    oldDate.setMinutes(minute);
                    oldDate.setSeconds(second);
                    this.date = new Date(oldDate.getTime());
                }

                if (!first) {
                    this.timePickerVisible = visible;
                }
            },

            handleMonthPick(month) {
                this.month = month;
                const selectionMode = this.selectionMode;
                if (selectionMode !== 'month') {
                    this.date.setMonth(month);
                    this.currentView = 'date';
                    this.resetDate();
                } else {
                    this.date.setMonth(month);
                    this.year && this.date.setFullYear(this.year);
                    this.resetDate();
                    const value = new Date(this.date.getFullYear(), month, 1);
                    this.$emit('pick', value);
                }
            },

            handleDatePick(value) {
                if (this.selectionMode === 'day') {
                    if (!this.showTime) {
                        this.$emit('pick', new Date(value.getTime()));
                    }
                    this.date.setFullYear(value.getFullYear());
                    this.date.setMonth(value.getMonth());
                    this.date.setDate(value.getDate());
                } else if (this.selectionMode === 'week') {
                    let date = formatDate(value.date, this.format || 'yyyywWW');
                    const week = this.week = value.week;

                    date = /WW/.test(date)
                        ? date.replace(/WW/, week < 10 ? '0' + week : week)
                        : date.replace(/W/, week);

                    this.$emit('pick', date);
                }

                this.resetDate();
            },

            handleYearPick(year, close = true) {
                this.year = year;
                if (!close) return;

                this.date.setFullYear(year);
                if (this.selectionMode === 'year') {
                    this.$emit('pick', new Date(year));
                } else {
                    this.currentView = 'month';
                }

                this.resetDate();
            },

            changeToNow() {
                this.date.setTime(+new Date());
                this.$emit('pick', new Date(this.date.getTime()));
                this.resetDate();
            },

            confirm() {
                this.$emit('pick', this.date);
            },

            resetView() {
                if (this.selectionMode === 'month') {
                    this.currentView = 'month';
                } else if (this.selectionMode === 'year') {
                    this.currentView = 'year';
                } else {
                    this.currentView = 'date';
                }

                if (this.selectionMode !== 'week') {
                    this.year = this.date.getFullYear();
                    this.month = this.date.getMonth();
                }
            }
        },

        components: {
            TimePicker, YearTable, MonthTable, DateTable, ElInput
        },

        mounted() {
            if (this.selectionMode === 'month') {
                this.currentView = 'month';
            }

            if (this.date && !this.year) {
                this.year = this.date.getFullYear();
                this.month = this.date.getMonth();
            }
        },

        data() {
            return {
                popperClass: '',
                pickerWidth: 0,
                date: new Date(),
                value: '',
                showTime: false,
                selectionMode: 'day',
                shortcuts: '',
                visible: false,
                currentView: 'date',
                disabledDate: '',
                firstDayOfWeek: 7,
                year: null,
                month: null,
                week: null,
                showWeekNumber: false,
                timePickerVisible: false,
                width: 0
            };
        },

        computed: {
            footerVisible() {
                return this.showTime;
            },

            visibleTime: {
                get() {
                    return formatDate(this.date, 'HH:mm:ss');
                },

                set(val) {
                    if (val) {
                        const date = parseDate(val, 'HH:mm:ss');
                        if (date) {
                            date.setFullYear(this.date.getFullYear());
                            date.setMonth(this.date.getMonth());
                            date.setDate(this.date.getDate());
                            this.date = date;
                            this.$refs.timepicker.value = date;
                            this.timePickerVisible = false;
                        }
                    }
                }
            },

            visibleDate: {
                get() {
                    return formatDate(this.date);
                },

                set(val) {
                    const date = parseDate(val, 'yyyy-MM-dd');
                    if (date) {
                        date.setHours(this.date.getHours());
                        date.setMinutes(this.date.getMinutes());
                        date.setSeconds(this.date.getSeconds());
                        this.date = date;
                        this.resetView();
                    }
                }
            },

            yearLabel() {
                const year = this.year;
                if (!year) return '';
                const yearTranslation = this.t('el.datepicker.year');
                if (this.currentView === 'year') {
                    const startYear = Math.floor(year / 10) * 10;
                    if (yearTranslation) {
                        return startYear + ' ' + yearTranslation + ' - ' + (startYear + 9) + ' ' + yearTranslation;
                    }
                    return startYear + ' - ' + (startYear + 9);
                }
                return this.year + ' ' + yearTranslation;
            }
        }
    }
})