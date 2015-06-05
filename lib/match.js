"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

_Object$defineProperty(exports, "__esModule", {
  value: true
});

var Match = (function () {
  function Match(_ref) {
    var path = _ref.path;
    var obj = _ref.obj;
    var prop = _ref.prop;
    var type = _ref.type;

    _classCallCheck(this, Match);

    this.attrs = { path: path, obj: obj, prop: prop, type: type, value: obj[prop] };
  }

  _createClass(Match, [{
    key: "toString",
    value: function toString() {
      var _attrs = this.attrs;
      var path = _attrs.path;
      var prop = _attrs.prop;
      var type = _attrs.type;
      var value = _attrs.value;

      return "" + path + "." + prop + " -> (" + type + ") " + value;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var _attrs2 = this.attrs;
      var obj = _attrs2.obj;
      var prop = _attrs2.prop;

      return obj[prop];
    }
  }, {
    key: "log",
    value: function log() {
      console.log(this);
    }
  }]);

  return Match;
})();

exports["default"] = Match;
module.exports = exports["default"];