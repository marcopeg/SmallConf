
var actionsFactory = require('./actions-factory');
var actionsRegister = require('./actions-register');

var storeFactory = require('./store-factory');

exports.createAction = actionsFactory.create;
exports.createComputedAction = actionsFactory.createComputed;
exports.createStore = storeFactory.create;

exports.fire = actionsRegister.run;
exports.getAction = actionsRegister.get;
