/**
 * Model to manipulate configuration of the nodes.
 */

var mongoose	= require('mongoose'),
	Schema 		= mongoose.Schema,

	config 		= require('../config.json');

var Configuration = new Schema({
	gauge		: {
		min: Number,
		max: Number
	},
	battery		: {
		min: Number,
		max: Number
	},
	factor : Number,
	inputs		: {
		input1: String,
		input2: String,
		input3: String,
		input4: String,
		input5: String,
		input6: String,
		input7: String,
		input8: String
	}
});

/*
 * Static definitions.
 */

/**
 * To add configuration for defect when the system is loaded for the first time.
 *
 * @param callback
 * @returns doc json.
 */
Configuration.statics.add_configuration = function (callback) {
	var this_model = this;

	return this_model.find({}, function (error, docs) {
		if (!error) {
			if (!docs.length) {
				var new_config = new this_model({
					gauge	: {
						min: config.gauge.min,
						max: config.gauge.max
					},
					battery: {
						min: config.battery.min,
						max: config.battery.max
					},
					factor : config.factor,
					inputs : {
						input1: '',
						input2: '',
						input3: '',
						input4: '',
						input5: '',
						input6: '',
						input7: '',
						input8: ''
					}
				});

				new_config.save(function (error, doc) {
					if (!error) {
						callback(null, { msg: 'Success: The config is save.', type: 'success' }, doc);
					} else {
						callback({ msg: 'Error: The config is not save.', type: 'error' }, null, null);
					}
				});
			} else {
				// There is no need of a configuration.
				callback(null, null);
			}
		} else {
			callback(error);
		}
	});
};

/**
 * Get the configuration.
 *
 * @param callback
 * @returns docs json
 */
Configuration.statics.get = function (callback) {
	return this.findOne({}, function (error, docs) {
		if (!error) {
			callback(null, docs);
		} else {
			callback(error, null);
		}
	});
}

/**
 * Update configuration of nodes.
 *
 * @param data
 * @param callback
 */
Configuration.statics.update = function (data, callback) {
	return this.findOne({}, function (error, doc) {
		if (!error) {
			doc.battery.min 	= data.battery.min;
			doc.battery.max 	= data.battery.max;

			doc.gauge.min		= data.gauge.min;
			doc.gauge.max		= data.gauge.max;

			doc.factor			= data.factor;
			
			doc.inputs.input1	= data.inputs.input1;
			doc.inputs.input2	= data.inputs.input2;
			doc.inputs.input3	= data.inputs.input3;
			doc.inputs.input4	= data.inputs.input4;
			doc.inputs.input5	= data.inputs.input5;
			doc.inputs.input6	= data.inputs.input6;
			doc.inputs.input7	= data.inputs.input7;
			doc.inputs.input8	= data.inputs.input8;

			doc.save(function (error) {
				if (!error) {
					callback(null);
				} else {
					callback(error);
				}
			});
		} else {
			callback(error);
		}
	});
}

module.exports = mongoose.model('Configuration', Configuration);
