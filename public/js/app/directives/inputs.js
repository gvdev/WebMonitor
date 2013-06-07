/**
 * http://docs.angularjs.org/guide/directive
 * Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against
 * the HTML and executed. This allows directives to register behavior, or transform the DOM.
 */

/**
 * Directive inputs:
 *
 * Clicking on one issue per socket status change.
 * Show real time when changing state automatically.
 */
web_monitor.directive('inputs', function ($compile, $http) {
	var linker = function (scope, element) {

		scope.$watch('input', function (str_input) {

			// Convert info type string to json.
			var info = JSON.parse(scope.info);
			
			var get_info = []
			get_info.push(info.input1);
			get_info.push(info.input2);
			get_info.push(info.input3);
			get_info.push(info.input4);
			get_info.push(info.input5);
			get_info.push(info.input6);
			get_info.push(info.input7);
			get_info.push(info.input8);
			
			// Add inputs on web client.
			var append = '';

			// Loop through each element of the input, eg 11100011.
			for (var i = 0; i < str_input.length; i++) {

				// Add 1 to i for the inputs starting in 1 and not 0.
				var count = i + 1;

				// Add element to htmlfor show inputs.
				// ng-click="change_state(...)" is a function to change the state of input.
				if (str_input[i] == '0') {
					if (scope.user) {
						append = append + '<span class="btn btn-mini" title="' + get_info[i] + '" ng-click="change_state(' + i + ', ' + str_input[i] + ', ' + "'" + scope.node_id + "'" + ', ' + "'" + scope.user + "'" + ')">' + count + '</span>  ';
						element.html(append);
					} else {
						append = append + '<span class="btn btn-mini" title="' + get_info[i] + '" ng-click="show_error()">' + count + '</span>  ';
						element.html(append);
					}
				} else if (str_input[i] == '1') {
					if (scope.user) {
						append = append + '<span class="btn btn-mini btn-danger" title="' + get_info[i] + '" ng-click="change_state(' + i + ', ' + str_input[i] + ', ' + "'" + scope.node_id + "'" + ', ' + "'" + scope.user + "'" + ')">' + count + '</span>  ';
						element.html(append);
					} else {
						append = append + '<span class="btn btn-mini btn-danger" title="' + get_info[i] + '" ng-click="show_error()">' + count + '</span>  ';
						element.html(append);
					}
				}
			}

			// Show inputs in web client.
			element.html(append);

			// Compile element to function ng-click="change_state(...)" can execute.
			// eg: http://jsfiddle.net/Ne5zn/2/
			$compile(element.contents())(scope);
		});
	};

	return {
		restrict  : 'E',		// <inputs input="{{node.inputs}}"></inputs>.
		link      : linker,
		scope     : {
			input  : '@input',
			node_id: '@node',
			info   : '@info',
			user   : '@user'
		},
		controller: function ($scope) {

			/**
			 * Controller to change state of input.
			 *
			 * @param position   Position of i in cicle.
			 * @param value      0 or 1, eg: 11100011.
			 * @param node_id    ID of node´s inputs.
			 * @param user_email Email of user.
			 */
			$scope.change_state = function (position, value, node_id, user_email) {

				socket.emit('change state input', {
					position: position,
					value   : (value == 0) ? 1 : 0,
					node_id : node_id,
					user	: {
						email: user_email
					}
				});
			};
			
			/**
			 * Show error when a user without being authenticated give an input click.
			 */
			$scope.show_error = function () {
				flash_message_launch({ msg: 'You must be logged in to change inputs.', type: 'error' });
			};
		}
	};
});
