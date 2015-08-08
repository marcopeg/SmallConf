/**
 * this is the general configuration object that is given
 * to the client app through a Wepack external "config".
 *
 * If you are conding at home you may want to run your app 
 * on your custom FireBase or you may want to apply configs
 * that are not meant to be pushed to the main repo.
 *
 * You should then create "app.config.local.js" which will
 * replace this file and it is already ignored by Git.
 */

module.exports = {
	firebaseUrl: 'https://smallconf.firebaseio.com/',
	gmapApiKey: 'AIzaSyBa0ly5WszC0HICL_sHhN3facnkIjf7TUU',
	conf: {
		name: 'SmallConf',
		address: 'Simrishamnsgatan 24, Malmö',
		nextDate: '3st September 2015'
	}
};