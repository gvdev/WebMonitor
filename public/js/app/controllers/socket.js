/**
 * Client side, sockets operations.
 *
 * @type {*|io.Socket}
 */
var socket = io.connect(location.protocol + '//' + location.host);

socket.emit('tables');
socket.on('flash message', flash_message_launch);

// Block Ping client.
// Received pong data from server.
socket.on('pong', function(data){
	// Working with the data sent by the server.
});

setTimeout(send_heartbeat, 3000);

// Sending a packet from client to server and wait for same packet ping to make sure the connection is up.
function send_heartbeat(){
	setTimeout(send_heartbeat, 3000);

	if (socket.socket.connected) {
		// Emit to server.
		socket.emit('ping', { beat : 1 });
	}
}

// To verify the connection and to show their state, time of verification in 1 second.
setInterval(function () {
	if (socket.socket.connected) {
		$('#state-connection').addClass('label-success');
		$('#state-connection').html('Connected');
	} else {
		$('#state-connection').removeClass('label-success');
		$('#state-connection').html('Disconnected');
	}
}, 1000);
// End Block Ping client.

/**
 * Show messages from server.
 *
 * @param message
 */
function flash_message_launch (message) {
	if (message.type == 'error') {
		flash_message(message.msg, message.type, 'top', 4000);
	}
	if (message.type == 'success') {
		flash_message(message.msg, message.type, 'top', 4000);
	}
}

/**
 * Generate message depending of the type.
 *
 * @param msg String Is the message to show.
 * @param type String Is the type of message (success, notification, information, alert, error).
 * @param layout String It is the position in which the message will be shown (top, topCenter, topLeft, topRight, center, centerLeft, centerRight, bottom, bottomCenter, bottomLeft, bottomRight).
 * @param interval Number Seconds to hide, by default 10000.
 */
function flash_message(msg, type, layout, interval) {
	var n = noty({
			text: msg,
			type: type,
			dismissQueue: true,
			layout: layout,
			theme: 'defaultTheme'
		},
		setTimeout(function() {
			$.noty.closeAll(n.options.id);
		}, interval)
	);
}
