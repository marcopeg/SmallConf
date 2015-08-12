
var ActionClass = require('./action-class');
var ComputedActionClass = require('./computed-action-class');
var actionsRegister = require('./actions-register');

function createAction() {
    var _instance = new ActionClass();
    _instance.init.apply(_instance, arguments);

    // setter/getter interface
    var Action = function() {
        if (arguments.length) {
            return _instance.set.apply(_instance, arguments);
        } else {
            return _instance.get();
        }
    };

    // additional apis
    Action.signature = _instance.signature;
    Action.subscribe = _instance.subscribe.bind(_instance);
    Action.fire = _instance.set.bind(_instance);
    Action.value = _instance.get.bind(_instance);

    if (actionsRegister.add(Action)) {
        return Action;
    } else {
        throw new Error('Action alredy defined: ' + Action.signature);
    }
}

function createComputedAction(fn) {
    var _instance = new ComputedActionClass();
    _instance.init.apply(_instance, arguments);

    var ComputedAction = _instance.run.bind(_instance);

    // additional apis
    ComputedAction.signature = _instance.signature;
    ComputedAction.subscribe = _instance.subscribe.bind(_instance);
    ComputedAction.dispose = _instance.dispose.bind(_instance);
    ComputedAction.value = _instance.get.bind(_instance);

    if (actionsRegister.add(ComputedAction)) {
        return ComputedAction;
    } else {
        throw new Error('ComputedAction alredy defined: ' + ComputedAction.signature);
    }

    return ComputedAction;
}

exports.create = createAction;
exports.createComputed = createComputedAction;
