var globalMap;
$(window).load(function() {
	var map = new Datamap({
	    element: document.getElementById('map'),
	    scope: 'usa',
	    fills: {
		    'WHITE': '#FFCC75',
		    'POC': '#844C14',
		    'GREEN': '#0B7045',
		    'APIB': '#00A077',
        	defaultFill: '#98D9D5'
    	}
	});

	globalMap = map;

	globalMap.bubbles([
		 {name: 'Bubble 1', latitude: 40.7128, longitude: -74.0059, radius: 5, fillKey: 'WHITE'},
		 {name: 'Bubble 2', latitude: 42.3314, longitude: -83.0458, radius: 5, fillKey: 'POC'},
		 {name: 'Bubble 3', latitude: 37.7749, longitude: -122.431297, radius: 5, fillKey: 'GREEN'},
		 {name: 'Bubble 4', latitude: 39.7749, longitude: -122.431297, radius: 5, fillKey: 'APIB'},

		], {
		 popupTemplate: function(geo, data) {
		   return "<div class='hoverinfo'>Bubble for " + data.name + "";
		 }
		});
});


/*****************************************************
	Show the data based on the applications clicked
*****************************************************/

function showRace(){
	//globalMap.bubbles()
	console.log("show race")

}

function showFunds(){
	console.log("show funds")
}

function showGradRates(){
	console.log("grad rates")

}

function showAPPrograms(){
	console.log("APIB")
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



