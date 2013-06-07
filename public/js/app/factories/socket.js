/**
 * Wrap the Socket.io functionality in a socket service so can encapsulate
 * that object and not leave it floating around on the global namespace.
 */
'use strict';

/**
 * Factory.
 * To configure and used socket in controllers.
 */
web_monitor.factory('socket', function ($rootScope) {
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	}
});