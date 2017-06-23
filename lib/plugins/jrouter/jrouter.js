/**
 * Created by Zhou on 17/1/23.
 */
define(function (require,module,exports) {
    var $;
    function JRouter(jQuery){
        $ = jQuery;
    }
    JRouter.prototype.start = function(config){
        var self = this;
        self.routerMap = config.router;
        self.mainView = config.view;
        self.errorTemplateId = config.errorTemplateId;
        self.startRouter();
        window.onhashchange = function(){
            self.startRouter();
        };
    };
    var messageStack = [];

    JRouter.prototype.getMessage = function(id){
        var msg = {};
        $.each(messageStack,function(i,e){
            if(e.id===id){
                msg = e;
            }
        });
        return msg;
    };

    JRouter.prototype.setMessage = function(obj){
        var _obj = JSON.parse(JSON.stringify(obj));
        $.each(messageStack,function(i,e){
            if(e.id===_obj.id){
                e = _obj;
                return false;
            }
        });
        messageStack.push(_obj);
    };
    JRouter.prototype.delMessage = function(id){
        if(typeof id==='undefined'){
            return false;
        }
        var index = 0;
        $.each(messageStack,function(i,e){
            if(e.id===id){
                index = i;
            }
        });
        $.each(messageStack,function(i,e){
            if(i>index){
                messageStack[i-1] = e;
            }
        });
    };
    JRouter.prototype.clearMessage = function(id){
        var index = 0;
        messageStack = [];
    };

    JRouter.prototype.stringify = function(routerUrl,paramObj){
        var paramStr='' ,hash;
        for(var i in  paramObj){
            paramStr += i + '=' + encodeURIComponent(paramObj[i]) + '&';
        }
        if(paramStr === ''){
            hash = routerUrl;
        }
        else{
            paramStr = paramStr.substring(0,paramStr.length-1);
            hash = routerUrl + '?' + paramStr;
        }
        return hash;
    };
    JRouter.prototype.parse = function(routerHash){
        var hash = typeof routerHash ==='undefined'?location.hash:routerHash;
        var obj = {
            url:'',
            param: {}
        };
        var param = {},url='';
        var pIndex = hash.indexOf('?');
        if(hash===''){
            return obj;
        }

        if(pIndex>-1){
            url = hash.substring(1,pIndex);
            var paramStr = hash.substring(pIndex+1);
            var paramArr = paramStr.split('&');

            $.each(paramArr,function(i,e){
                var item = e.split('='),
                    key,
                    val;
                key = item[0];
                val = item[1];
                if(key!==''){
                    param[key] = decodeURIComponent(val);
                }


            });
        }
        else{
            url = hash.substring(1);
            param = {};
        }
        return {
            url:url,
            param: param
        };
    };

    JRouter.prototype.routerAction = function(routeObj){
        var self = this;
        var routerItem = self.routerMap[routeObj.url];
        if(typeof routerItem==='undefined'){
            var defaultsRoute = self.routerMap.defaults;
            routerItem = self.routerMap[defaultsRoute];
            location.hash = defaultsRoute;
            return false;
        }

        $.ajax({
            type: 'GET',
            url: routerItem.templateUrl,
            dataType: 'html',
            success: function(data, status, xhr){
                $(self.mainView).html(data);
                self.loadScript(routerItem.controller);
            },
            error: function(xhr, errorType, error){
                if($(self.errorTemplateId).length===0){
                    return false;
                }
                var errHtml = $(self.errorTemplateId).html();
                errHtml = errHtml.replace(/{{errStatus}}/,xhr.status);
                errHtml = errHtml.replace(/{{errContent}}/,xhr.responseText);
                $(self.mainView).html(errHtml);
            }
        });
    }

    JRouter.prototype.startRouter = function() {
        var self = this;
        var hash = location.hash;
        var routeObj = self.parse(hash);
        self.routerAction(routeObj);
    }

    JRouter.prototype.loadScript = function(src, callback) {

        seajs.use(src, function (controller) {
            if(controller){

                if (typeof controller.init === 'function') {
                    controller.init(window.mUserConfig,window.getUrlParams);
                }
            }else{
                console.log('start page failed');
            }
        });
    }

    return JRouter;
})
