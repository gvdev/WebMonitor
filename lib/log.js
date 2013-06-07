/**
 * Library to process logs.
 */

var Log = require('../models/log');

module.exports = {

	/**
	 * Save new log.
	 *
	 * @param type
	 * @param ip
	 * @param method
	 * @param msg
	 * @param object_user
	 */
	save: function (type, ip, method, msg, object_user) {

		// New log to add in DB.
		var new_log = {
			type	: type,
			ip		: ip,
			method	: method,
			msg		: (object_user)? 'User ' + object_user.email + ' - ' + msg : msg,
			success	: (type != 'error')? true : false
		};

		Log.add(new_log);
	}
};
