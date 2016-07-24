function mongoData() {
// Retrieve
var MongoClient = require('mongodb');

// Connect to the db
MongoClient.connect("mongodb://heroku_2mm2czgg:go0i1j0kiqpdasta9k7dh5899b@ds015700.mlab.com:15700/heroku_2mm2czgg", function(err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('districts');
  collection.find().toArray(function(err, items) {});

});

}