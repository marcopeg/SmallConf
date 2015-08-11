
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
    if (signatures.indexOf(signature) === -1) {
        throw new Error('Action not implemented: ' + signature);
    }

    var args = Array.prototype.slice.call(arguments, 1);
    var action = actions[signature];
    return action.apply(action, args);
}

exports.add = addAction;
exports.get = getAction;
exports.run = runAction;
