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
 * @returns logs
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


module.exports = mongoose.model('Log', Log);
