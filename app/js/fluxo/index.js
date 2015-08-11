
var action = require('./action');
var store = require('./store');
var actionsRegister = require('./actions-register');

exports.createAction = action.create;
exports.createStore = store.create;
exports.runAction = actionsRegister.run;
