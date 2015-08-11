
var decamelize = require('decamelize');

var signatures = [];
var actions = {};

function addAction(Action) {
    var signature = Action.signature;

    if (signatures.indexOf(signature) !== -1) {
        return false;
    } else {
        signatures.push(signature);
        actions[signature] = Action;
        return true;
    }
}

function getAction(actionName) {
    return actions[actionName] || false;
}

function runAction(signature, value) {

    // detect a package of actions to be executed together
    if (typeof signature === 'object') {
        return runActions(signature);
    }

    if (signatures.indexOf(signature) === -1) {
        throw new Error('Action not implemented: ' + signature);
    }

    var args = Array.prototype.slice.call(arguments, 1);
    var action = actions[signature];
    return action.apply(action, args);
}

function runActions(actions) {
    Object.keys(actions)
        .map(key => decamelize(key, '-'))
        .forEach(key => runAction(key, actions[key]));
}

exports.add = addAction;
exports.get = getAction;
exports.run = runAction;
