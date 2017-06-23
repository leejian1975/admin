/*http*/
;(function(root, factory) {
	if(typeof define === 'function') {
        define(function() {
            return factory(root);
        });
    } else if(typeof exports === 'object') {
        module.exports = factory(require('http'));
    } else {
        root.http = factory(root);
    }
} (this, function() {
	var context = this

	if ('window' in context) {
		var doc = document, byTag = 'getElementsByTagName', head = doc[byTag]('head')[0];
	} else {
		var XHR2;
		try {
			XHR2 = require('xhr2');
		} catch(ex) {
			throw new Error('xhr2 required!');
		}
	}

	var httpsRe = /^http/, protocolRe = /(^\w+):\/\//, twoHundo = /^(20\d|1223)$/, readyState = 'readyState',
	contentType = 'Content-Type', requestedWith = 'X-Requested-With', uniqid = 0, callbackPrefix = 'reqwest_' + ( + new Date()),
	lastValue, xmlHttpRequest = 'XMLHttpRequest', xDomainRequest = 'XDomainRequest', noop = function() {},
	isArray = typeof Array.isArray == 'function' ? Array.isArray: function(a) {
		return a instanceof Array
	},
	defaultHeaders = {
		'contentType': 'application/x-www-form-urlencoded',
		'requestedWith': xmlHttpRequest,
		'accept': {
			'*': 'text/javascript, text/html, application/xml, text/xml, */*',
			'xml': 'application/xml, text/xml',
			'html': 'text/html',
			'text': 'text/plain',
			'json': 'application/json, text/javascript',
			'js': 'application/javascript, text/javascript'
		}
	},
	xhr = function(o) {
		// is it x-domain
		if (o['crossOrigin'] === true) {
			var xhr = context[xmlHttpRequest] ? new XMLHttpRequest() : null;
			if (xhr && 'withCredentials' in xhr) {
				return xhr;
			} else if (context[xDomainRequest]) {
				return new XDomainRequest();
			} else {
				throw new Error('Browser does not support cross-origin requests');
			}
		} else if (context[xmlHttpRequest]) {
			return new XMLHttpRequest();
		} else if (XHR2) {
			return new XHR2();
		} else {
			return new ActiveXObject('Microsoft.XMLHTTP');
		}
	},
	globalSetupOptions = {
		dataFilter: function(data) {
			return data;
		}
	};

	function succeed(r) {
		var protocol = protocolRe.exec(r.url);
		protocol = (protocol && protocol[1]) || context.location.protocol;
		return httpsRe.test(protocol) ? twoHundo.test(r.request.status) : !!r.request.response;
	}

	function handleReadyState(r, success, error) {
		return function() {
			// use _aborted to mitigate against IE err c00c023f
			// (can't read props on aborted request objects)
			if (r._aborted) return error(r.request);
			if (r._timedOut) return error(r.request, 'Request is aborted: timeout');
			if (r.request && r.request[readyState] == 4) {
				r.request.onreadystatechange = noop;
				if (succeed(r))
					success(r.request);
				else
					error(r.request);
			}
		}
	}

	function setHeaders(httpxhr, o) {
		var headers = o['headers'] || {}, h;
		headers['Accept'] = headers['Accept'] || defaultHeaders['accept'][o['type']] || defaultHeaders['accept']['*'];
		var isAFormData = typeof FormData !== 'undefined' && (o['data'] instanceof FormData);
		// breaks cross-origin requests with legacy browsers
		if (!o['crossOrigin'] && !headers[requestedWith]) headers[requestedWith] = defaultHeaders['requestedWith'];
		if (!headers[contentType] && !isAFormData) headers[contentType] = o['contentType'] || defaultHeaders['contentType'];
		for (h in headers) {
			headers.hasOwnProperty(h) && 'setRequestHeader' in httpxhr && httpxhr.setRequestHeader(h, headers[h]);
		}
	}

	function setCredentials(httpxhr, o) {
		if (typeof o['withCredentials'] !== 'undefined' && typeof httpxhr.withCredentials !== 'undefined') {
			httpxhr.withCredentials = !!o['withCredentials'];
		}
	}

	function generalCallback(data) {
		lastValue = data;
	}

	function urlappend(url, s) {
		return url + (/\?/.test(url) ? '&': '?') + s;
	}

	function handleJsonp(o, fn, err, url) {
		var reqId = uniqid++,
		cbkey = o['jsonpCallback'] || 'callback',
		cbval = o['jsonpCallbackName'] || http.getcallbackPrefix(reqId),
		cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)'),
		match = url.match(cbreg),
		script = doc.createElement('script'),
		loaded = 0,
		isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1;

		if (match) {
			if (match[3] === '?') {
				url = url.replace(cbreg, '$1=' + cbval); // wildcard callback func name
			} else {
				cbval = match[3]; // provided callback func name
			}
		} else {
			url = urlappend(url, cbkey + '=' + cbval); // no callback details, add 'em
		}

		context[cbval] = generalCallback;

		script.type = 'text/javascript';
		script.src = url;
		script.async = true;
		if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
			script.htmlFor = script.id = '_reqwest_' + reqId;
		}

		script.onload = script.onreadystatechange = function() {
			if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
				return false;
			}
			script.onload = script.onreadystatechange = null;
			script.onclick && script.onclick();
			// Call the user callback with the last value stored and clean up values and scripts.
			fn(lastValue);
			lastValue = undefined;
			head.removeChild(script);
			loaded = 1;
		}

		// Add the script to the DOM head
		head.appendChild(script);

		// Enable JSONP timeout
		return {
			abort: function() {
				script.onload = script.onreadystatechange = null;
				err({}, 'Request is aborted: timeout', {});
				lastValue = undefined;
				head.removeChild(script);
				loaded = 1;
			}
		}
	}

	function getRequest(fn, err) {
		var o = this.o,
		method = (o['method'] || 'GET').toUpperCase(),
		url = typeof o === 'string' ? o: o['url'],
		data = (o['processData'] !== false && o['data'] && typeof o['data'] !== 'string') ? 
			http.toQueryString(o['data']) : (o['data'] || null),
		httpxhr, sendWait = false;

		// if we're working on a GET request and we have data then we should append
		// query string to end of URL and not post data
		if ((o['type'] == 'jsonp' || method == 'GET') && data) {
			url = urlappend(url, data);
			data = null;
		}

		if (o['type'] == 'jsonp') return handleJsonp(o, fn, err, url);

		// get the xhr from the factory if passed
		// if the factory returns null, fall-back to ours
		httpxhr = (o.xhr && o.xhr(o)) || xhr(o);

		httpxhr.open(method, url, o['async'] === false ? false: true);
		setHeaders(httpxhr, o);
		setCredentials(httpxhr, o);
		if (context[xDomainRequest] && httpxhr instanceof context[xDomainRequest]) {
			httpxhr.onload = fn;
			httpxhr.onerror = err;
			httpxhr.onprogress = function() {};
			sendWait = true;
		} else {
			httpxhr.onreadystatechange = handleReadyState(this, fn, err);
		}
		o['before'] && o['before'](httpxhr);
		if (sendWait) {
			setTimeout(function() {
				httpxhr.send(data);
			}, 200);
		} else {
			httpxhr.send(data);
		}
		return httpxhr;
	}

	function Reqwest(o, fn) {
		this.o = o;
		this.fn = fn;
		init.apply(this, arguments);
	}

	function setType(header) {
		// json, javascript, text/plain, text/html, xml
		if (header === null) return undefined; //In case of no content-type.
		if (header.match('json')) return 'json';
		if (header.match('javascript')) return 'js';
		if (header.match('text')) return 'html';
		if (header.match('xml')) return 'xml';
	}

	function init(o, fn) {
		this.url = typeof o == 'string' ? o: o['url'];
		this.timeout = null;

		// whether request has been fulfilled for purpose
		// of tracking the Promises
		this._fulfilled = false;
		// success handlers
		this._successHandler = function() {};
		this._fulfillmentHandlers = [];
		// error handlers
		this._errorHandlers = [];
		// complete (both success and fail) handlers
		this._completeHandlers = [];
		this._erred = false;
		this._responseArgs = {};

		var self = this;

		fn = fn || function() {};

		if (o['timeout']) {
			this.timeout = setTimeout(function() {
				timedOut();
			}, o['timeout']);
		}

		if (o['success']) {
			this._successHandler = function() {
				o['success'].apply(o, arguments);
			}
		}

		if (o['error']) {
			this._errorHandlers.push(function() {
				o['error'].apply(o, arguments);
			});
		}

		if (o['complete']) {
			this._completeHandlers.push(function() {
				o['complete'].apply(o, arguments);
			});
		}

		function complete(resp) {
			o['timeout'] && clearTimeout(self.timeout);
			self.timeout = null;
			while (self._completeHandlers.length > 0) {
				self._completeHandlers.shift()(resp);
			}
		}

		function success(resp) {
			var type = o['type'] || resp && setType(resp.getResponseHeader('Content-Type')); // resp can be undefined in IE
			resp = (type !== 'jsonp') ? self.request: resp;
			// use global data filter on response text
			var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type), r = filteredResponse;
			try {
				resp.responseText = r;
			} catch(e) {
				// can't assign this in IE<=8, just ignore
			}
			if (r) {
				switch (type) {
				case 'json':
					try {
						resp = context.JSON ? context.JSON.parse(r) : eval('(' + r + ')');
					} catch(err) {
						return error(resp, 'Could not parse JSON in response', err);
					}
					break;
				case 'js':
					resp = eval(r);
					break;
				case 'html':
					resp = r;
					break;
				case 'xml':
					resp = resp.responseXML && 
						resp.responseXML.parseError &&
						resp.responseXML.parseError.errorCode &&
						resp.responseXML.parseError.reason ? null: resp.responseXML;
					break;
				}
			}

			self._responseArgs.resp = resp;
			self._fulfilled = true;
			fn(resp);
			self._successHandler(resp);
			while (self._fulfillmentHandlers.length > 0) {
				resp = self._fulfillmentHandlers.shift()(resp);
			}

			complete(resp);
		}

		function timedOut() {
			self._timedOut = true;
			self.request.abort();
		}

		function error(resp, msg, t) {
			resp = self.request;
			self._responseArgs.resp = resp;
			self._responseArgs.msg = msg;
			self._responseArgs.t = t;
			self._erred = true;
			while (self._errorHandlers.length > 0) {
				self._errorHandlers.shift()(resp, msg, t);
			}
			complete(resp);
		}

		this.request = getRequest.call(this, success, error);
	}

	Reqwest.prototype = {
		abort: function() {
			this._aborted = true;
			this.request.abort();
		},
		retry: function() {
			init.call(this, this.o, this.fn)
		},
		then: function(success, fail) {
			success = success || function() {};
			fail = fail || function() {};
			if (this._fulfilled) {
				this._responseArgs.resp = success(this._responseArgs.resp);
			} else if (this._erred) {
				fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t);
			} else {
				this._fulfillmentHandlers.push(success);
				this._errorHandlers.push(fail);
			}
			return this;
		},
		always: function(fn) {
			if (this._fulfilled || this._erred) {
				fn(this._responseArgs.resp);
			} else {
				this._completeHandlers.push(fn);
			}
			return this;
		},
		fail: function(fn) {
			if (this._erred) {
				fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t);
			} else {
				this._errorHandlers.push(fn);
			}
			return this;
		},
		'catch': function(fn) {
			return this.fail(fn);
		}
	}

	function http(o, fn) {
		return new Reqwest(o, fn);
	}

	// normalize newline variants according to spec -> CRLF
	function normalize(s) {
		return s ? s.replace(/\r?\n/g, '\r\n') : '';
	}

	function serial(el, cb) {
		var n = el.name, t = el.tagName.toLowerCase(),
		optCb = function(o) {
			if (o && !o['disabled']) {
				cb(n, normalize(o['attributes']['value'] && o['attributes']['value']['specified'] ? o['value'] : o['text']));
			}
		}, ch, ra, val, i;
		// don't serialize elements that are disabled or without a name
		if (el.disabled || !n) return;

		switch (t) {
		case 'input':
			if (!/reset|button|image|file/i.test(el.type)) {
				ch = /checkbox/i.test(el.type);
				ra = /radio/i.test(el.type);
				val = el.value;
				// WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
				; (!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on': val));
			}
			break;
		case 'textarea':
			cb(n, normalize(el.value));
			break;
		case 'select':
			if (el.type.toLowerCase() === 'select-one') {
				optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null);
			} else {
				for (i = 0; el.length && i < el.length; i++) {
					el.options[i].selected && optCb(el.options[i]);
				}
			}
			break;
		}
	}

	// collect up all form elements found from the passed argument elements all
	// the way down to child elements; pass a '<form>' or form fields.
	// called with 'this'=callback to use for serial() on each element
	function eachFormElement() {
		var cb = this, e, i, serializeSubtags = function(e, tags) {
			var i, j, fa;
			for (i = 0; i < tags.length; i++) {
				fa = e[byTag](tags[i]);
				for (j = 0; j < fa.length; j++) serial(fa[j], cb);
			}
		};

		for (i = 0; i < arguments.length; i++) {
			e = arguments[i];
			if (/input|select|textarea/i.test(e.tagName)) serial(e, cb);
			serializeSubtags(e, ['input', 'select', 'textarea']);
		}
	}

	// standard query string style serialization
	function serializeQueryString() {
		return http.toQueryString(http.serializeArray.apply(null, arguments));
	}

	// { 'name': 'value', ... } style serialization
	function serializeHash() {
		var hash = {};
		eachFormElement.apply(function(name, value) {
			if (name in hash) {
				hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]]);
				hash[name].push(value);
			} else {
				hash[name] = value;
			}
		}, arguments);
		return hash;
	}

	// [ { name: 'name', value: 'value' }, ... ] style serialization
	http.serializeArray = function() {
		var arr = [];
		eachFormElement.apply(function(name, value) {
			arr.push({ name: name, value: value });
		}, arguments);
		return arr;
	}

	http.serialize = function() {
		if (arguments.length === 0) return '';
		var opt, fn, args = Array.prototype.slice.call(arguments, 0);
		opt = args.pop();
		opt && opt.nodeType && args.push(opt) && (opt = null);
		opt && (opt = opt.type);

		if (opt == 'map')
			fn = serializeHash;
		else if (opt == 'array')
			fn = http.serializeArray;
		else
			fn = serializeQueryString;

		return fn.apply(null, args);
	}

	http.toQueryString = function(o, trad) {
		var prefix, i, traditional = trad || false, s = [], enc = encodeURIComponent,
		add = function(key, value) {
			// If value is a function, invoke it and return its value
			value = ('function' === typeof value) ? value() : (value == null ? '': value);
			s[s.length] = enc(key) + '=' + enc(value);
		};
		// If an array was passed in, assume that it is an array of form elements.
		if (isArray(o)) {
			for (i = 0; o && i < o.length; i++) add(o[i]['name'], o[i]['value']);
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (prefix in o) {
				if (o.hasOwnProperty(prefix)) buildParams(prefix, o[prefix], traditional, add);
			}
		}

		// spaces should be + according to spec
		return s.join('&').replace(/%20/g, '+');
	}

	function buildParams(prefix, obj, traditional, add) {
		var name, i, v, rbracket = /\[\]$/;

		if (isArray(obj)) {
			// Serialize array item.
			for (i = 0; obj && i < obj.length; i++) {
				v = obj[i];
				if (traditional || rbracket.test(prefix)) {
					// Treat each array item as a scalar.
					add(prefix, v);
				} else {
					buildParams(prefix + '[' + (typeof v === 'object' ? i: '') + ']', v, traditional, add);
				}
			}
		} else if (obj && obj.toString() === '[object Object]') {
			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
			}

		} else {
			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	http.getcallbackPrefix = function() {
		return callbackPrefix;
	}

	// jQuery and Zepto compatibility, differences can be remapped here so you can call
	// .ajax.compat(options, callback)
	http.compat = function(o, fn) {
		if (o) {
			o['type'] && (o['method'] = o['type']) && delete o['type'];
			o['dataType'] && (o['type'] = o['dataType']);
			o['jsonpCallback'] && (o['jsonpCallbackName'] = o['jsonpCallback']) && delete o['jsonpCallback'];
			o['jsonp'] && (o['jsonpCallback'] = o['jsonp']);
		}
		return new Reqwest(o, fn);
	}

	http.ajaxSetup = function(options) {
		options = options || {};
		for (var k in options) {
			globalSetupOptions[k] = options[k];
		}
	}

	////////////////////////////////////////
	http.internal = {};

	http.internal.config = null;

	http.internal.request = function(url, method, data, callback) {
		var config = http.internal.config;
		if(!config) {
			throw new Error('you should call http.config() before use it.');
		}
		if(!config.domain || !config.project) {
			throw new Error('no domain and project name found in your config.');
		}
		url = config.domain + config.project + url;
		new Reqwest({
			url: url,
			method: method, // type
			data: data,
			cache: false,
			async: true,
			type: 'text', // dataType
			crossOrigin: true, // crossDomain
			timeout: config.timeout || 30000,
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			error: function(xhr) {
				if(typeof callback == 'function') {
					callback(-3, '网络异常，请检查您的网络(' + xhr.status + ':' + xhr.statusText + ')');
				}
			},
			success: function(xhr) {
				var errorCode = parseInt(xhr.getResponseHeader('error_code'));
				if(errorCode === 200) {
					var rawData = xhr.response;
					// success
					if(rawData && rawData != '') {
						rawData = JSON.parse(rawData);
					}
					var errCode = 0;
					if(rawData && rawData.errorCode != null && rawData.errorCode != undefined) {
						errCode = rawData.errorCode;
					}
					var errMsg = 'succeed';
					if(rawData && rawData.errorMsg != null && rawData.errorMsg != undefined) {
						errMsg = rawData.errorMsg;
					}
					
					var totalCount = undefined;
					if(rawData && typeof(rawData.totalCount) == 'number') {
						totalCount = rawData.totalCount;
					}
					var pageCount = undefined;
					if(rawData && typeof(rawData.pageCount) == 'number') {
						pageCount = rawData.pageCount;
					}
					
					if(typeof callback == 'function') {
						callback(errCode, errMsg, rawData.data, totalCount, pageCount);
					}
				} else if(errorCode === 100) {
					if(typeof callback == 'function') {
						callback(-1, '您尚未登录或会话超时');
					}
				} else {
					console.error('error_code: ' + errorCode);
					if(typeof callback == 'function') {
						callback(-2, '服务器错误，请稍后重试');
					}
				}
			},
			complete: function(xhr) {
				//
			}
		});
	};

	http.config = function(cfg) {
		http.internal.config = cfg;
	};

	/**
	* 远程权限访问对象
	* */
	http.permission = {};

	/**
	 * 登入
	 * @param {string} userName 用户名
	 * @param {string} password 密码
	 * @param {Object} extras 扩展参数
	 * @param {function} callback 回调函数
	 * */
	http.permission.logon = function(userName, password, callback) {
		var paramsObj = {
			userName: userName,
			password: password
		};
		var params = 'params=' + encodeURIComponent(JSON.stringify(paramsObj));
		http.internal.request('/logon', 'POST', params, callback);
	};

	/**
	 * 登出
	 * @param {function} callback 回调函数
	 * */
	http.permission.logout = function(callback) {
		http.internal.request('/logout', 'DELETE', '', callback)
	};

	/**
	 * 获取用户权限
	 * @param {string} type 类型
	 * @param {function} callback 回调函数
	 * */
	http.permission.getPermissions = function(type, callback) {
		var params = {type: type};
		http.internal.request('/user/profile', 'GET', params, callback);
	};

	/**
	* 远程service访问对象
	* */
	http.service = {};

	/**
	 * 发起请求
	 * serviceRequest.request1('myService', 'myFunc', param1, param2, param3, ...);
	 * @param {string} serviceName 服务名
	 * @param {string} funcName 方法名
	 * @param {any...} 远程服务方法参数
	 * @param {function} callback 回调函数
	 * */
	http.service.request = function(serviceName, funcName) {
		var argsCount = arguments.length;
		if(argsCount < 2) {
			throw new error('call request with wrong params.');
		}
		var callback = undefined;
		var url = '/service/' + serviceName + '/' + funcName;
		var params = new Array();
		for (var i = 2; i < argsCount; i++) {
			var arg = arguments[i];
			if(i == argsCount - 1 && typeof(arg) == 'function') {
				callback = arg;
			} else {
				params.push(arg);
			}
		};
		var data = 'params=' + encodeURIComponent(JSON.stringify(params));
		http.internal.request(url, 'POST', data, callback);
	};

	/**
	 * 发起请求
	 * serviceRequest.request2('myService', 'myFunc', {param1:value1, param2:value2, param3:value3, ...});
	 * @param {string} serviceName 服务名
	 * @param {string} funcName 方法名
	 * @param {json} funcParams 远程服务方法Map形式参数
	 * @param {function} callback 回调函数
	 * */
	http.service.request2 = function(serviceName, funcName, funcParams, callback) {
		var argsCount = arguments.length;
		if(argsCount < 2) {
			throw new error('call request with wrong params.');
		}
		var url = '/service/' + serviceName + '/' + funcName;
		var params = '';
		if(typeof(funcParams) == 'object') {
			for (var key in funcParams) {
				if(params != '') {
					params += '&';
				}
				params += key + '=' + JSON.stringify(funcParams[key]);
			};
		}
		http.internal.request(url, 'POST', params, callback);
	};
	////////////////////////////////////////

	return http

}));

