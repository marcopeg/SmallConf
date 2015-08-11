
var Fluxo = require('fluxo');

Fluxo.createAction('set-name', 'marco');
Fluxo.createAction('set-surname', 'peg');

var fullName = Fluxo.createComputedAction('full-name', function() {
    return Fluxo.trigger('set-name') + ' ' + Fluxo.trigger('set-surname');
});

var scoresStore = Fluxo.createStore({
    actions: [
        'full-name',
        'set-score'
    ],
    getInitialState() {
        return {
            name: fullName.value(),
            score: 0
        };
    },

    onFullName: function(val) {
        this.setState({
            name: val
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
            name: fullName.value(),
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

Fluxo.trigger({
    'set-name': 'Luke',
    'set-surname': 'Skywalker',
    'set-score': 22,
    setAge: 34
});
