var express = require('express');
var router = express.Router();
var District = require('../models/districts');

router.post('/populateDB', function( req, res, next) {
  
    District.updateDistricts(
      req.body.send_key, req.body.district_name, req.body.south, req.body.north, req.body.west, req.body.east, req.body.num_rows, function (err){
        if(err){
          res.send("There was an error!");
        } else {
          res.send('hello code2040!');
        }
      }
    );
  // function(id, districtname, south, north, west, east, numschools,

  // District.updateDistricts(0, "Allentown", 100, 10, -10, 10, 5, function(err){
  //   console.log("Updating");
  //   console.log(err);
  //   if(err){
  //     res.send("There was an error!");
  //   } else {
  //     res.send('hello code2040!');
  //   }
  // });
});

module.exports = router;