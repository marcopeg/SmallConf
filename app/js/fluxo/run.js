
var Fluxo = require('fluxo');

var setName = Fluxo.createAction({
    signature: 'set-name',
    initialValue: 'marco'
});

var setSurname = Fluxo.createAction('set-surname');

var setAge = Fluxo.createAction({
    signature: 'set-age',
    initialValue: 34
});

var setScore = Fluxo.createAction({
    signature: 'set-score',
    initialValue: 12
});

var scoresStore = Fluxo.createStore({
    actions: [setName, setSurname, setAge],
    getInitialState() {
        return {
            name: setName(),
            surname: 'solo'
        };
    },

    onSetName: function(val) {
        this.setState({
            name: val
        });
    },

    onSetSurname: function(val) {
        this.setState({
            surname: val
        });
    },
});

console.log(scoresStore.state);

Fluxo.runAction('set-name', 'luke');

// setName('luke');
setSurname('skywalker');
console.log(scoresStore.state);

scoresStore.stopListen();

setName('foo');
console.log(scoresStore.state);

scoresStore.listen();

setName('hihi');
console.log(scoresStore.state);

// surname('skywalker');
// age(22);
// score(74);

// console.log(scores.state);
