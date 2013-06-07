/**
 * Controllers to working with configurations forms.
 */
'use strict';

/**
 * Controller.
 * Show and edit form with date of configurations nodes.
 */
web_monitor.controller('configuration', function ($scope, $http) {

	// GET settings through the API /api/config.
	$http.get('/api/config').success(function(data) {
		$scope.config = data;
	});

	// POST send data for modified configurations.
	$scope.submit_config = function(config) {
		$http.post('/api/config/update', config);
	};
});
