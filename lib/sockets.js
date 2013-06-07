/**
 * Server side, sockets operations.
 *
 * @type {*}
 */

var io 		= require('socket.io'),

	index	= require('../routes/index');

exports.socketServer 	= function (app, server) {
	var socket = io.listen(server);
	socket.set('log level', 1);
	socket.set("transports", ["xhr-polling"]);
	socket.set('browser client minification', true);
	//socket.set('browser client gzip', true);

	module.exports.export = socket;

	socket.sockets.on('connection', function (client) {
		console.log("New client is here!");

		// To display all table data by socket when the client requests.
		setTimeout(function () {
			index.io_index(io, client);
		}, 1000);

		client.on('change state input', function (data) {
			index.change_state_input(io, client, data);
		});

		// Block Ping client.
		// Received a packet from client to server and wait for same packet ping to make sure the connection is up.
		client.on('ping', function(data){
			client.emit('pong', data);
		});
	});
};

