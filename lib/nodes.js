/**
 * Library dedicated to nodes processing.
 */

var crypto		= require('crypto'),

	socket 		= require('./sockets');

module.exports = {

	/**
	 * Process node table and convert it to json format and send it to the client for display data.
	 *
	 * @param 	table	Is the object to display in the web client.
	 * @param 	config	It is the system configuration, for example the maximum value of the gauges.
	 * @param images	It is the all images of each nodes.
	 */
	return_nodes: function (table, config, images) {
		// Array for send nodes to the client.
		var nodes = [];

		for (key in table) {
			var line_return = this.return_line(key, table, config, images);
			nodes.push(line_return);
		}

		// Emit all web clients new data extracted from "table".
		socket.export.sockets.emit('data of the node', nodes);
	},

	/**
	 * To show all table data by socket when the client requests.
	 *
	 * @param table
	 * @param config
	 * @param images	It is the all images of each nodes.
	 * @returns {Array}
	 */
	io_return_nodes: function (table, config, images) {
		// Array for send nodes to the client.
		var nodes = [];

		for (key in table) {
			var line_return = this.return_line(key, table, config, images);
			nodes.push(line_return);
		}

		return nodes;
	},

	/**
	 * Process a node and show the changes in the web client.
	 *
	 * @param line		Is in json format, its content is a table row and a variable "update" to specify whether node inputs edited.
	 * @param table		Is the table object -> array nodes.
	 * @param config	It is the system configuration, for example the maximum value of the gauges.
	 * @param images	It is the all images of each nodes.
	 */
	return_node: function (line, table, config, images) {
		
		// Get updated data node.
		var line_return = this.return_line(line.node[0], table, config, images);

		// If you upgraded any input console.log show,
		(line.update == 1)? console.log('Updated Node: ' + JSON.stringify(line.node)) : null;

		if (line.pwm_update) {

			// Emit all web clients new pwm data.
			socket.export.sockets.emit('update client pwm', {
				node_id	: line_return.node_id,
				pwm		: line_return.pwm
			});

		} else {

			// Emit all web clients new data extracted from "table".
			socket.export.sockets.emit('data of the one node', {
				line_return	: line_return,
				line		: line.node
			});
		}
	},

	/**
	 * Delete node by ID.
	 *
	 * @param node 	-> node.node_id
	 * @param table Is the table object -> array nodes.
	 */
	delete_node: function (node, table) {

		delete table[node.node_id];

		// Emit all web clients new data extracted from "table".
		socket.export.sockets.emit('delete node', {
			node_id	: node.node_id
		});
	},

	/**
	 * Converts the object table or a specific node in json object to send to the web client.
	 *
	 * @param key			Is the position in which positioning for a specific node in the object table.
	 * @param table			Is the table object -> array nodes.
	 * @param config		It is the system configuration, for example the maximum value of the gauges.
	 * @param images		It is the all images of each nodes.
	 * @returns {{node_id: *, name: *, inputs: *, adcs: Array, battery_level: *, battery_min: *, max: *}}
	 */
	return_line: function (key, table, config, images) {
		
		var node_id = table[key][0];
		
		// Get array descriptions using split arrangement.
		// Eg descriptions after split:
		// ["name1","temp","hum","ph"]
		var descriptions = table[key][1].split(',');

		// Obtain name of descriptions node.
		// shift obtain first element of array and eliminated.
		var name = descriptions.shift();

		// Array of concatenate and return description values with ADCs.
		var adcs = [];

		// Count is the accountant for table data, from array element 3 within
		// the first ADC is obtained, each ADC has a description field.
		count = 3;
		for (desc in descriptions) {

			// Value of ADC, eg:
			// temp = 500
			// {"temp": 500}
			var adc_value = table[key][count];

			// Block triggers.
			// End Block triggers.

			// Is included in the ADCs array data set related description corresponding ADC.
			adcs.push({
				descriptions: descriptions[desc],
				value       : adc_value / config.factor,
				max			: config.gauge.max / config.factor
			});
			count++;
		}		

		// Obtain image of node.
		var image = null;
		for (i in images) {
			if (images[i].token == node_id) {
				image = images[i].image.path_public;
			}
		}

		// Prepare json to return values ​​to the client node per socket.
		var battery_level	= table[key][table[key].length-3];
		var last_received	= table[key][table[key].length-2];
		var pwm				= table[key][table[key].length-1];

		var line = {
			node_id      : node_id,
			name         : name,
			inputs       : table[key][2],
			adcs         : adcs,
			battery_level: battery_level,
			battery_min  : config.battery.min,
			battery_max  : config.battery.max,
			last_received: last_received,
			pwm          : pwm,
			inputs_info  : config.inputs,
			img			 : (image != null)? image : '/img/generic.jpg'
		};

		return line;
	}
};
