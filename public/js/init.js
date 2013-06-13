$(document).ready(function () {
	$('body').attr('unselectable', 'on')
		.on('selectstart', false);

	$('.reportrange').daterangepicker(
		{
			ranges         : {
				'Today'       : ['today', 'today'],
				'Yesterday'   : ['yesterday', 'yesterday'],
				'Last 7 Days' : [Date.today().add({ days: -6 }), 'today'],
				'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
				'This Month'  : [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
				'Last Month'  : [Date.today().moveToFirstDayOfMonth().add({ months: -1 }), Date.today().moveToFirstDayOfMonth().add({ days: -1 })]
			},
			opens          : 'left',
			format         : 'MM/dd/yyyy',
			separator      : ' to ',
			startDate      : Date.today().add({ days: -29 }),
			endDate        : Date.today(),
			minDate        : '01/01/2012',
			maxDate        : '12/31/2013',
			locale         : {
				applyLabel      : 'Submit',
				fromLabel       : 'From',
				toLabel         : 'To',
				customRangeLabel: 'Custom Range',
				daysOfWeek      : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
				monthNames      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				firstDay        : 1
			},
			showWeekNumbers: true,
			buttonClasses  : ['btn-danger']
		},
		function (start, end) {
			$('.reportrange span').html(start.toString('MM/dd/yyyy') + ' - ' + end.toString('MM/dd/yyyy'));
		}
	);

	//Set the initial state of the picker label
	$('.reportrange span').html(Date.today().add({ days: -29 }).toString('MM/dd/yyyy') + ' - ' + Date.today().toString('MM/dd/yyyy'));
});

/**
 * Get browser name.
 */
function get_browser() {
	var N = navigator.appName, ua = navigator.userAgent, tem;
	var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
	M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
	return M[0];
}
