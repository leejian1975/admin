define(function (require, exports, module) {
  const dateUtil = require('../../../../src/utils/date');
  const newArray = function (start, end) {
    let result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  const equalDate = function (dateA, dateB) {
    return dateA === dateB || new Date(dateA).getTime() === new Date(dateB).getTime();
  };

  const toDate = function (date) {
    return isDate(date) ? new Date(date) : null;
  };

  const isDate = function (date) {
    if (date === null || date === undefined) return false;
    if (isNaN(new Date(date).getTime())) return false;
    return true;
  };

  const formatDate = function (date, format) {
    date = toDate(date);
    if (!date) return '';
    return dateUtil.format(date, format || 'yyyy-MM-dd');
  };

  const parseDate = function (string, format) {
    return dateUtil.parse(string, format || 'yyyy-MM-dd');
  };

  const getDayCountOfMonth = function (year, month) {
    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return 30;
    }

    if (month === 1) {
      if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    }

    return 31;
  };

  const getFirstDayOfMonth = function (date) {
    const temp = new Date(date.getTime());
    temp.setDate(1);
    return temp.getDay();
  };

  const DAY_DURATION = 86400000;

  const getStartDateOfMonth = function (year, month) {
    const result = new Date(year, month, 1);
    const day = result.getDay();

    if (day === 0) {
      result.setTime(result.getTime() - DAY_DURATION * 7);
    } else {
      result.setTime(result.getTime() - DAY_DURATION * day);
    }

    return result;
  };

  const getWeekNumber = function (src) {
    const date = new Date(src.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const prevMonth = function (src) {
    const year = src.getFullYear();
    const month = src.getMonth();
    const date = src.getDate();

    const newYear = month === 0 ? year - 1 : year;
    const newMonth = month === 0 ? 11 : month - 1;

    const newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
    if (newMonthDayCount < date) {
      src.setDate(newMonthDayCount);
    }

    src.setMonth(newMonth);
    src.setFullYear(newYear);

    return new Date(src.getTime());
  };

  const nextMonth = function (src) {
    const year = src.getFullYear();
    const month = src.getMonth();
    const date = src.getDate();

    const newYear = month === 11 ? year + 1 : year;
    const newMonth = month === 11 ? 0 : month + 1;

    const newMonthDayCount = getDayCountOfMonth(newYear, newMonth);
    if (newMonthDayCount < date) {
      src.setDate(newMonthDayCount);
    }

    src.setMonth(newMonth);
    src.setFullYear(newYear);

    return new Date(src.getTime());
  };

  const getRangeHours = function (ranges) {
    const hours = [];
    let disabledHours = [];

    (ranges || []).forEach(function(range){
      const value = range.map(
          function(date){
            date.getHours()
          }
      );

      disabledHours = disabledHours.concat(newArray(value[0], value[1]));
    });

    if (disabledHours.length) {
      for (let i = 0; i < 24; i++) {
        hours[i] = disabledHours.indexOf(i) === -1;
      }
    } else {
      for (let i = 0; i < 24; i++) {
        hours[i] = false;
      }
    }

    return hours;
  };

  const limitRange = function (date, ranges) {
    if (!ranges || !ranges.length) return date;

    const len = ranges.length;
    const format = 'HH:mm:ss';

    date = dateUtil.parse(dateUtil.format(date, format), format);
    for (let i = 0; i < len; i++) {
      const range = ranges[i];
      if (date >= range[0] && date <= range[1]) {
        return date;
      }
    }

    let maxDate = ranges[0][0];
    let minDate = ranges[0][0];

    ranges.forEach(function(range){
      minDate = new Date(Math.min(range[0], minDate));
    maxDate = new Date(Math.max(range[1], maxDate));
    })
    ;

    return date < minDate ? minDate : maxDate;
  };
  module.exports = {
    equalDate:equalDate,
    toDate:toDate,
    isDate:isDate,
    formatDate:formatDate,
    parseDate:parseDate,
    getDayCountOfMonth:getDayCountOfMonth,
    getFirstDayOfMonth:getFirstDayOfMonth,
    getStartDateOfMonth:getStartDateOfMonth,
    getWeekNumber:getWeekNumber,
    prevMonth:prevMonth,
    nextMonth:nextMonth,
    getRangeHours:getRangeHours,
    DAY_DURATION:DAY_DURATION,

    limitRange:limitRange,
  }
})