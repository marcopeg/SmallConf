SmallConf.io
---

`SmallConf` is a _single page application_ which provides an organization and social tool for meet up groups.

It is based on `ReactJS` and stores data in `FireSlide`. There is no "server side" in this app, everything is just frontend technology.

Enjoy it!

![TravisCI Build](https://travis-ci.org/marcopeg/SmallConf.svg?branch=master)

## Work on it!

### Requirements

1. We code on a Mac, you?
2. NodeJS 0.12.7

After you clone the repository you should run a simple `npm install` to download the dependencies, with that step done you are ready to run the project and code.

### Setup your Firebase

- open `settings/app.settings.js`
- set your firebase url in key `firebaseUrl`

### Development

	# development session
	npm start
	
This script runs the transpiler in _watch_ mode, a development server that uses port `8080` and a `LiveReload` service on it's standard port.

Open your browser and go to `http://localhost:8080` to run the app on your local machine!

### Test

You can run all the unit tests by:
	
	// run test one shot
    npm test
    
During your normal activity with `npm start` all the available tests are being executed
every time you save a file and a _KarmaJS_ server is available to connect to and debug your tests using any browser:
	
	// connect to karma server
    http://localhost:9876
    
The test suite is composed by:

- KarmaJS
- MochaJS
- ChaiJS
- SinonJS

All the unit tests should follow the following naming convention:

    /{module-name}/specs/{test-name}.spec.js
    
Inside every test you can require all the files you need using a local path.


### Release

	# test a release locally
	npm run start-release

## Settings

### Workspace

	config/workspace.config.js
	
Those settings are used to build the projects. 
There are a distinct set of settings for the development process and the release.

> You can create a local develompent setting file which will not 
> be part of your commits: `config/workspace.config.local.js`

### Application

	config/app.config.js
	
Those settings are part of the initial state of the application.

> You can create a local develompent setting file which will not 
> be part of your commits: `config/app.config.local.js`

## Contribute

We are in a so early stage that we don't have fancy rules or strict processes.

1. fork the repo
2. hack on it
3. create a PR
4. discuss it with us

