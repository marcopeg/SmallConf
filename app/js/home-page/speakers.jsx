
var React = require('react');
var SpeakerStore = require('stores/speaker-store');

module.exports = React.createClass({
    mixins: [SpeakerStore.componentMixin()],

    render() {
        var speakers = this.state.list.map(t => <li key={t}>{t}</li>);
        return (
            <ul>{speakers}</ul>
        );
    }
});
