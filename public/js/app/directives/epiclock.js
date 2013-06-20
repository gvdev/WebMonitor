/**
 * http://docs.angularjs.org/guide/directive
 * Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against
 * the HTML and executed. This allows directives to register behavior, or transform the DOM.
 */

/**
 * Show actual time clock in top of webpage with a clock round animation.
 */
web_monitor.directive('epiclock', function () {

	var linker = function (scope) {

		$('#explicit').epiclock({
			mode	: $.epiclock.modes.explicit,
			time	: new Date(scope.datetime),
			format	: "h:i:s a",
			utc		: false
			//renderer: 'retro'
		});

	};

	return {
		restrict	: 'A',
		link		: linker,
		scope		: {
			datetime: '='
		}
	};
});