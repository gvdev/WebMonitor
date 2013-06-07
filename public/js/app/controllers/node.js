/**
 * Controller: dynamically update the client nodes.
 * Receive an array of nodes with data in json format, is received by this socket.
 * If the node does not exist is created and if there is updated.
 *
 * @param nodes array.
 */
web_monitor.controller('update_node', function ($scope, $element, $compile, socket) {

	/**
	 * Receive an array of socket nodes in json format.
	 * Example of a node in json format:
	 *
	 * {"node_id":"0011BBFFAACC","name":"name1","inputs":"11100011","adcs":[
	 * {"descriptions":"temp","value":"1528"},
	 * {"descriptions":"hum","value":"0230"},
	 * {"descriptions":"ph","value":"0500"},
	 * {"descriptions":"lux","value":"1000"}],
	 * "battery_level":"2780","threshold":1000,"max":1200}
	 */
	socket.on('data of the node', function (nodes) {
		$scope.nodes = [];

		for (node in nodes) {
			// Return to client each node in json format.
			$scope.nodes.push(nodes[node]);
		}
	});

	/**
	 * Receive an line of node in json format to update value
	 * individual in web client.
	 * Example of a node in json format:
	 *
	 * {"node_id":"0011BBFFAACC","name":"name1","inputs":"11100011","adcs":[
	 * {"descriptions":"temp","value":"1528"},
	 * {"descriptions":"hum","value":"0230"},
	 * {"descriptions":"ph","value":"0500"},
	 * {"descriptions":"lux","value":"1000"}],
	 * "battery_level":"2780","threshold":1000,"max":1200}
	 */
	socket.on('data of the one node', function (data) {

		// Validate that the node does not exist.
		// If there is not then add it in on Web.
		var exist = false;

		// Search node to update.
		angular.forEach($scope.nodes, function(node){

			// If node exist then update.
			if(node.node_id === data.line_return.node_id){
				// Node found.
				exist = true;

				// Update node found.
				node.name 			= data.line_return.name;
				node.inputs 		= data.line_return.inputs;
				node.adcs 			= data.line_return.adcs;
				node.battery_level 	= data.line_return.battery_level;
				node.battery_min 	= data.line_return.battery_min;
				node.max 			= data.line_return.max;
				node.last_received 	= data.line_return.last_received;
				node.img			= data.line_return.img;
			}
		});

		// If node not found then add in web client.
		if (exist == false) {
			$scope.nodes = [];
			// Add new node.
			$scope.nodes.push(data.line_return);
		}

	});

	/**
	 * Receive new image to node.
	 * Refresh in all browsers.
	 */
	socket.on('update image node', function (data) {
		// Validate that the node does not exist.
		// If there is not then add it in on Web.
		var exist = false;

		// Search node to update.
		angular.forEach($scope.nodes, function(node){

			// If node exist then update.
			if (node.node_id === data.node_id && exist == false) {
				// Node found.
				exist = true;

				// Update image node found.
				node.img = data.image;
			}
		});
	});
});
