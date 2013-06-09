var event	= require('../lib/event'),
	cron	= require('cron').CronJob;

// Run dynamic event, to send the web customer table.
// EventEmitter -> require('events').
// The event.js is in ./web_monitor/routes/event.js
var new_event = new event();

new_event.on('open', function (table) {
	// New data to table.
	line=['AA2233AABBBB','name1,temp,temp','11110000',2530,0200,0134,1700,2780,'',0]
	table[line[0]]=line;
	table[line[0]][8]= Date.now();
	line=['FFFF33AABB00','name2,hum,lux,temp,ph','00110110',0630,0470,0674,1000,2500,'',0]
	table[line[0]]=line;
	table[line[0]][8]= Date.now();

	// The time intervals running with node-cron plugin to provide a wider range of interval programming.
	// Run a task every 5 seconds.
	new cron('*/5 * * * * *', function(){

		table['FFFF33AABB00'][3]= Math.floor(Math.random()*5555);
		table['FFFF33AABB00'][4]= Math.floor(Math.random()*5555);
		table['FFFF33AABB00'][5]= Math.floor(Math.random()*5555);
		table['FFFF33AABB00'][8]= Date.now();
		table['AA2233AABBBB'][7]= Math.floor(Math.random()*5555);
		table['AA2233AABBBB'][8]= Date.now();

		/**
		 * Update a only node.
		 *
		 * {node: table[NODE ID], update: 0}
		 *
		 * node is updated on the Web.
		 * update specifies whether an input is being updated.
		 * 0 has not changed the status of an input.
		 * 1 has changed the status of an input.
		 */
		new_event.emit('update client', {node: table['FFFF33AABB00'], update: 0});
		//new_event.emit('send', table);
	}, null, true, "");
});
