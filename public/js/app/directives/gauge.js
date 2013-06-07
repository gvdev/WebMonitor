/**
 * http://docs.angularjs.org/guide/directive
 * Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against
 * the HTML and executed. This allows directives to register behavior, or transform the DOM.
 */

/**
 * Directive gauge.
 * Add label to each parameter gauge nodes.
 * Each tag <canvas gauge></canvas> execute with jquery plugin jsgauge.
 */
web_monitor.directive('gauge', function() {
	var linker = function(scope, element) {

		// Configure and show plugin jquery jsgauge.
		var threshold = scope.adc.max;
		var max = threshold * 1.2;
		element.gauge({
			min: 0,
			max: max,
			value: scope.adc.value,
			label: scope.adc.descriptions
			//bands: [{ color: "#ff0000", from: 0, to: max}]
		}).gauge('setValue', scope.adc.value);

	};

	return {
		restrict: 'A',
		link: linker,
		scope: {
			adc: '='
		}
	};
});