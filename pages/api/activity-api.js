/**
 * Created by joe on 2017/3/10.
 */
define(function (require, exports, module) {
    var axios = Cfe.axios ? Cfe.axios : require('axios');

    var fetchActivityList = function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return axios.post('/service/activities/list', [...arg]);
    };

    var batchDeleteActivity = function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return Cfe.axios.post('/service/activities/list_delete', [...arg]);
    };

    var deleteActivity = function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return Cfe.axios.post('/service/activities/delete', [...arg]);
    };

    var updateActivity = function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return Cfe.axios.post('/service/activities/update', [...arg]);

    };

    var addActivity = function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return Cfe.axios.post('/service/activities/add', [...arg]);
    };

    var getActivityById = function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return Cfe.axios.post('/service/activities/detail_by_id', [...arg]);
    };

    var getActivityByName = function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return Cfe.axios.post('/service/activities/list_by_name', [...arg]);
    };

    var delActivityAgenda=function(...arg){
        //var data = 'params=' + encodeURIComponent(JSON.stringify([...arg]));
        return Cfe.axios.post('/service/agenda/delete', [...arg]);
    };

    module.exports = {
        fetchActivityList:fetchActivityList,
        batchDeleteActivity:batchDeleteActivity,
        deleteActivity:deleteActivity,
        updateActivity:updateActivity,
        addActivity:addActivity,
        getActivityById:getActivityById,
        getActivityByName:getActivityByName,
        delActivityAgenda:delActivityAgenda
    }
});
