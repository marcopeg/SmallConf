var React = require('react');
var HomePage = require('home-page');

if (document && document.body) {
    var settings = require('settings');
    var home = React.createElement(HomePage, settings);
    React.render(home, document.body);
} else {
    module.exports = function() {
        console.log('server side??');
    };
}
