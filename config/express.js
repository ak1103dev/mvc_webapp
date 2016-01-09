var express = require('express');
var morgan = require('morgan');
var compression  = require('compression');
var bodyParser = require('body-parser');
var sass = require('node-sass-middleware');
var validator = require('express-validator');
var cookieSession = require('cookie-session');

module.exports = function () {
	var app = express();
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	}
	else {
		app.use(compression());
	}

	app.use(cookieSession({
		name: 'session',
		keys: ['secret_key1', 'secret_key2']
	}));
	//support application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
		extended: true // false-> string, array || true-> anything
	}));
	//support application/json
	app.use(bodyParser.json());
	app.use(validator());

	app.set('views', './app/views'); // relative path from server.js
	app.set('view engine', 'jade');

	require('../app/routes/index.routes')(app);
	require('../app/routes/user.routes')(app);

	app.use(sass({
		src: './sass',
		dest: './public/css', // path of css file that is compiled from sass file
		outputStyle: 'compressed', // compressed, compact, expanded
		prefix: '/css',
		indentedSyntax: true
	}));
	app.use(express.static('./public'));

	return app;
};
