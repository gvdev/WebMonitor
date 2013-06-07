/**
 * Module dependencies.
 */

var express 		= require('express'),
	path 			= require('path'),
	http 			= require('http'),
	sockets 		= require('./lib/sockets'),
	serial			= require('./lib/serial'),

	mongoose 		= require('mongoose'),
	passport 		= require('passport'),
	LocalStrategy 	= require('passport-local').Strategy,

	User 			= require('./models/user'),

	config 			= require('./config.json');

var app = express();

// Configuration
app.configure(function () {
	app.set('port', config.website.port || process.env.PORT || 3000);

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.logger('dev'));

	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser('your secret here'));
	app.use(express.session());

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.locals.pretty = true;
});

app.configure('production', function () {
	app.use(express.errorHandler());
});

// Configure passport.
passport.use(new LocalStrategy(User.authenticate()));

// Use static serialize and deserialize of model for passport session support.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect mongoose.
require('./db.js').startup();
require('./db.js').install(function (error) {
	if (error) {
		console.log('Error setting the database.');
	}
});

// Routes

// Setup routes
require('./routes')(app);

var server = http.createServer(app);

// Socket.
sockets.socketServer(app, server);

server.listen(app.get('port'), function () {
	console.log("Web Monitor server listening");
});
