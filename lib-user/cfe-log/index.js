/* cfe-log v0.1*/
;(function (root, factory) {
    if (typeof define === 'function') {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Log = factory();
    }
}(this, function () {
    var _level;
    var _count;
    function Log(){
        var instantiated;

        if (!instantiated) {
            instantiated = this.init();
        }
        return instantiated;
    };
    Log.prototype.init = function(){
        _level = 0;
        _count = 0;

    }
    Log.prototype.setLevel = function(level){
        if(_count == 0){
            if(level =='i'||level =='info'||level =='I'||level =='INFO'){
                _level = 1;
            }else if(level =='w'||level =='warning'||level =='W'||level =='WARNING'){
                _level = 2;
            }else if(level =='e'||level =='error'||level =='E'||level =='ERROR'){
                _level = 3;
            }else if(level =='d'||level =='debug'||level =='D'||level =='DEBUG'){
                _level = 0;
            }else{
                _level = 100;
            }
            _count == 1;
        }else{
            console.log("CFE提示：ERROR:\t"+"重复设置log等级，请检查")
        }
    };
    Log.prototype.debug = function(...args){
        if(_level <= 0) {
            console.debug("CFE提示：DEBUG:==============================")
            for(var i =0; i < args.length; i++){
                console.debug(args[i])
            }

        }
    };
    Log.prototype.info = function(...args){
        if(_level <= 1) {
            console.info("CFE提示：INFO:==============================")
            for (var i = 0; i < args.length; i++) {
                console.info(args[i])
            }
        }

    };

    Log.prototype.warn = function(...args){
        if(_level <= 2) {
            console.warn("CFE提示：WARN:==============================")
            for(var i =0; i < args.length; i++){
                console.warn(args[i])
            }
        }
    };
    Log.prototype.error = function(...args){
        if(_level <= 3) {
            console.error("CFE提示：ERROR:==============================")
            for(var i =0; i < args.length; i++){
                console.error(args[i])
            }
        }
    }


    window.Cfe.Log = new Log;
}))