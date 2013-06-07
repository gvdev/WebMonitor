/**
 * http://docs.angularjs.org/guide/directive
 * Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against
 * the HTML and executed. This allows directives to register behavior, or transform the DOM.
 */

/**
 * Directive battery.
 * Show battery level.
 * Alert if low battery.
 */
web_monitor.directive('battery', function () {
	var linker = function (scope, element) {

		scope.$watch('node', function (str_node) {
			// Convert String "node" to JSON format.
			var node = JSON.parse("[" + str_node + "]")[0];

			var percent_min = (node.battery_min * 100) / node.battery_max;
			var percent 	= (node.battery_level * 100) / node.battery_max;

			var progress_h 	= '<div class="progress span2 pull-right">' + node.battery_level;

			var bad_level;
			if (percent < percent_min) {
				bad_level = '<div class="bar bar-danger" style="width: ' + percent + '%;"></div>' +
					'<span style="" class="label label-important pull-right">Low Battery</span>';
			} else {
				bad_level = '<div class="bar bar-danger" style="width: ' + percent_min + '%;"></div>';
			}

			var good_level;
			if (percent > percent_min) {
				var rest 	= percent - percent_min;
				good_level 	= '<div class="bar bar-success" style="width: ' + rest + '%;"></div>';
			} else {
				good_level 	= '<div class="bar bar-success" style="width: ' + 0 + '%;"></div>';
			}

			var progress_f = '</div>';

			element.html(progress_h + bad_level + good_level + progress_f);
		});
	};

	return {
		restrict: 'E',
		link    : linker,
		scope   : {
			node: '@node'
		}
	};
});
