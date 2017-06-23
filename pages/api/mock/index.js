
define(function (require, exports, module) {
    var MockAdapter = require('axios-mock-adapter');
    Cfe.axios = require('axios');
    var bootstrap = function () {
        var mock = new MockAdapter(Cfe.axios);
        mock.onPost('http://localhost:8080/activiti/test').reply(
            function(){
                return new Promise(function(resolve, reject)  {
                    setTimeout(function() {
                        resolve([200, {
                            total: 1,
                            users: 1
                        } ]);
                    }, 500);
                });
            }
        );
        mock.onPost('/service/user/getUserListByPage').reply(require('./user-api-mock').list);
        mock.onPost('/service/admin/detail').reply(require('./admin-api-mock').detail);


        mock.onPost('/logon').reply(
            function(config){
                return new Promise(function(resolve, reject)  {
                    setTimeout(function() {
                        resolve([200, {
                            errorCode: 0,
                            errorMsg: null
                        } ]);
                    }, 500);
                });
            }
        )

    }
    module.exports = {
        bootstrap:bootstrap
    };
})
