var express = require('express');
var router = express.Router();
var District = require('../models/districts');

//router.get()

router.post('/populateDB', function( req, res, next ) {
  
    District.updateDistricts(
      req.body.send_key, req.body.district_name, req.body.south, req.body.north, req.body.west, req.body.east, req.body.num_rows, req.body.APoffered, function (err){
        if(err){
          res.send("There was an error!");
        } else {
          res.send('hello code2040!');
        }
      }
    );
});

module.exports = router;