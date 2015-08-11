
var ActionClass = require('./action-class');

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

    return Action;
}

exports.create = createAction;
