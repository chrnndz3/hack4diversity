var mongoose = require("mongoose");

var districtSchema = mongoose.Schema({
	districtID: Number,
  name: String,
  southMost: Number,
  northMost: Number,
  westMost: Number,
  eastMost: Number,
  numberOfSchools: Number,
  apCourses: Number
});

districtSchema.statics.updateDistricts = function(id, districtname, south, north, west, east, numschools, apOffered, callback) {

  console.log("apOffered!: ", apOffered);

  District.findOne({districtID: id}, function (err, doc){

    if(err) {
      
      console.log("Found an error with findONe!");
      console.log(err);
    } else {
      console.log("Did not find an error!");
      if(!doc){
        District.create({
          districtID: id,
          name: districtname,
          southMost: south,
          northMost: north, 
          westMost: west,
          eastMost: east,
          numberOfSchools: numschools,
          apCourses: apOffered
        }, function (err) {
          if (err) {
            console.log("there's an error!");
            console.log(err);
            callback(true);
          } else {
            callback(null, "No error!");
          }
        });

      } else {

        console.log("Document exists");
        console.log(doc);
        var highLat = Math.max(doc.southMost, south);
        var lowLat = Math.min(doc.northMost, north);
        var lowLong = Math.min(doc.westMost, west);
        var highLong = Math.max(doc.eastMost, east);
        var schoolsum = doc.numberOfSchools + numschools;
        var apExists = Math.max(doc.apCourses, apOffered);

        District.update({districtID:id}, {$set:{
          southMost: highLat,
          northMost: lowLat,
          westMost: lowLong,
          eastMost: highLong,
          numberOfSchools: schoolsum,
          apCourses: apExists
        }}, function (err) {
          if (err){
            console.log("Error updating");
            console.log(err);
            callback(true);
          } else {
            console.log("No error, update went through");
            callback(null, "Everything is good! The doc exists and I'm updating!");
          }
        });
      }

    }

  });

}

var District = mongoose.model('District', districtSchema);
module.exports = District;