'use strict';

var express = require('express');
var http = require('http');
var app = express();
var mongoose = require('mongoose');
mongoose.connect("mongodb://heroku_2mm2czgg:go0i1j0kiqpdasta9k7dh5899b@ds015700.mlab.com:15700/heroku_2mm2czgg", function(err){
	console.log(err);
})
var db = mongoose.connection;
var port = (process.env.PORT || 4000)
var server = http.createServer(app).listen(port, function(){
  console.log(`Running at ${port}`);
});

var index = require('./routes/index');

var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/', index);

// app.get("/", function(req, res, next){
//   res.status(200).send("hello");
// });


module.exports = app;