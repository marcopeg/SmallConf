var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var PageHeader = require('react-bootstrap/lib/PageHeader');
var Well = require('react-bootstrap/lib/Well');
var Button = require('react-bootstrap/lib/Button');
var GoogleMap = require('./google-map');

module.exports = React.createClass({
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
		var conf = this.props.conf;
		
		if (this.state.gmapIsVisible) {
			gmap = (
				<GoogleMap 
					apiKey={this.props.gmapApiKey}	
					address={conf.address} />
			);
		}

		return (
			<Grid>
				<PageHeader className="text-center">{conf.name}</PageHeader>
				<div className="text-center">
					<Well bsSize="large">
						<h4>{conf.nextDate}</h4>
					</Well>
					<p>
						<Button bsStyle="link" onClick={this._toggleGmap}>{conf.address}</Button>
					</p>
					{gmap}
				</div>
			</Grid>
		);
	}
});