var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var PageHeader = require('react-bootstrap/lib/PageHeader');
var Well = require('react-bootstrap/lib/Well');

module.exports = React.createClass({
	render() {
		return (
			<Grid>
				<PageHeader>{this.props.name}</PageHeader>
				<div className="text-center">
					<address>{this.props.address}</address>
					<Well>{this.props.nextDate}</Well>
				</div>
			</Grid>
		);
	}
});