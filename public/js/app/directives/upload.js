/**
 * http://docs.angularjs.org/guide/directive
 * Directives are a way to teach HTML new tricks. During DOM compilation directives are matched against
 * the HTML and executed. This allows directives to register behavior, or transform the DOM.
 */

/**
 * Directive upload,
 * Upload images of nodes.
 */
web_monitor.directive('upload', function() {

	var linker = function ($scope, $element) {

		$scope.load = false;
		var fileInput = $element.find('input[type="file"]');

		fileInput.bind('change', function (e) {
			$scope.file = e.target.files[0];

			// Obtaining a reference to a Blob object,
			// the static method URL.createObjectURL()
			// is called on that Blob object.
			var URL 		= window.URL || window.webkitURL;
			var blob_url 	= URL.createObjectURL($scope.file);

			// Show image before upload.
			$scope.src 	= blob_url;
			$scope.load = true;
		});

		$element.find('.file_input').customFileInput({
			button_position: 'left'
		});
	};

	var controller = function ($scope, $fileUpload) {
		$scope.notReady = true;

		/**
		 * Update node when change image.
		 */
		$scope.upload = function () {
			if ($scope.load == true) {
				$scope.load = false;
				$fileUpload.upload($scope.file, $scope.node);
			} else {
				flash_message_launch({ msg: 'Error: please select one image.', type: 'error' });
			}
		};
	};

	return {
		restrict	: 'E',
		transclude	: true,
		template	: '<div><input type="file" class="file_input" /></div>',
		controller	: controller,
		link		: linker,
		$scope		: {
			node	: '='
		}
	};
});
