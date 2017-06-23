
/**
 * Created by Zhou on 17/2/9.
 */

define(function (require, exports, module) {
  module.exports = {
    name: 'ElForm',
    template:require('./form.tpl'),
    install : function(Vue) {
      Vue.component(this.name, this);
    },
    componentName: 'ElForm',

    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      rules() {
        this.validate();
      }
    },
    data() {
      return {
        fields: []
      };
    },
    created() {
        var that = this;
        this.$on('el.form.addField',
            function (field) {
                if (field) {
                    that.fields.push(field);
                }
            });
      /* istanbul ignore next */
        this.$on('el.form.removeField',
            function (field) {
                if (field.prop) {
                    that.fields.splice(that.fields.indexOf(field), 1);
                }
            });
    },
    methods: {
        resetFields() {
            this.fields.forEach(
                function (field) {
                    field.resetField();
                });
        },
      validate(callback) {
        let valid = true;
        let count = 0;
          var that = this;
          this.fields.forEach(
              function (field, index) {
                  field.validate('',
                      function (errors) {
                          if (errors) {
                              valid = false;
                          }
                          if (typeof callback === 'function' && ++count === that.fields.length) {
                              callback(valid);
                          }
                      });
              });
      },
      validateField(prop, cb) {
        var field = this.fields.filter(field => field.prop === prop)[0];
        if (!field) { throw new Error('must call validateField with valid prop string!'); }

        field.validate('', cb);
      }
    }
  }
})