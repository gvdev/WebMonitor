/**
 * Controllers to working with users forms.
 */
'use strict';

/**
 * Controller.
 *
 * To process users: List, Add, Edit, Delete.
 */
web_monitor.controller('users_all', function ($scope, $http) {
	$scope.users = {};

	// GET settings through the API /api/config.
	$http.get('/api/user/all').success(function(data) {
		$scope.users = data;
	});

	/**
	 * To edit a user and show update in the client.
	 *
	 * @param user json
	 */
	$scope.edit = function (user) {

		// Send user edit to server.
		$http.post('/api/user/edit', user).success(function (json_return) {

			// Return users of system.
			$http.get('/api/user/all').success(function(data) {
				$scope.users = data;
			});

			// Show success or error message.
			flash_message_launch(json_return);
		});
	};

	/**
	 * Change role of user
	 *
	 * @param id ID of user.
	 */
	$scope.change_role = function (id) {
		// Send id user for role change.
		$http.post('/api/user/role', { user_id: id }).
			success(function (json_return) {
				// If the user was change role correctly to show notification message.
				if (json_return.type == 'success') {
					// Search user to update role.
					angular.forEach($scope.users, function(user){
						if (user._id == id) {
							user.is_admin = json_return.is_admin;
						}
					});
				} else {
					// Show error message.
					flash_message_launch(json_return.error);
				}
			});
	};

	/**
	 * Take a new user of form and send by ajax to system.
	 *
	 * @param user json
	 */
	$scope.add = function (user) {

		// Send user add to server.
		$http.post('/api/user/add', user).
			success(function (json_return) {

				// If the user was added correctly to show notification message.
				if (json_return.type == 'success') {
					$scope.users.push(json_return.user);
					flash_message_launch(json_return.msg);
				} else {
					// Show error message.
					flash_message_launch(json_return.error);
				}
			}).
			error(function(error) {
				flash_message_launch({ msg: 'Error: it has happened an error in the system, please attempt it in some minutes.', type: 'error' });
			});

		$scope.user = {};
	};

	/**
	 * Delete user by ID.
	 *
	 * @param user json
	 */
	$scope.delete = function (user) {
		$http.post('/api/user/delete', user).success(function (json_return) {
			flash_message_launch(json_return);
		});

		var old_users 	= $scope.users;
		var new_users 	= [];

		angular.forEach(old_users, function(user_check) {
			if(user_check._id !== user._id) new_users.push(user_check);
		});

		$scope.users = new_users;
	};
});