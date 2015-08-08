var React = require('react');
var HomePage = require('home-page');
var settings = require('settings');

var home = React.createElement(HomePage, settings.conf);
React.render(home, document.body);
