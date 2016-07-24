'use strict';

var csv = require('csv');
var request = require('request');
var parser = csv.parse();
var fs = require('fs');
const DISTRICT_ID = 4;
const LATITUDE = 7;
const LONGITUDE = 8;
const DISTRICT_NAME = 1;
const POST_URL = '';

function add_row(row, totals){
  var districtID = row[DISTRICT_ID];

  if(!totals[districtID]) //NOT THE SAME
  {
    totals[districtID] = {
      north: parseFloat(row[LATITUDE]),
      south: parseFloat(row[LATITUDE]),
      west: parseFloat(row[LONGITUDE]),
      east: parseFloat(row[LONGITUDE]),
      district_name: row[DISTRICT_NAME],
      num_rows:1
    };
  }
  else {
    var totalDist = totals[districtID];
    var n = parseFloat(row[LATITUDE]);
    if(n < totalDist.north){
      totalDist.north = n;
    }

    var s = parseFloat(row[LATITUDE]);
    if(s > totalDist.south){
      totalDist.south = s;
    }

    var w = parseFloat(row[LONGITUDE]);
    if(w < totalDist.west)
    {
      totalDist.west = w;
    }

    var e = parseFloat(row[LONGITUDE]);
    if(e > totalDist.east)
    {
      totalDist.east = e;
    }

    totalDist.num_rows++;
  }
}

fs.readdir(__dirname + '/csv_files', function(err, files) {
  if (err) return console.log('there was an error');

  for (let file of files) {
    let totals = {};

    var path = `${__dirname}/csv_files/${file}`;
    var stream = fs.createReadStream(path);
    stream.pipe(csv.parse())
      .pipe(csv.transform(function(row) {
        add_row(row, totals);
      }));

      for(let key_districtID in totals){
        let district = totals[key_districtID];
        request.post(POST_URL, {
          form: {
            north: district.north,
            south: district.south,
            west: district.west,
            east: district.east,
            num_rows: district.num_rows,
            district_name: district.district_name,
            send_key: key_districtID
          }
        }, function(error, respon error);
        });
      }
  }

});
