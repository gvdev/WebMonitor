/**
 * http://angularjs.org/
 * Provides services on top of XHR, that dramatically simplify your code.
 * We wrap XHR to give you exception management and promises. Promises
 * further simplify your code by handling asynchronous return of data.
 * This lets you assign properties synchronously when the return is actually
 * asynchronous.
 */

/**
 * Service to upload file.
 */
web_monitor.service('$fileUpload', ['$http', function($http) {
	
	// Execute upload.
	this.upload = function (file, node) {

		var fd = new FormData(), xhr = new XMLHttpRequest();
		fd.append("file", file);
		fd.append("node_id", node.node_id);

		xhr.open("POST", "/api/upload/image");
		xhr.send(fd);
	};
}]);
