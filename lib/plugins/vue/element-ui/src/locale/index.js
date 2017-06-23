// import defaultLang from 'element-ui/src/locale/lang/zh-CN';
// import Vue from 'vue';
 //import deepmerge from 'deepmerge';
// import Format from './format';
define(function (require, exports, module) {
  const Vue = require('vue');
  const Format = require('./format.js')
  const deepmerge = require('deepmerge')
  let lang = require('./lang/zh-CN.js');
  const format = Format(Vue);
  let merged = false;
  let i18nHandler = function() {
    const vuei18n = Object.getPrototypeOf(this || Vue).$t;
    if (typeof vuei18n === 'function') {
      if (!merged) {
        merged = true;
        Vue.locale(
            Vue.config.lang,
            deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
        );
      }
      return vuei18n.apply(this, arguments);
    }
  };

  const t = function(path, options) {
    let value = i18nHandler.apply(this, arguments);
    if (value !== null && value !== undefined) return value;

    const array = path.split('.');
    let current = lang;

    for (let i = 0, j = array.length; i < j; i++) {
      const property = array[i];
      value = current[property];
      if (i === j - 1) return format(value, options);
      if (!value) return '';
      current = value;
    }
    return '';
  };

  const use = function(l) {
    lang = l || lang;
  };

  const i18n = function(fn) {
    i18nHandler = fn || i18nHandler;
  };

    module.exports={
      use:use,
      t:t,
      i18n:i18n
    }
})


