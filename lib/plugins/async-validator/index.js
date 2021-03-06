'use strict';

define(function (require, exports, module) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var _util = require('./util');

  var _validator = require('./validator/index');

  var _validator2 = _interopRequireDefault(_validator);

  var _messages2 = require('./messages');

  var _rule = require('./rule/index');

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {"default": obj};
  }

  /**
   *  Encapsulates a validation schema.
   *
   *  @param descriptor An object declaring validation rules
   *  for this schema.
   */
  function Schema(descriptor) {
    this.rules = null;
    this._messages = _messages2.messages;
    this.define(descriptor);
  }

  Schema.prototype = {
    messages: function messages(_messages) {
      if (_messages) {
        this._messages = (0, _util.deepMerge)((0, _messages2.newMessages)(), _messages);
      }
      return this._messages;
    },
    define: function define(rules) {
      if (!rules) {
        throw new Error('Cannot configure a schema with no rules');
      }
      if ((typeof rules === 'undefined' ? 'undefined' : _typeof(rules)) !== 'object' || Array.isArray(rules)) {
        throw new Error('Rules must be an object');
      }
      this.rules = {};
      var z = void 0;
      var item = void 0;
      for (z in rules) {
        if (rules.hasOwnProperty(z)) {
          item = rules[z];
          this.rules[z] = Array.isArray(item) ? item : [item];
        }
      }
    },
    validate: function validate(source_) {
      var _this = this;

      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oc = arguments[2];

      var source = source_;
      var options = o;
      var callback = oc;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (!this.rules || Object.keys(this.rules).length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      function complete(results) {
        var i = void 0;
        var field = void 0;
        var errors = [];
        var fields = {};

        function add(e) {
          if (Array.isArray(e)) {
            errors = errors.concat.apply(errors, e);
          } else {
            errors.push(e);
          }
        }

        for (i = 0; i < results.length; i++) {
          add(results[i]);
        }
        if (!errors.length) {
          errors = null;
          fields = null;
        } else {
          for (i = 0; i < errors.length; i++) {
            field = errors[i].field;
            fields[field] = fields[field] || [];
            fields[field].push(errors[i]);
          }
        }
        callback(errors, fields);
      }

      if (options.messages) {
        var messages = this.messages();
        if (messages === _messages2.messages) {
          messages = (0, _messages2.newMessages)();
        }
        (0, _util.deepMerge)(messages, options.messages);
        options.messages = messages;
      } else {
        options.messages = this.messages();
      }

      options.error = _rule.error;
      var arr = void 0;
      var value = void 0;
      var series = {};
      var keys = options.keys || Object.keys(this.rules);
      keys.forEach(function (z) {
        arr = _this.rules[z];
        value = source[z];
        arr.forEach(function (r) {
          var rule = r;
          if (typeof rule.transform === 'function') {
            if (source === source_) {
              source = _extends({}, source);
            }
            value = source[z] = rule.transform(value);
          }
          if (typeof rule === 'function') {
            rule = {
              validator: rule
            };
          } else {
            rule = _extends({}, rule);
          }
          rule.validator = _this.getValidationMethod(rule);
          rule.field = z;
          rule.fullField = rule.fullField || z;
          rule.type = _this.getType(rule);
          if (!rule.validator) {
            return;
          }
          series[z] = series[z] || [];
          series[z].push({
            rule: rule,
            value: value,
            source: source,
            field: z
          });
        });
      });
      var errorFields = {};
      (0, _util.asyncMap)(series, options, function (data, doIt) {
        var rule = data.rule;
        var deep = (rule.type === 'object' || rule.type === 'array') && (_typeof(rule.fields) === 'object' || _typeof(rule.defaultField) === 'object');
        deep = deep && (rule.required || !rule.required && data.value);
        rule.field = data.field;
        function addFullfield(key, schema) {
          return _extends({}, schema, {
            fullField: rule.fullField + '.' + key
          });
        }

        function cb() {
          var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          var errors = e;
          if (!Array.isArray(errors)) {
            errors = [errors];
          }
          if (errors.length) {
            (0, _util.warning)('async-validator:', errors);
          }
          if (errors.length && rule.message) {
            errors = [].concat(rule.message);
          }

          errors = errors.map((0, _util.complementError)(rule));

          if ((options.first || options.fieldFirst) && errors.length) {
            errorFields[rule.field] = 1;
            return doIt(errors);
          }
          if (!deep) {
            doIt(errors);
          } else {
            // if rule is required but the target object
            // does not exist fail at the rule level and don't
            // go deeper
            if (rule.required && !data.value) {
              if (rule.message) {
                errors = [].concat(rule.message).map((0, _util.complementError)(rule));
              } else {
                errors = [options.error(rule, (0, _util.format)(options.messages.required, rule.field))];
              }
              return doIt(errors);
            }

            var fieldsSchema = {};
            if (rule.defaultField) {
              for (var k in data.value) {
                if (data.value.hasOwnProperty(k)) {
                  fieldsSchema[k] = rule.defaultField;
                }
              }
            }
            fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
            for (var f in fieldsSchema) {
              if (fieldsSchema.hasOwnProperty(f)) {
                var fieldSchema = Array.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
                fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
              }
            }
            var schema = new Schema(fieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, function (errs) {
              doIt(errs && errs.length ? errors.concat(errs) : errs);
            });
          }
        }

        rule.validator(rule, data.value, cb, data.source, options);
      }, function (results) {
        complete(results);
      });
    },
    getType: function getType(rule) {
      if (rule.type === undefined && rule.pattern instanceof RegExp) {
        rule.type = 'pattern';
      }
      if (typeof rule.validator !== 'function' && rule.type && !_validator2["default"].hasOwnProperty(rule.type)) {
        throw new Error((0, _util.format)('Unknown rule type %s', rule.type));
      }
      return rule.type || 'string';
    },
    getValidationMethod: function getValidationMethod(rule) {
      if (typeof rule.validator === 'function') {
        return rule.validator;
      }
      var keys = Object.keys(rule);
      var messageIndex = keys.indexOf('message');
      if (messageIndex !== -1) {
        keys.splice(messageIndex, 1);
      }
      if (keys.length === 1 && keys[0] === 'required') {
        return _validator2["default"].required;
      }
      return _validator2["default"][this.getType(rule)] || false;
    }
  };

  Schema.register = function register(type, validator) {
    if (typeof validator !== 'function') {
      throw new Error('Cannot register a validator by type, validator is not a function');
    }
    _validator2["default"][type] = validator;
  };

  Schema.messages = _messages2.messages;

  exports["default"] = Schema;
  module.exports = exports['default'];
})