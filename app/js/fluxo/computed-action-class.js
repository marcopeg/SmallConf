
var actionsRegister = require('./actions-register');
var actionsLogger = require('./actions-logger');

function ComputedAction() {
    this.signature = null;
    this.value = null;
    this.fn = null;
    this.dependencies = [];

    this.internalSubscriptions = [];
    this.externalSubscriptions = [];

    this.__runTimeout = null;
    this.isDisposed = false;
}

ComputedAction.prototype.init = function(config) {

    // [signature, implementation]
    if (typeof config === 'string') {
        config = {
            signature: config,
            fn: arguments[1]
        };
    }

    this.signature = config.signature;
    this.fn = config.fn;

    // first run
    actionsLogger.clear();
    this.value = this.fn();

    // collect dependencies
    this.dependencies = getDependencies(actionsLogger.clear());

    // register listeners to the tracked actions
    this.dependencies.forEach(action => {
        var ticket = action.subscribe($=> this.delayedRun());
        this.internalSubscriptions.push(ticket);
    });
};

ComputedAction.prototype.dispose = function() {
    this.internalSubscriptions.forEach(sub => sub.dispose());
    this.internalSubscriptions = null;

    this.externalSubscriptions.forEach(sub => sub.dispose());
    this.externalSubscriptions = null;

    this.value = null;
    this.fn = null;
    this.dependencies = null;
    this.__runTimeout = null;

    this.isDisposed = true;
};

ComputedAction.prototype.run = function() {
    actionsLogger.log(this.signature);
    this.value = this.fn();
    this.externalSubscriptions
        .filter(s => s.isActive)
        .forEach(s => s.fn.call(this, this.value));
};

ComputedAction.prototype.get = function() {
    return this.value;
};

ComputedAction.prototype.delayedRun = function() {
    clearTimeout(this.__runTimeout);
    this.__runTimeout = setTimeout($=> this.run());
};

ComputedAction.prototype.subscribe = function(fn) {
    var ticket = {
        isActive: true,
        fn: fn,
        dispose: $=> {
            ticket.isActive = false;
            delete ticket.fn;
        }
    };
    this.externalSubscriptions.push(ticket);
    return ticket;
};

function getDependencies(actionsLog) {
    var dependencies = [];

    actionsLog.forEach(actionSignature => {
        if (dependencies.indexOf(actionSignature) === -1) {
            dependencies.push(actionSignature);
        }
    });

    return dependencies.map(signature => actionsRegister.get(signature));
}

module.exports = ComputedAction;
