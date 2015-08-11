
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

scoresStore.subscribe(function(prevState) {
    console.log('new state', this.state);
    console.log('prev state', prevState);
});

setName('Luke');
setSurname('Skywalker');
