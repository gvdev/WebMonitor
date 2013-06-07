/**
 * Model to manipulate users and sessions.
 */

var mongoose 				= require('mongoose'),
	Schema 					= mongoose.Schema,
	passportLocalMongoose 	= require('passport-local-mongoose'),

	config 					= require('../config.json');

var User = new Schema({
	email		: String,
	name		: String,
	last_name	: String,
	is_admin	: Boolean,
	active		: Boolean,
	banned		: Boolean,
	deleted		: Boolean,
	expired		: Date,
	created		: {
		type	: Date,
		default	: Date.now
	}
});

User.plugin(passportLocalMongoose);

/*
 * Method definitions.
 */
/*
 * Static definitions.
 */

/**
 * Add Super admin and site configuration if not exist.
 */
User.statics.add_super_admin = function (callback) {
	var this_model = this;

	return this.find({}, function (error, docs) {
		if (!error) {
			if (!docs.length) {
				var super_admin = new this_model({
					username: config.website.super_admin.name,
					email   : config.website.super_admin.name,
					is_admin: true,
					name    : 'Administrator',
					active  : true
				});

				this_model.register(super_admin, config.website.super_admin.password, function (error) {
					if (!error) {
						callback(null, super_admin._id);
					}
					else {
						callback(error);
					}
				});
			}
			else {
				// There is no need of a super admin user.
				callback(null, null);
			}
		}
		else {
			callback(error);
		}
	});
};

/**
 * List all users.
 *
 * @param callback
 * @returns {*}
 */
User.statics.list_all = function (callback) {
	var this_model = this;

	return this_model.find({}, function (error, docs) {
		if (!error) {
			callback(null, docs)
		} else {
			callback(error);
		}
	});
};

/**
 * Add new user in the DB if not exist.
 *
 * @param user		json
 * @param callback
 * @returns {*}
 */
User.statics.add = function (user, callback) {
	var this_model = this;

	return this.find({
		email: user.email
	}, function (error, docs) {
		if (!error) {
			if (!docs.length) {

				var new_user = new this_model({
					username : user.email,
					email    : user.email,
					is_admin : user.is_admin,
					name     : user.name,
					last_name: user.last_name,
					active   : true
				});

				this_model.register(new_user, user.password, function (error) {
					if (!error) {
						callback(null, new_user);
					}
					else {
						callback({ msg: 'Error: the user could not be added.', type: 'error' }, null);
					}
				});

			} else {
				callback({ msg: 'Error: The user ' + user.email + ' already exists', type: 'error' }, null);
			}

		} else {
			callback({ msg: 'Error:' + error, type: 'error' }, null);
		}
	});
};

/**
 * Edit user.
 *
 * @param user		json
 * @param callback
 * @returns {*|Query|Query|Cursor}
 */
User.statics.edit = function (user, callback) {
	var this_model = this;

	return this_model.findOne({
		_id: user._id
	}, function (error, doc) {
		if (!error) {
			doc.username 	= user.email;
			doc.email		= user.email;
			doc.name		= user.name;
			doc.last_name	= user.last_name;

			doc.save();
			callback();
		} else {
			callback({ msg: error, type: 'error' });
		}
	});
};

/**
 * Change role of user
 *
 * @param id
 * @param callback
 */
User.statics.change_role = function (id, callback) {
	var this_model = this;

	return this_model.findOne({
		_id: id
	}, function (error, doc) {
		if (!error) {
			// Change role, if is true change to false.
			(doc.is_admin == true)? doc.is_admin = false : doc.is_admin = true;

			doc.save();
			callback(null, doc);
		} else {
			callback({ msg: error, type: 'error' }, null);
		}
	});
};

/**
 * Delete user by ID.
 *
 * @param user		json
 * @param callback
 * @returns {*}
 */
User.statics.delete = function (user, callback) {
	var this_model = this;

	return this_model.remove({
		_id: user._id
	}, function (error) {
		if (!error) {
			callback({ msg: 'Success: The user is deleted.', type: 'success' });
		}
		else {
			callback(error.message);
		}
	});
};

module.exports = mongoose.model('User', User);