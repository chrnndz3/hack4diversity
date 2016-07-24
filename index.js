'use strict';

var express = require('express');
var http = require('http');
var app = express();
var port = (process.env.PORT || 4000)
var server = http.createServer(app).listen(port, function(){
  console.log(`Running at ${port}`);
});

app.get("/", function(req, res, next){
  res.status(200).send("hello");
});
