define(function (require, exports, module) {
    var axios = Cfe.axios ? Cfe.axios : require('axios');

    var requestLogin = function (...arg){
        return axios.post('/logon', ...arg)
    };
    var requestLogout = function (){
        return axios.delete('/logout');
    };
    var adminDetail = function (){
        return axios.post('/service/admins/detail')
    };
    var resetPwd = function (...arg){
        return axios.post('/service/admins/resetpwd',[...arg])
    };
    module.exports = {
        requestLogin:requestLogin,
        requestLogout:requestLogout,
        adminDetail:adminDetail,
        resetPwd:resetPwd
    }
})