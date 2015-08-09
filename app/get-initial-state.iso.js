/**
 * Isomorphic App
 * builds and output app's initial state
 */

var request = require('request');
var appConf = require('../lib/app-conf');

function getInitialState() {
    return new Promise(function(resolve, reject) {

        var state = {
            settings: {},
            events: [],     // to be implemented
            drafts: [],     // to be implemented
            speakers: []    // to be implemented
        };

        var _settings = get('settings').then(s => state.settings = s);

        Promise.all([
            _settings
        ]).then($=> resolve(state)).catch(reject);
    });
}

module.exports = getInitialState;

function get(path) {
    return new Promise(function(resolve, reject) {
        var uri = appConf.firebaseUrl + path + '.json';
        request({
            method: 'GET',
            uri: uri,
            json: true
        }, function(err, res, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

