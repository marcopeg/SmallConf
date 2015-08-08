var React = require('react');

module.exports = React.createClass({
	getDefaultProps() {
		return {
			apiKey: '',
			address: '',
			width: 600,
			height: 450
		};
	},
	render() {

		var url = [
			'https://www.google.com/maps/embed/v1/place?key=',
			this.props.apiKey,
			'&q=',
			this.props.address
		].join('');

		return (
			<iframe
				width={this.props.width}
				height={this.props.height}
				frameBorder={0}
				style={{border:0}}
				src={url} 
				allowFullScreen={true} />
		);
	}
});