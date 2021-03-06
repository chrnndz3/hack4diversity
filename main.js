var globalMap;
var globalBubbles;
var globalResults;

var dataFetched = false;

var bubbleCache = [];

getAPData();
/*****************************************************
  Cacheing
*****************************************************/
function addToCache(key, events){
  bubbleCache[key] = events; 
}

//TODO: Check to see if this is correct syntax
function updateCache(key, event) {
  bubbleCache[key].push(event);
}

/*****************************************************
Click event handlers
*****************************************************/

$( "#race" ).click(function() {
  showRace();
});

$( "#funds" ).click(function() {
  showFunds();
});

$( "#grad" ).click(function() {
  showGradRates();
});

$( "#ap" ).click(function() {
  showAPPrograms();
  
});


function setCategory(x){
$("#category").text(x);

}

/*****************************************************
  Show the data based on the applications clicked
*****************************************************/

function showFunds(){
  var key = "FUND"
  console.log("show funds")
  setCategory("Money spent per student");

  globalMap.bubbles(moneyBubbles(globalResults), {
    popupTemplate: function (geo, data) {
      return ['<div class="hoverinfo">' + data.name + 
      '<br/> Money spent per student:' + data.tSalary +
      + '</div>'].join('');
    }
  });
}

function showAPPrograms(){
  console.log("APIB")

  setCategory("Districts that offer AP/IB Programs")
  var key = "APIB"

  globalMap.bubbles(apBubbles(globalResults), {
    popupTemplate: function (geo, data) {
      return ['<div class="hoverinfo">' + data.name + 
      '<br/> White Students:' + data.wPercentage +
      '<br/> Black Students:' + data.bPercentage +
      '<br/> Hispanic Students:' + data.hPercentage
      + '</div>'].join('');
    }
  });
}

function apBubbles(myArr){
    var bubbles = [];
    for(var i = 0; i < myArr.length; i++) {
    var node = myArr[i];
    var hasAP = node.apCourses * 2;
    var wPercentage = ((parseFloat(node.aPMathWhiteM) + parseFloat(node.aPMathWhiteF))/(parseFloat(node.whiteM) + parseFloat(node.whiteF))) * 100;
    var hPercentage = ((parseFloat(node.aPMathHispanicM) + parseFloat(node.aPMathHispanicF))/(parseFloat(node.hispanicM) + parseFloat(node.hispanicF))) * 100;
    var bPercentage = ((parseFloat(node.aPMathBlackM) + parseFloat(node.aPMathBlackF))/(parseFloat(node.blackM) + parseFloat(node.blackF))) * 100;
    var bubble = {name: node.name, 
      latitude: node.northMost, 
      longitude: node.eastMost, 
      radius: 1, 
      fillKey: 'APIB', 
      borderWidth: 1,
      wPercentage: wPercentage,
      hPercentage: hPercentage,
      bPercentage: bPercentage,
      borderColor: 'APIB'
    };
    bubbles.push(bubble);
  }
  console.log(bubbles.length);
  //globalMap.bubbles(bubbles);
  return bubbles
}

function moneyBubbles(myArray){
  var bubbles = [];
    for(var i = 0; i < myArray.length; i++) {
    var node = myArray[i];
    var hasAP = node.apCourses * 2;

    var tSalary = parseFloat(node.salary)/(parseFloat(node.whiteF) + parseFloat(node.whiteM) + parseFloat(node.hispanicM) + parseFloat(node.hispanicF) + parseFloat(node.blackF) + parseFloat(node.blackM));

    var bubble = {name: node.name, 
      latitude: node.northMost, 
      longitude: node.eastMost, 
      radius: 1, 
      fillKey: 'GREEN', 
      borderWidth: 1,
      tSalary: tSalary,
      borderColor: 'GREEN'
    };
    bubbles.push(bubble);
  }
  console.log(bubbles.length);
  //globalMap.bubbles(bubbles);
  return bubbles

}

function hoverText(geo, data){
  return [']<div class"hoveinfo"> :' + data.name + 
  '<br/> White Students:' + data.wPercentage +
  '<br/> Black Students:' + data.bPercentage +
  '<br/> Hispanic Students:' + data.hPercentage
  + '</div>'].join('');

}


/*******************************************
DATABASE QUERIES
*******************************************/

function getAPData(){
  var xmlhttp = new XMLHttpRequest();
  var url = "https://agile-basin-90147.herokuapp.com/getDistrict";

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var myArr = JSON.parse(xmlhttp.responseText);
      globalResults = myArr;
      console.log(globalResults);
      dataFetched = true
     
      // globalMap.bubbles(apBubbles(myArr), {
      // popupTemplate: function (geo, data) {
      //   return ['<div class="hoverinfo">' + data.name + 
      //   '<br/> White Students:' + data.wPercentage +
      //   '<br/> Black Students:' + data.bPercentage +
      //   '<br/> Hispanic Students:' + data.hPercentage
      //   + '</div>'].join('');
      //   }
      // });
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


// /*****************************************************
//  Zoom
// *****************************************************/

function Zoom(args) {
  $.extend(this, {
    $buttons:   $(".zoom-button"),
    $info:      $("#zoom-info"),
    scale:      { max: 50, currentShift: 0 },
    $container: args.$container,
    datamap:    args.datamap
  });

  this.init();
}

Zoom.prototype.init = function() {
  var paths = this.datamap.svg.selectAll("path"),
      subunits = this.datamap.svg.selectAll(".datamaps-subunit");

  // preserve stroke thickness
  paths.style("vector-effect", "non-scaling-stroke");

  // disable click on drag end
  subunits.call(
    d3.behavior.drag().on("dragend", function() {
      d3.event.sourceEvent.stopPropagation();
    })
  );

  this.scale.set = this._getScalesArray();
  this.d3Zoom = d3.behavior.zoom().scaleExtent([ 1, this.scale.max ]);

  this._displayPercentage(1);
  this.listen();
};

Zoom.prototype.listen = function() {
  this.$buttons.off("click").on("click", this._handleClick.bind(this));

  this.datamap.svg
    .call(this.d3Zoom.on("zoom", this._handleScroll.bind(this)))
    .on("dblclick.zoom", null); // disable zoom on double-click
};

Zoom.prototype.reset = function() {
  this._shift("reset");
};

Zoom.prototype._handleScroll = function() {
  var translate = d3.event.translate,
      scale = d3.event.scale,
      limited = this._bound(translate, scale);

  this.scrolled = true;

  this._update(limited.translate, limited.scale);
};

Zoom.prototype._handleClick = function(event) {
  var direction = $(event.target).data("zoom");

  this._shift(direction);
};

Zoom.prototype._shift = function(direction) {
  var center = [ this.$container.width() / 2, this.$container.height() / 2 ],
      translate = this.d3Zoom.translate(), translate0 = [], l = [],
      view = {
        x: translate[0],
        y: translate[1],
        k: this.d3Zoom.scale()
      }, bounded;

  translate0 = [
    (center[0] - view.x) / view.k,
    (center[1] - view.y) / view.k
  ];

  if (direction == "reset") {
    view.k = 1;
    this.scrolled = true;
  } else {
    view.k = this._getNextScale(direction);
  }

l = [ translate0[0] * view.k + view.x, translate0[1] * view.k + view.y ];

  view.x += center[0] - l[0];
  view.y += center[1] - l[1];

  bounded = this._bound([ view.x, view.y ], view.k);

  this._animate(bounded.translate, bounded.scale);
};

Zoom.prototype._bound = function(translate, scale) {
  var width = this.$container.width(),
      height = this.$container.height();

  translate[0] = Math.min(
    (width / height)  * (scale - 1),
    Math.max( width * (1 - scale), translate[0] )
  );

  translate[1] = Math.min(0, Math.max(height * (1 - scale), translate[1]));

  return { translate: translate, scale: scale };
};

Zoom.prototype._update = function(translate, scale) {
  this.d3Zoom
    .translate(translate)
    .scale(scale);
  this.datamap.svg.selectAll("g")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

  this._displayPercentage(scale);
};

Zoom.prototype._animate = function(translate, scale) {
  var _this = this,
      d3Zoom = this.d3Zoom;

  d3.transition().duration(350).tween("zoom", function() {
    var iTranslate = d3.interpolate(d3Zoom.translate(), translate),
        iScale = d3.interpolate(d3Zoom.scale(), scale);

    return function(t) {
      _this._update(iTranslate(t), iScale(t));
    };
  });
};

Zoom.prototype._displayPercentage = function(scale) {
  var value;

  value = Math.round(Math.log(scale) / Math.log(this.scale.max) * 100);
  this.$info.text(value + "%");
};

Zoom.prototype._getScalesArray = function() {
  var array = [],
      scaleMaxLog = Math.log(this.scale.max);

  for (var i = 0; i <= 10; i++) {
    array.push(Math.pow(Math.E, 0.1 * i * scaleMaxLog));
  }

  return array;
};

Zoom.prototype._getNextScale = function(direction) {
  var scaleSet = this.scale.set,
      currentScale = this.d3Zoom.scale(),
      lastShift = scaleSet.length - 1,
      shift, temp = [];

  if (this.scrolled) {

    for (shift = 0; shift <= lastShift; shift++) {
      temp.push(Math.abs(scaleSet[shift] - currentScale));
    }

    shift = temp.indexOf(Math.min.apply(null, temp));

    if (currentScale >= scaleSet[shift] && shift < lastShift) {
      shift++;
    }

    if (direction == "out" && shift > 0) {
      shift--;
    }

    this.scrolled = false;

  } else {

    shift = this.scale.currentShift;

    if (direction == "out") {
      shift > 0 && shift--;
    } else {
      shift < lastShift && shift++;
    }
  }

  this.scale.currentShift = shift;

  return scaleSet[shift];
};

function Datamap() {
  this.$container = $("#map");
  this.instance = new Datamaps({element: document.getElementById('map'),
      scope: 'usa',
      element: this.$container.get(0),
      fills: {
        'WHITE': '#FFCC75',
        'POC': '#844C14',
        'GREEN': '#0B7045',
        'APIB': '#FC502A',
          defaultFill: '#98D9D5'
      },
      done: this._handleMapReady.bind(this)
  });

  globalMap = this.instance;
}

Datamap.prototype._handleMapReady = function(datamap) {
  this.zoom = new Zoom({
    $container: this.$container,
    datamap: datamap
  });
}

new Datamap();
