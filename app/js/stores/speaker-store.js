
var Fluxo = require('fluxo');

module.exports = Fluxo.createStore({

    getInitialState() {
        return {
            list: []
        };
    },

    actions: [
        'add-speaker'
    ],

    onAddSpeaker(speaker) {
        var list = this.state.list;
        list.push(speaker);
        this.setState({list: list});
    }
});
