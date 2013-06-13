/**
 * Model to manipulate log of the Ips.
 */
var mongoose	= require('mongoose'),
	Schema 		= mongoose.Schema,

	config 		= require('../config.json');

var Log = new Schema({
	type		: String,
	ip			: String,
	method		: String,
	msg			: String,
	datetime	: {
		type	: Date,
		default	: Date.now
	},
	success		: Boolean
});

/*
 * Method definitions.
 */
/*
 * Static definitions.
 */

/**
 * Add new log in DB.
 *
 * @param new_log
 */
Log.statics.add = function (new_log) {
	var this_model = this;

	var add = new this_model(new_log);

	add.save();
};

/**
 * List of logs.
 * They will be shown of 10 in 10
 *
 * @param options
 * @param callback
 * @returns {*|Promise}
 */
Log.statics.get = function (options, callback) {
	var this_model = this;

	return this_model.find({})
		.skip(options.skip)
		.limit(options.limit)
		.sort({ datetime: 'desc' })
		.exec(function (error, docs) {
			if (!error) {
				callback(null, docs);
			} else {
				callback(error, null);
			}
		});
};

/**
 * Execute function search of logs.
 *
 * @param options
 * @param callback
 */
Log.statics.a_search = function (options, callback) {
	var this_model = this;

	var search = {};

	if (options.type) {
		search.type = options.type
	}

	if (options.ip) {
		search.ip = options.ip
	}

	if (options.method) {
		search.method = options.method
	}

	if (options.range) {

		// Get range from web client, example: "06/06/2013 - 06/12/2013".
		// Split this to get range start and range end to compare date with logs.
		var range = options.range.split(' - ');

		// Convert to object Date.
		var range_start = new Date(range[0]);
		var range_end 	= new Date(range[1]);

		// If range_start distinct to range_end then rest value of day
		// because function $gte of mongoose compare < but not <=
		range_start		= (range_start == range_end)? range_start.setDate(range_start.getDate() - 1) : range_start;

		// Sum day to range_end because function $lte of mongoose compare
		// > but not =>
		range_end		= range_end.setDate(range_end.getDate() + 1);

		search.datetime = {
			$gte: range_start,
			$lte: range_end
		};
	}

	if (options.criteria) {
		search.msg = {
			$in: options.criteria
		}
	}

	this_model.find({
		$or: [
			search
		]
	}, function (error, docs) {
		if (!error) {

			callback(null, docs);
		} else {
			callback({ msg: 'Error: No logs is found.', type: 'error' }, null);
		}
	});
};

module.exports = mongoose.model('Log', Log);
