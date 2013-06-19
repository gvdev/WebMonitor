/**
 * Controllers to working with logs list.
 */
'use strict';

/**
 * Controller.
 * Show all logs of system.
 */
web_monitor.controller('process_log', function ($scope, $http) {
	$scope.logs 			= [];
	$scope.loading 			= false;
	$scope.loading_scroll 	= false;
	$scope.is_infinite 		= true;

	var skip = 11;
	var limit = 10;

	// GET settings through the API /api/config.
	$http.get('/api/log/all').success(function(data) {
		$scope.logs = data;
	});

	/**
	 * Infinite scroll to logs.
	 */
	$scope.infinite_scroll = function () {

		if ($scope.is_infinite) {
			$scope.loading_scroll = true;

			$http.post('/api/log/scroll', {skip: skip, limit: limit}).success(function (data) {

				if (data.length > 0) {
					data.forEach(function(log) {
						$scope.logs.push(log);
					});

					skip = skip + 10;

					$scope.loading_scroll = false;

				} else {
					$scope.loading_scroll = false;
					flash_message_launch({ msg: 'For the moment not more logs find.', type: 'success' });
				}
			});
		}
	};

	/**
	 * Refresh for use infinite scroll directive.
	 */
	$scope.logs_refresh = function () {

		$scope.loading 		= true;

		// Execute infinite scroll.
		$scope.is_infinite 	= true;

		var date = new Date();
		var str_date = date.toString('MM/dd/yyyy');
		str_date = str_date + ' - ' + str_date;

		var search = {
			range: str_date
		}

		this.reset();

		$http.post('/api/log/a_search', search).success(function (data) {
			$scope.logs 	= data;
			$scope.loading 	= false;
		});
	};
	
	/**
	 * Advanced search.
	 */
	$scope.a_search = function (search) {

		$scope.loading = true;

		// No execute infinite scroll.
		$scope.is_infinite = false;

		if ($('#range').html() != '') {
			if (!search) {
				search = {};
			}
			search.range = $('#range').html();
		}
		
		$http.post('/api/log/a_search', search).success(function (data) {
			$scope.logs 	= data;
			$scope.loading 	= false;
		});
	};

	/**
	 * Remove data of range.
	 */
	$scope.remove_criteria_date = function () {

		if ($('#range').html() != '') {
			$('#range').html('');
		}
	};

	/**
	 * Reset all form search.
	 */
	$scope.reset = function () {

		if ($('#range').html() != '') {
			$('#range').html('');
		}

		$scope.search 	= angular.copy({});
		$scope.find		= angular.copy({});
	}
});
