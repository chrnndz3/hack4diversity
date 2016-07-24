'use strict';

var express = require('express');
var http = require('http');
var app = express();

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var mongoose = require('mongoose');

mongoose.connect(
	"mongodb://heroku_2mm2czgg:go0i1j0kiqpdasta9k7dh5899b@ds015700.mlab.com:15700/heroku_2mm2czgg",
	function(err){
	  console.log(err);
})
var db = mongoose.connection;
app.use('/', require('./routes'));


var port = (process.env.PORT || 4000)
var server = http.createServer(app).listen(port, function(){
  console.log(`Running at ${port}`);
});


module.exports = app;