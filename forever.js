var forever = require('forever-monitor');

var child = new (forever.Monitor)('app.js', {
	max: 3,
	silent: false,
	watch: true,
	watchDirectory: 'api',
//	logFile: 'path/to/file',
	args: []
});


// ** SEND EMAIL **
child.on('exit', function () {
    console.error('"forever" made 3 attempts to restart the app. Exiting now.');
});


child.start();
