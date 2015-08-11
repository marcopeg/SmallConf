
var actionsFactory = require('./actions-factory');
var actionsRegister = require('./actions-register');

var storeFactory = require('./store-factory');

exports.createAction = actionsFactory.create;
exports.createStore = storeFactory.create;

exports.runAction = actionsRegister.run;
