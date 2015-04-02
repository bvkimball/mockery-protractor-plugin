"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var responders = [];

function getPath(data) {
	var exp = /^(?:[^\/]*(?:\/(?:\/[^\/]*\/?)?)?([^?]+)(?:\??.+)?)$/,
	    found = data.match(exp);
	if (found.length) {
		return found[0];
	}

	return false;
}

var STATUS_CODES = {
	100: "Continue",
	101: "Switching Protocols",
	200: "OK",
	201: "Created",
	202: "Accepted",
	203: "Non-Authoritative Information",
	204: "No Content",
	205: "Reset Content",
	206: "Partial Content",
	207: "Multi-Status",
	300: "Multiple Choice",
	301: "Moved Permanently",
	302: "Found",
	303: "See Other",
	304: "Not Modified",
	305: "Use Proxy",
	307: "Temporary Redirect",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Request Entity Too Large",
	414: "Request-URI Too Long",
	415: "Unsupported Media Type",
	416: "Requested Range Not Satisfiable",
	417: "Expectation Failed",
	422: "Unprocessable Entity",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported"
};

var MockHttpRequest = (function () {
	function MockHttpRequest() {
		_classCallCheck(this, MockHttpRequest);

		this.request = null;
		this.response = null;
		this.responseText = null;
		this.status = null;
		this.statusText = null;
		this.readyState = 0;
		this.responseType = "application/json";
	}

	_createClass(MockHttpRequest, {
		open: {
			value: function open(method, url, async, username, password) {
				this.request = null;
				this.response = null;
				this.responseText = null;
				this.status = null;
				this.statusText = null;
				this.readyState = 0;

				var path = getPath(url);
				var found = responders.filter(function (res, i) {
					//todo, convert res.url to regular expression
					var route = res.url,
					    // "/users/:uid/pictures";
					matcher = new RegExp(route.replace(/:[^\s/]+/g, "([\\w-]+)"));

					return method == res.method && path.match(matcher);
				});

				if (found.length) {
					var responder = found[0],
					    route = responder.url,
					    keys = route.match(/:[^\s/]+/g),
					    matcher = new RegExp(route.replace(/:[^\s/]+/g, "([\\w-]+)")),
					    matched = path.match(matcher),
					    params = {};

					for (var i in keys) {
						var key = keys[i];
						params[key] = matched[i];
					}
					this.request = {
						method: method,
						path: path,
						params: params,
						//headers: null,
						responseType: "application/json",
						callback: responder.callback
					};
				} else {
					this.request = new XMLHttpRequest();
					this.request.onload = this.onload;
					this.request.onerror = this.onerror;
					this.request.ontimeout = this.ontimeout;
					this.request.onabort = this.onabort;
					this.request.onreadystatechange = this.onreadystatechange;
					this.request.open(method, url, async, username, password);
				}
			}
		},
		send: {
			value: function send(data) {
				var request = this.request;
				if (request instanceof XMLHttpRequest) {
					this.request.send(data);
				} else {
					request.data = data;
					request.callback.call(this, request, this);
					if (this.status < 400) {
						if (this.usingReadyStateChange) {
							this.readyState = 4;
							this.onreadystatechange && this.onreadystatechange();
						} else {
							this.onload && this.onload();
						}
					} else {
						this.onerror && this.onerror();
					}
				}
			}
		},
		statusCode: {
			value: function statusCode(value) {
				this.status = value;
				this.statusText = STATUS_CODES[value];
			}
		},
		json: {
			value: function json(value) {
				this.response = JSON.stringify(value);
			}
		},
		text: {
			value: function text(value) {
				this.responseText = JSON.stringify(value);
			}
		},
		type: {
			value: function type(value) {
				this.responseType = value;
			}
		},
		onload: {
			get: function () {
				return this.loadhandler;
			},
			set: function (value) {
				this.loadhandler = value;
			}
		},
		ontimeout: {
			get: function () {
				return this.timeouthandler;
			},
			set: function (value) {
				this.timeouthandler = value;
			}
		},
		onerror: {
			get: function () {
				return this.errorhandler;
			},
			set: function (value) {
				this.errorhandler = value;
			}
		},
		onabort: {
			get: function () {
				this.aborthandler;
			},
			set: function (value) {
				this.aborthandler = value;
			}
		},
		onreadystatechange: {
			get: function () {
				return this.readystatechangehandler;
			},
			set: function (value) {
				this.usingReadyStateChange = true;
				this.readystatechangehandler = value;
			}
		},
		setRequestHeader: {
			value: function setRequestHeader(header, value) {}
		}
	}, {
		addResponder: {
			value: function addResponder(url, method, callback) {
				responders.push({ url: url, method: method, callback: callback });
			}
		}
	});

	return MockHttpRequest;
})();

//ignore