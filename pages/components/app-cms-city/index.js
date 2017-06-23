define(function (require, exports, module) {
    const Vue = require('vue');
    Vue.use(require('element-cascader'));
    var cityData = require('./city.js').data;

    module.exports = {
        name: 'app-cms-city',
        install:function(Vue){
            Vue.component(this.name,this);
        },
        props:{
            cityName:String,
            onlyCity:false
        },
        template:require('./index.tpl'),
        data:function() {
            return {
                options: [],
                city:[],
                cityValue:this.cityName
            };
        },
        watch:{
            'cityName':function () {
                var _this = this;
                if(_this.cityName == "" || _this.cityName == null ){
                    _this.city = [];
                }else{
                    if(_this.onlyCity == true){
                        _this.loadCityData(_this.cityName);
                    }else{
                        _this.city =_this.cityName.split("/");
                    }
                }
            }
        },
        mounted:function() {
            var _this = this;
            _this.loadCityData();
        },
        methods:{
            handleChange:function(value){
                var _this = this;
                _this.cityValue = "";
                if(_this.onlyCity == true){
                    _this.cityValue = value[1];
                }else{
                    for(var item in value){
                        if(item == 1){
                            _this.cityValue = _this.cityValue + "/"+ value[item];
                        }else{
                            _this.cityValue = _this.cityValue + value[item];
                        }
                    }
                }
                _this.$emit("city-change",_this.cityValue);
            },
            //遍历城市本地json数据
            loadCityData:function(cityName){
                var _this = this;
                for(var index in cityData){
                    var option = {
                        children:[]
                    };
                    option.value = cityData[index].name;
                    option.label = cityData[index].name;
                    for(var i in cityData[index].city){
                        var option1 = {};
                        option1.value = cityData[index].city[i].name;
                        option1.label = cityData[index].city[i].name;
                        option.children.push(option1);
                        if(option1.value == cityName){
                            _this.city.push(option.value);
                            _this.city.push(option1.value);
                        }
                    }
                    _this.options.push(option);
                }
            }
        }
    };
})