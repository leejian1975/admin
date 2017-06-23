/**
 * Created by Zhou on 17/2/9.
 */
define(function (require, exports, module) {
    const hasClass = require('../../../../src/utils/dom').hasClass;
    module.exports = {
        props: {
            disabledDate: {},
            date: {},
            year: {}
        },
        template:require('./year-table.tpl'),
        computed: {
            startYear() {
                return Math.floor(this.year / 10) * 10;
            }
        },

        methods: {
            getCellStyle(year) {
                const style = {};
                const date = new Date(this.date);

                date.setFullYear(year);
                style.disabled = typeof this.disabledDate === 'function' &&
                    this.disabledDate(date);
                style.current = Number(this.year) === year;

                return style;
            },

            nextTenYear() {
                this.$emit('pick', Number(this.year) + 10, false);
            },

            prevTenYear() {
                this.$emit('pick', Number(this.year) - 10, false);
            },

            handleYearTableClick(event) {
                const target = event.target;
                if (target.tagName === 'A') {
                    if (hasClass(target.parentNode, 'disabled')) return;
                    const year = target.textContent || target.innerText;
                    this.$emit('pick', year);
                }
            }
        }
    };
})