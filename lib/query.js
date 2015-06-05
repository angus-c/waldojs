'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var Query = (function () {
  function Query(_ref) {
    var searchBy = _ref.searchBy;
    var searchTerm = _ref.searchTerm;
    var path = _ref.path;

    _classCallCheck(this, Query);

    this.attrs = { searchBy: searchBy, searchTerm: searchTerm, path: path };
    this.matches = [];
  }

  _createClass(Query, [{
    key: 'toString',
    value: function toString() {
      var _attrs = this.attrs;
      var searchBy = _attrs.searchBy;
      var searchTerm = _attrs.searchTerm;

      var searchByDescriptions = {
        propName: 'by name',
        type: 'by type',
        value: 'by value',
        valueCoerced: 'by value coerced',
        custom: 'custom function'
      };

      searchBy = searchByDescriptions[searchBy] || searchByDescriptions['custom'];

      return 'search ' + searchBy + ' for ' + searchTerm;
    }
  }, {
    key: 'getMatches',
    value: function getMatches() {
      return this.matches;
    }
  }, {
    key: 'addMatch',
    value: function addMatch(match) {
      this.matches.push(match);
    }
  }, {
    key: 'log',
    value: function log() {
      console.log(this);
    }
  }]);

  return Query;
})();

exports['default'] = Query;
module.exports = exports['default'];