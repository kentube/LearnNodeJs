'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Logo = require('./components/Logo');

var _Logo2 = _interopRequireDefault(_Logo);

var _MyTable = require('./components/MyTable');

var _MyTable2 = _interopRequireDefault(_MyTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(
  'h1',
  null,
  _react2.default.createElement(_MyTable2.default, null),
  ' Welcome to The MyTable App!'
), document.getElementById('app'));