'use strict';

// Declare app level module which depends on filters, and services.
var web_monitor = angular.module('web_monitor', ['infinite-scroll']).

	// Routes of APP.
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

		$routeProvider.otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
	}]
);
