define(function (require, exports, module) {
    const Vue = require('vue');
    Vue.use(require('element-time-picker'));
    const dateUtil = require('../../utils/date');
    module.exports = {
        name: 'app-cms-time',
        install: function (Vue) {
            Vue.component(this.name, this);
        },
        props: {
            value: String,
            placeholder: String,
            format:{
                default: 'HH:mm:ss'
            }
        },
        template: require('./index.tpl'),
        data: function () {
            return {
                timeValue:this.value,
                timePlaceholder:this.placeholder,
                timeFormat:this.format,

            }
        },
        watch: {
            'value':function(){
                if(this.value){
                    var time = new Date(Date.parse("2017-05-10"+" "+this.value));
                    this.timeValue = new Date(2017,5,10,time.getHours(),time.getMinutes(),time.getSeconds());
                }else{
                    this.timeValue = null;
                }
            },
            'format':function(){
                this.timeFormat = this.format;
            },
            'timeValue': function () {
                var timeString = '';
                if(this.timeValue){
                    timeString = dateUtil.format(this.timeValue, this.format || 'HH:mm:ss');
                }
                this.$emit('on-time-change', timeString);
            }
        },
        methods: {}
    };
})