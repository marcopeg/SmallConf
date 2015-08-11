
var extend = require('extend');
var camelcase = require('camelcase');

var actionsRegister = require('./actions-register');
var actionFactory = require('./actions-factory');

module.exports = StoreClass;

function StoreClass() {
    this.state = {};
    this.actions = {};
    this.actionsSubscriptions = [];
    this.storeSubscriptions = [];
    this.isDisposed = false;

    this.__prevState = null;
    this.__emitterTimeout;
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
    this.actionsSubscriptions = null;

    this.storeSubscriptions.forEach(sub => sub.dispose());
    this.storeSubscriptions = null;

    this.__prevState = null;
    this.__emitterTimeout = null;

    this.isDisposed = true;
};

StoreClass.prototype.listen = function() {
    Object.keys(this.actions)
        .map(actionName => this.actions[actionName])
        .forEach(action => {
            var ticket = action.observable.subscribe(action.callback.bind(this));
            this.actionsSubscriptions.push(ticket);
        });
};

StoreClass.prototype.stopListen = function() {
    this.actionsSubscriptions.forEach(sub => sub.dispose());
    this.actionsSubscriptions = [];
};

StoreClass.prototype.setState = function(newState) {

    if (this.__prevState === null) {
        this.__prevState = extend({}, this.state);
    }

    this.state = extend(true, {}, this.state, newState || {});

    // delay to emit signals so to collect many sinchronous actions
    clearTimeout(this.__emitterTimeout);
    this.__emitterTimeout = setTimeout($=> {
        this.storeSubscriptions
            .filter(s => s.isActive)
            .forEach(s => s.fn.call(this, this.__prevState));

        this.__prevState = null;
    });
};

StoreClass.prototype.subscribe = function(fn) {
    var ticket = {
        isActive: true,
        fn: fn,
        dispose: $=> {
            ticket.isActive = false;
            delete ticket.fn;
        }
    };
    this.storeSubscriptions.push(ticket);
    return ticket;
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
        .map(action => buildActionsFromString(action))
        .map(action => getActionCallback(action, config))
        .filter(v => v !== null)
        .forEach(action => actionsList[action.observable.signature] = action);

    return actionsList;
}

function buildActionsFromString(actionName) {
    if (typeof actionName !== 'string') {
        return actionName;
    }

    var action = actionsRegister.get(actionName);
    if (!action) {
        action = actionFactory.create(actionName);
    }

    return action;
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
