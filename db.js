/**
 * Set up and connect to the database in MongoDB via Mongoose ODM.
 *
 * @type {*}
 */

var mongoose 		= require('mongoose'),

	User 			= require('./models/user'),
	Configuration	= require('./models/configuration'),

	config = require('./config.json');

module.exports = {
	// initialize DB
	startup: function () {
		// Open DB connection to database.
		//mongoose.connect("mongodb://admin:admin@localhost/Nav20");
		mongoose.connect("mongodb://" +
			config.database.user + ":" +
			config.database.pass + "@" +
			config.database.host + "/" +
			config.database.name);

		/*
		 * Database checks.
		 */
		mongoose.connection.on('error', function (error) {
			console.log('Connection error: ' + error);
		});

		mongoose.connection.once('open', function () {
			console.log('Connection opened.');
		});
	},
	install: function (callback) {
		// Create user administrator if none exists in the database.
		User.add_super_admin(callback);

		// Creating initial configuration if it does not exist in the database.
		Configuration.add_configuration(callback);
	}
};