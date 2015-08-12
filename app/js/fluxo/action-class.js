
var actionsLogger = require('./actions-logger');

function ActionClass() {
    this.signature = '';
    this.value = '';
    this.subscriptions = [];
}

ActionClass.prototype.init = function(config, arg1) {

    // [signature, [initialValue | fn]]
    if (typeof config === 'string') {
        config = {
            signature: config,
            initialValue: typeof arg1 !== 'function' ? arg1 : null,
            fn: typeof arg1 === 'function' ? arg1 : null
        };
    }

    this.signature = config.signature;
    this.value = config.initialValue;
    this.fn = config.fn;
};

ActionClass.prototype.get = function() {
    actionsLogger.log(this.signature);
    return this.value;
};

ActionClass.prototype.set = function(value) {
    if (typeof this.fn === 'function') {
        this.value = this.fn.apply(this, arguments);
    } else {
        this.value = value;
    }

    this.subscriptions
        .filter(s => s.isActive)
        .forEach(s => s.fn.apply(this, arguments));

    return this.value;
};

ActionClass.prototype.subscribe = function(fn) {
    var ticket = {
        isActive: true,
        fn: fn,
        dispose: $=> {
            ticket.isActive = false;
            delete ticket.fn;
        }
    };
    this.subscriptions.push(ticket);
    return ticket;
};

module.exports = ActionClass;
