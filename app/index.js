/**
 * Isomorphic Application
 */

var speakerActions = require('actions/speaker-actions');
var speakerStore = require('stores/speaker-store');

var React = require('react');
var HomePage = require('home-page');

// edit store's state without notify
speakerStore.applyState({list: ['foo', 'faa']});

// client side startup
exports.start = function(initialState, fireBase) {
    var home = React.createElement(HomePage, initialState.settings);
    React.render(home, document.getElementById('app'));

    setInterval($=> speakerActions.add(Date.now()), 1000);
};

// server side rendering
exports.renderMarkup = function(initialState) {
    var home = React.createElement(HomePage, initialState.settings);
    return React.renderToString(home);
};
