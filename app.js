var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require("./config.js");

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/foodforme')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
        console.log("Successfully connected to MongoDB with Mongoose");
        });

var restaurant_schema =  new Schema({
    "apiKey": String,
	"deliveryMin": Number,
    "logoUrl": String,
    "name": String,
    "streetAddress": String,
    "city": String,
    "state": String,
    "zip": String,
    "foodTypes": Array,
    "phone": String,
    "latitude": Number,
    "longitude": Number,
    "minFreeDelivery": Number,
    "taxRate": Number,
    "acceptsCash": Boolean,
    "acceptsCard": Boolean,
    "offersPickup": Boolean,
    "offersDelivery": Boolean,
    "isTestRestaurant": Boolean,
    "minWaitTime": Number,
    "maxWaitTime": Number,
    "open": Boolean,
    "url": String,
    "hours": {
        "Sunday": Array,
        "Monday": Array,
        "Tuesday": Array,
        "Wednesday": Array,
        "Thursday": Array,
        "Friday": Array,
        "Saturday": Array
    },
    "timezone": String
});

var Restaurant = mongoose.model('Restaurant', restaurant_schema);
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
    console.log("search val = " + search_val);
	console.log("location val = " + location_val);
	/* Query the database */
	var rests = Restaurant.find({ 'foodTypes': search_val, "zip": location_val }, function (err, restaurants) {
		  if (err) return handleError(err);
	})
	/* Mongoose find is asynchronous so all the code is surrounded in this block */
	rests.lean().exec(function(err,restaurants){
		if(err)
			return console.log(err);
		/* If there are results in the DB, send those to the user */
		if (restaurants.length > 0) {

			console.log("things found in DB");
			res.send(restaurants);
			console.log("send success");
			res.end();
			console.log("end success");
			return;
		
		/* Otherwise, do our API call */
		} else {
			var http = require("https");
    		var options = {
    	 		"method": "GET",
     		    "hostname": "api.eatstreet.com",
     		    "port": null,
		        "path": "/publicapi/v1/restaurant/search?street-address=ADDRESS&search=SEARCH_VAL",
  		        "headers": {
    			    "x-access-token": config.eatstreet,
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
	        		var data = JSON.parse(body.toString());
		        	var restaurants = data.restaurants;
		        	res.send(restaurants);
		        	for (var i = 0; i < restaurants.length; i++) {
						var curr_restaurant = new Restaurant(restaurants[i])
        	    		curr_restaurant.save(function (err, curr_restaurant) {
                			if (err) {
                		   		console.log("Error saving to DB");
                		    	return console.error(err);
                			}
                			//console.log("Saving " + restaurants[i].name + " to DB.");
            			});
					}
        			res.end();
    			});
			});
    		api_req.end();
		}		
	});
	//});
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
