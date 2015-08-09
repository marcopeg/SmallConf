var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var PageHeader = require('react-bootstrap/lib/PageHeader');
var Well = require('react-bootstrap/lib/Well');
var Button = require('react-bootstrap/lib/Button');
var GoogleMap = require('./google-map');

module.exports = React.createClass({
    getDefaultProps() {
        return {
            gmapApiKey: 'gmap-api-key',
            confName: 'conf-name',
            confAddress: 'conf-address',
            confNextDate: 'conf-next-date'
        };
    },

    getInitialState() {
        return {
            gmapIsVisible: false
        };
    },

    _toggleGmap(e) {
        e.target.blur();
        this.setState({
            gmapIsVisible: !this.state.gmapIsVisible
        });
    },

    render() {
        var gmap;

        if (this.state.gmapIsVisible) {
            gmap = (
                <GoogleMap
                    apiKey={this.props.confGmapApiKey}
                    address={conf.address} />
            );
        }

        return (
            <Grid>
                <PageHeader className="text-center">{this.props.confName}</PageHeader>
                <div className="text-center">
                    <Well bsSize="large">
                        <h4>{this.props.confNextDate}</h4>
                    </Well>
                    <p>
                        <Button bsStyle="link" onClick={this._toggleGmap}>{this.props.confAddress}</Button>
                    </p>
                    {gmap}
                </div>
            </Grid>
        );
    }
});
