
var actionsLogger = require('./actions-logger');

function ActionClass() {
    this.signature = '';
    this.value = '';
    this.subscriptions = [];
}

ActionClass.prototype.init = function(config) {

    // [signature, [initialValue]]
    if (typeof config === 'string') {
        config = {
            signature: config,
            initialValue: arguments.length > 1 ? arguments[1] : null
        };
    }

    this.signature = config.signature;
    this.value = config.initialValue;
};

ActionClass.prototype.get = function() {
    actionsLogger.log(this.signature);
    return this.value;
};

ActionClass.prototype.set = function(value) {
    this.value = value;
    this.subscriptions
        .filter(s => s.isActive)
        .forEach(s => s.fn.apply(this, arguments));
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
