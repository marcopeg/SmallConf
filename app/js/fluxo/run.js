
var Fluxo = require('fluxo');

var scoresStore = Fluxo.createStore({
    actions: [
        'set-name',
        'set-surname',
        'set-score'
    ],
    getInitialState() {
        return {
            name: 'Marco',
            surname: 'Peg',
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
    console.log(this.state.name + ' score ' + this.state.score);
});

var ageStore = Fluxo.createStore({
    actions: [
        'set-name',
        'set-age'
    ],
    getInitialState() {
        return {
            name: 'Marco',
            age: 0
        };
    },

    onSetName: function(val) {
        this.setState({
            name: val
        });
    },

    onSetAge: function(val) {
        this.setState({
            age: val
        });
    }
});

ageStore.subscribe(function(prevState) {
    console.log(this.state.name + ' age ' + this.state.age);
});

// Fluxo.trigger('set-name', 'Luke');
// Fluxo.trigger('set-surname', 'Skywalker');
// Fluxo.trigger('set-score', 22);
// Fluxo.trigger('set-age', 34);

Fluxo.trigger({
    'set-name': 'Luke',
    'set-surname': 'Skywalker',
    'set-score': 22,
    setAge: 34
});
