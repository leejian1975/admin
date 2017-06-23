/**
 * Created by Zhou on 17/2/9.
 */
define(function (require, exports, module) {
    const Locale = require('../../../../src/mixins/locale');
    const  hasClass =require('../../../../src/utils/dom').hasClass;

    module.exports = {
        props: {
            disabledDate: {},
            date: {},
            month: {
                type: Number
            }
        },
        mixins: [Locale],
        template:require('./month-table.tpl'),
        methods: {
            getCellStyle(month) {
                const style = {};
                const date = new Date(this.date);

                date.setMonth(month);
                style.disabled = typeof this.disabledDate === 'function' &&
                    this.disabledDate(date);
                style.current = this.month === month;

                return style;
            },

            handleMonthTableClick(event) {
                const target = event.target;
                if (target.tagName !== 'A') return;
                if (hasClass(target.parentNode, 'disabled')) return;
                const column = target.parentNode.cellIndex;
                const row = target.parentNode.parentNode.rowIndex;
                const month = row * 4 + column;

                this.$emit('pick', month);
            }
        }
    };
})