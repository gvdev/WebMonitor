/**
 * http://docs.angularjs.org/guide/directive
 * Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against
 * the HTML and executed. This allows directives to register behavior, or transform the DOM.
 */

/**
 * Directive in place editor.
 *
 * To edit the elements of a list in the same place.
 */
web_monitor.directive('inplaceEditor', function () {
	return {
		restrict: 'E',
		replace : true,
		template: '<div><input type="text" ng-model="edit" ng-dblclick="onCancel()" /><i class="icon-remove" ng-click="onCancel()"></i></div>'
	};
});

web_monitor.directive('editInplace', ['$compile', function ($compile) {
	var template = '<inplace-editor></inplace-editor>';
	return {
		restrict  : 'E',
		scope     : {
			onOk: '&onSave',
			edit: '='
		},
		template  : '<span>{{edit}}</span>',
		replace   : true,
		controller: function ($scope) {

		},
		link      : function (scope, element) {

			var editor = $compile(template)(scope);
			//var old_val = scope.edit;

			//show the editor
			function show() {
				editor = $compile(template)(scope);
				element.after(editor);
				element.hide();
			}

			// Cancela editor.
			function cancelEdit() {
				element.show();
				editor.remove();
				//scope.edit = old_val;
			}

			scope.onCancel = function () {
				cancelEdit();
			};

			scope.hide = function () {
				element.show();
				editor.remove();
			};

			// Wire click event.
			element.on('click', function () {
				scope.$apply(show);
			});
		}
	};
}]);