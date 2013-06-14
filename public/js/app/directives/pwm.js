/**
 * http://docs.angularjs.org/guide/directive
 * Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against
 * the HTML and executed. This allows directives to register behavior, or transform the DOM.
 */

/**
 * Directive pwm:
 *
 * Slider for each node.
 * This slider will be similar to clicking inputs but it will send a value between 0 and 100 and store
 * it in PWM ( table [9] ) . Slider should only send value on mouse stop.
 *
 * Each node:
 */
web_monitor.directive('pwm', function ($compile) {

	var linker = function (scope, element) {

		scope.$watch('value', function (str_value) {

			if (scope.user) {

				element.slider({
					orientation: "horizontal",
					range: "min",
					min: 0,
					max: 100,
					value: str_value,
					slide: function (event, ui) {
						$("#pwm_" + scope.node).html(ui.value);
					}
				});

				$compile(element.contents())(scope);

			} else {

				element.slider({
					orientation: "horizontal",
					range: "min",
					min: 0,
					max: 100,
					value: str_value
				});
			}
		});
	};

	var controller = function ($scope) {

		// Change value of pwm.
		$scope.change_value = function (node, email) {
			
			var value = $("#pwm_" + node).html();

			if (email) {

				if (value != $scope.value) {
					
					socket.emit('change value slider pwm', {
						value: value,
						node_id : node,
						user: {
							email: email
						}
					});
					
				};
			} else {
				
				$('#pwmm_' + node).slider({
					orientation: "horizontal",
					range: "min",
					min: 0,
					max: 100,
					value: $scope.value,
					slide: function () {
						flash_message_launch({ msg: 'You must be logged in to change pwm.', type: 'error' });
					}
				});
			}
		};
	};

	return {
		restrict	: 'A',
		link		: linker,
		controller	: controller,
		scope: {
			value: '=',
			user : '=',
			node : '='
		}
	};
});
