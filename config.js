define(function(require, exports, module) {
	var config = {
		alias: {
            'cfe-log': 'lib-user/cfe-log/index.js',
            'app-router':'pages/router.js',
            'app-store':'pages/store.js',
			'app-mock':'pages/mock/index.js',
			'curve':'lib-user/curve/curve.min.js'
        },
		base:['vue','axios'],
		logLevel:'debug',
        fileDownloadUrl:'/upload/',
        imgDownloadUrl:'/upload/',
		userConfig: {
			network: {
				timeout: 30000,
				headers:{
					post:{
						'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
					}
				},
                baseURL: 'http://localhost:8080/cms/'
			}
		}
	};
	module.exports = config;

});