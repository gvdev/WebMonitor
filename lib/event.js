var util 			= require('util'),
	EventEmitter 	= require('events').EventEmitter,

	socket			= require('./sockets'),
	rnodes			= require('./nodes'),

	Config 			= require('../models/configuration'),
	Node			= require('../models/node');

var table = Object.create(null);

/**
 * Event Emitter.
 * Extended class to be called from other functions to show the table in the client web.
 */
var event = function() {

	// we need to store the reference of 'this' to 'self', so that we can use the current context in the setTimeout (or any callback) functions
	// using 'this' in the setTimeout functions will refer to those functions, not the event class.
	var self = this;

	setTimeout(function() {

		// Emit 'open' event instantly.
		// Send table object.
		self.emit('open', table);

		// EventEmitters inherit a single event listener, see it in action.
		// Execute send data to web client.
		self.on('send', function (table) {
			// To show table data on web client.
			table_to_client(table);
		});
	}, 0);

	// To update a node individually.
	self.on('update client', function (line) {
		// To show node data on web client.
		node_to_client(line);
	});
};

/**
 * To show table data on web client.
 *
 * @param table object
 */
var table_to_client = function (table) {

	// Search in the Database the configuration.
	Config.get(function (error, config) {
		if (!error) {
			
			// Obtain images of ndoes.
			Node.all(function (images) {
				
				/**
				 * @param	table	Is the object to display in the web client.
				 * @param	config	It is the system configuration, obtained from the database.
				 */
				rnodes.return_nodes(table, config, images);
				
			});

		} else {
			socket.export.sockets.emit('flash message', { msg: 'We are sorry, error when loading the configuration.', type: 'error' });
		}
	});
};

/**
 * Show node changes in the web client.
 *
 * @param line objeet
 */
var node_to_client = function (line) {

	// Search in the Database the configuration.
	Config.get(function (error, config) {
		if (!error) {
			
			// Obtain images of ndoes.
			Node.all(function (images) {
				
				/**
				 * @param	line	Is the node to display in the web client.
				 * @param	table	Is the table object.
				 * @param	config	It is the system configuration, obtained from the database.
				 */
				rnodes.return_node(line, table, config, images);
				
			});

		} else {
			socket.export.sockets.emit('flash message', { msg: 'We are sorry, error when loading the configuration.', type: 'error' });
		}
	});
};

// extend the EventEmitter class using our event class.
util.inherits(event, EventEmitter);

// we specify that this module is a reference to the event class.
module.exports = event;
