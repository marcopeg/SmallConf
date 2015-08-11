
var ActionClass = require('./action-class');
var ActionsRegister = require('./actions-register');

function createAction(config) {
    var _instance = new ActionClass();
    _instance.init(config);

    // setter/getter interface
    var Action = function() {
        if (arguments.length) {
            return _instance.set.apply(_instance, arguments);
        } else {
            return _instance.get();
        }
    };

    // additional apis
    Action.subscribe = _instance.subscribe.bind(_instance);
    Action.signature = _instance.signature;

    if (ActionsRegister.add(Action)) {
        return Action;
    } else {
        throw new Error('Action alredy defined: ' + Action.signature);
    }
}

exports.create = createAction;
