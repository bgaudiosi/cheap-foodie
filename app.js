var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');

var index = require('./routes/index');
//We will uncomment this after implementing authenticate
////var authenticate = require('./routes/authenticate');
var app = express();
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Post method for searches
app.post('/', function(req, res) {
	var search_val = req.body.search;
	var location_val = req.body.loc;
	
	var http = require("https");
	var options = {
		"method": "GET",
		"hostname": "api.eatstreet.com",
		"port": null,
		"path": "/publicapi/v1/restaurant/search?street-address=ADDRESS&search=SEARCH_VAL",
		"headers": {
			"x-access-token": "563aa311f08441be",
			"cache-control": "no-cache",
		 	"postman-token": "7e22b582-35fe-164b-d5f7-10c1860cd158"
		}
	}
	options.path = options.path.replace("ADDRESS", location_val);
	options.path = options.path.replace("SEARCH_VAL", search_val);
	
	var api_req = http.request(options, function (api_res) {
		var chunks = [];
		api_res.on("data", function (chunk) {
			chunks.push(chunk);
		});
		api_res.on("end", function () {
			var body = Buffer.concat(chunks);
			res.send(JSON.parse(body.toString()));
			res.end();
		});
	});
	api_req.end();
});
//app.use('/auth', authenticate);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
