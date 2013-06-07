var passport 	= require('passport'),

	User 		= require('./models/user'),

	start 		= require('./routes/index'),
	api			= require('./routes/api');

/**
 * Validate if user is logged.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = function (app) {
	/*
	 * Index.
	 */
	app.get('/', start.get_index);

	/**
	 * Configurations.
	 */
	app.get('/config', ensureAuthenticated, start.get_config);

	/*
	 * Authentication.
	 */
	app.get('/', start.get_login);
	app.post('/', passport.authenticate('local', {
		failureRedirect: '/?code=1'
	}), start.post_login);
	app.get('/auth/logout', start.get_logout);

	/**
	 * API GET.
	 */

	// Configurations.
	app.get('/api/config', ensureAuthenticated, api.get_api_config);

	// Users.
	app.get('/api/user/all', ensureAuthenticated, api.get_api_user_all);

	// Logs.
	app.get('/api/log/all', ensureAuthenticated, api.get_api_log_all);

	/**
	 * API POST.
	 */

	// Configurations.
	app.post('/api/config/update', ensureAuthenticated, api.post_api_udpate_config);

	// Users.
	app.post('/api/user/add', ensureAuthenticated, api.post_api_user_add);
	app.post('/api/user/edit', ensureAuthenticated, api.post_api_user_edit);
	app.post('/api/user/delete', ensureAuthenticated, api.post_api_user_delete);

	// Change role, Admin or not Admin.
	app.post('/api/user/role', ensureAuthenticated, api.post_api_user_change_role);

	// Logs
	app.post('/api/log/scroll', ensureAuthenticated, api.post_api_log_scroll);

	// Nodes.

	// Upload image of node.
	app.post('/api/upload/image', api.post_api_node_upload_image);
	
};
