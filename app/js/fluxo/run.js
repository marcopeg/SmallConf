
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

// var setScore = Fluxo.createAction({
//     signature: 'set-score',
//     initialValue: 12
// });

var scoresStore = Fluxo.createStore({
    actions: [
        'set-name',
        setSurname,
        setAge,
        'set-score'
    ],
    getInitialState() {
        return {
            name: setName(),
            surname: 'solo',
            score: 0
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

    onSetScore: function(val) {
        this.setState({
            score: val
        });
    }
});

scoresStore.subscribe(function(prevState) {
    console.log('new state', this.state);
    console.log('prev state', prevState);
});

setName('Luke');
setSurname('Skywalker');

Fluxo.runAction('set-score', 22);
