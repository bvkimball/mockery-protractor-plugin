"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var global = window || global || undefined;
var GlobalXMLHttpRequest = global.XMLHttpRequest,
    GlobalActiveXObject = global.ActiveXObject,
    supportsActiveX = typeof GlobalActiveXObject != "undefined",
    supportsXHR = typeof GlobalXMLHttpRequest != "undefined";

var Mockery = (function () {
	function Mockery() {
		_classCallCheck(this, Mockery);

		throw new Error("Mockery is a static class and can not be instantiated.");
	}

	_createClass(Mockery, null, {
		imitate: {
			value: function imitate(path, action, fn) {
				MockHttpRequest.addResponder(path, action, fn);
			}
		},
		setup: {
			value: function setup() {
				var xhr = arguments[0] === undefined ? "XMLHttpRequest" : arguments[0];

				if (supportsXHR) {
					global[xhr] = MockHttpRequest;
				}
				if (supportsActiveX) {
					global.ActiveXObject = function ActiveXObject(objId) {
						if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/i.test(objId)) {
							return new MockHttpRequest();
						}
						return new GlobalActiveXObject(objId);
					};
				}
			}
		},
		restore: {
			value: function restore() {
				global.XMLHttpRequest = GlobalXMLHttpRequest;
				global.ActiveXObject = GlobalActiveXObject;
			}
		}
	});

	return Mockery;
})();