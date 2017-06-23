define(function (require, exports, module) {
    var requestError = function(res,self){
        self.$message({
            message: res.errorMsg,
            type: 'danger'
        });
        if(res.errorCode == -1){
            self.$router.push({path: '/login', query: {redirect: self.$route.fullPath}});
        }
    }
    module.exports = {
        requestError:requestError
    }
})