/**
 * Actions to controller the system.
 *
 * @type {*}
 */

var crypto	= require('crypto'),

	rnodes	= require('../lib/nodes'),
	socket 	= require('../lib/sockets'),
	event	= require('../lib/event'),
	log		= require('../lib/log'),
	strlib	= require('../lib/string'),

	User 	= require('../models/user'),
	Config	= require('../models/configuration'),
	Node	= require('../models/node'),

	config	= require('../config');

module.exports = {

	/**
	 * Index page.
	 *
	 * @param req
	 * @param res
	 */
	get_index: function (req, res) {
		var object_user = req.user;

		// Log.
		log.save('information', req.ip, req.method, 'Access to index page.', object_user);

		res.render('index', {
			user : object_user
		});
	},

	/**
	 * Configuration page.
	 *
	 * @param req
	 * @param res
	 */
	get_config: function (req, res) {
		var object_user = req.user;

		// Log.
		log.save('information', req.ip, req.method, 'Access to configuration page.', object_user);

		res.render('configuration', {
			user : object_user
		});
	},

	/**
	 * Display Form authentication.
	 *
	 * @param req
	 * @param res
	 */
	get_login: function (req, res) {
		var object_user = req.user;
		if (object_user) {
			console.log(object_user.name);
		}

		res.render('auth/login', {
			user	: object_user,
			code  	: req.query.code || 0
		});
	},

	/**
	 * Run the authentication and redirect to the home page.
	 *
	 * @param req
	 * @param res
	 */
	post_login: function (req, res) {
		var object_user = req.user;

		// Log.
		log.save('information', req.ip, req.method, 'Authenticated.', object_user);

		res.redirect('/');
	},

	/**
	 * Run out of the site (logout).
	 *
	 * @param req
	 * @param res
	 */
	get_logout: function (req, res) {
		var object_user = req.user;

		// Log.
		log.save('information', req.ip, req.method, 'Logout.', object_user);

		req.logout();
		res.redirect('/');
	},

	/**
	 * Socket Operations.
	 *
	 */

	/**
	 * To display all table data by socket when the client requests.
	 *
	 * @param io
	 * @param socket
	 */
	io_index: function(io, socket) {
		var new_event = new event();

		new_event.on('open', function (table) {
			// Search in the Database the configuration.
			Config.get(function (error, config) {
				
				// Obtain images of ndoes.
				Node.all(function (images) {
										
					// Show al table nodes in web client.
					var io_table = rnodes.io_return_nodes(table, config, images);
					
					socket.emit('data of the node', io_table);
				});
			});
		});
	},
	
	/**
	 * Inputs.
	 */
	
	/**
	 * Get node to modify and change its state of inputs.
	 *
	 * @param data
	 */
	change_state_input: function (io, client, data) {

		// Run dynamic event, to send the web customer table.
		// EventEmitter -> require('events').
		// The event.js is in ./web_monitor/routes/event.js
		var new_event = new event();

		// Event listener return table object.
		new_event.on('open', function (table) {

			// Get node to modify.
			var line = table[data.node_id];

			// Get actual inputs of node.
			//var inputs = '' + line[2] + '';
			var inputs = line[2];

			// Change state of inputs.
			var new_input = strlib.set_char_at(inputs, data.position, data.value);

			// Change input -new_input- in table.
			line[2] = new_input;
			table[data.node_id] = line;

			// TODO: Implement what you have to do to show the status of the inputs on the client.

			// Log.
			var address = client.handshake.address;
			log.save('information', address.address, 'websocket', 'change input state of node ' + data.node_id + ' of ' + inputs + ' at ' + new_input + '.', data.user);

			/**
			 * Update a only node.
			 *
			 * {node: table[NODE ID], update: 0}
			 *
			 * node is updated on the Web.
			 * update specifies whether an input is being updated.
			 * 0 has not changed the status of an input.
			 * 1 has changed the status of an input.
			 */
			new_event.emit('update client', {node: line, update: 1});
		});
	}
};
