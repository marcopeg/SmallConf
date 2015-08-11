
var logs = [];

exports.log = function(signature) {
    logs.push(signature);
};

exports.clear = function() {
    var _logs = logs.map($=> $);
    logs = [];
    return _logs;
};
