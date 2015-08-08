/**
 * Isomorphic Application
 */

var React = require('react');
var HomePage = require('home-page');

// client side startup
exports.start = function(initialState) {
    var home = React.createElement(HomePage, initialState);
    React.render(home, document.getElementById('app'));
};

// server side rendering
exports.renderMarkup = function(initialState) {
    var home = React.createElement(HomePage, initialState);
    return React.renderToString(home);
};
