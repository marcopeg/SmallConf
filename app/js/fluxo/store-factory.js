
var StoreClass = require('./store-class');

function createStore(config) {
    var _instance = new StoreClass();
    _instance.init(config);
    return _instance;
}

exports.create = createStore;
