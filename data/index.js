'use strict';

var csv = require('csv');
var request = require('request');
var semaphore = require('semaphore');
var parser = csv.parse();
var fs = require('fs');
const DISTRICT_ID = 4;
const LATITUDE = 7;
const LONGITUDE = 8;
const DISTRICT_NAME = 1;
const POST_URL = 'https://agile-basin-90147.herokuapp.com/populateDB';
const SCH_APENR_IND = 531;
var APoffered = 0;

function add_row(row, totals){
  var districtID = row[DISTRICT_ID];

  if(!totals[districtID]) //NOT THE SAME
  {
    totals[districtID] = {
      north: parseFloat(row[LATITUDE]),
      south: parseFloat(row[LATITUDE]),
      west: parseFloat(row[LONGITUDE]),
      east: parseFloat(row[LONGITUDE]),
      send_key: row[DISTRICT_NAME],
      district_name: row[DISTRICT_NAME],
      APoffered: APoffered,
      num_rows:1
    };

    var y = row[SCH_APENR_IND];
    if(y == 'YES'){
        APoffered = 1;
    }
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

    var y = row[SCH_APENR_IND];
    if(y == 'YES'){
        APoffered = 1;
    }

    totalDist.num_rows++;
  }
}

fs.readdir(__dirname + '/csv_files', function(err, files) {
  if (err) return console.log('there was an error');

  var sem = semaphore(5);
  for (let file of files) {
    sem.take(function(){
      let totals = {};
      let path = `${__dirname}/csv_files/${file}`;
      //console.log('loading ' + path);
      let stream = fs.createReadStream(path);
      stream
        .pipe(csv.parse())
        .pipe(csv.transform(function(row) {
          add_row(row, totals);
        }))
        .on('finish', function() {
          sem.leave();
          //console.log("5 files");
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
                send_key: key_districtID,
                APoffered: district.APoffered
              }
            }, function(error, response, body) {
              if (error) console.log(error);
            });
          }
        });
    });
  }// end of for-loop

});
