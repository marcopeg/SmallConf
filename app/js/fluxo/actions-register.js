
var signatures = [];
var actions = {};

function registerAction(Action) {
    var signature = Action.signature;

    if (signatures.indexOf(signature) !== -1) {
        return false;
    } else {
        signatures.push(signature);
        actions[signature] = Action;
        return true;
    }
}

function runAction(signature, value) {
    if (signatures.indexOf(signature) === -1) {
        throw new Error('Action not implemented: ' + signature);
    }

    var args = Array.prototype.slice.call(arguments, 1);
    var action = actions[signature];
    return action.apply(action, args);
}

exports.add = registerAction;
exports.run = runAction;
