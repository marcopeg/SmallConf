
var React = require('react');
var Fluxo = require('fluxo');

var name = Fluxo.createAction('name', 'Luke');
var surname = Fluxo.createAction('surname', 'Skywalker');

var fullName = Fluxo.createComputedAction('full-name', function() {
    return name() + ' ' + surname();
});

var myStore = Fluxo.createStore({

    getInitialState: function() {
        return {
            name: fullName.value()
        };
    },

    actions: [
        'full-name'
    ],

    onFullName(value) {
        this.setState({
            name: value
        });
    }
});

var ExampleComponent = React.createClass({

    mixins: [myStore.componentMixin()],

    onClick() {
        Fluxo.trigger('name', 'Darth');
        Fluxo.trigger('surname', 'Vader');
    },

    render() {
        return (
            <div>
                <p>{this.state.name}</p>
                <button onClick={this.onClick}>turn to the dark side</button>
            </div>
        );
    }
});

React.render(<ExampleComponent />, document.getElementById('app'));
