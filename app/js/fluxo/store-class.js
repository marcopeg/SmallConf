
var extend = require('extend');
var camelcase = require('camelcase');

module.exports = StoreClass;

function StoreClass() {
    this.state = {};
    this.actions = {};
    this.subscriptions = [];
    this.isDisposed = false;
}

StoreClass.prototype.init = function(config) {

    this.state = getInitialState(config);
    this.actions = getActions(config);

    this.listen();
};

StoreClass.prototype.dispose = function() {
    this.stopListen();
    this.state = null;
    this.actions = null;
    this.subscriptions = null;
    this.isDisposed = true;
};

StoreClass.prototype.listen = function() {
    Object.keys(this.actions)
        .map(actionName => this.actions[actionName])
        .forEach(action => {
            var ticket = action.observable.subscribe(action.callback.bind(this));
            this.subscriptions.push(ticket);
        });
};

StoreClass.prototype.stopListen = function() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = [];
};

StoreClass.prototype.setState = function(newState) {
    var prevState = extend({}, this.state);
    this.state = extend(true, {}, this.state, newState || {});
};

function getInitialState(settings) {
    if (settings.getInitialState) {
        try {
            return settings.getInitialState();
        } catch (e) {
            throw new Error('store.getInitialState() should be a function');
        }
    } else {
        return {};
    }
}

function getActions(config) {
    var actionsList = {};

    if (!config.actions) {
        return actionsList;
    }

    if (!Array.isArray(config.actions)) {
        throw new Error('store.actions should be an array');
    }

    config.actions
        .filter(action => action.signature !== null)
        .map(action => getActionCallback(action, config))
        .filter(v => v !== null)
        .forEach(action => actionsList[action.observable.signature] = action);

    return actionsList;
}

function getActionCallback(action, config) {
    var actionName = action.signature;
    var callbackName = camelcase('on-' + action.signature);

    if (typeof config[callbackName] === 'function') {
        return {
            observable: action,
            callback: config[callbackName]
        };
    } else {
        return null;
    }

    return action;
}
