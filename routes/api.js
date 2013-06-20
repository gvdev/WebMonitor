/**
 * API to controller the system.
 *
 * @type {*}
 */
var socket	= require('../lib/sockets'),
	event	= require('../lib/event'),
	log		= require('../lib/log'),

	User 	= require('../models/user'),
	Config	= require('../models/configuration'),
	Log		= require('../models/log'),
	Node 	= require('../models/node'),

	config	= require('../config');

module.exports = {

	/**
	 * Configurations.
	 */

	/**
	 * Get system configuration, gauges and triggers.
	 *
	 * @param req
	 * @param res	json eg:
	 *
	 * Object {_id: "519e7a4f023a31cd32000001", __v: 0, trigger_adc: Object, battery: Object, gauge: Object}
	 *	_	id: "519e7a4f023a31cd32000001"
	 *	battery: Object
	 *		max: 3000
	 *		min: 2150
	 *	gauge: Object
	 *		max: 3000
	 *		min: 0
	 *	trigger_adc: Object
	 *		max: 3000
	 *		min: 100
	 */
	get_api_config: function (req, res) {
		// Search in the Database the configuration.
		Config.get(function (error, data) {
			if (!error) {
				res.json(data);
			} else {
				res.json({});
			}
		});
	},

	/**
	 * Update config of website.
	 *
	 * @param req
	 */
	post_api_udpate_config: function (req) {
		var config = req.body;
		var object_user = req.user;

		Config.update(config, function (error) {
			if (!error) {
				// Log.
				log.save('information', req.ip, req.method, 'it edit configurations.', object_user);

				socket.export.sockets.emit('flash message', { msg: 'Success: The configuration is edit.', type: 'success' });
			} else {
				// Log.
				log.save('error', req.ip, req.method, 'Error while edit configuration.', object_user);

				socket.export.sockets.emit('flash message', { msg: 'We are sorry, an error to try please.', type: 'error' });
			}
		});
	},

	/**
	 * Users.
	 */

	/**
	 * Show all the users of the system.
	 *
	 * @param req
	 * @param res
	 */
	get_api_user_all: function (req, res) {
		User.list_all(function (error, users) {
			if (!error) {
				res.json(users);
			} else {
				res.json({});
			}
		});
	},

	/**
	 * Add new user in the system.
	 *
	 * @param req
	 * @param res
	 */
	post_api_user_add: function (req, res) {
		var object_user = req.user;

		// To call to the model to add a new user.
		User.add(req.body, function (error, user) {
			var json_return = {};

			if (!error) {
				json_return = {
					type: 'success',
					user: user,
					msg	: { msg: 'Success: The user is added.', type: 'success' }
				};

				// Log.
				log.save('information', req.ip, req.method, 'added user ' + user.email + '.', object_user);

				res.json(json_return);
			}
			else {
				json_return = {
					type	: 'error',
					error	: error
				};

				// Log.
				log.save('error', req.ip, req.method, 'Error while added user ' + req.body.email + ' , this user not added.', object_user);
				res.json(json_return);
			}
		});
	},

	/**
	 * Edit user.
	 *
	 * @param req
	 * @param res
	 */
	post_api_user_edit: function (req, res) {
		var object_user = req.user;

		// To call to the model to edit a user.
		User.edit(req.body, function (error) {
			if (!error) {

				// Log.
				log.save('information', req.ip, req.method, 'edited user ' + req.body.email + '.', object_user);

				res.json({ msg: 'Success: The user is edited.', type: 'success' });
			} else {
				// Log.
				log.save('error', req.ip, req.method, 'Error while edited user ' + req.body.email + '.', object_user);

				res.json(error);
			}
		});
	},

	/**
	 * Change role user, Admin or not Admin.
	 *
	 * @param req
	 * @param res
	 */
	post_api_user_change_role: function (req, res) {
		var object_user = req.user;

		// To call to the model to change role of user.
		User.change_role(req.body.user_id, function (error, doc) {
			if (!error) {

				// Log.
				log.save('information', req.ip, req.method, 'change role of user ' + doc.email + ' to ' + doc.is_admin, object_user);

				res.json({ msg: 'Success: The user is edited.', type: 'success', is_admin: doc.is_admin });
			} else {

				// Log.
				log.save('error', req.ip, req.method, 'Error while change role.', object_user);

				res.json(error);
			}
		});
	},

	/**
	 * Deleted user by ID.
	 *
	 * @param req
	 * @param res
	 */
	post_api_user_delete: function (req, res) {
		var object_user = req.user;

		// To call to the model to delete a user.
		User.delete(req.body, function (json_return) {

			// Log.
			log.save('information', req.ip, req.method, 'deleted user ' + req.body.email, object_user);

			res.json(json_return);
		})
	},

	/**
	 * Upload image of node.
	 *
	 * @param req
	 * @param res
	 */
	post_api_node_upload_image: function (req, res) {
		var object_user = req.user;
		
		Node.upload_image({
			input	: req.files,
			node	: req.body
		}, function (error, data) {
			if (!error) {

				// Log.
				log.save('information', req.ip, req.method, 'upload image for node ' + req.body.node_id, object_user);

				socket.export.sockets.emit('update image node', { node_id: data.node_id, image: data.image });

			} else {
				// Log.
				log.save('error', req.ip, req.method, 'error while upload image for node ' + req.body.node_id, object_user);
			}
		});
	},

	post_api_node_reset_image: function (req, res) {
		var object_user = req.user;

		Node.reset_image(req.body.node_id, function (error, data) {

			if (!error) {

				// Log.
				log.save('information', req.ip, req.method, 'reset image of node ' + req.body.node_id, object_user);

				// Run dynamic event, to send the web customer table.
				// EventEmitter -> require('events').
				// The event.js is in ./web_monitor/routes/event.js
				var new_event = new event();

				// Event listener return table object.
				new_event.on('open', function (table) {

					// Get node to modify.
					var line = table[req.body.node_id];

					/**
					 * Update a only node.
					 *
					 * {node: table[NODE ID], update: 0}
					 *
					 * node is updated on the Web.
					 *
					 * update specifies whether an input is being updated.
					 * 0 has not changed the status of an input.
					 * 1 has changed the status of an input.
					 *
					 * pwm_update If true only update pwm value in web client.
					 */
					new_event.emit('update client', {node: line, update: 0, pwm_update: false});
				});
			} else {
				// Log.
				log.save('error', req.ip, req.method, 'error while reset image of node ' + req.body.node_id, object_user);
			}
		});
	},

	/**
	 * Logs.
	 */

	/**
	 * Show all the logs of the system.
	 * They will be shown of 10 in 10
	 *
	 * @param req
	 * @param res
	 */
	get_api_log_all: function (req, res) {
		Log.get({skip: 0, limit: 10}, function (error, docs) {
			if (!error) {
				res.json(docs);
			} else {
				res.json({});
			}
		});
	},

	/**
	 * Infinite scroll to logs.
	 *
	 * @param req
	 * @param res
	 */
	post_api_log_scroll: function (req, res) {
		Log.get(req.body, function (error, docs) {
			if (!error) {
				res.json(docs);
			} else {
				res.json({});
			}
		});
	},
	
	/**
	 * Advanced search logs.
	 * 
	 * @param req
	 * @param res
	 */
	post_api_log_a_search: function (req, res) {
		Log.a_search(req.body, function (error, docs) {
			if (!error) {
				res.json(docs);
			} else {
				res.json({});
			}
		});
	},

	/**
	 * Delete logs by range.
	 *
	 * @param req
	 * @param res
	 */
	post_api_log_delete_by_range: function (req, res) {

		Log.delete_by_range(req.body, function () {});

		Log.a_search(req.body.search, function (error, docs) {

			if (!error) {
				res.json(docs);
			} else {
				res.json({});
			}
		});
	}
};
