//mapboxgl.accessToken = ''; //<your access token here>
mapboxgl.accessToken = 'pk.eyJ1IjoidmVldiIsImEiOiIzdzVEVDdrIn0.z3N2X1Fk7rx4wXesVf0-rQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [ -73.97332, 40.685787 ], // starting position [lng, lat]
    zoom: 12 // starting zoom level
});

// load geojson data once base map has loaded
map.on('load', function() {
	// load data with d3 (just my preference, load it another way if you prefer)
	d3.json('../data/City Council Districts.geojson', function(err, data) {
		if (err) throw err;

		console.log(data);
	});

});